import { ChatInputCommandInteraction, GuildMember } from "discord.js";

import { 
  joinVoiceChannel, 
  createAudioResource, 
  createAudioPlayer, 
  VoiceConnection, 
  VoiceConnectionStatus, 
  AudioPlayer, 
  AudioPlayerStatus, 
  NoSubscriberBehavior
} from '@discordjs/voice';

import { youtube as yt } from 'scrape-youtube';
import ytdl from 'ytdl-core';
import play from 'play-dl'

import { __musicMap, queryDispatchMap, queryMap, queryType } from "./globals";
import { MusicPlayer, Song } from "./def";

import { ERROR_MSGUSER_NOT_IN_VCHANNEL } from "./errors";

/**
 * This function registers listeners for a VoiceConnection and handles case
 * Useful for managing the lifecycle of our Voice Connection with Discord
 *
 * @todo complete this function and handle each case of the lifecycle
 * @param ChatInputCommandInteraction - an instance of the chat interaction that is sent over by the user
 * @returns void
 */
export function registerVoiceConnectionEvents(connection: VoiceConnection) {
  connection.on(VoiceConnectionStatus.Ready, () => { 
    console.log('The connection has entered the Ready state - ready to play audio!'); 
  });
  connection.on(VoiceConnectionStatus.Disconnected, () => { 
    console.log('The connection has entered the Disconnected state - Connection has been severed!'); 
  });
  connection.on(VoiceConnectionStatus.Destroyed, () => { 
    console.log('The connection has entered the Destroyed state - Cleaned up!'); 
  });
}

/**
 * This function registers listeners for an AudioPlayer instance and handles the lifecycle
 * Useful for managing the lifecycle of an AudioPlayer with Discord voice
 *
 * @todo complete this function and handle each case of the lifecycle
 * @param ChatInputCommandInteraction - an instance of the chat interaction that is sent over by the user
 * @returns void
 */
export function registerAudioPlayerEvents(player: AudioPlayer, guildId: string) {
  player.on(AudioPlayerStatus.Idle, () => {
    // If the player is Idle.. We can just check the queue has songs to play...If the Queue is empty... we can also play recommended songs...
    const Id = guildId;

    const musicPlayer = __musicMap.get(Id)

    if(!musicPlayer) {
      console.log("Error");
      return;
    }

    const musicQueue = musicPlayer.queue;
    // If Idle and Queue not empty, pop queue and playSong
    if(musicPlayer.queue.length > 0) {
      const song = musicQueue.shift();
      if(!song) return;
      playSong(musicPlayer, song);
      queryResponse(musicPlayer.lastInteraction, "Added your song to the Queue");
    } else {
      queryResponse(musicPlayer.lastInteraction, "No more songs in the Queue.");
    }


  });
  player.on(AudioPlayerStatus.Paused, () => {
    console.log('The connection has entered the Ready state - ready to play audio!'); 
  });
  player.on(AudioPlayerStatus.Playing, () => {
      // If the player is Idle.. We can just check the queue has songs to play...If the Queue is empty... we can also play recommended songs...
      const Id = guildId;

      const musicPlayer = __musicMap.get(Id)
      if(!musicPlayer) {
        console.log("Error");
        return;
      }
  });
  player.on(AudioPlayerStatus.Buffering, () => {
    console.log('The connection has entered the Ready state - ready to play audio!'); 
  });
  player.on(AudioPlayerStatus.AutoPaused, () => {
    console.log('The connection has entered the Ready state - ready to play audio!'); 
  });
}

/**
 * Initliazes the MusicPlayer if it does not exist within the bots musicMap data structure
 * which is a Hash Map. The keys of __musicMap represent a discord guild id where the value repesents 
 * the music player instance in guild with that matching guildId.
 *
 * @remarks
 * This function is the starting point of the music player api for Mushroom Bot
 *
 * @param ChatInputCommandInteraction - an instance of the chat interaction that is sent over by the user
 * @returns an Instance of MusicPlayer
 */
export function getPlayer(interaction: ChatInputCommandInteraction): MusicPlayer | undefined {
    const vChannel = (interaction.member as GuildMember)!.voice!.channel;
    const guildId = interaction.guildId;

    if(!guildId) return;

    if(!vChannel)  {
      interaction.reply(ERROR_MSGUSER_NOT_IN_VCHANNEL);
      return;
    }

    // Check if we have a music player for this guild
    let mp = __musicMap.get(guildId);

    // If we do, let's reuse it
    if(mp !== undefined) return mp;

    // Setup some parameters to join the voice channel
    const channelId = vChannel!.id;
    const vac = vChannel!.guild.voiceAdapterCreator;

    const ap = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play }});
    // Join the voice channel and create a connection
    const conn = joinVoiceChannel({
      channelId: channelId,
      guildId: guildId,
      adapterCreator: vac,
      selfDeaf: false,
      selfMute: false,
      debug: true
    });
    // If somehow we don't have a music player at this point... no point of continuting

    if(!conn) return;

    mp = { 
      player: ap,
      queue: [],
      playing: false,
      connection: conn,
      lastInteraction: interaction
    };

    // Register voice channel connection events
    registerVoiceConnectionEvents(conn);
    // Register audio player events
    registerAudioPlayerEvents(ap, guildId);

    __musicMap.set(guildId, mp)

    return mp;
}

export async function resolveQuery(interaction: ChatInputCommandInteraction, query: string) {
  let qtype = null;
  
  for(const key of queryMap.keys()) {
    const potential = queryMap.get(key);

    if(potential?.test(query)) {
      qtype = key;
      break;
    }
  }

  if(qtype === null) qtype = queryType.SearchQuery;

  const routine = queryDispatchMap.get(qtype);
  if(routine) await routine(interaction, query);
}

export async function resolveSearch(interaction: ChatInputCommandInteraction, query: string) {
    const player = getPlayer(interaction) 

    if(!player) return;

    player.lastInteraction = interaction;

    try {

      let results = await play.search(query, { limit: 1 })
      //const results = await yt.search(query);

      console.log(results);
      // Unless you specify a custom type you will only receive 'video' results
      const title = results[0].title;
      const link = results[0].url;
      const duration = results[0].durationRaw;

      if(!title) return;

      const song = { 
        title: title, 
        link: link, 
        duration: duration, 
        requester: interaction.user 
      };

      playSong(player, song);

    } catch(error) {
      console.error(error);
    }
}

export async function resolveYoutubeTrack(interaction: ChatInputCommandInteraction, query: string) {
  const track = ytdl(query, { filter: 'audioonly' });
  console.log('youtube track')
}

export async function resolveSpotifyTrack(interaction: ChatInputCommandInteraction, query: string) {
  console.log('spotify track')

}

export async function resolveSpotifyPlaylist(interaction: ChatInputCommandInteraction, query: string) {
  console.log('spotify playlist')

}

export async function resolveYoutubePlaylist(interaction: ChatInputCommandInteraction, query: string) {
  console.log('youtube playlist')

}

export async function playSong(player: MusicPlayer, song: Song) {
  // If we are playing, we add the song the Music Queue
  if(player.playing) {
    player.queue.push(song);
    queryResponse(player.lastInteraction, `Added the track: ${song.title} to the Music Queue at the request of ${song.requester}`);
    return;
  }

  // If we are not currently playing anything, we need to play something
  //
  // Download the song from youtube
  // IMPORTANT(Ali) For some freakin' reason, highWaterMark has to be set to the below value 
  // for the audio connection to not 
  //const stream = ytdl(song.link, { filter: 'audioonly', highWaterMark: 1048576 / 4});

  // Create an AudioResource for our AudioPLayer to play
  //
  let stream = await play.stream(song.link)
  let resource = createAudioResource(stream.stream, { inputType: stream.type })

  // Create a subscription if it doesn't exist
  if(!player.subscription) player.subscription = player.connection.subscribe(player.player);

  // play our audio resource
  player.player.play(resource);
  // Set our player state to playing=true
  player.playing = true;

  queryResponse(player.lastInteraction, `Playing the track: ${song.title} at the request of ${song.requester}`);
}

export async function queryResponse(interaction: ChatInputCommandInteraction, message: string) {
  await interaction.reply(message);
}

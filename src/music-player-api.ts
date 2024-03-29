import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { youtube as yt } from 'scrape-youtube';
import ytdl from 'ytdl-core';
import { joinVoiceChannel, createAudioPlayer, createAudioResource} from '@discordjs/voice';
import { __musicMap, queryDispatchMap, queryMap, queryType } from "./globals";
import { MusicPlayer } from "./def";
import { ERROR_MSGUSER_NOT_IN_VCHANNEL } from "./errors";

export function initPlayer(interaction: ChatInputCommandInteraction): MusicPlayer | null {

    const channel = (interaction.member as GuildMember)!.voice!.channel;
    const guildId = interaction!.channel!.id;

    if(!channel)  {
      interaction.reply(ERROR_MSGUSER_NOT_IN_VCHANNEL);
      return null;
    }

    const channelId = channel!.id;

    const vac = channel!.guild.voiceAdapterCreator;

    let mp = __musicMap.get(guildId);

    if(mp) return mp;

    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: channelId,
      guildId: guildId,
      adapterCreator: vac,
      selfDeaf: false,
      selfMute: false
    });


    mp = {
      connection: connection,
      player: player,
      queue: [],
      playing: false
    };

    queryMap.set(queryType.YoutubeTrack, /https:\/\/www.youtube\.com\/watch*/g);
    queryMap.set(queryType.YoutubePlaylist, /https:\/\/youtube\.com\/playlist*/g);
    queryMap.set(queryType.SpotifyTrack, /https:\/\/(open\.?)spotify\.com\/track*/g);
    queryMap.set(queryType.SpotifyPlaylist, /https:\/\/(open\.)?spotify\.com\/playlist*/);

    queryDispatchMap.set(queryType.YoutubeTrack, resolveYoutubeTrack);
    queryDispatchMap.set(queryType.SpotifyTrack, resolveSpotifyTrack);
    queryDispatchMap.set(queryType.SpotifyPlaylist, resolveSpotifyPlaylist);
    queryDispatchMap.set(queryType.YoutubePlaylist, resolveYoutubePlaylist);
    queryDispatchMap.set(queryType.SearchQuery, resolveSearch);

    __musicMap.set(guildId, mp)

    return mp;
}

export async function resolveQuery(interaction: ChatInputCommandInteraction, query: string) {
  let qtype = null;

  initPlayer(interaction);

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
    console.log('resolvesearch')
    const channel = (interaction.member as GuildMember)!.voice!.channel;
    const guildId = channel!.guild!.id;

    let player = __musicMap.get(guildId);
    if(player === undefined) {
      initPlayer(interaction);
      player = __musicMap.get(guildId);
    }

    if(!player) return;

    await yt.search(query).then((results: any) => {
        // Unless you specify a custom type you will only receive 'video' results
        const title = results.videos[0].title;
        const link = results.videos[0].link;
        const duration = results.videos[0].duration;
        player.queue.push({ title: title, link: link, duration: duration, requester: interaction.user });
    });

    const url = player.queue[0].link;
    player.head = player.queue[0];
    player.tail = player.queue[0];
    player.current = player.queue[0];

    console.log(player.current)
    const stream = ytdl(url, { filter: 'audioonly' })
    const resource = createAudioResource(stream);

    player.connection.subscribe(player?.player);
    player.player.play(resource);
    player.playing = true;

}

// Plays or Adds the track to the Music Queue
export async function resolveYoutubeTrack(interaction: ChatInputCommandInteraction, query: string) {
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

export async function play() {

}

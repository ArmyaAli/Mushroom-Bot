import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, EmbedBuilder, CacheType } from 'discord.js';
import { Command } from '../types';
import { Logger } from '../utils/logger';
import { getPlayer } from '../music/Player';
import { buildPrimaryControls, buildAdvancedControls } from '../gui/MusicPlayer';
import { inVoice } from '../music/util';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Queue a YouTube URL for playback.')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song name or URL (currently not processed).')
        .setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    //const logger = Logger.getInstance();
    const query = interaction.options.getString('query', true).trim();
    if(!interaction) {
      console.log("Interaction is Null")
      return;
    }
    //await interaction.deferReply();

    if(!(await inVoice(interaction))){
      console.log("InVoice not returning anything")
      return;
    }

    // Extract video ID from YouTube URL or use query as-is
    //const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    //const match = query.match(youtubeRegex);
    //const url = match ? `https://www.youtube.com/watch?v=${match[1]}` : query;

    const player = getPlayer(interaction.guildId!);
    
    //
    const member = interaction.member
    if (member && member instanceof GuildMember && member.voice.channel){
      player.connect(member.voice.channel)
    }
    
    //player.enqueue({ title: query, url: url, requestedBy: interaction.user.id });

    const wasFirstPlay = !player.hasPlayedBefore();
    player.play();

  if (wasFirstPlay) {
      const embed = new EmbedBuilder()
        .setTitle('Music Player')
    .setDescription('Controls for managing playback')
        .setColor(0x00FF00)
        .addFields(
          { name: 'Current Track', value: player.getCurrent()?.title || 'None', inline: true },
          { name: 'Queue Length', value: player.getQueue().length.toString(), inline: true },
          { name: 'Autoplay', value: player.getAutoplay() ? 'Enabled' : 'Disabled', inline: true }
        );

      await interaction.editReply({
  embeds: [embed],
  components: [buildPrimaryControls(player), buildAdvancedControls(player)]
      });
    } else {
  await interaction.editReply('Added to queue');
    }
  }
};

export = command;


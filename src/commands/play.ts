import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { Logger } from '../utils/logger';
import { getPlayer } from '../music/Player';
import { buildPrimaryControls, buildAdvancedControls } from '../gui/MusicPlayer';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a track (playback disabled until media libraries configured).')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song name or URL (currently not processed).')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const logger = Logger.getInstance();
    const query = interaction.options.getString('query', true).trim();
    await interaction.deferReply();

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      await interaction.editReply('You need to be in a voice channel to play music!');
      return;
    }

    const player = getPlayer(interaction.guildId!);
    await player.connect(interaction.member.voice.channel);

    // Dummy enqueue since playback is disabled
    player.enqueue({
      title: query,
      url: 'dummy-url',
      requestedBy: interaction.user.id
    });

    const wasFirstPlay = !player.hasPlayedBefore();
    player.play();

    if (wasFirstPlay) {
      const embed = new EmbedBuilder()
        .setTitle('Music Player')
        .setDescription('Controls for managing playback (Playback disabled)')
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
      await interaction.editReply('Added to queue (Playback disabled)');
    }
  }
};

export = command;

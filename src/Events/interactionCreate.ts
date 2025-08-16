import { Events, Interaction, InteractionType } from 'discord.js';
import { DiscordEvent, MushroomBot } from '../types';
import { getPlayer } from '../music/Player';
import { searchModal, buildPrimaryControls, buildAdvancedControls } from '../gui/MusicPlayer';

const event: DiscordEvent = {
  name: Events.InteractionCreate,
  async execute(bot: MushroomBot, interaction: Interaction) {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        if (interaction.isChatInputCommand()) {
          const command = bot.commands.get(interaction.commandName);
          if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
          }

          try {
            await command.execute(interaction);
          } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
              await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
              await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
          }
        }
        break;
      case InteractionType.MessageComponent:
        if (interaction.isButton()) {
          const player = getPlayer(interaction.guildId!);

          switch (interaction.customId) {
            case 'play_pause': {
              if (!player.isActive()) {
                player.play();
                await interaction.reply({ content: 'Playback started!', ephemeral: true });
              } else {
                const nowPaused = player.togglePause();
                await interaction.reply({ content: nowPaused ? 'Paused!' : 'Resumed!', ephemeral: true });
              }
              if (interaction.message && interaction.message.editable) {
                try { await interaction.message.edit({ components: [buildPrimaryControls(player), buildAdvancedControls(player)] }); } catch {}
              }
              break; }
            case 'stop': {
              player.stop();
              await interaction.reply({ content: 'Stopped!', ephemeral: true });
              if (interaction.message && interaction.message.editable) {
                try { await interaction.message.edit({ components: [buildPrimaryControls(player), buildAdvancedControls(player)] }); } catch {}
              }
              break; }
            case 'shuffle':
              player.shuffle();
              await interaction.reply({ content: 'Shuffled!', ephemeral: true });
              break;
            case 'autoplay': {
              const enabled = player.toggleAutoplay();
              await interaction.reply({ content: `Autoplay ${enabled ? 'enabled' : 'disabled'}!`, ephemeral: true });
              if (interaction.message && interaction.message.editable) {
                try { await interaction.message.edit({ components: [buildPrimaryControls(player), buildAdvancedControls(player)] }); } catch {}
              }
              break; }
            case 'mute': {
              const muted = player.toggleMute();
              await interaction.reply({ content: muted ? 'Muted (no audio libraries loaded)' : 'Unmuted (no audio libraries loaded)', ephemeral: true });
              if (interaction.message && interaction.message.editable) {
                try { await interaction.message.edit({ components: [buildPrimaryControls(player), buildAdvancedControls(player)] }); } catch {}
              }
              break; }
            default:
              console.log('Unknown button:', interaction.customId);
          }
  }
        break;
      case InteractionType.ModalSubmit:
        if (interaction.customId === 'search') {
          const query = interaction.fields.getTextInputValue('searchQuery').trim();
          if (!query) {
            await interaction.reply({ content: 'No query provided!', ephemeral: true });
            return;
          }

          if (!interaction.member || !('voice' in interaction.member) || !interaction.member.voice.channel) {
            await interaction.reply({ content: 'You need to be in a voice channel!', ephemeral: true });
            return;
          }

          const player = getPlayer(interaction.guildId!);
          await player.connect(interaction.member.voice.channel);

          // Dummy enqueue
          player.enqueue({
            title: query,
            url: 'dummy-url',
            requestedBy: interaction.user.id
          });

          player.play();

          await interaction.reply({ content: `Added "${query}" to queue (playback disabled)`, ephemeral: true });
        }
        break;
      default:
        console.log('Unknown interaction type received!');
        break;
    }
  }
}

export = event;

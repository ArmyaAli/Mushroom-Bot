import { Events, Interaction, InteractionType } from 'discord.js';
import { DiscordEvent, MushroomBot } from '../types';

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
          console.log('Button interaction received!');
          // Handle button interactions here
        } else if (interaction.isStringSelectMenu()) {
          console.log('Select menu interaction received!');
          // Handle select menu interactions here
        }
        break;
      case InteractionType.ModalSubmit:
        console.log('Modal submit interaction received!');
        // Handle modal submit interactions here
        break;
      default:
        console.log('Unknown interaction type received!');
        break;
    }
  }
}

export = event;

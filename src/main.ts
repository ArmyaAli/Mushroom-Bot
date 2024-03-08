// really only used for dev environment
// on a server... environment variables will be handled by system
// TODO(Ali): Figure out a better way for this, kinda smells
import 'dotenv/config';

// BOOTSTRAP
import './bootstrap';

// BEGIN imports
import { Events } from 'discord.js';
import { __botCommands, __discordClient } from './globals';

__discordClient.once(Events.ClientReady, readyClient => { console.log("Ready!", readyClient.user.tag); })

__discordClient.on(Events.InteractionCreate, async interaction => { 
    if (!interaction.isChatInputCommand()) return;
	const command = __botCommands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.exec(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

__discordClient.login(process.env.DISCORD_BOT_TOKEN);

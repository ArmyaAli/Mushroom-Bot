import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();
const clientID = process.env.DISCORD_APP_ID;
const guildID = process.env.DISCORD_GUILD_ID;
const token = process.env.DISCORD_TOKEN;

interface Command {
	data: { toJSON: () => unknown };
	execute: (...args: unknown[]) => unknown;
}

const commands: unknown[] = [];
// Grab all the command folders from the commands directory you created earlier

const foldersPath = path.join(__dirname, 'src/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	console.log(commandsPath)
	if (fs.statSync(commandsPath).isFile()) {
		const command: Partial<Command> = require(commandsPath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data!.toJSON());
		} else {
			console.log(`[WARNING] The command at ${commandsPath} is missing a required "data" or "execute" property.`);
		}
	} else {
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const command: Partial<Command> = require(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data!.toJSON());
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

// Construct and prepare an instance of the REST module

if (!token) process.exit(1);

const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		if (!clientID) process.exit(1);
		if (!guildID) process.exit(1);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientID, guildID),
			{ body: commands },
		) as { length: number };

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
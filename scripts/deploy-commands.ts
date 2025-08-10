import { REST, Routes } from 'discord.js';
import { config } from './src/config';
import fs from 'node:fs';
import path from 'node:path';
import { Command } from './src/types';

const commands = [];
const foldersPath = path.join(__dirname, 'src/Commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command: Command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(config.discordToken);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(config.discordAppId, config.discordGuildId),
            { body: commands },
        ) as { length: number };

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

import { REST, Routes, ApplicationCommandData } from 'discord.js';
import { config } from '../src/config';
import fs from 'node:fs';
import path from 'node:path';
import { Command } from '../src/types';

const commands: ApplicationCommandData[] = [];
const commandsPath = path.join(__dirname, '../src/Commands');

function readCommands(dir: string) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            readCommands(filePath);
        } else if (file.isFile() && file.name.endsWith('.ts')) {
            try {
                const command: Command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON() as ApplicationCommandData);
                    console.log(`Loaded command: ${command.data.name}`);
                } else {
                    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            } catch (error) {
                console.error(`Failed to load command file ${filePath}:`, error);
            }
        }
    }
}

readCommands(commandsPath);

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
        console.error('Failed to deploy commands:', error);
        process.exit(1);
    }
})();

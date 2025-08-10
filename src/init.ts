import fs from 'node:fs';
import path from 'node:path';
import { MushroomBot } from './types';

export async function Init(bot: MushroomBot) {
    const client = bot.discord_client;
    if(client) {
      loadEvents(bot);
      loadCommands(bot);
    }
}

export async function loadEvents(bot: MushroomBot) {
    const client = bot.discord_client;
    if (!client) return;

    const eventsPath = path.join(__dirname, 'Events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(bot, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(bot, ...args));
        }
    }
}

export async function loadCommands(bot: MushroomBot) {
    const commandsPath = path.join(__dirname, 'Commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            bot.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

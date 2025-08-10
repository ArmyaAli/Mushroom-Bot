import { Events } from 'discord.js';
import { MushroomBot } from '../types';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(bot: MushroomBot) {
    const client = bot.discord_client;
    if(!client) return;
    if(!client.user) return;
    console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

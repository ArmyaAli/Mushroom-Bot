import { Events } from 'discord.js';
import { MushroomBot } from '../types';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(bot: MushroomBot) {
        const client = bot.discord_client;
        if (!client) {
            bot.logger.error('Ready event triggered but client is null');
            return;
        }
        if (!client.user) {
            bot.logger.error('Ready event triggered but client.user is null');
            return;
        }
        
        bot.logger.info('Discord bot is ready', {
            username: client.user.tag,
            id: client.user.id,
            guilds: client.guilds.cache.size,
            commands: bot.commands.size
        });
    },
};

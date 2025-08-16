import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import { MushroomBot } from './types';
import { Init } from './init';

const bot = new MushroomBot();

try {
  bot.discord_client = new Client({ intents: [GatewayIntentBits.Guilds] });
  bot.logger.info('Discord client created', { intents: [GatewayIntentBits.Guilds] });
  
  Init(bot);
  bot.logger.info('Bot initialization started');
  
  bot.discord_client.login(config.discordToken)
    .then(() => {
      bot.logger.info('Bot successfully logged in to Discord');
    })
    .catch((error) => {
      bot.logger.error('Failed to log in to Discord', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      process.exit(1);
    });
} catch (error) {
  bot.logger.error('Critical error during bot startup', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
  process.exit(1);
}

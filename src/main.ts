import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import { MushroomBot } from './types';
import { Init } from './init';


const bot = new MushroomBot();

if(bot) {
  bot.discord_client = new Client({ intents: [GatewayIntentBits.Guilds] });
  Init(bot);
  bot.discord_client.login(config.discordToken);
} else {
  console.log("discord client is null");

}

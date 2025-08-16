import { SlashCommandBuilder, Collection, Client, ChatInputCommandInteraction, GatewayIntentBits, Interaction, Events, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { Logger, LogLevel } from './utils/logger';

export interface Config {
  nodeVersion: string;
  discordAppId: string;
  discordAppSecret: string;
  discordToken: string;
  discordGuildId: string;
};

export interface DiscordEvent {
  name: Events;
  execute: (bot: MushroomBot, interaction: Interaction) => Promise<void>;
};

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export class MushroomBot {
  commands: Collection<string, Command> = new Collection();
  discord_client: Client | null = null;
  logger: Logger;

  constructor() {
    this.logger = Logger.getInstance({
      level: LogLevel.INFO,
      logDir: './logs',
      filename: 'discord-bot.log',
      enableConsole: true
    });
  }
};

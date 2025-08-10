import { SlashCommandBuilder, Collection, Client, ChatInputCommandInteraction, GatewayIntentBits, Interaction, Events } from "discord.js";

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
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export class MushroomBot {
  commands: Collection<string, Command> = new Collection();
  discord_client: Client | null = null;
};

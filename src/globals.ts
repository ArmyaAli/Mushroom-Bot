import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "./def";

export const __discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
export const __botCommands = new Collection<string, Command>();
export const __commandTree = new Collection<string, string[]>();

export const __musicPlayer = new Collection<string, string>();

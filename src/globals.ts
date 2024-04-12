import { ChatInputCommandInteraction, Client, Collection, GatewayIntentBits } from "discord.js";
import { Command, MusicPlayer } from "./def";

export const __discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages] });
export const __botCommands = new Collection<string, Command>();
export const __commandTree = new Collection<string, string[]>();
export const __musicMap = new Collection<string, MusicPlayer>();


export enum queryType {
  YoutubeTrack,
  SpotifyTrack,
  YoutubePlaylist,
  SpotifyPlaylist,
  SearchQuery
};

export const queryMap = new Collection<queryType, RegExp>();
export const queryDispatchMap = new Collection<queryType, (interaction: ChatInputCommandInteraction, query: string) => Promise<void>>();


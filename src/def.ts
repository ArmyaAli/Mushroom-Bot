import { ChatInputCommandInteraction, User, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { VoiceConnection, AudioPlayer, PlayerSubscription } from '@discordjs/voice'

export interface Song {
  title: string;
  link: string;
  duration: string;
  requester: User;
}

export interface MusicPlayer {
    player: AudioPlayer;
    connection: VoiceConnection;
    queue: Song[];
    current?: Song;
    playing: boolean;
    lastInteraction: ChatInputCommandInteraction;
    autoplay: boolean;
    tail?: Song;
    head?: Song;
    subscription?: PlayerSubscription;
}

export interface Command {
    cooldown: number,
    // NOTE(Ali): For some freakin' reason, data.setName() <- cannot contain capital chars
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    exec: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

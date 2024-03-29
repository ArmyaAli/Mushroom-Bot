import { ChatInputCommandInteraction, User, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { VoiceConnection, AudioPlayer } from '@discordjs/voice'

export interface Command {
    cooldown: number,
    // NOTE(Ali): For some freakin' reason, data.setName() <- cannot contain capital chars
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    exec: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

interface song {
  title: string;
  link: string;
  duration: string;
  requester: User;
}

export interface MusicPlayer {
    connection: VoiceConnection;
    player: AudioPlayer;
    queue: song[];
    head?: song;
    tail?: song;
    current?: song;
    playing: boolean;
}

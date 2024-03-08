import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'

export interface Command {
    cooldown: number,
    // NOTE(Ali): For some freakin' reason, data.setName() <- cannot contain capital chars
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    exec: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

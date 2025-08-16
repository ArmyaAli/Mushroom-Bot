import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the currently playing music.'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Music paused!');
    },
};

export = command;
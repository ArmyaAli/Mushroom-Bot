import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the paused music.'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Music resumed!');
    },
};

export = command;
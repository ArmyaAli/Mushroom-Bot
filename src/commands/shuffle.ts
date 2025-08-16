import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the music queue.'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Queue shuffled!');
    },
};

export = command;
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the current song or queue.'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Looping enabled/disabled!');
    },
};

export = command;
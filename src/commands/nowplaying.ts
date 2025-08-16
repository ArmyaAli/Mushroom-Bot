import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Displays the currently playing song.'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Displaying current song!');
    },
};

export = command;
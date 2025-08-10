import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const musicPlayerControls = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('play')
            .setLabel('Play')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('pause')
            .setLabel('Pause')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('resume')
            .setLabel('Resume')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('stop')
            .setLabel('Stop')
            .setStyle(ButtonStyle.Danger),
    );

export const musicPlayerAdvancedControls = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('shuffle')
            .setLabel('Shuffle
')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('autoplay')
            .setLabel('Autoplay')
            .setStyle(ButtonStyle.Primary),
    );

export const volumeControl = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('volume')
            .setPlaceholder('Select Volume')
            .addOptions([
                { label: '25%', value: '25' },
                { label: '50%', value: '50' },
                { label: '75%', value: '75' },
                { label: '100%', value: '100' },
            ]),
    );

export const searchModal = new ModalBuilder()
    .setCustomId('search')
    .setTitle('Search for a song')
    .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId('searchQuery')
                .setLabel('Song name or URL')
                .setStyle(TextInputStyle.Short)
        )
    );
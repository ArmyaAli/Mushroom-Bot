import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { MusicPlayer } from '../music/Player';

export function buildPrimaryControls(player: MusicPlayer) {
    const isPaused = player.isPaused();
    const isActive = player.isActive();
    const label = isActive ? (isPaused ? 'Resume' : 'Pause') : 'Play';
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('play_pause')
                .setLabel(label)
                .setStyle(!isActive ? ButtonStyle.Success : (isPaused ? ButtonStyle.Success : ButtonStyle.Secondary))
                .setDisabled(!isActive && !player.hasQueue()),
            new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('Stop')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(!isActive),
        );
}

export function buildAdvancedControls(player: MusicPlayer) {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('shuffle')
                .setLabel('Shuffle')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('autoplay')
                .setLabel('Autoplay')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('mute')
                .setLabel(player.isMuted() ? 'Unmute' : 'Mute')
                .setStyle(ButtonStyle.Secondary),
        );
}

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
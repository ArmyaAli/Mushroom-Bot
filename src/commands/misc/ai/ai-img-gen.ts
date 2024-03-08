import { Command } from "../../../def";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const command: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('image-gen')
        .setDescription('generates an image'),
    exec: async function (interaction: ChatInputCommandInteraction) {
        await interaction.reply('image-gen command');
    }

}

export default command;

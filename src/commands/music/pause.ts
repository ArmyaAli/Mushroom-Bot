import { Command } from "../../def";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { resolveQuery } from "../../music-player-api";

const command: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pauses the currently playing song'),
    exec: async function (interaction: ChatInputCommandInteraction) {
      
    }

}

export default command;

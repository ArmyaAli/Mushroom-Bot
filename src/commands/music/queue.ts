import { Command } from "../../def";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { resolveQuery } from "../../music-player-api";

const command: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Tells the user what the next 5 songs in the queue are and who requested them'),
    exec: async function (interaction: ChatInputCommandInteraction) {
      
    }

}

export default command;

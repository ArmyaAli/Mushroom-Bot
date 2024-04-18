import { Command } from "../../def";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { displayQueue } from "../../music-player-api";
import { __musicMap } from "../../globals";

const command: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Tells the user what the next 5 songs in the queue are and who requested them'),
    exec: async function (interaction: ChatInputCommandInteraction) {
      const guildId = interaction.guildId;
      if(guildId === null) return;
      const player = __musicMap.get(guildId);
      if(!player) return;
      displayQueue(interaction, player); 
    }

}

export default command;

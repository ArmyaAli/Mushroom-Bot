import { Command } from "../../def";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const command: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Gives the user a list of supported commands'),
    exec: async function (interaction: ChatInputCommandInteraction) {
      try {
        await interaction.reply("help command"); 

      } catch(err){
        console.log('elo');
      }
    }

}

export default command;

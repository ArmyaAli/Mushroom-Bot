import { Command } from "../../def";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { resolveQuery } from "../../music-player-api";

const command: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song/playlist as trackname,youtube link,spotify link,youtube playlist,spotify playlist')
        .addStringOption(option => {
          return option.setName('query')
          .setDescription('the thing to play')
          .setRequired(true)
        }),
    exec: async function (interaction: ChatInputCommandInteraction) {

        // Let's implement case 1 and case 2
        // Search a song and play it
        // Play a direct youtube link

        //1. Get command arg from user
        const query = interaction.options.getString('query');
        console.log(query)

        if(!query) {
           await interaction.reply('You must specify something to play'); 
           return;
        }

        await resolveQuery(interaction, query)
    }

}

export default command;

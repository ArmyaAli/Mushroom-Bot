import { Command } from "../../def";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { resolveQuery } from "../../music-player-api";

//const fs = require('fs');
//const ytdl = require('ytdl-core');
//// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
//// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
//// TypeScript: import ytdl = require('ytdl-core'); with neither of the above
//
//ytdl('http://www.youtube.com/watch?v=aqz-KE-bpKQ')
//  .pipe(fs.createWriteStream('video.mp4'));

const command: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song/playlist as trackname,youtube link,spotify link,youtube playlist,spotify playlist')
        .addStringOption(option => {
          return option.setName('query')
          .setDescription('the thing to play')
        }),
    exec: async function (interaction: ChatInputCommandInteraction) {

        // Let's implement case 1 and case 2
        // Search a song and play it
        // Play a direct youtube link

        //1. Get command arg from user
        const query = interaction.options.getString('query');
        console.log(query)

        if(!query) {
           await interaction.reply('You must specify a song / playlist to play'); 
           return;
        }

        await resolveQuery(interaction, query)

    }

}

export default command;

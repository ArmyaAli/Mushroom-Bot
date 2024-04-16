import { Command } from "../../def";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { skipSong } from "../../music-player-api";
import { __musicMap } from "../../globals";

const command: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skips the currently plating song'),
    exec: async function (interaction: ChatInputCommandInteraction) {

      const guildId = interaction.guildId;

      if(guildId === null) return;

      const player = __musicMap.get(guildId);
      if(!player) return;
      skipSong(interaction, player)
    }

}

export default command;

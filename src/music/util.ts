import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export async function inVoice(interaction: ChatInputCommandInteraction): Promise<Boolean> {
    if(!interaction.member || !(interaction.member instanceof GuildMember)) return false;
    if (!interaction.member.voice.channel) {
      await interaction.editReply('You need to be in a voice channel to play music!');
      return false;
    }
    return true;
}
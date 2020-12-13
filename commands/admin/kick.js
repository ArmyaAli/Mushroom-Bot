const { MessageEmbed, Message } = require('discord.js');

const MorderatorRoleId = '787768132386291732';
const AdministratorRoleId = '787768456219983923';
const requiredRoles = [MorderatorRoleId, AdministratorRoleId];

module.exports = {
  name: "kick",
  description: "lets an *admin* kick a mentioned user",
  /**
   * This is a command
   * @param {Message} message
   * @param {String[]} args
   */
  execute(message) {
    const mentionedMembers = message.mentions.members;
    if(mentionedMembers.Size > 1) {
      message.channel.send('You can only kick one user at a time! Please only mention one person to kick');
    } else {
      const memberToKick = mentionedMembers.first();
      // if the owner decides to kick we kick
      if(message.guild.ownerID === message.author.id) {
        memberToKick.kick();
        message.channel.send(`Kicked ${memberToKick.displayName}! What a bad shroom!`);
        return;
      }

      if(message.member.roles.cache.some(role => requiredRoles.includes(role.name))) {
        memberToKick.kick().catch(() => message.channel.send(`You cannot kick a user with a higher permission than you!`));
        message.channel.send(`Kicked ${memberToKick.displayName}! What a bad shroom!`);
      } else {
        message.channel.send(`You do not have the correct permission to kick a user!`);
      }
    }
  }
}

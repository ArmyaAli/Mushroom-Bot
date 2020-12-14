const {Message } = require('discord.js');

module.exports = {
  name: "kick",
  description: "lets an *admin* kick a mentioned user",
  requiredPermissions: ['KICK_MEMBERS'],
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
      if(memberToKick != null) {
        memberToKick.kick()
        .then(() => message.channel.send(`Kicked ${memberToKick.displayName}! What a bad shroom!`))
        .catch((error) =>{ message.channel.send(`You cannot kick someone with a higher role than you!`) });
      } else {
        message.channel.send(`You cannot kick someone that does not exist!`);
      }
      
    }
  }
}

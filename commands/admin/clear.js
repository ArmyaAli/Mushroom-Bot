const { Message } = require("discord.js");

const MorderatorRoleId = "787768132386291732";
const AdministratorRoleId = "787768456219983923";
const requiredRoles = [MorderatorRoleId, AdministratorRoleId];

module.exports = {
  name: "clear",
  description:
    "Clear the currently wrote to channel: args: number (how many messages to delete) or 'nuke' (Clears everything in that channel)",
  /**
   * This is a command
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(message, args) {
    try {
      if (args.length > 1) {
        message.channel.send("This command only takes ONE arguement!");
        return;
      }
      // Fetch all roles from the guild
      message.guild.roles
        .fetch()
        .then((roles) => roles.cache.forEach(role => console.log(role)))
        .catch(console.error);
    } catch (error) {
      message.channel.send(`Error: ${error}`);
    }
  },
};

const { Message } = require("discord.js");

module.exports = {
  name: "clear",
  description:
    "Clear the currently wrote to channel: args: number (how many messages to delete) or 'nuke' (Clears everything in that channel)",
    requiredPermissions: ['MANAGE_CHANNELS'],
  /**
   * This is a command
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(message, args) {
    global.COMMAND_RAN = true;
    try {
      if (args.length > 1 || args.length == 0) {
        message.channel.send("This command takes ONE arguement and ONLY one arguement");
        return;
      }  else {
        if(args.join() === "nuke") {
          const oldPosition = message.channel.position;
          const newChannel = await message.channel.clone();
          newChannel.setPosition(oldPosition);
          await message.channel.delete();
        } else {
          // must be a number!
          if(parseInt(args.join()) > 0)
            await message.channel.bulkDelete(parseInt(args.join())+1)
          else
            message.channel.send("How do I delete exactly ZERO messages...");
        }
      }
    } catch (error) {
      message.channel.send(`Error: ${error}`);
    }
  },
};

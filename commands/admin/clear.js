const { Message } = require("discord.js");

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
      if (args.length > 1 || args.length == 0) {
        message.channel.send("This command takes ONE arguement and ONLY one arguement");
        return;
      }  else {
        if(args.join() === "nuke") {
          // grab the current channel id
          await message.channel.clone();
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

  module.exports = {
    name: "ud",
    description: "Queries urbandictionary using their public API!",
    async execute(message, args) {
      global.COMMAND_RAN = true;
      const searchQuery = args.join(' ');
      message.channel.send(searchQuery);
    }
  };
  
  module.exports = {
    name: "ud",
    description: "Queries urbandictionary using their public API!",
    async execute(message, args) {
      const searchQuery = args.join(' ');
      message.channel.send(searchQuery);
    }
  };
  
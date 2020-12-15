module.exports = {
    name: "skip",
    description: "stops the current song and clears the queue",
    async execute(player, message) {
      global.COMMAND_RAN = true;
      // check if there is a song already in queue
      let isPlaying = player.isPlaying(message.guild.id);
      try {
        if(!isPlaying) {
          message.channel.send(`Mushroomie! Nothing is playing...`);
        } else {
            let song = await player.skip(message.guild.id);
            message.channel.send(`Mushroomie! ${song.name} was skipped!`);
        }
      } catch(error) {
        console.log(error)
      }
    },
  };
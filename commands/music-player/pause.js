module.exports = {
    name: "pause",
    description: "pause the currently running music",
    async execute(player, message) {
      global.COMMAND_RAN = true;
      // check if there is a song already in queue
      let isPlaying = player.isPlaying(message.guild.id);
      try {
        if(!isPlaying) {
          message.channel.send(`Mushroomie! Nothing is playing...`);
        } else {
          let song = await player.pause(message.guild.id);
          message.channel.send(`${song.name} was paused!`);
        }
      } catch(error) {
        console.log(error)
      }
    },
  };
module.exports = {
    name: "resume",
    description: "resumes the currently paused music",
    async execute(player, message) {
      global.COMMAND_RAN = true;
      // check if there is a song already in queue
      let isPlaying = player.isPlaying(message.guild.id);
      try {
        if(!isPlaying) {
          message.channel.send(`Mushroomie! Nothing is playing...`);
        } else {
          let song = await player.resume(message.guild.id);
          message.channel.send(`${song.name} was resumed!`);
        }
      } catch(error) {
        console.log(error)
      }
    },
  };
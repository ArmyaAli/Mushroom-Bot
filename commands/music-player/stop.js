module.exports = {
    name: "stop",
    description: "stops the current song and clears the queue",
    execute(player, message) {
      global.COMMAND_RAN = true;
      // check if there is a song already in queue
      let isPlaying = player.isPlaying(message.guild.id);
      try {
        if(!isPlaying) {
          message.channel.send(`Mushroomie! Nothing is playing...`);
        } else {
        player.stop(message.guild.id);
          message.channel.send('Mushroomie.. Stopped playing music and cleared the song queue!');
        }
      } catch(error) {
        console.log(error)
      }
    },
  };
const filterOptions = {
  uploadDate: 'none', // 'hour/today/week/month/year', // Default - none
	duration: 'none', //'short/long', // Default - none
	sortBy: 'relevance' //'relevance/date/view count/rating' // Default - 'relevance'
};

module.exports = {
  name: "play",
  description: "Plays music off of youtube!",
  async execute(player, message, args) {
    global.COMMAND_RAN = true;
    // check if there is a song already in queue
    const isPlaying = player.isPlaying(message.guild.id);
    const searchString = args.join(' ');
    try {
      if(!isPlaying) {
        let song = await player.play(message.member.voice.channel, searchString, filterOptions);
        song = song.song;
        console.log(song.name);
        message.channel.send(`Started playing ${song.name}.`);
        song.queue.on('end', () => {
          message.channel.send('Mushroomie...! The queue is empty, please add new songs!');
        });
      } else {
        // Add the song to the queue
        let song = await player.addToQueue(message.guild.id, searchString);
        song = song.song;
        message.channel.send(`Mushroomies have music playing! Song ${song.name} was added to the queue!`);
      }
    } catch(error) {
      message.channel.send(error);
    }
  },
};

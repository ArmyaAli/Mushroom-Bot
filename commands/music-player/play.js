const { search } = require("ffmpeg-static");

const filterOptions = {
  uploadDate: 'none', // 'hour/today/week/month/year', // Default - none
	duration: 'none', //'short/long', // Default - none
	sortBy: 'relevance' //'relevance/date/view count/rating' // Default - 'relevance'
};

module.exports = {
  name: "play",
  description: "Plays music off of youtube!",
  async execute(player, message, args) {
    // check if there is a song already in queue
    const isPlaying = await player.isPlaying(message.guild.id);
    const searchString = args.join(' ');
    try {
      const voiceChannel = message.member.voice.channel;
      if(!voiceChannel) {
        message.channel.send('Mushroomie...! You must be in a voice channel to play a song!');
        return;
      }
      if(!isPlaying) {
        let song = await player.play(voiceChannel, searchString, filterOptions);
        if(song.error) throw song.error;
        song = song.song;
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
      if(error.type === 'SearchIsNull') {
        message.channel.send(`Error occured: ${error.message}`);
      } else {
        message.channel.send(`Error occured: ${error}`);
      }
     
    }
  },
};

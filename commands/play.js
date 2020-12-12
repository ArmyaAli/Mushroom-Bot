module.exports = {
  name: "play",
  description: "play music",
  async execute(player, message, args) {
    // check if there is a song already in queue
    let isPlaying = player.isPlaying(message.guild.id);
    console.log(isPlaying)
    const searchString = args.join(" ") + " " + "song";
    try {
      if(!isPlaying) {
        let song = await player.play(message.member.voice.channel, searchString, {
          duration: "long", // This is optional
        });
        song = song.song;
        console.log(song.name);
        message.channel.send(`Started playing ${song.name}.`);
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

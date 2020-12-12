const { Player } = require("discord-music-player");
const generalChannelVoice = "143853351103102977";

module.exports = {
  name: "play",
  description: "play music",
  async execute(message, args) {
    const player = new Player(message.client, {
      leaveOnEnd: false,
      leaveOnStop: true,
      leaveOnEmpty: true,
      quality: "high",
    });
    const searchString = args.join(" ");
    let song = await player.play(message.member.voice.channel, searchString, {
      duration: "long", // This is optional
    });

    song = song.song;
    console.log(song.song);
    message.channel.send(`Started playing ${song.name}.`);
  },
};

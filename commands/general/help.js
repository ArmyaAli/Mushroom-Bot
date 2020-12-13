const helpTemplate = `
Commands!
  - Music Player
      - !play *songname* -> Plays a song!
      - !queue -> returns all the songs in the queue listed out for you!
      - !resume/pause -> plays/resumes the currently playing song
      - !skip -> skips the current song in the queue
      - !stop -> Stops playing the song and exits the voice channel
`;

module.exports = {
    name: "help",
    description: "Gives the user the list of basic commands",
    execute(message) {
      message.channel.send('Here are a list of commands I can currently use!');
      message.channel.send(helpTemplate);
    },
  };
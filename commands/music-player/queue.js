module.exports = {
    name: "queue",
    description: "Gets all music in the current song Queue.",
    async execute(player, message) {
        global.COMMAND_RAN = true;
        let queue = await player.getQueue(message.guild.id);
        if(queue) {
            message.channel.send('Queue:\n'+(queue.songs.map((song, i) => {
                return `${i === 0 ? 'Now Playing' : `#${i+1}`} : ${song.name}`
            }).join('\n')));
        } else {
            message.channel.send('The queue is empty!');
        }
    },
  };
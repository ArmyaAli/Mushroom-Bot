const permissionHandler = require('./permissionManager.js');

const commands = (client, command, message, args) => {
    switch (command) {
        case "play":
          if (args.length == 0) {
            message.channel.send("Arguments are required for that command!");
            return;
          }
          client.commands.get("play").execute(client.player, message, args);
          break;
        case "pause":
          client.commands.get("pause").execute(client.player, message);
          break;
        case "resume":
          client.commands.get("resume").execute(client.player, message);
          break;
        case "stop":
          client.commands.get("stop").execute(client.player, message);
          break;
        case "queue":
          client.commands.get("queue").execute(client.player, message);
          break;
    }
}

module.exports.commands = commands;
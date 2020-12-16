const permissionHandler = require('./permissionManager.js');

const commands = (client, command, message, args) => {
    switch (command) {
        case "play":
          global.COMMAND_RAN = true;
          if (args.length == 0) {
            message.channel.send("Arguments are required for that command!");
            return;
          }
          client.commands.get("play").execute(client.player, message, args);
          break;
        case "pause":
          global.COMMAND_RAN = true;
          client.commands.get("pause").execute(client.player, message);
          break;
        case "resume":
          global.COMMAND_RAN = true;
          client.commands.get("resume").execute(client.player, message);
          break;
        case "stop":
          global.COMMAND_RAN = true;
          client.commands.get("stop").execute(client.player, message);
          break;
        case "queue":
          global.COMMAND_RAN = true;
          client.commands.get("queue").execute(client.player, message);
          break;
    }
}

module.exports.commands = commands;
const permissionHandler = require('./permissionManager.js');

const commands = (client, command, message, args) => {
    switch (command) {
        case "ud":
          global.COMMAND_RAN = true;
          if (args.length == 0) {
            message.channel.send("Arguments are required for that command!");
            return;
          }
          client.commands.get("udquery").execute(message, args);
          break;
    }
}

module.exports.commands = commands;
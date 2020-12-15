const permissionHandler = require('./permissionManager.js');

const commands = (client, command, message, args) => {
    switch (command) {
        case "kick":
          if(!permissionHandler.checkPermissions(client, message, "kick")) {
            message.channel.send('You do not have the required permissions to excecute that command!')
            return;
          };
          client.commands.get("kick").execute(message);
          break;
        case "clear":
          if(!permissionHandler.checkPermissions(client, message, "clear")) {
            message.channel.send('You do not have the required permissions to excecute that command!')
            return;
          };
          client.commands.get("clear").execute(message, args);
          break;
    }
}

module.exports.commands = commands;
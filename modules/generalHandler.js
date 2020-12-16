const commands = (client, command, message, args) => {
    switch (command) {
        case "help":
            global.COMMAND_RAN = true;
            client.commands.get("help").execute(message);
            break;
    }
}

module.exports.commands = commands;
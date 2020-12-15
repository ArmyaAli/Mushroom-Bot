const commands = (client, command, message, args) => {
    switch (command) {
        case "help":
            client.commands.get("help").execute(message);
            break;
    }
}

module.exports.commands = commands;
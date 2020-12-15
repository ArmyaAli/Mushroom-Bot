const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const config = require("./bot_config.js");
const { Player } = require("discord-music-player");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: true,
  leaveOnEmpty: true,
  quality: "high",
});

client.player = player;
// CONSTANTS (TO DO SHOULD BE IN A SEPERATE FILE)
const generalChannel = "143853351103102976";

let commandFiles = [];
const commandContext = path.join(__dirname, "commands");

function readCommandsRecursive(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const Absolute = path.join(dir, file);
    if (fs.statSync(Absolute).isDirectory())
      return readCommandsRecursive(Absolute);
    else 
      return commandFiles.push(Absolute);
  });
}

readCommandsRecursive(commandContext);
commandFiles = commandFiles.filter((fileName) => fileName.endsWith(".js"));

for (const filePath of commandFiles) {
  const command = require(filePath);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on("message", async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const checkPermissions = (message, commandName) => {
    let authorPerms = message.member.permissions;
    return authorPerms.has(client.commands.get(commandName).requiredPermissions)
  };

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
    case "skip":
      client.commands.get("skip").execute(client.player, message);
      break;
    case "queue":
      client.commands.get("queue").execute(client.player, message);
      break;
    case "help":
      client.commands.get("help").execute(message);
      break;
    case "kick":
      if(!checkPermissions(message, "kick")) {
        message.channel.send('You do not have the required permissions to excecute that command!')
        return;
      };
      client.commands.get("kick").execute(message);
      break;
    case "clear":
      if(!checkPermissions(message, "clear")) {
        message.channel.send('You do not have the required permissions to excecute that command!')
        return;
      };
      client.commands.get("clear").execute(message, args);
      break;
    default:
      message.channel.send("That is not a valid command");
  }
});

// sends a welcome message if a user joins
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.id == generalChannel
  );
  if (!channel) return;
  channel.send("Welcome to the Mushroom Cave" + " " + member.displayName + "!");
});

client.login(config.token);

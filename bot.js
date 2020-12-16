const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const config = require("./bot_config.js");
const general = require("./modules/generalHandler.js")
const admin = require("./modules/adminHandler.js")
const music = require("./modules/musicHandler.js")
const ud = require("./modules/udHandler.js")
const { Player } = require("discord-music-player");

global.COMMAND_RAN = false;

const client = new Discord.Client();

const player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: true,
  leaveOnEmpty: true,
  quality: "high",
});

client.player = player;
client.commands = new Discord.Collection();
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

  general.commands(client, command, message, args);
  admin.commands(client, command, message, args);
  music.commands(client, command, message, args);
  ud.commands(client, command, message, args);

  if(!global.COMMAND_RAN) 
    message.channel.send("That is an invalid command");
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

const fs = require("fs"); // talk to the filesystem on the os
const Discord = require("discord.js");
const config = require("./bot_config.js");
const { Player } = require("discord-music-player");

const client = new Discord.Client();

const player = new Player(client, {
  leaveOnEnd: true,
  leaveOnStop: true,
  leaveOnEmpty: true,
  quality: "high",
});

client.player = player;
// CONSTANTS (TO DO SHOULD BE IN A SEPERATE FILE)
const generalChannel = "143853351103102976";
const musicCommandPath = "./commands/music-player";
const adminCommandPath = "./commands/admin";

// GRAB ALL OUR COMMANDS BEFORE WE LOGIN
const musicCommands = fs
  .readdirSync(musicCommandPath)
  .filter((file) => file.endsWith(".js"));

const adminCommands = fs
  .readdirSync(adminCommandPath)
  .filter((file) => file.endsWith(".js"));

client.musicCommands = new Discord.Collection();

for (const file of musicCommands) {
  const command = require(musicCommandPath + "/" + `${file}`);
  client.musicCommands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "play":
      if (args.length == 0) {
        message.channel.send("Arguments are required for that command!");
        return;
      }
      client.musicCommands.get("play").execute(client.player, message, args);
      break;
    case "pause":
      client.musicCommands.get("pause").execute(client.player, message);
      break;
    case "resume":
      client.musicCommands.get("resume").execute(client.player, message);
      break;
    case "stop":
      client.musicCommands.get("stop").execute(client.player, message);
      break;
    case "skip":
      client.musicCommands.get("skip").execute(client.player, message);
      break;
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

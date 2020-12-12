const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs"); // talk to the filesystem on the os
const config = require("./bot_config.js");
const { Player } = require("discord-music-player");

const player = new Player(client, {
    leaveOnEnd: false,
    leaveOnStop: true,
    leaveOnEmpty: true,
    quality: 'high',
});

client.player = player;

// CONSTANTS (TO DO SHOULD BE IN A SPERPATE FILE)
const generalChannel = "143853351103102976";


// GRAB ALL OUR COMMANDS BEFORE WE LOGIN
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

client.commands = new Discord.Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on("message", async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  if(command === 'play'){
      const searchString = args.join(' ');
      let song = await client.player.play(message.member.voice.channel, searchString, {
          duration: 'long' // This is optional
      });

      song = song.song;
      console.log(song.song)
      message.channel.send(`Started playing ${song.name}.`);
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

const Discord = require('discord.js');
const client = new Discord.Client();
const { Player } = require("discord-music-player");
const config = require('./bot_config.js');
// CONSTANTS
const generalChannel = '143853351103102976';
const generalChannelVoice = '143853351103102977';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.includes('gay')) {
    msg.reply('Gay means happy');
  }

});

// sends a welcome message if a user joins
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.id == generalChannel);
  if (!channel) return;
  channel.send('Welcome to the Mushroom Cave' + ' ' + member.displayName + '!');
});



client.login(config.token);
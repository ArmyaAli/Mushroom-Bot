const fetch = require('node-fetch');
const { MessageEmbed }  = require('discord.js');

module.exports = {
  name: "udquery",
  description: "Queries urbandictionary using their public API!",
  async execute(message, args) {
    const searchQuery = args.join(" ");
    const api = `http://api.urbandictionary.com/v0/define?term=${searchQuery}`;
    try {
      const rawdata = await fetch(api);
      const json = await rawdata.json();
      const results = json.list.slice(0, 5);
      if(results.length == 0) {
        throw 'No results found! Try a different query';
      }
      const messageList = [];
      for(let i = 0; i < results.length; ++i) {
        const msgFormat = `Definition
                          ${results[i].definition} 

                          Example
                          ${results[i].example}
                        `;
        messageList.push(new MessageEmbed()
        .setTitle(`Word: ${searchQuery}, Thumbsup: ${results[i].thumbs_up}, Thumbsdown: ${results[i].thumbs_down}`)
        .setColor(0xff0000)
        .setURL(results[i].permalink)
        .setDescription(msgFormat));
      }

      for(const msg of messageList) {
        message.channel.send(msg);
      }
    } catch(error) {
      message.channel.send(`Error occured: ${error}`);
    }
  
  },
};

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

      if(json.list === undefined || json.list.length === 0)
        throw 'No results found! Try a different query';

        let results = json.list.slice(0, 5);
        results.sort((a, b) =>  b.thumbs_up - a.thumbs_up)
        for(let i = 0; i < results.length; ++i) {
        const msgFormat = `Definition
                          ${results[i].definition} 

                          Example
                          ${results[i].example}
                        `;
        await message.channel.send(new MessageEmbed()
        .setTitle(`Word: ${searchQuery} UP: ${results[i].thumbs_up} DOWN: ${results[i].thumbs_down}`)
        .setColor(0xff0000)
        .setURL(results[i].permalink)
        .setDescription(msgFormat));
      }
    } catch(error) {
      message.channel.send(`Error occured: ${error}`);
    }
  
  },
};

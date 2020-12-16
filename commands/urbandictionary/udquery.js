const https = require("http");

module.exports = {
  name: "udquery",
  description: "Queries urbandictionary using their public API!",
  async execute(message, args) {
    const searchQuery = args.join(" ");
    const api = `http://api.urbandictionary.com/v0/define?term=${searchQuery}`;
    message.channel.send(searchQuery);

    https.get(api, (resp) => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          message.channel.send(`API RESPONSE: ${JSON.parse(data)}`);
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
  },
};

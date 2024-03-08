import 'dotenv/config'

import { REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { promises as fs } from 'fs';
import path from 'path'

interface Command {
    cooldown: number,
    // NOTE(Ali): For some freakin' reason, data.setName() <- cannot contain capital chars
    data: SlashCommandBuilder,
    exec: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commands: Command[] = [];
const __COMMANDPATH = `${__dirname}/../src/commands`;

// Set this variable to your GuildID
// Default is Mushroom Cave (my guild ;)
const guildId = '143853351103102976';

(async function run() {
  // Node 20... has a recursive file walk??
  await (async function loadCommands() {
    const files = await fs.readdir(__COMMANDPATH, { recursive: true });
    for (const file of files) {
        if(/(.js$|.ts$)/.test(file)) {
          const command = await import(path.join(__COMMANDPATH, file));
          commands.push(command.default.data);
        }
    }
  })();


  // deploy your commands!
  (async () => {
    try {
      if(!process.env.DISCORD_BOT_TOKEN) process.exit()
      if(!process.env.DISCORD_CLIENT_ID) process.exit()

      console.log(`Started refreshing ${commands.length} application (/) commands.`);

      const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

      if(process.argv[2] === 'global') {
        const data = await rest.put( Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands } );
        console.log(`Successfully reloaded ${(data as any[]).length} global application (/) commands.`);
      } else {
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put( Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId), { body: commands },);
        console.log(`Successfully reloaded ${(data as any[]).length} guild application (/) commands.`);
      }

    } catch (error) {
      console.error(error);
    }
  })();
})()

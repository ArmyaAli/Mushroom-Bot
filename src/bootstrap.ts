import { promises as fs } from 'fs'
import  path from 'path'
import { __COMMANDPATH } from './constants'
import { __botCommands, __commandTree } from './globals';

// Node 20... has a recursive file walk??
(async function loadCommands() {
  const files = await fs.readdir(__COMMANDPATH, { recursive: true });
  for (const file of files) {
      if(/(.js$|.ts$)/.test(file)) {
        const command = await import(path.join(__COMMANDPATH, file));
        __botCommands.set(command.default.data.name, command.default);
      }
  }
})();

export {};

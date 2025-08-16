import fs from 'node:fs';
import path from 'node:path';
import { MushroomBot } from './types';

export async function Init(bot: MushroomBot) {
    const client = bot.discord_client;
    if(client) {
        bot.logger.info('Initializing bot components');
        await loadEvents(bot);
        await loadCommands(bot);
        bot.logger.info('Bot components initialized successfully');
    } else {
        bot.logger.error('Failed to initialize bot: Discord client is null');
    }
}

export async function loadEvents(bot: MushroomBot) {
    const client = bot.discord_client;
    if (!client) {
        bot.logger.error('Failed to load events: Discord client is null');
        return;
    }

    try {
        const eventsPath = path.join(__dirname, 'Events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
        
        bot.logger.info('Loading events', { eventCount: eventFiles.length });

        for (const file of eventFiles) {
            try {
                const filePath = path.join(eventsPath, file);
                const event = require(filePath);
                
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(bot, ...args));
                } else {
                    client.on(event.name, (...args) => event.execute(bot, ...args));
                }
                
                bot.logger.debug('Event loaded successfully', { 
                    event: event.name, 
                    file,
                    once: !!event.once 
                });
            } catch (error) {
                bot.logger.error('Failed to load event file', {
                    file,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        
        bot.logger.info('Events loaded successfully');
    } catch (error) {
        bot.logger.error('Failed to load events directory', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
    }
}

export async function loadCommands(bot: MushroomBot) {
    const commandsPath = path.join(__dirname, 'Commands');
    bot.logger.info('Loading commands', { commandsPath });

    function readCommands(dir: string) {
        try {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            let loadedCount = 0;

            for (const file of files) {
                const filePath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    bot.logger.debug('Entering command subdirectory', { directory: file.name });
                    readCommands(filePath);
                } else if (file.isFile() && file.name.endsWith('.ts')) {
                    try {
                        const command = require(filePath);
                        if ('data' in command && 'execute' in command) {
                            bot.commands.set(command.data.name, command);
                            loadedCount++;
                            bot.logger.debug('Command loaded successfully', {
                                command: command.data.name,
                                file: file.name
                            });
                        } else {
                            bot.logger.warn('Invalid command file structure', {
                                file: filePath,
                                hasData: 'data' in command,
                                hasExecute: 'execute' in command
                            });
                        }
                    } catch (error) {
                        bot.logger.error('Failed to load command file', {
                            file: filePath,
                            error: error instanceof Error ? error.message : 'Unknown error'
                        });
                    }
                }
            }

            bot.logger.info('Commands loaded from directory', {
                directory: dir,
                loadedCount
            });
        } catch (error) {
            bot.logger.error('Failed to read commands directory', {
                directory: dir,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    readCommands(commandsPath);
    bot.logger.info('Command loading completed', {
        totalCommands: bot.commands.size
    });
}

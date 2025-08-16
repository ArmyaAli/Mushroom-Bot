import fs from 'fs';
import path from 'path';
import { createWriteStream, WriteStream } from 'fs';

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

export interface LoggerConfig {
    level: LogLevel;
    logDir: string;
    maxFiles?: number;         // Maximum number of log files to keep
    maxFileSize?: number;      // Maximum size of each log file in bytes
    retentionDays?: number;   // Number of days to keep log files
    enableConsole?: boolean;  // Whether to also log to console
    filename?: string;        // Base filename for logs
}

export class Logger {
    private static instance: Logger;
    private config: LoggerConfig;
    private currentStream: WriteStream | null = null;
    private currentLogFile: string = '';
    private currentFileSize: number = 0;

    private constructor(config: LoggerConfig) {
        this.config = {
            ...{
                maxFiles: 5,
                maxFileSize: 5 * 1024 * 1024, // 5MB default
                retentionDays: 7,
                enableConsole: true,
                filename: 'app.log'
            },
            ...config
        };

        // Ensure log directory exists
        if (!fs.existsSync(this.config.logDir)) {
            fs.mkdirSync(this.config.logDir, { recursive: true });
        }

        this.rotateLogsIfNeeded();
        this.cleanOldLogs();
        this.openNewLogStream();
    }

    public static getInstance(config?: LoggerConfig): Logger {
        if (!Logger.instance && config) {
            Logger.instance = new Logger(config);
        }
        if (!Logger.instance) {
            throw new Error('Logger not initialized. Please provide config first.');
        }
        return Logger.instance;
    }

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private formatMessage(level: LogLevel, message: string, meta?: any): string {
        const timestamp = this.getTimestamp();
        const levelStr = LogLevel[level].padEnd(5);
        let formattedMessage = `[${timestamp}] ${levelStr}: ${message}`;
        
        if (meta) {
            formattedMessage += ' ' + JSON.stringify(meta);
        }
        
        return formattedMessage + '\n';
    }

    private openNewLogStream(): void {
        // Use only the date part for the log file name
        const date = new Date().toISOString().split('T')[0];
        this.currentLogFile = path.join(
            this.config.logDir,
            `${path.parse(this.config.filename || 'app.log').name}-${date}.log`
        );
        
        this.currentStream = createWriteStream(this.currentLogFile, { flags: 'a' });
        this.currentFileSize = fs.existsSync(this.currentLogFile) 
            ? fs.statSync(this.currentLogFile).size 
            : 0;
    }

    private async rotateLogsIfNeeded(): Promise<void> {
        if (!this.currentStream || this.currentFileSize >= (this.config.maxFileSize || 0)) {
            if (this.currentStream) {
                this.currentStream.end();
            }
            this.openNewLogStream();
            
            // Clean up old files if we exceed maxFiles
            const logFiles = fs.readdirSync(this.config.logDir)
                .filter(file => file.endsWith('.log'))
                .map(file => path.join(this.config.logDir, file))
                .sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());

            if (logFiles.length > (this.config.maxFiles || 5)) {
                logFiles.slice(this.config.maxFiles).forEach(file => {
                    try {
                        fs.unlinkSync(file);
                    } catch (err) {
                        console.error(`Failed to delete old log file: ${file}`, err);
                    }
                });
            }
        }
    }

    private cleanOldLogs(): void {
        const now = new Date().getTime();
        const retentionMs = (this.config.retentionDays || 7) * 24 * 60 * 60 * 1000;

        fs.readdirSync(this.config.logDir)
            .filter(file => file.endsWith('.log'))
            .map(file => path.join(this.config.logDir, file))
            .forEach(file => {
                const stat = fs.statSync(file);
                if (now - stat.mtime.getTime() > retentionMs) {
                    try {
                        fs.unlinkSync(file);
                    } catch (err) {
                        console.error(`Failed to delete expired log file: ${file}`, err);
                    }
                }
            });
    }

    private async write(level: LogLevel, message: string, meta?: any): Promise<void> {
        if (level < (this.config.level || LogLevel.INFO)) {
            return;
        }

        const formattedMessage = this.formatMessage(level, message, meta);
        
        // Log to file
        await this.rotateLogsIfNeeded();
        if (this.currentStream) {
            this.currentStream.write(formattedMessage);
            this.currentFileSize += formattedMessage.length;
        }

        // Log to console if enabled
        if (this.config.enableConsole) {
            // Remove the trailing newline for console output
            const consoleMessage = formattedMessage.trimEnd();
            switch (level) {
                case LogLevel.ERROR:
                    console.error(consoleMessage);
                    break;
                case LogLevel.WARN:
                    console.warn(consoleMessage);
                    break;
                case LogLevel.INFO:
                    console.info(consoleMessage);
                    break;
                case LogLevel.DEBUG:
                    console.debug(consoleMessage);
                    break;
            }
        }
    }

    public debug(message: string, meta?: any): void {
        this.write(LogLevel.DEBUG, message, meta);
    }

    public info(message: string, meta?: any): void {
        this.write(LogLevel.INFO, message, meta);
    }

    public warn(message: string, meta?: any): void {
        this.write(LogLevel.WARN, message, meta);
    }

    public error(message: string, meta?: any): void {
        this.write(LogLevel.ERROR, message, meta);
    }

    public setLevel(level: LogLevel): void {
        this.config.level = level;
    }

    public async close(): Promise<void> {
        if (this.currentStream) {
            await new Promise<void>((resolve) => {
                if (this.currentStream) {
                    this.currentStream.end(() => resolve());
                } else {
                    resolve();
                }
            });
        }
    }
}

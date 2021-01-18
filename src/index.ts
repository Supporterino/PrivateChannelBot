import { Logger, ILogObject } from 'tslog';
import { PrivateChannelBot } from './bot/main';
import * as dotenv from "dotenv";
import { appendFileSync } from 'fs';

dotenv.config();

const log : Logger = new Logger({
    name: 'PrivateChannelBotLogger',
    minLevel: 'silly',
    dateTimeTimezone: 'Europe/Berlin'
});

//attachFileOut();

if (process.env.TOKEN !== undefined) {
    log.info('Starting main routine.')
    const bot : PrivateChannelBot = new PrivateChannelBot(log, process.env.TOKEN, '!');
    bot.start();
} else {
    log.fatal(new Error("No token present!"));
}

function logToFile(logObject : ILogObject) {
    appendFileSync('log.log', `${JSON.stringify(logObject)} \n`);
}

function attachFileOut() {
    log.attachTransport(
        {
            silly: logToFile,
            debug: logToFile,
            trace: logToFile,
            info: logToFile,
            warn: logToFile,
            error: logToFile,
            fatal: logToFile, 
        },
        'debug'
    )
}
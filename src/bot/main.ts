import { Logger } from "tslog";
import { Client, Guild, GuildChannel, Message, MessageEmbed } from "discord.js";

export class PrivateChannelBot {
    private logger : Logger;
    private token : string;
    private apiClient : Client;
    private prefix : string;

    constructor(log : Logger, secret : string, pre : string) {
        this.logger = log;
        this.token = secret;
        this.prefix = pre;
        this.apiClient = new Client();
    }

    start() : void {
        this.login();
        this.setCommandHandlers();
    }

    private login() : void {
        this.apiClient.login(this.token);
        this.logger.info('Client logged in.');
    }

    private setCommandHandlers() : void {
        this.apiClient.on('message', msg => {
            if (!msg.content.startsWith(this.prefix) || msg.author.bot) return;

            const args = msg.content.slice(this.prefix.length).trim().split(/ +/);
            const command = args.shift()?.toLowerCase();

            if (command === 'hello') {
                this.sendGreetings(msg);
            } else if (command === 'help') {
                this.sendHelp(msg);
            } else if (command === 'createprivatechannel') {
                this.createPrivateChannel(msg, args);
            } else {
                msg.reply(`Your command didn't match any availible command. Please use !help to see supported commands.`);
            }
        });
        this.logger.info('Initialized command handler.');
    }

    private createPrivateChannel(msg : Message, args : string[]) : void {
        this.logger.info(`Creating private channel for ${msg.author.username}`);

        if (!this.getChannelByName(msg, 'private Channels')) this.createCatChannel(msg);

        if (args.length < 1) {
            this.createVoiceChannel(msg);
        } else if (args.length == 1) {
            this.createVoiceChannel(msg, args[0]);
        } else {
            this.createVoiceChannel(msg, args[0]);
            args.forEach(arg => {

            });
        }
    }

    private createVoiceChannel(msg: Message, name?: string) {

    }

    private createCatChannel(msg: Message) {

    }

    private getChannelByName(msg: Message, name: string) : GuildChannel | undefined {
        return msg.guild.channels.cache.find(channel => channel.name === name);
    }

    private getUserByMention(mention: string) {
        this.logger.info(`Getting user for mention: ${mention}`);
        if (!mention) return;

        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);

            if (mention.startsWith('!')) mention = mention.slice(1);

            return this.apiClient.users.cache.get(mention);
        }
    }

    private sendGreetings(msg : Message) {
        msg.channel.send(`Hello ${msg.author.username} :wave:`);
    }

    private sendHelp(msg: Message) {
        const embeded = new MessageEmbed();

        embeded
            .setTitle('PrivateChannelBot Help Page')
            .setColor(0xff0000)
            .setDescription('I am supporting the following commands:')
            .addField('!hello', 'Get a friendly greeting from the bot.')
            .addField('!help', 'Print this help page.')
            
        msg.channel.send(embeded);
    }
}
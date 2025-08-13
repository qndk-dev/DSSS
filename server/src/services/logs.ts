import chalk from 'chalk';
import { Message, PartialMessage, ChannelType, DMChannel } from 'discord.js';

class Logger {
    constructor() {
    }

    private formatMessage(level: string, message: string): string {
        const timestamp = new Date().toLocaleString();
        return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    }

    public logMessageUpdate(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): void {
        let channelIdentifier = 'Неизвестный канал';
        const channelId = oldMessage.channel?.id;

        if (oldMessage.channel) {
            if (oldMessage.channel.type === ChannelType.DM) {
                const dmChannel = oldMessage.channel as DMChannel;
                channelIdentifier = `DM с ${dmChannel.recipient?.tag || 'неизвестным пользователем'}`;
            } else {
                channelIdentifier = `#${(oldMessage.channel as any).name}`;
            }
        }

        const message = `Сообщение изменено в канале ${channelIdentifier}${channelId ? ` (${channelId})` : ''} пользователем ${oldMessage.author?.tag} (${oldMessage.author?.id}):\n  До: ${oldMessage.content || '[Нет содержимого]'}\n  После: ${newMessage.content || '[Нет содержимого]'}`;
        const formattedMessage = this.formatMessage('info', message);
        console.log(chalk.cyan(formattedMessage));
    }

    public logMessageDelete(message: Message | PartialMessage): void {
        const msgContent = message.content || '[Нет содержимого]';
        let channelIdentifier = 'Неизвестный канал';
        const channelId = message.channel?.id;

        if (message.channel) {
            if (message.channel.type === ChannelType.DM) {
                const dmChannel = message.channel as DMChannel;
                channelIdentifier = `DM с ${dmChannel.recipient?.tag || 'неизвестным пользователем'}`;
            } else {
                channelIdentifier = `#${(message.channel as any).name}`;
            }
        }

        const messageLog = `Сообщение удалено в канале ${channelIdentifier}${channelId ? ` (${channelId})` : ''} пользователем ${message.author?.tag} (${message.author?.id}):\n  Содержимое: ${msgContent}`;
        const formattedMessage = this.formatMessage('warn', messageLog);
        console.log(chalk.magenta(formattedMessage));
    }

    public info(message: string): void {
        const formattedMessage = this.formatMessage('info', message);
        console.log(chalk.green(formattedMessage));
    }

    public warn(message: string): void {
        const formattedMessage = this.formatMessage('warn', message);
        console.log(chalk.yellow(formattedMessage));
    }

    public error(message: string): void {
        const formattedMessage = this.formatMessage('error', message);
        console.error(chalk.red(formattedMessage));
    }

    public debug(message: string): void {
        const formattedMessage = this.formatMessage('debug', message);
        console.log(chalk.blue(formattedMessage));
    }
}

export default new Logger();

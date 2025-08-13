import { Events, Message, PartialMessage } from 'discord.js';
import { Event } from '../interfaces/Command.js';
import Logger from '../services/logs.js';

const event: Event = {
    name: Events.MessageUpdate,
    once: false,
    async execute(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
        if (oldMessage.author?.bot) return;
        Logger.logMessageUpdate(oldMessage, newMessage);
    },
};

export default event;

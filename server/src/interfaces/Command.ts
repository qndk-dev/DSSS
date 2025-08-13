import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    cooldown?: number;
}

export interface Event {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
}

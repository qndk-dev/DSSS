import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder, // Новый импорт для большей гибкости
    ChatInputCommandInteraction,
} from 'discord.js';

export interface Command {
    // Тип data теперь может быть одним из двух, что позволяет использовать его как для
    // команд с подкомандами, так и для команд только с опциями.
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    cooldown?: number;
}
export interface Event {

    name: string;

    once?: boolean;

    execute: (...args: any[]) => Promise<void>;

} 
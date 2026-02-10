import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from './Client.js';

export abstract class BaseCommand {
    protected client: ExtendedClient;
    public abstract data: SlashCommandBuilder;
    public cooldown?: number;

    constructor(client: ExtendedClient) {
        this.client = client;
    }

    public abstract execute(interaction: CommandInteraction): Promise<void>;

    protected async reply(interaction: CommandInteraction, content: string, ephemeral: boolean = false): Promise<void> {
        await interaction.reply({ content, ephemeral });
    }

    protected async deferReply(interaction: CommandInteraction, ephemeral: boolean = false): Promise<void> {
        await interaction.deferReply({ ephemeral });
    }
}

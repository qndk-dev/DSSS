import { Events, Interaction } from 'discord.js';
import { Event } from '../interfaces/Command.js';

const event: Event = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ 
                    content: 'Произошла ошибка при выполнении команды!', 
                    ephemeral: true 
                });
            } else {
                await interaction.reply({ 
                    content: 'Произошла ошибка при выполнении команды!', 
                    ephemeral: true 
                });
            }
        }
    }
};

export default event;

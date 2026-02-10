import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Проверка работоспособности бота'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();
            
            const ping = Date.now() - interaction.createdTimestamp;
            const apiPing = Math.round(interaction.client.ws.ping);

            await interaction.editReply({
                content: `🏓 Pong!\n⏱️ Задержка: \`${ping}мс\`\n<:database:1405139559557238784> API: \`${apiPing}мс\``
            });
        } catch (error) {
            console.error('Error in ping command:', error);
            if (!interaction.replied) {
                await interaction.reply({ 
                    content: '❌ Произошла ошибка при выполнении команды!', 
                    ephemeral: true 
                });
            }
        }
    }
};

export default command;

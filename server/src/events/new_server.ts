import { Client, EmbedBuilder, Events, Guild } from 'discord.js';
import Database from '../database/database.js';

export default {
    name: Events.GuildCreate,
    once: false,
    async execute(guild: Guild) {
        console.log(`Bot has joined a new server: ${guild.name}`);
        
        const db = await Database.getInstance();
        await db.updateGuildSettings(guild.id, {});
        
        const channel = guild.channels.cache.find(
            channel => channel.isTextBased() && guild.members.me && channel.permissionsFor(guild.members.me).has('SendMessages')
        );

    if (channel && channel.isTextBased()) {
        const embed = new EmbedBuilder()
            .setColor('#e558f2') 
            .setAuthor({ 
                name: 'Discord Server Security System', 
                iconURL: guild.members.me?.displayAvatarURL()
            })
            .setTitle('🎉 Добро пожаловать в DSSS!')
            .setDescription(`Привет, **${guild.name}**! Спасибо за доверие!\n\n` +
                          `🤖 Я - многофункциональный бот для управления и модерации вашего сервера.\n` +
                          `🌟 Создан чтобы сделать ваш сервер еще лучше!`)
            .addFields(
                { 
                    name: '📚 Основные команды', 
                    value: '```\n/help - Список всех команд\n/setup - Быстрая настройка\n/dashboard - Веб-панель```',
                    inline: false
                },
                {
                    name: '⚡ Быстрый старт',
                    value: '1️⃣ Используйте `/setup` для базовой настройки\n' +
                           '2️⃣ Настройте права в веб-панели\n' +
                           '3️⃣ Готово к использованию!',
                    inline: true
                },
                {
                    name: '🔗 Полезные ссылки',
                    value: '[🌐 Веб-панель](https://dsss.qndk.fun)\n' +
                           '[📖 Документация](https://dsss.qndk.fun/docs)',
                    inline: true
                }
            )
            .setImage('attachment://newserver.png')
            .setTimestamp()
            .setFooter({ 
                text: `Сервер: ${guild.name} • ID: ${guild.id}`, 
                iconURL: guild.iconURL() || undefined 
            });

        await channel.send({
            embeds: [embed],
            files: [{
                attachment: './assets/newserver.png',
                name: 'newserver.png'
            }]
        });
    }
},
};

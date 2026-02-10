import { EmbedBuilder, Events, Guild } from "discord.js";
import Database from "../database/database.js";

export default {
  name: Events.GuildCreate,
  once: false,
  async execute(guild: Guild) {
    console.log(`Bot has joined a new server: ${guild.name}`);

    const db = await Database.getInstance();
    await db.updateGuildSettings(guild.id, {});

    const channel = guild.channels.cache.find(
      (channel) =>
        channel.isTextBased() &&
        guild.members.me &&
        channel.permissionsFor(guild.members.me).has("SendMessages"),
    );

    if (channel && channel.isTextBased()) {
      const embed = new EmbedBuilder() // todo: migrate in separate file
        .setColor("#e558f2")
        .setAuthor({
          name: "Discord Server Security System",
          iconURL: guild.members.me?.displayAvatarURL(),
        })
        .setTitle("👋 Хай! Это DSSS!")
        .setDescription(
          `Я - многофункциональный бот для управления, модерации и защиты вашего Discord сервера.\n` +
            `И я создан чтобы сделать ваш сервер еще лучше!`,
        )
        .addFields(
          {
            name: "⚡ Быстрый старт",
            value:
              "1. Используйте `/setup` для базовой настройки\n" +
              "2. Настройте нужные вещи в веб-панели\n" +
              "3. Готово к использованию!",
            inline: true,
          },
          {
            name: "🔗 Полезные ссылки",
            value:
              "[Веб-панель](https://dsss.qndk.fun)\n" +
              "[Документация](https://dsss.qndk.fun/docs)\n" +
              "[Открытый исходный код](<https://github.com/qndk-dev/DSSS>)\n" +
              "[Поддержка](https://dsss.qndk.fun/support)",
            inline: true,
          },
        )
        .setImage("attachment://newserver.png")
        .setTimestamp()
        .setFooter({
          text: `Сервер: ${guild.name} • ID вашего сервера: ${guild.id}`,
          iconURL: guild.iconURL() || undefined,
        });

      await channel.send({
        embeds: [embed],
        files: [
          {
            attachment: "./assets/dsss-banner.png",
            name: "newserver.png",
          },
        ],
      });
    }
  },
};

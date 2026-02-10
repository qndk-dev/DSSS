import { EmbedBuilder, Message, PartialMessage, TextChannel } from "discord.js";
import { DatabaseManager } from "../database/database.js";
import Logger from "../services/logs.js";

export default async (message: Message | PartialMessage) => {
  if (message.author?.bot) return;
  if (!message.guild) return;

  try {
    const dbManager = await DatabaseManager.getInstance();
    const settings = await dbManager.getGuildSettings(message.guild.id);
    const logChannelId = settings.log_channel_id;

    if (logChannelId) {
      const logChannel = message.guild.channels.cache.get(
        logChannelId,
      ) as TextChannel;
      if (logChannel && logChannel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000") // Красный цвет для удалений
          .setTitle("🗑️ Сообщение удалено")
          .setDescription(
            `**Автор:** ${message.author?.tag} (${message.author?.id})
**Канал:** <#${message.channel.id}>
**Содержимое:**
\`\`\`${message.content || "Нет контента"}\`\`\``,
          )
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
        Logger.info(
          `Сообщение удалено в канале ${message.channel.id} на сервере ${message.guild.name}`,
        );
      }
    }
  } catch (error) {
    Logger.error(`Ошибка при логировании удаления сообщения: ${error}`);
  }
};

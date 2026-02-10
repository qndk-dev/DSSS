import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    ButtonInteraction,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    RoleSelectMenuInteraction,
} from 'discord.js';
import { Command } from '../interfaces/Command.js';
import { DatabaseManager } from '../database/database.js';

interface SetupState {
    welcome_channel_id?: string;
    log_channel_id?: string;
    mod_channel_id?: string;
    autorole_id?: string;
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Интерактивная настройка бота для сервера')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        try {
            const dbManager = await DatabaseManager.getInstance();
            const currentSettings = await dbManager.getGuildSettings(interaction.guildId!);
            
            // Состояние настроек во время конфигурации
            let setupState: SetupState = { ...currentSettings };

            const showMainMenu = async (isUpdate = false) => {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('⚙️ Настройка бота')
                    .setDescription('Выберите что хотите настроить:')
                    .addFields(
                        {
                            name: '👋 Канал приветствий',
                            value: setupState.welcome_channel_id ? `<#${setupState.welcome_channel_id}>` : '❌ Не настроен',
                            inline: true
                        },
                        {
                            name: '📝 Канал логов',
                            value: setupState.log_channel_id ? `<#${setupState.log_channel_id}>` : '❌ Не настроен',
                            inline: true
                        },
                        {
                            name: '🛡️ Канал модерации',
                            value: setupState.mod_channel_id ? `<#${setupState.mod_channel_id}>` : '❌ Не настроен',
                            inline: true
                        },
                        {
                            name: '🎭 Автороль',
                            value: setupState.autorole_id ? `<@&${setupState.autorole_id}>` : '❌ Не настроена',
                            inline: true
                        }
                    )
                    .setFooter({ text: 'Нажмите на кнопки ниже для настройки' });

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('setup_select')
                    .setPlaceholder('Выберите что настроить...')
                    .addOptions([
                        {
                            label: 'Канал приветствий',
                            description: 'Настроить канал для приветствия новых участников',
                            value: 'welcome',
                            emoji: '👋'
                        },
                        {
                            label: 'Канал логов',
                            description: 'Настроить канал для системных логов',
                            value: 'logs',
                            emoji: '📝'
                        },
                        {
                            label: 'Канал модерации',
                            description: 'Настроить канал для уведомлений модерации',
                            value: 'moderation',
                            emoji: '🛡️'
                        },
                        {
                            label: 'Автороль',
                            description: 'Настроить роль для новых участников',
                            value: 'autorole',
                            emoji: '🎭'
                        }
                    ]);

                const actionRow1 = new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(selectMenu);

                const actionRow2 = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('setup_save')
                            .setLabel('💾 Сохранить настройки')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('setup_reset')
                            .setLabel('🗑️ Сбросить всё')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('setup_cancel')
                            .setLabel('❌ Отмена')
                            .setStyle(ButtonStyle.Secondary)
                    );

                const messageData = {
                    embeds: [embed],
                    components: [actionRow1, actionRow2]
                };

                if (isUpdate) {
                    await interaction.editReply(messageData);
                } else {
                    await interaction.editReply(messageData);
                }
            };

            await showMainMenu();

            const collector = interaction.channel?.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                filter: (i) => i.user.id === interaction.user.id,
                time: 300000 // 5 минут
            });

            const buttonCollector = interaction.channel?.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: (i) => i.user.id === interaction.user.id,
                time: 300000
            });

            const channelCollector = interaction.channel?.createMessageComponentCollector({
                componentType: ComponentType.ChannelSelect,
                filter: (i) => i.user.id === interaction.user.id,
                time: 300000
            });

            const roleCollector = interaction.channel?.createMessageComponentCollector({
                componentType: ComponentType.RoleSelect,
                filter: (i) => i.user.id === interaction.user.id,
                time: 300000
            });

            // Обработка выбора в главном меню
            collector?.on('collect', async (selectInteraction: StringSelectMenuInteraction) => {
                const selectedOption = selectInteraction.values[0];
                
                if (selectedOption === 'welcome' || selectedOption === 'logs' || selectedOption === 'moderation') {
                    const channelSelect = new ChannelSelectMenuBuilder()
                        .setCustomId(`channel_${selectedOption}`)
                        .setPlaceholder('Выберите канал...')
                        .addChannelTypes(ChannelType.GuildText);

                    const backButton = new ButtonBuilder()
                        .setCustomId('back_to_main')
                        .setLabel('← Назад')
                        .setStyle(ButtonStyle.Secondary);

                    const clearButton = new ButtonBuilder()
                        .setCustomId(`clear_${selectedOption}`)
                        .setLabel('🗑️ Убрать')
                        .setStyle(ButtonStyle.Danger);

                    const actionRow1 = new ActionRowBuilder<ChannelSelectMenuBuilder>()
                        .addComponents(channelSelect);
                    
                    const actionRow2 = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(backButton, clearButton);

                    const embed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle(`⚙️ Настройка ${getOptionName(selectedOption)}`)
                        .setDescription('Выберите канал из списка ниже:');

                    await selectInteraction.update({
                        embeds: [embed],
                        components: [actionRow1, actionRow2]
                    });

                } else if (selectedOption === 'autorole') {
                    const roleSelect = new RoleSelectMenuBuilder()
                        .setCustomId('role_autorole')
                        .setPlaceholder('Выберите роль...');

                    const backButton = new ButtonBuilder()
                        .setCustomId('back_to_main')
                        .setLabel('← Назад')
                        .setStyle(ButtonStyle.Secondary);

                    const clearButton = new ButtonBuilder()
                        .setCustomId('clear_autorole')
                        .setLabel('🗑️ Убрать')
                        .setStyle(ButtonStyle.Danger);

                    const actionRow1 = new ActionRowBuilder<RoleSelectMenuBuilder>()
                        .addComponents(roleSelect);
                    
                    const actionRow2 = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(backButton, clearButton);

                    const embed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('⚙️ Настройка автороли')
                        .setDescription('Выберите роль, которая будет автоматически выдаваться новым участникам:');

                    await selectInteraction.update({
                        embeds: [embed],
                        components: [actionRow1, actionRow2]
                    });
                }
            });

            // Обработка выбора канала
            channelCollector?.on('collect', async (channelInteraction: ChannelSelectMenuInteraction) => {
                const customId = channelInteraction.customId;
                const selectedChannel = channelInteraction.channels.first();

                if (customId.startsWith('channel_')) {
                    const optionType = customId.replace('channel_', '');
                    
                    if (optionType === 'welcome') {
                        setupState.welcome_channel_id = selectedChannel?.id;
                    } else if (optionType === 'logs') {
                        setupState.log_channel_id = selectedChannel?.id;
                    } else if (optionType === 'moderation') {
                        setupState.mod_channel_id = selectedChannel?.id;
                    }

                    await channelInteraction.deferUpdate();
                    await showMainMenu(true);
                }
            });

            // Обработка выбора роли
            roleCollector?.on('collect', async (roleInteraction: RoleSelectMenuInteraction) => {
                const selectedRole = roleInteraction.roles.first();
                setupState.autorole_id = selectedRole?.id;

                await roleInteraction.deferUpdate();
                await showMainMenu(true);
            });

            // Обработка кнопок
            buttonCollector?.on('collect', async (buttonInteraction: ButtonInteraction) => {
                const customId = buttonInteraction.customId;

                if (customId === 'back_to_main') {
                    await buttonInteraction.deferUpdate();
                    await showMainMenu(true);
                    
                } else if (customId.startsWith('clear_')) {
                    const optionType = customId.replace('clear_', '');
                    
                    if (optionType === 'welcome') {
                        setupState.welcome_channel_id = undefined;
                    } else if (optionType === 'logs') {
                        setupState.log_channel_id = undefined;
                    } else if (optionType === 'moderation') {
                        setupState.mod_channel_id = undefined;
                    } else if (optionType === 'autorole') {
                        setupState.autorole_id = undefined;
                    }

                    await buttonInteraction.deferUpdate();
                    await showMainMenu(true);
                    
                } else if (customId === 'setup_save') {
                    await dbManager.updateGuildSettings(interaction.guildId!, setupState);

                    const successEmbed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('✅ Настройки успешно сохранены!')
                        .setDescription('Все изменения применены.')
                        .addFields(
                            {
                                name: '👋 Канал приветствий',
                                value: setupState.welcome_channel_id ? `<#${setupState.welcome_channel_id}>` : 'Не установлен',
                                inline: true
                            },
                            {
                                name: '📝 Канал логов',
                                value: setupState.log_channel_id ? `<#${setupState.log_channel_id}>` : 'Не установлен',
                                inline: true
                            },
                            {
                                name: '🛡️ Канал модерации',
                                value: setupState.mod_channel_id ? `<#${setupState.mod_channel_id}>` : 'Не установлен',
                                inline: true
                            },
                            {
                                name: '🎭 Автороль',
                                value: setupState.autorole_id ? `<@&${setupState.autorole_id}>` : 'Не установлена',
                                inline: true
                            }
                        )
                        .setTimestamp();

                    await buttonInteraction.update({
                        embeds: [successEmbed],
                        components: []
                    });

                    // Останавливаем все коллекторы
                    collector?.stop();
                    buttonCollector?.stop();
                    channelCollector?.stop();
                    roleCollector?.stop();
                    
                } else if (customId === 'setup_reset') {
                    setupState = {};

                    await buttonInteraction.deferUpdate();
                    await showMainMenu(true);
                    
                } else if (customId === 'setup_cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        .setColor('#ff9900')
                        .setTitle('❌ Настройка отменена')
                        .setDescription('Никакие изменения не были сохранены.');

                    await buttonInteraction.update({
                        embeds: [cancelEmbed],
                        components: []
                    });

                    collector?.stop();
                    buttonCollector?.stop();
                    channelCollector?.stop();
                    roleCollector?.stop();
                }
            });

            // Обработка истечения времени
            collector?.on('end', () => {
                // Коллекторы автоматически очистятся
            });

        } catch (error) {
            console.error('Error in interactive setup command:', error);
            await interaction.editReply({
                content: '❌ Произошла ошибка при настройке бота.',
                embeds: [],
                components: []
            });
        }
    }
};

function getOptionName(option: string): string {
    switch (option) {
        case 'welcome': return 'канала приветствий';
        case 'logs': return 'канала логов';
        case 'moderation': return 'канала модерации';
        case 'autorole': return 'автороли';
        default: return 'неизвестной опции';
    }
}

export default command;
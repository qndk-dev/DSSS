import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Command } from '../interfaces/Command.js';
import Logger from '../services/logs.js'; // Изменено на новый логгер

export class ExtendedClient extends Client {
    public commands: Collection<string, Command>;
    public cooldowns: Collection<string, Collection<string, number>>;
    public logger: typeof Logger;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessageReactions
            ],
            allowedMentions: { parse: ['users', 'roles'], repliedUser: false }
        });

        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.logger = Logger;
    }

    public async init() {
        this.logger.info('Initializing bot...');
        
        // Загрузка обработчиков
        await this.loadHandlers();
        
        // Подключение к Discord
        await this.login(process.env.DISCORD_TOKEN);
    }

    private async loadHandlers() {
        const { CommandHandler } = await import('../handlers/CommandHandler.js');
        const { EventHandler } = await import('../handlers/EventHandler.js');

        // Инициализация обработчиков
        const commandHandler = new CommandHandler(this);
        const eventHandler = new EventHandler(this);

        // Загрузка команд и событий
        await commandHandler.loadCommands();
        await eventHandler.loadEvents();
    }
}

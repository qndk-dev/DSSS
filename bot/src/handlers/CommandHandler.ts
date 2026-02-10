import { Collection } from 'discord.js';
import { ExtendedClient } from '../structures/Client.js';
import { Command } from '../interfaces/Command.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CommandHandler {
    private client: ExtendedClient;
    private commandsPath: string;

    constructor(client: ExtendedClient) {
        this.client = client;
        this.commandsPath = path.join(__dirname, '..', 'commands');
    }

    public async loadCommands(): Promise<void> {
        try {
            const commandFiles = fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.ts'));

            for (const file of commandFiles) {
                const filePath = path.join(this.commandsPath, file);
                const commandModule = await import(`file://${filePath}`);
                const command = commandModule.default;

                if ('data' in command && 'execute' in command) {
                    this.client.commands.set(command.data.name, command);
                    this.client.logger.debug(`Загружена команда: ${command.data.name}`);
                } else {
                    this.client.logger.warn(`Команда ${file} не содержит необходимых свойств 'data' или 'execute'`);
                }
            }
        } catch (error) {
            this.client.logger.error(`Ошибка при загрузке команд: ${error}`);
        }
    }

    public async handleCooldowns(command: Command, userId: string): Promise<boolean> {
        if (!this.client.cooldowns.has(command.data.name)) {
            this.client.cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = this.client.cooldowns.get(command.data.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps?.has(userId)) {
            const expirationTime = timestamps.get(userId)! + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return false;
            }
        }

        timestamps?.set(userId, now);
        setTimeout(() => timestamps?.delete(userId), cooldownAmount);
        return true;
    }
}

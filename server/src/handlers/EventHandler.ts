import { ExtendedClient } from '../structures/Client.js';
import { Event } from '../interfaces/Command.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EventHandler {
    private client: ExtendedClient;
    private eventsPath: string;

    constructor(client: ExtendedClient) {
        this.client = client;
        this.eventsPath = path.join(__dirname, '..', 'events');
    }

    public async loadEvents(): Promise<void> {
        try {
            const eventFiles = fs.readdirSync(this.eventsPath).filter(file => file.endsWith('.ts'));

            for (const file of eventFiles) {
                const filePath = path.join(this.eventsPath, file);
                const eventModule = await import(`file://${filePath}`);
                const event: Event = eventModule.default;

                if (event.once) {
                    this.client.once(event.name, (...args: unknown[]) => event.execute(...args));
                } else {
                    this.client.on(event.name, (...args: unknown[]) => event.execute(...args));
                }

                this.client.logger.debug(`Загружено событие: ${event.name}`);
            }
        } catch (error) {
            this.client.logger.error(`Ошибка при загрузке событий: ${error}`);
        }
    }
}

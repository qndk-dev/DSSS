import { createClient, Client } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data.db');

interface GuildSettings {
    welcome_channel_id?: string;
    log_channel_id?: string;
    mod_channel_id?: string;
    autorole_id?: string;
}

class DatabaseSingleton {
    private static instance: DatabaseSingleton;
    private db!: Client;

    private constructor() {}

    public static async getInstance(): Promise<DatabaseSingleton> {
        if (!DatabaseSingleton.instance) {
            DatabaseSingleton.instance = new DatabaseSingleton();
            await DatabaseSingleton.instance.initialize();
        }
        return DatabaseSingleton.instance;
    }

    private async initialize(): Promise<void> {
        this.db = createClient({
            url: `file:${dbPath}`,
        });

        await this.db.execute(`
            CREATE TABLE IF NOT EXISTS guild_settings (
                guildId TEXT PRIMARY KEY,
                settings TEXT
            );
        `);
        console.log('База данных успешно инициализирована.');
    }

    public async getGuildSettings(guildId: string): Promise<GuildSettings> {
        const result = await this.db.execute({
            sql: 'SELECT settings FROM guild_settings WHERE guildId = ?',
            args: [guildId]
        });
        
        if (result.rows.length > 0) {
            const settings = result.rows[0].settings as string;
            return JSON.parse(settings);
        }
        return {};
    }

    public async updateGuildSettings(guildId: string, settings: GuildSettings): Promise<void> {
        const currentSettings = await this.getGuildSettings(guildId);
        const newSettings = { ...currentSettings, ...settings };
        const settingsJson = JSON.stringify(newSettings);
        
        await this.db.execute({
            sql: 'INSERT OR REPLACE INTO guild_settings (guildId, settings) VALUES (?, ?)',
            args: [guildId, settingsJson]
        });
    }

    public async close(): Promise<void> {
        await this.db.close();
    }
}

export default DatabaseSingleton;
export const DatabaseManager = DatabaseSingleton;
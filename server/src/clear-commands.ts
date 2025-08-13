import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '../.env') });

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
    try {
        console.log('Удаляем все команды...');
        
        // Удаляем глобальные команды
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: [] }
        );

        console.log('✅ Все команды успешно удалены!');
    } catch (error) {
        console.error('Ошибка при удалении команд:', error);
    }
})();

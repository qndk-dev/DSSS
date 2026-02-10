import { config } from 'dotenv';
import { REST, Routes } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Правильный путь к .env в папке server
config({ path: path.join(__dirname, '../.env') });

const commands: any[] = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const commandModule = await import(`./commands/${file}`);
    const command = commandModule.default;
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);


(async () => {
    try {
        console.log(`Найдено ${commandFiles.length} команд для регистрации...`);
        
        // Регистрируем команды глобально
        console.log('Начинаем глобальную регистрацию (/) команд...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands },
        );

        console.log('✅ Команды успешно зарегистрированы глобально!');
        console.log('⚠️ Примечание: обновление глобальных команд может занять до часа');
        
        // Выводим список зарегистрированных команд
        console.log('\nСписок зарегистрированных команд:');
        commands.forEach((cmd: any) => {
            console.log(`- /${cmd.name}: ${cmd.description}`);
        });
    } catch (error) {
        console.error('❌ Ошибка при регистрации команд:', error);
    }
})();

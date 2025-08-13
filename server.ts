import { spawn } from 'child_process';
import { ExtendedClient } from './server/src/structures/Client';
import { config } from 'dotenv';

config();

// Функция для запуска Nuxt
function startNuxt() {
    const nuxt = spawn('pnpm', ['nuxt', 'dev'], {
        stdio: 'inherit',
        shell: true
    });

    nuxt.on('error', (error) => {
        console.error('Ошибка при запуске Nuxt:', error);
    });

    return nuxt;
}

// Функция для запуска Discord бота
async function startBot() {
    const client = new ExtendedClient();
    
    try {
        await client.init();
        console.log('✅ Discord бот успешно запущен');
    } catch (error) {
        console.error('Ошибка при запуске бота:', error);
    }
    
    return client;
}

// Запуск всех сервисов
async function startServices() {
    console.log('🚀 Запуск сервисов...');
    
    // Запуск Nuxt
    const nuxt = startNuxt();
    console.log('📦 Nuxt запускается...');

    // Запуск Discord бота
    const bot = await startBot();
    console.log('🤖 Discord бот запускается...');

    // Обработка завершения работы
    process.on('SIGTERM', () => {
        console.log('Завершение работы...');
        nuxt.kill();
        bot.destroy();
        process.exit(0);
    });

    process.on('SIGINT', () => {
        console.log('Завершение работы...');
        nuxt.kill();
        bot.destroy();
        process.exit(0);
    });
}

startServices().catch(console.error);

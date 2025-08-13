import { config } from 'dotenv';
import { ExtendedClient } from './structures/Client.js';

// Загрузка переменных окружения
config();

// Создание инстанса клиента
const client = new ExtendedClient();

// Обработка необработанных исключений
process.on('unhandledRejection', (error: Error) => {
    client.logger.error(`Необработанное исключение: ${error.stack}`);
});

process.on('uncaughtException', (error: Error) => {
    client.logger.error(`Неперехваченное исключение: ${error.stack}`);
    process.exit(1);
});

// Инициализация бота
client.init().catch((error: Error) => {
    client.logger.error(`Ошибка при инициализации: ${error.stack}`);
    process.exit(1);
});

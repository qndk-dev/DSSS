import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data.db');

export async function initializeDatabase() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE,
            value TEXT
        );
    `);

    console.log('База данных успешно инициализирована.');
    return db;
}

export async function getSetting(key: string): Promise<string | null> {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    const row = await db.get('SELECT value FROM settings WHERE key = ?', key);
    await db.close();
    return row ? row.value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, value);
    await db.close();
}

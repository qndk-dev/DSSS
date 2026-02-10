import { defineEventHandler, readBody } from 'h3';
import { getSetting, setSetting } from '../../server/src/database/database.js';

export default defineEventHandler(async (event) => {
    if (event.node.req.method === 'GET') {
        const key = event.node.req.url?.split('/').pop();
        if (key) {
            const value = await getSetting(key);
            return { key, value };
        }
        return { error: 'Key not provided' };
    } else if (event.node.req.method === 'POST') {
        const body = await readBody(event);
        const { key, value } = body;
        if (key && value) {
            await setSetting(key, value);
            return { success: true };
        }
        return { error: 'Key or value not provided' };
    }
    return { error: 'Method not allowed' };
});

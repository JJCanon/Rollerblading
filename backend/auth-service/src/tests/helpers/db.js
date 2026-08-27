import { pool } from '../../config/db.js';

export async function cleanDatabase() {
    await pool.query('TRUNCATE refresh_tokens, users RESTART IDENTITY CASCADE');
}

export async function closeDbPool() {
    await pool.end();
}
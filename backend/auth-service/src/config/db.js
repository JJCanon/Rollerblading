import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: env.databaseUrl,
});

// it fails fast if the DB doesn't response when it starts, in change on discover it
// recent in the first request which it need it.
export async function checkDbConnection() {
    const client = await pool.connect();
    try {
        await client.query('SELECT 1');
    } finally {
        client.release();
    }
}
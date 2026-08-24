import { pool } from '../config/db.js';

// Save Refresh Token
export async function saveRefreshToken({ userId, tokenHash, expiresAt }) {
    const { rows } = await pool.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, expires_at, revoked`,
        [userId, tokenHash, expiresAt]
    );
    return rows[0];
}

// Find Valid Refresh Token
export async function findValidRefreshToken(tokenHash) {
    const { rows } = await pool.query(
        `SELECT * FROM refresh_tokens
        WHERE token_hash = $1
        AND revoked = false
        AND expires_at > now()`,
        [tokenHash]
    );
    return rows[0] ?? null;
}

// Revoke Refresh Token
export async function revokeRefreshToken(id) {
    const { rows } = await pool.query(
        `UPDATE refresh_tokens 
        SET revoked = true 
        WHERE id = $1`,
        [id]
    );
}

// Revoke All User Tokens
export async function revokeAllUserTokens(userId) {
    await pool.query(
        `UPDATE refresh_tokens
        SET revoked = true
        WHERE user_id = $1 
        AND revoked = false`,
        [userId]
    );
}
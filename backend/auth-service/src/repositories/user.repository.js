import { pool } from '../config/db.js';

// Create User
export async function createUser({ email, passwordHash, name, lastname, cellphone, avatarUrl }) {
    const { rows } = await pool.query(
        `INSERT INTO users (email, password_hash, name, lastname, cellphone, avatar_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, name, lastname, cellphone, avatar_url, role, active, registered_at`,
        [email, passwordHash, name, lastname, cellphone ?? null, avatarUrl ?? null]
    );
    return rows[0];
}

// Find by email
export async function findUserByEmail(email) {
    const { rows } = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return rows[0] ?? null;
}

// Find by id
export async function findUserById(id) {
    const { rows } = await pool.query(
        `SELECT id, email, name, lastname, cellphone, avatar_url, role, active, registered_at
        FROM users WHERE id = $1`,
        [id]
    )
    return rows[0] ?? null
}


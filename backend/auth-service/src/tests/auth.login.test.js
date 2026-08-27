import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { cleanDatabase, closeDbPool } from './helpers/db.js';

const VALID_USER = {
    email: 'login-test@example.com',
    password: 'password123',
    name: 'Ana',
    lastname: 'Gomez',
};

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await cleanDatabase();
        await request(app).post('/api/auth/register').send(VALID_USER);
    });

    after(async () => {
        await closeDbPool();
    });

    test('inicia sesión con credenciales correctas', async () => {
        const response = await request(app).post('/api/auth/login').send({
            email: VALID_USER.email,
            password: VALID_USER.password,
        });

        assert.equal(response.status, 200);
        assert.ok(response.body.accessToken);
        assert.ok(response.body.refreshToken);
        assert.equal(response.body.user.email, VALID_USER.email);
        assert.equal(response.body.user.password_hash, undefined);
    });

    test('rechaza contraseña incorrecta', async () => {
        const response = await request(app).post('/api/auth/login').send({
            email: VALID_USER.email,
            password: 'contraseña-equivocada',
        });

        assert.equal(response.status, 401);
    });

    test('rechaza email que no existe', async () => {
        const response = await request(app).post('/api/auth/login').send({
            email: 'no-existe@example.com',
            password: 'cualquierPassword123',
        });

        assert.equal(response.status, 401);
    });

    test('el mensaje de error es igual para email inexistente y password incorrecta', async () => {
        const wrongPassword = await request(app).post('/api/auth/login').send({
            email: VALID_USER.email,
            password: 'contraseña-equivocada',
        });

        const wrongEmail = await request(app).post('/api/auth/login').send({
            email: 'no-existe@example.com',
            password: 'cualquierPassword123',
        });

        assert.equal(wrongPassword.body.error, wrongEmail.body.error);
    });

    test('rechaza login de usuario inactivo', async () => {
        const { pool } = await import('../config/db.js');
        await pool.query('UPDATE users SET active = false WHERE email = $1', [VALID_USER.email]);

        const response = await request(app).post('/api/auth/login').send({
            email: VALID_USER.email,
            password: VALID_USER.password,
        });

        assert.equal(response.status, 401);
    });
});
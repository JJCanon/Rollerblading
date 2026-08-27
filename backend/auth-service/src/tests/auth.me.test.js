import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { cleanDatabase, closeDbPool } from './helpers/db.js';

const VALID_USER = {
    email: 'me-test@example.com',
    password: 'password123',
    name: 'Ana',
    lastname: 'Gomez',
};

async function registerAndLogin() {
    await request(app).post('/api/auth/register').send(VALID_USER);
    const loginResponse = await request(app).post('/api/auth/login').send({
        email: VALID_USER.email,
        password: VALID_USER.password,
    });
    return loginResponse.body;
}

describe('GET /api/auth/me', () => {
    beforeEach(async () => {
        await cleanDatabase();
    });

    after(async () => {
        await closeDbPool();
    });

    test('devuelve los datos del usuario con un access token válido', async () => {
        const { accessToken } = await registerAndLogin();

        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${accessToken}`);

        assert.equal(response.status, 200);
        assert.equal(response.body.user.email, VALID_USER.email);
        assert.equal(response.body.user.password_hash, undefined);
    });

    test('rechaza el request sin header Authorization', async () => {
        const response = await request(app).get('/api/auth/me');

        assert.equal(response.status, 401);
    });

    test('rechaza un token con formato inválido', async () => {
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer token-que-no-es-un-jwt-real');

        assert.equal(response.status, 401);
    });

    test('rechaza un refresh token usado como access token', async () => {
        const { refreshToken } = await registerAndLogin();

        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${refreshToken}`);

        assert.equal(response.status, 401);
    });
});
import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { cleanDatabase, closeDbPool } from './helpers/db.js';

const VALID_USER = {
    email: 'logout-all-test@example.com',
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

after(async () => {
    await closeDbPool();
});

describe('POST /api/auth/logout-all', () => {
    beforeEach(async () => {
        await cleanDatabase();
    });

    test('revoca todas las sesiones activas del usuario', async () => {
        // Simula 2 sesiones activas: dos logins distintos del mismo usuario
        const session1 = await registerAndLogin();
        const loginAgain = await request(app).post('/api/auth/login').send({
            email: VALID_USER.email,
            password: VALID_USER.password,
        });
        const session2 = loginAgain.body;

        const logoutAllResponse = await request(app)
            .post('/api/auth/logout-all')
            .set('Authorization', `Bearer ${session1.accessToken}`);

        assert.equal(logoutAllResponse.status, 204);

        // Ambos refresh tokens deben quedar inválidos, no solo el de session1
        const refresh1 = await request(app).post('/api/auth/refresh').send({ refreshToken: session1.refreshToken });
        const refresh2 = await request(app).post('/api/auth/refresh').send({ refreshToken: session2.refreshToken });

        assert.equal(refresh1.status, 401);
        assert.equal(refresh2.status, 401);
    });

    test('rechaza el request sin access token', async () => {
        const response = await request(app).post('/api/auth/logout-all');

        assert.equal(response.status, 401);
    });
});
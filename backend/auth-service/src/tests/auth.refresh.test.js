import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { cleanDatabase, closeDbPool } from './helpers/db.js';

const VALID_USER = {
    email: 'refresh-test@example.com',
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

describe('POST /api/auth/refresh', () => {
    beforeEach(async () => {
        await cleanDatabase();
    });

    test('emite un nuevo par de tokens con un refresh token válido', async () => {
        const { refreshToken } = await registerAndLogin();
        const response = await request(app).post('/api/auth/refresh').send({ refreshToken });

        assert.equal(response.status, 200);
        assert.ok(response.body.accessToken);
        assert.ok(response.body.refreshToken);
        assert.notEqual(response.body.refreshToken, refreshToken);
    });

    test('rota el refresh token: el token usado no vuelve a servir', async () => {
        const { refreshToken } = await registerAndLogin();
        await request(app).post('/api/auth/refresh').send({ refreshToken });
        const secondAttempt = await request(app).post('/api/auth/refresh').send({ refreshToken });

        assert.equal(secondAttempt.status, 401);
    });

    test('rechaza un refresh token inexistente', async () => {
        const response = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken: 'un-token-que-nunca-existio' });

        assert.equal(response.status, 401);
    });
});

describe('POST /api/auth/logout', () => {
    beforeEach(async () => {
        await cleanDatabase();
    });

    test('revoca el refresh token exitosamente', async () => {
        const { refreshToken } = await registerAndLogin();
        const logoutResponse = await request(app).post('/api/auth/logout').send({ refreshToken });

        assert.equal(logoutResponse.status, 204);

        const refreshAfterLogout = await request(app).post('/api/auth/refresh').send({ refreshToken });
        assert.equal(refreshAfterLogout.status, 401);
    });

    test('es idempotente: repetir logout con el mismo token no falla', async () => {
        const { refreshToken } = await registerAndLogin();
        const first = await request(app).post('/api/auth/logout').send({ refreshToken });
        const second = await request(app).post('/api/auth/logout').send({ refreshToken });

        assert.equal(first.status, 204);
        assert.equal(second.status, 204);
    });

    test('no falla con un token que nunca existió', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .send({ refreshToken: 'un-token-que-nunca-existio' });

        assert.equal(response.status, 204);
    });
});
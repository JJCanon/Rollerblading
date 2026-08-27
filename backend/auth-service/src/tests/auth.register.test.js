import { test, describe, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { cleanDatabase, closeDbPool } from './helpers/db.js';

describe('POST /api/auth/register', () => {
    beforeEach(async () => {
        await cleanDatabase();
    });

    after(async () => {
        await closeDbPool();
    });

    test('registra un usuario nuevo correctamente', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'nuevo@example.com',
                password: 'password123',
                name: 'Ana',
                lastname: 'Gomez',
            });

        assert.equal(response.status, 201);
        assert.equal(response.body.user.email, 'nuevo@example.com');
        assert.equal(response.body.user.role, 'roller');
        assert.equal(response.body.user.password_hash, undefined);
    });

    test('rechaza un registro con email duplicado', async () => {
        await request(app).post('/api/auth/register').send({
            email: 'duplicado@example.com',
            password: 'password123',
            name: 'Ana',
            lastname: 'Gomez',
        });

        const response = await request(app).post('/api/auth/register').send({
            email: 'duplicado@example.com',
            password: 'otraPassword456',
            name: 'Otro',
            lastname: 'Usuario',
        });

        assert.equal(response.status, 409);
    });

    test('rechaza un registro con email inválido', async () => {
        const response = await request(app).post('/api/auth/register').send({
            email: 'no-es-un-email',
            password: 'password123',
            name: 'Ana',
            lastname: 'Gomez',
        });

        assert.equal(response.status, 400);
        assert.ok(response.body.details.email);
    });

    test('rechaza un registro con password muy corta', async () => {
        const response = await request(app).post('/api/auth/register').send({
            email: 'test@example.com',
            password: '123',
            name: 'Ana',
            lastname: 'Gomez',
        });

        assert.equal(response.status, 400);
        assert.ok(response.body.details.password);
    });
});
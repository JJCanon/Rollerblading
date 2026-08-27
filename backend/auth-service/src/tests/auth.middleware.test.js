import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { requireRole } from '../middlewares/auth.middleware.js';

function mockRes() {
    const res = {};
    res.statusCode = null;
    res.body = null;
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (payload) => {
        res.body = payload;
        return res;
    };
    return res;
}

describe('requireRole middleware', () => {
    test('permite el paso si el rol coincide', () => {
        const req = { user: { id: 'abc', role: 'admin' } };
        const res = mockRes();
        let nextCalled = false;

        requireRole('admin')(req, res, () => { nextCalled = true; });

        assert.equal(nextCalled, true);
        assert.equal(res.statusCode, null);
    });

    test('bloquea con 403 si el rol no coincide', () => {
        const req = { user: { id: 'abc', role: 'roller' } };
        const res = mockRes();
        let nextCalled = false;

        requireRole('admin')(req, res, () => { nextCalled = true; });

        assert.equal(nextCalled, false);
        assert.equal(res.statusCode, 403);
    });

    test('acepta múltiples roles permitidos', () => {
        const req = { user: { id: 'abc', role: 'roller' } };
        const res = mockRes();
        let nextCalled = false;

        requireRole('admin', 'roller')(req, res, () => { nextCalled = true; });

        assert.equal(nextCalled, true);
    });

    test('bloquea con 401 si no hay req.user (authenticate no corrió antes)', () => {
        const req = {};
        const res = mockRes();
        let nextCalled = false;

        requireRole('admin')(req, res, () => { nextCalled = true; });

        assert.equal(nextCalled, false);
        assert.equal(res.statusCode, 401);
    });
});
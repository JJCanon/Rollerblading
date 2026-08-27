import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

// Generate 
export function generateAccessToken(user) {
    return jwt.sign(
        { sub: user.id, role: user.role },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    );
}

// Verify Access Token
export function verifyAccessToken(token) {
    return jwt.verify(token, env.jwtSecret);
}

// Generate Refresh Token
export function generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
}

// Hash Token
export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

// Parse Duration to Ms
export function parseDurationToMs(duration) {
    const match = /^(\d+)([smhd])$/.exec(duration);
    if (!match) throw new Error(`duration format invalid: ${duration}`);
    const value = Number(match[1]);
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return value * multipliers[match[2]];
}
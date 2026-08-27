import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { createUser, findUserByEmail, findUserById } from '../repositories/user.repository.js';
import { saveRefreshToken, findValidRefreshToken, revokeRefreshToken } from "../repositories/refresh_token.repository.js";
import { generateAccessToken, generateRefreshToken, hashToken, parseDurationToMs } from "./token.service.js";

// "Decoy" hash precomputed once when the service starts.
// It ensures bcrypt.compare takes the same amount of time regardless of whether the user exists,
// preventing an attacker from inferring registered emails based on timing differences.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', env.bcryptRounds)

// Register User
export async function registerUser({ email, password, name, lastname, cellphone, avatarUrl }) {
    const existing = await findUserByEmail(email);
    if (existing) {
        const error = new Error('there is already exist an user with that email');
        error.statusCode = 409;
        throw error;
    }

    // hashing password
    const passwordHash = await bcrypt.hash(password, env.bcryptRounds);

    const user = await createUser({
        email,
        passwordHash,
        name,
        lastname,
        cellphone,
        avatarUrl,
    });

    return user; // its come without passwordhash thanks to repository returning
}

// Login User
export async function loginUser({ email, password }) {
    const user = await findUserByEmail(email);

    const passwordMatches = await bcrypt.compare(
        password,
        user?.password_hash ?? DUMMY_HASH
    );

    if (!user || !user.active || !passwordMatches) {
        const error = new Error('Invalid Credentials');
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + parseDurationToMs(env.jwtRefreshExpiresIn));

    await saveRefreshToken({ userId: user.id, tokenHash: refreshTokenHash, expiresAt });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role,
        },
    };
}

// Refresh tokens
export async function refreshTokens(refreshToken) {

    const tokenHash = hashToken(refreshToken);

    const existing = await findValidRefreshToken(tokenHash);
    if (!existing) {
        const error = new Error('Refresh token invalid or expired');
        error.statusCode = 401;
        throw error;
    }

    const user = await findUserById(existing.user_id);
    if (!user || !user.active) {
        const error = new Error('Refresh token invalid or expired');
        error.statusCode = 401;
        throw error;
    }

    // Rotation: the used token is revoked inmediatly, it is never reusable
    await revokeRefreshToken(existing.id);

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + parseDurationToMs(env.jwtRefreshExpiresIn));
    await saveRefreshToken({ userId: user.id, tokenHash: newRefreshTokenHash, expiresAt });

    const accessToken = generateAccessToken(user);

    return { accessToken, refreshToken: newRefreshToken };
}

// Logout User
export async function logoutUser(refreshToken) {
    const tokenHash = hashToken(refreshToken);
    const existing = await findValidRefreshToken(tokenHash);

    if (existing) {
        await revokeRefreshToken(existing.id);
    }
}
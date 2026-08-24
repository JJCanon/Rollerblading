import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { createUser, findUserByEmail } from '../repositories/user.repository.js';

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
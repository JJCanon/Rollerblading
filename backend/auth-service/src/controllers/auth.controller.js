import { registerSchema, loginSchema, refreshSchema, logoutSchema } from "../schemas/auth.schema.js";
import { registerUser, loginUser, refreshTokens, logoutUser } from "../services/auth.service.js";
import { findUserById } from "../repositories/user.repository.js";

// Register controller
export async function register(req, res, next) {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: 'Invalid Data',
                details: parsed.error.flatten().fieldErrors,
            });
        }
        const user = await registerUser(parsed.data);

        res.status(201).json({ user });
    } catch (err) {
        next(err);
    }
}

// Login Controller
export async function login(req, res, next) {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: 'Invalid data',
                details: parsed.error.flatten().fieldErrors,
            });
        }

        const { accessToken, refreshToken, user } = await loginUser(parsed.data);

        res.status(200).json({ accessToken, refreshToken, user });
    } catch (err) {
        next(err);
    }
}

// Refresh Token Controller
export async function refresh(req, res, next) {
    try {
        const parsed = refreshSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: 'Invalid data',
                details: parsed.error.flatten().fieldErrors,
            });
        }

        const tokens = await refreshTokens(parsed.data.refreshToken);

        res.status(200).json(tokens);
    } catch (err) {
        next(err);
    }
}

// Logout Controller
export async function logout(req, res, next) {
    try {
        const parsed = logoutSchema.safeParse(req.body);

        if (!parsed.success) {
            return req.status(400).json({
                error: 'Invalid data',
                details: parsed.error.flatten().fieldErrors,
            });
        }

        await logoutUser(parsed.data.refreshToken);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

// Enpoint to charge the app
export async function me(req, res, next) {
    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}
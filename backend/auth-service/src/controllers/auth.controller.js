import { registerSchema } from "../schemas/auth.schema.js";
import { registerUser } from "../services/auth.service.js";

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
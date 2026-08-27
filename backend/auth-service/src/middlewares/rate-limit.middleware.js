import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// Auth Rate Limiter (15 minutes, 5 tries max)
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // max 5 tries by IP in that window
    standardHeaders: true, // return limit info in headers RateLimit-*
    legacyHeaders: false, // deactivate the X-RateLimit-* headers (obsolete)
    message: { error: 'too many tries, try again later' },
    skip: () => env.nodeEnv === 'test',
});
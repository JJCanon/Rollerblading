const rateLimit = require('express-rate-limit');

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);

// general limit, applied all request that comes to gateway.
const generalLimiter = rateLimit({
    windowMs,
    max: Number(process.env.RATE_LIMIT_MAX || 100),
    standarHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many request, please try again later.' },
});

// stricter limiter just for /api/auth/*, to stop brute force tries in login/register.
const authLimiter = rateLimit({
    windowMs,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX || 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts, please try again later.' },
});

module.exports = { generalLimiter, authLimiter };
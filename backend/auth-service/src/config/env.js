import 'dotenv/config'

const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
];

for (const key of requiredVars) {
    if (!process.env[key]) {
        throw new Error(`environment variable requiered missing: ${key}`)
    }
}

export const env = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
    corsOrigins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
}
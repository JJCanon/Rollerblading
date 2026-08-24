import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { checkDbConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// base security and utilities
app.use(helmet());
app.use(cors({ origin: env.corsOrigins.length ? env.corsOrigins : true }));
app.use(express.json());
app.use(pinoHttp());

// health check: confirm that the service is alive
// without depends on the database or real routes yet
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'auth-service' });
});

// auth API
app.use('/api/auth', authRoutes);

app.use(errorHandler);

async function start() {
    try {
        await checkDbConnection();
        console.log('Connection to PostgreSQL succeed');
    } catch (err) {
        console.error('it couldn\'t connect to the database:', err.message);
        process.exit(1);
    }
    app.listen(env.port, () => {
        console.log(`Auth Service listenning in the ${env.port} port (${env.nodeEnv})`);
    });
}


start();
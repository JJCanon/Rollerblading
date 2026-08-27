import express from "express";
import helmet from "helmet";
import cors from 'cors';
import PinoHttp, { pinoHttp } from "pino-http";
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from "./middlewares/error.middleware.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins.length ? env.corsOrigins : true }));
app.use(express.json());
app.use(pinoHttp());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'auth-service' });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);
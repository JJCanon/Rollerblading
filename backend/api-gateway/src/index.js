require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const authenticate = require('./middleware/auth');
const rbac = require('./middleware/rbac');
const proxyRequest = require('./middleware/proxy');
const { generalLimiter, authLimiter } = require('./middleware/rateLimit');

const app = express();

// we trust on 1 proxy forward (the platform load balancer), to req.ip be the real client ip besides proxy id.
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// stricter rate limit in auth routes, then the general to the others
app.use('/api/auth', authLimiter);
app.use(generalLimiter);

app.use(authenticate);
app.use(rbac);
app.use(proxyRequest);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('[gateway] unhandled error:', err);
    res.status(500).json({ error: 'Internal gateway error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});
const { createProxyMiddleware } = require('http-proxy-middleware');

const targets = {
    AUTH: process.env.AUTH_SERVICE_URL,
    CONTENT: process.env.CONTENT_SERVICE_URL,
    EVENTS: process.env.EVENTS_SERVICE_URL,
    STORE: process.env.STORE_SERVICE_URL,
};

const proxies = Object.fromEntries(
    Object.entries(targets).map(([service, target]) => [
        service,
        createProxyMiddleware({
            target,
            changeOrigin: true,
            on: {
                error: (err, _req, res) => {
                    console.error(`[gateway] proxy error -> ${service}:`, err.message);
                    res.status(502).json({ error: `${service} service unavailable` });
                },
            },
        }),
    ])
);

// Resend the request to the service which the 'rbac' middleware resolved. it must run after 'rbac'
function proxyRequest(req, res, next) {
    const { service } = req.matchedRoute;
    const target = targets[service];

    if (!target) {
        return res.status(502).json({ error: `Service ${service} is not configured` });
    }

    return proxies[service](req, res, next);
}

module.exports = proxyRequest;
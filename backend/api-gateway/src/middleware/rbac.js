const { match } = require('path-to-regexp');
const routes = require('../config/routes');

// Precompile each route pattern once when it starts, avoiding do it each request
const compiledRoutes = routes.map((route) => ({
    ...route,
    matcher: match(route.path, { decode: decodeURIComponent }),
}));

// Find Route
function findRoute(method, path) {
    return compiledRoutes.find((route) => {
        const methodMatches = route.method === 'ALL' || route.method === method;
        if (!methodMatches) return false;
        return route.matcher(path) !== false;
    });
}

/**
 * Look for entrance request on the routes table and check the calling role against the allowed roles for each route
 * it must run after authenticate middleware
 */
function rbac(req, res, next) {
    const route = findRoute(req.method, req.path);

    if (!route) {
        return res.status(404).json({ error: 'Route not found' });
    }

    if (!route.roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role for this action' });
    }

    req.matchedRoute = route;
    return next();
}

module.exports = rbac;
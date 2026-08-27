import { verifyAccessToken } from "../services/token.service.js";

// Authenticate
export function authenticate(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access Token required' });
    }

    const token = authHeader.slice('Bearer '.length);

    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Access Token invalid or expired' });
    }
}

// Require Role
export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Access Token required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You don\'t have permission for this action' })
        }
        next();
    };
}
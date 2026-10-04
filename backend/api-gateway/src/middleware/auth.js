const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        req.user = { role: 'invited' };
        return next();
    }

    const token = header.slice('Bearer '.length).trim();

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: payload.sub || payload.id,
            role: payload.role || 'roller',
        };
        return next();
    } catch (err) {
        const reason = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        return res.status(401).json({ error: reason })
    }
}

module.exports = authenticate;
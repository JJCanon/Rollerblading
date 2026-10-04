const INVITED = 'invited';
const ROLLER = 'roller';
const ADMIN = 'admin';

const ALL = [INVITED, ROLLER, ADMIN];
const AUTHENTICATED = [ROLLER, ADMIN];
const ADMIN_ONLY = [ADMIN];

module.exports = [
    // ───────── Auth Service ─────────
    { method: 'ALL', path: '/api/auth/:rest*', service: 'AUTH', roles: ALL },

    // ───────── Content Service ─────────
    // Sección 1: History
    { method: 'GET', path: '/api/content/history', service: 'CONTENT', roles: ALL },
    { method: 'PUT', path: '/api/content/history', service: 'CONTENT', roles: ADMIN_ONLY },

    // Sección 2: Instagram feed
    { method: 'GET', path: '/api/content/instagram-posts', service: 'CONTENT', roles: ALL },

    // Sección 6: Social media / contact
    { method: 'GET', path: '/api/content/social-media', service: 'CONTENT', roles: ALL },
    { method: 'POST', path: '/api/content/social-media', service: 'CONTENT', roles: ADMIN_ONLY },
    { method: 'PUT', path: '/api/content/social-media/:id', service: 'CONTENT', roles: ADMIN_ONLY },
    { method: 'DELETE', path: '/api/content/social-media/:id', service: 'CONTENT', roles: ADMIN_ONLY },

    // Sección 7: Collaborators
    { method: 'GET', path: '/api/content/colaborators', service: 'CONTENT', roles: ALL },
    { method: 'POST', path: '/api/content/colaborators', service: 'CONTENT', roles: ADMIN_ONLY },
    { method: 'PUT', path: '/api/content/colaborators/:id', service: 'CONTENT', roles: ADMIN_ONLY },
    { method: 'DELETE', path: '/api/content/colaborators/:id', service: 'CONTENT', roles: ADMIN_ONLY },

    // Sección 8: Entrepreneurship
    { method: 'GET', path: '/api/content/entrepreneurship', service: 'CONTENT', roles: ALL },
    { method: 'POST', path: '/api/content/entrepreneurship', service: 'CONTENT', roles: AUTHENTICATED },
    { method: 'PATCH', path: '/api/content/entrepreneurship/:id/state', service: 'CONTENT', roles: ADMIN_ONLY },

    // ───────── Events Service ─────────
    // Sección 3: Events
    { method: 'GET', path: '/api/events/:rest*', service: 'EVENTS', roles: ALL },
    { method: 'POST', path: '/api/events', service: 'EVENTS', roles: ADMIN_ONLY },
    { method: 'PUT', path: '/api/events/:id', service: 'EVENTS', roles: ADMIN_ONLY },
    { method: 'DELETE', path: '/api/events/:id', service: 'EVENTS', roles: ADMIN_ONLY },

    // Sección 4: Schedule
    { method: 'GET', path: '/api/schedules/:rest*', service: 'EVENTS', roles: ALL },
    { method: 'POST', path: '/api/schedules', service: 'EVENTS', roles: ADMIN_ONLY },
    { method: 'PUT', path: '/api/schedules/:id', service: 'EVENTS', roles: ADMIN_ONLY },
    { method: 'DELETE', path: '/api/schedules/:id', service: 'EVENTS', roles: ADMIN_ONLY },

    // ───────── Store Service ─────────
    // Sección 5: Products
    { method: 'GET', path: '/api/store/products/:rest*', service: 'STORE', roles: ALL },
    { method: 'POST', path: '/api/store/products', service: 'STORE', roles: AUTHENTICATED },
    { method: 'PATCH', path: '/api/store/products/:id/state', service: 'STORE', roles: ADMIN_ONLY },

    // Orders / order items
    { method: 'POST', path: '/api/store/orders', service: 'STORE', roles: AUTHENTICATED },
    { method: 'GET', path: '/api/store/orders/:rest*', service: 'STORE', roles: AUTHENTICATED },
    { method: 'PUT', path: '/api/store/orders/:id', service: 'STORE', roles: ADMIN_ONLY },

    // Payments
    { method: 'GET', path: '/api/store/payments/:rest*', service: 'STORE', roles: AUTHENTICATED },
    { method: 'POST', path: '/api/store/payments/webhook/:supplier', service: 'STORE', roles: ALL },
];
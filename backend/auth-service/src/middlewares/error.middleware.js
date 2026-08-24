export function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Error interno del servidor' : err.message;

    if (statusCode === 500) {
        console.error(err);
    }

    res.status(statusCode).json({ error: message });
}
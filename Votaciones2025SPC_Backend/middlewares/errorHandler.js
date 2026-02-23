const logger = require('../logger');

function notFoundHandler(req, res) {
    res.status(404).json({ error: 'Route not found' });
}

function errorHandler(err, req, res, next) {
    logger.error('Unhandled request error', {
        path: req.path,
        method: req.method,
        error: err.message
    });
    res.status(500).json({ error: 'Internal server error' });
}

module.exports = {
    notFoundHandler,
    errorHandler
};

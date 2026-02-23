const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const logger = require('./logger');
const path = require("path"); // Asegura que el módulo path esté importado
const sql = require('./db/db');


// Routes import
//const userRoutes = require('./routes/users');
const logRoutes = require('./routes/log');
//const validationRoutes = require('./routes/validation');
const routes = require('./routes');
//const solicitudes = require('./routes/solicitudes');
//const User = require('./routes/users');
const votaciones = require('./routes/votaciones');

// Middlewares import
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

// Application
const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));


// Rate limiting middleware
const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX || 250),
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiting to all requests
app.use(limiter);

// Enable CORS
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];
app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server and tools without Origin header
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    }
}));

// Middleware to parse JSON bodies
app.use(express.json({ limit: process.env.JSON_LIMIT || '64kb' }));
app.use(express.urlencoded({ extended: true }));

// Root url
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'operational',
        message: 'Votaciones Salesianas API is running',
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/ready', async (req, res, next) => {
    try {
        const connected = await sql.isConnected();
        if (!connected) {
            return res.status(503).json({ status: 'error', db: 'disconnected' });
        }
        return res.status(200).json({ status: 'ready', db: 'connected' });
    } catch (error) {
        return next(error);
    }
});

// Those routes are only examples routes to inspire you or to get you started faster.
// You are not forced to use them, and can erase all routes in order to make your own.
// Nested routes (routes are stored in the routes folder)

app.use('/votaciones', votaciones);

app.use(notFoundHandler);
app.use(errorHandler);

let server = null;

async function startServer() {
    const PORT = Number(process.env.PORT || 5005);
    server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
        logger.info(`Received ${signal}. Starting graceful shutdown...`);
        server.close(async () => {
            try {
                await sql.close();
                logger.info('HTTP server and DB connections closed');
                process.exit(0);
            } catch (error) {
                logger.error('Error closing resources during shutdown', { error: error.message });
                process.exit(1);
            }
        });

        setTimeout(() => {
            logger.error('Forced shutdown after timeout');
            process.exit(1);
        }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled rejection', { reason: String(reason) });
    });
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception', { error: error.message });
    });
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };

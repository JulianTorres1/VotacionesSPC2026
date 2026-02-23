jest.mock('../db/db', () => ({
    isConnected: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined),
    functions: {
        getRows: jest.fn(),
        getCandidateVotes: jest.fn(),
        insertRow: jest.fn(),
        getRow: jest.fn(),
        updateRow: jest.fn(),
        deleteRow: jest.fn()
    }
}));

const { app } = require('../app');
const sql = require('../db/db');

function getRouteHandler(expressApp, method, path) {
    const layer = expressApp._router.stack.find((stackLayer) => {
        if (!stackLayer.route) return false;
        return stackLayer.route.path === path && stackLayer.route.methods[method];
    });
    if (!layer) throw new Error(`Route ${method.toUpperCase()} ${path} not found`);
    return layer.route.stack[0].handle;
}

function createMockRes() {
    return {
        statusCode: 200,
        body: undefined,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };
}

describe('Application reliability tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /health responds ok', async () => {
        const handler = getRouteHandler(app, 'get', '/health');
        const req = {};
        const res = createMockRes();

        await handler(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /ready returns 503 when DB is down', async () => {
        const handler = getRouteHandler(app, 'get', '/ready');
        sql.isConnected.mockResolvedValue(false);
        const req = {};
        const res = createMockRes();
        const next = jest.fn();

        await handler(req, res, next);
        expect(res.statusCode).toBe(503);
        expect(res.body.db).toBe('disconnected');
        expect(next).not.toHaveBeenCalled();
    });

    test('GET /ready returns 200 when DB is connected', async () => {
        const handler = getRouteHandler(app, 'get', '/ready');
        sql.isConnected.mockResolvedValue(true);
        const req = {};
        const res = createMockRes();
        const next = jest.fn();

        await handler(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res.body.db).toBe('connected');
        expect(next).not.toHaveBeenCalled();
    });

    test('POST /votaciones/create rejects invalid payload', async () => {
        const votacionesRouter = require('../routes/votaciones');
        const handler = votacionesRouter.stack.find((layer) => layer.route.path === '/create').route.stack[0].handle;
        const req = { body: { foo: 'bar' } };
        const res = createMockRes();

        await handler(req, res);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Datos inválidos');
    });

    test('POST /votaciones/create accepts valid payload', async () => {
        const votacionesRouter = require('../routes/votaciones');
        const handler = votacionesRouter.stack.find((layer) => layer.route.path === '/create').route.stack[0].handle;
        sql.functions.insertRow.mockResolvedValue({ affectedRows: 1 });
        const req = { body: { id_candidato: 12 } };
        const res = createMockRes();

        await handler(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Voto registrado exitosamente');
        expect(sql.functions.insertRow).toHaveBeenCalledWith('votaciones', { id_candidato: 12 });
    });
});

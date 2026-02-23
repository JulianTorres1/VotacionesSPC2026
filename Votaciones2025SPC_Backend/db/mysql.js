const mysql = require('mysql2/promise');
require('dotenv').config();

const sql = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0
});

const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

function validateIdentifier(identifier, label) {
    if (!IDENTIFIER_REGEX.test(identifier)) {
        throw new Error(`Invalid ${label}`);
    }
}

function validateDataKeys(data) {
    const keys = Object.keys(data);
    if (keys.length === 0) {
        throw new Error('At least one field is required');
    }

    for (const key of keys) {
        validateIdentifier(key, 'column name');
    }
}

// Test the connection
async function isConnected() {
    try {
        await sql.query('SELECT 1');
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}

isConnected().then((connected) => {
    console.log('Database connection status:', connected ? 'OK' : 'ERROR');
});

const functions = {
    /**
     * Get all rows from a specified table.
     * @param {string} table - The name of the table to query.
     * @returns {Promise<Array>} - A promise that resolves to an array of rows.
     * @example
     * const users = await sql.functions.getRows('users');
     */
    async getRows(table) {
        validateIdentifier(table, 'table name');
        const [rows] = await sql.query(`SELECT * FROM ${table}`);
        return rows;
    },

    /**
     * Get a specific row from a specified table using a selector.
     * @param {string} table - The name of the table to query.
     * @param {Object} selector - An object representing the selection criteria.
     * @returns {Promise<Object>} - A promise that resolves to a single row.
     * @example
     * const user = await sql.functions.getRow('users', { id: 1 });
     */
    async getRow(table, selector) {
        validateIdentifier(table, 'table name');
        const [rows] = await sql.query(`SELECT * FROM ${table} WHERE ?`, selector);
        return rows[0];
    },

    // obtener una fila en base a la fecha
    async getRowsByDate(table, date) {
        validateIdentifier(table, 'table name');
        const [rows] = await sql.query(`SELECT * FROM ${table} WHERE fecha_evento = ?`, date);
        return rows;
    },
    /**
     * Update a row in a specified table using a selector.
     * @param {string} table - The name of the table to update.
     * @param {Object} data - An object representing the data to update.
     * @param {Object} selector - An object representing the selection criteria.
     * @returns {Promise<Object>} - A promise that resolves to the result of the update operation.
     * @example
     * const result = await sql.functions.updateRow('users', { name: 'John Doe' }, { id: 1 });
     */
    async updateRow(table, data, selector) {
        validateIdentifier(table, 'table name');
        validateDataKeys(data);
        validateDataKeys(selector);
        const [result] = await sql.query(`UPDATE ${table} SET ? WHERE ?`, [data, selector]);
        return result;
    },

    /**
     * Insert a row in a specified table
     * @param {string} table
     * @param {Object} data
     * @returns {Promise<Object>}
     * @example
     * const result = await sql.functions.insertRow('users', { name: 'John Doe',  id: 1 });
     */
    
    async insertRow(table, data) {
        validateIdentifier(table, 'table name');
        if (!data || typeof data !== 'object') {
            console.error('Error: Los datos proporcionados a insertRow son inválidos:', data);
            throw new Error('Los datos proporcionados a insertRow son inválidos.');
        }

        validateDataKeys(data);
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(key => data[key]);

        try {
            const [result] = await sql.query(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`, values);
            return result;
        } catch (error) {
            console.error('Error ejecutando la consulta:', error);
            throw error;
        }
    },
    
    async getCandidateVotes() {
        const query = `
            SELECT c.nombre AS candidato, c.grupo, COUNT(v.id_voto) AS total_votos
            FROM candidatos c
            LEFT JOIN votaciones v ON c.id_candidato = v.id_candidato
            GROUP BY c.id_candidato, c.nombre, c.grupo
            ORDER BY total_votos DESC;
        `;
    
        try {
            const [rows] = await sql.query(query);
            return rows;
        } catch (error) {
            console.error('Error ejecutando la consulta de votos:', error);
            throw error;
        }
    },

    async deleteRow(table, selector) {
        validateIdentifier(table, 'table name');
        validateDataKeys(selector);
        const [result] = await sql.query(`DELETE FROM ${table} WHERE ?`, [selector]);
        return result;
    }
}



// monkey patch the pool with the functions object
// not the best practice but it works for now
sql.functions = functions;
sql.isConnected = isConnected;
sql.close = async () => sql.end();

module.exports = sql;

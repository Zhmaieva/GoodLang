import { pool } from '../pool.js';

/**
 * Creates a new account without requiring an email.
 * @returns {Promise<{id: string}>}
 */
export async function createAccount() {
    const query = `
        INSERT INTO accounts DEFAULT VALUES
        RETURNING id
    `;

    try {
        const result = await pool.query(query);
        return { id: result.rows[0].id };
    } catch (err) {
        throw err;
    }
}

/**
 * Get account status
 * @param {string} accountId
 * @returns {Promise<'free'|'paid'|'attention'>}
 */
export async function getAccountStatus(accountId) {
    const { rows } = await pool.query(
        'SELECT status FROM accounts WHERE id=$1',
        [accountId]
    );
    return rows[0]?.status || 'free';
}

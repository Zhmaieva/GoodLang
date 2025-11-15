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

export async function getAccountById(accountId) {
    try {
        const result = await pool.query(
            `
            SELECT 
                id,
                email,
                status,
                stripe_customer_id,
                created_at
            FROM accounts
            WHERE id = $1
            LIMIT 1
            `,
            [accountId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    } catch (err) {
        console.error("DB error in getAccountById:", err);
        throw err;
    }
}


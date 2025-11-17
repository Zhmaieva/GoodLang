import { pool } from '../pool.js';
import {sendVerificationEmail} from "../../core/emailSender.js";

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
 * Get account info by account ID
 * @param {string} accountId
 * @returns {Promise<{email: string, status: 'free'|'paid'|'attention'}>}
 */
export async function getAccountInfo(accountId) {
    const { rows } = await pool.query(
        'SELECT email, status FROM accounts WHERE id = $1',
        [accountId]
    );

    if (!rows[0]) {
        return {
            email: null,
            status: 'free', // default fallback
        };
    }

    return {
        email: rows[0].email,
        status: rows[0].status || 'free',
    };
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

/**
 * Send verification code only if account exists
 */
export async function sendVerificationCode(email) {
    // check if account exists
    const { rows: accounts } = await pool.query(
        'SELECT id FROM accounts WHERE email=$1',
        [email]
    );

    if (!accounts[0]) {
        // account not found → do not generate code
        return null;
    }

    const accountId = accounts[0].id;

    const code = (Math.floor(100000 + Math.random() * 900000)).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await pool.query(
        `INSERT INTO sign_in_links (account_id, email, code, created_at, expires_at)
         VALUES ($1,$2,$3,NOW(),$4)
         ON CONFLICT (account_id) DO UPDATE SET code=$3, created_at=NOW(), expires_at=$4`,
        [accountId, email, code, expiresAt]
    );

    // send the code via email
    await sendVerificationEmail(email, code);

    return accountId;
};

/**
 * Verify code for email and return account id if valid
 */
export async function verifyCode(email, code) {
    const { rows } = await pool.query(
        `SELECT account_id, expires_at FROM sign_in_links 
         WHERE email=$1 AND code=$2`,
        [email, code]
    );

    if (!rows[0]) return null;

    const now = new Date();
    if (rows[0].expires_at < now) return null; // expired

    return rows[0].account_id;
}

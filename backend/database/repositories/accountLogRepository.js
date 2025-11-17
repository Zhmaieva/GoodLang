import { pool } from '../pool.js';
import { ACTION_TYPES } from '../../core/constants.js';
import {getAccountInfo} from "./accountsRepository.js";

/**
 * Check translation usage limit
 * @param {string} accountId
 * @param {number} limit Maximum calls in window
 * @param {number} hours Time window in hours
 * @returns {Promise<{ allowed: boolean, waitTimeSeconds: number }>}
 */
export async function checkTranslationLimit(accountId, limit = 10, hours = 3) {
    const status = (await getAccountInfo(accountId)).status;

    if (status === 'paid') {
        return { allowed: true, waitTimeSeconds: 0 }; // no limit for paid users
    }

    const { rows } = await pool.query(
        `
        SELECT created_at
        FROM account_log
        WHERE account_id = $1
          AND action_type = $2
        ORDER BY created_at ASC
        `,
        [accountId, ACTION_TYPES.TRANSLATION_CALL]
    );

    const timestamps = rows.map(r => new Date(r.created_at).getTime());
    const now = Date.now();
    const windowMs = hours * 60 * 60 * 1000;

    if (timestamps.length < limit) {
        return { allowed: true, waitTimeSeconds: 0 };
    }

    // Oldest timestamp in the current window
    const oldestTimestamp = timestamps[timestamps.length - limit];
    const waitTimeMs = windowMs - (now - oldestTimestamp);
    const waitTimeSeconds = Math.max(Math.ceil(waitTimeMs / 1000), 0);

    return {
        allowed: waitTimeSeconds === 0,
        waitTimeSeconds
    };
}


/**
 * Record a translation usage
 */
export async function recordTranslationUsage(accountId) {
    const query = `
        INSERT INTO account_log (account_id, action_type)
        VALUES ($1, $2)
    `;
    await pool.query(query, [accountId, ACTION_TYPES.TRANSLATION_CALL]);
}

import { pool } from '../pool.js';
import { ACTION_TYPES } from '../../core/constants.js';
import {getAccountInfo} from "./accountsRepository.js";

/**
 * Check translation usage limit (race-safe)
 * @param {string} accountId
 * @param {boolean} soft for checking without tracking
 * @returns {Promise<{ allowed: boolean, waitTimeSeconds: number }>}
 */
export async function checkTranslationLimit(accountId, soft = true) {
    const account = await getAccountInfo(accountId);

    // 0️⃣ Paid users → unlimited
    if (account.status !== "free") {
        return { allowed: true, waitTimeSeconds: 0 };
    }

    // Account-based limits (fallback-safe)
    const limit = Number.isFinite(account.translationLimit) ? account.translationLimit : 7;
    const windowSeconds = Number.isFinite(account.limitTimeSpanSeconds) ? account.limitTimeSpanSeconds : (24 * 3600);
    const windowMs = windowSeconds * 1000;

    if (soft) {
        if (account.translationsQuota > 0)
            return { allowed: true, waitTimeSeconds: 0 };
    } else {
        // 1️⃣ Atomic quota decrement (single round-trip)
        const { rowCount } = await pool.query(
            `
            UPDATE accounts
            SET translations_quota = translations_quota - 1
            WHERE id = $1
              AND translations_quota > 0
            RETURNING translations_quota
        `,
            [accountId]
        );

        // If quota was successfully consumed → allow immediately
        if (rowCount === 1) {
            return { allowed: true, waitTimeSeconds: 0 };
        }
    }


    // 2️⃣ Quota exhausted → time window logic based on account limits
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

    if (timestamps.length < limit) {
        return { allowed: true, waitTimeSeconds: 0 };
    }

    const oldestTimestamp = timestamps[timestamps.length - limit];
    const waitTimeMs = windowMs - (now - oldestTimestamp);
    const waitTimeSeconds = Math.max(Math.ceil(waitTimeMs / 1000), 0);

    return {
        allowed: waitTimeSeconds === 0,
        waitTimeSeconds,
    };
}

/**
 * Record a translation usage
 */
export async function recordTranslationUsage(accountId, taskType = 1) {
    const query = `
        INSERT INTO account_log (account_id, action_type, created_at)
        VALUES ($1, $2, $3)
    `;
    const date = new Date();

    if (taskType !== 1)
        await recordAction(accountId, ACTION_TYPES.TRANSLATION_CALL_CHOOSE, date);
    else
        await pool.query(query, [accountId, ACTION_TYPES.TRANSLATION_CALL, date]);
}

/**
 * Record a translation usage
 */
export async function recordAction(accountId, actionType) {
    const query = `
        INSERT INTO account_log (account_id, action_type, created_at)
        VALUES ($1, $2, $3)
    `;
    const date = new Date();
    await pool.query(query, [accountId, actionType, date]);
}

/**
 * Get event count for a specific action type and account
 */
export async function getActionCount(accountId, actionType) {
    const query = `
        SELECT COUNT(*)::int AS count
        FROM account_log
        WHERE account_id = $1
          AND action_type = $2
    `;

    const { rows } = await pool.query(query, [accountId, actionType]);
    return rows[0].count;
}

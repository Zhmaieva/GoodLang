import { pool } from '../pool.js';
import {sendPromoEmail, sendVerificationEmail} from "../../core/emailSender.js";
import {getLifetime10CouponId, stripe} from "../../integrations/stripeService.js";
import {nanoid} from "nanoid";

const SHORTENED_WAIT_TIME_HOURS = 24;

/**
 * Creates a new account without requiring an email.
 * @returns {Promise<{id: string}>}
 */
export async function createAccount() {
    const shortLimitsEnabled = String(process.env.FEATURE_SHORT_TRANSLATION_LIMITS).toLowerCase() === "true";

    const query = shortLimitsEnabled
        ? `
            INSERT INTO accounts (translation_limit, limit_time_span_seconds)
            VALUES (3, `+SHORTENED_WAIT_TIME_HOURS+` * 3600)
            RETURNING id
          `
        : `
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
 * Get account info by account ID (+ optional promo info by promo code)
 * @param {string} accountId
 * @param {string?} promoCode
 * @returns {Promise<{
 *   email: string|null,
 *   status: 'free'|'paid'|'attention',
 *   isTrial: boolean,
 *   trialEndsOn: any,
 *   translationLimit: number,
 *   translationsQuota: number,
 *   limitTimeSpanSeconds: number,
 *   promo: null | {
 *     accountId: string,
 *     promoCode: string,
 *     expirationDate: any,
 *     originalPrice: number,
 *     discountedPrice: number,
 *     discountPercentage: number
 *   },
 *   marathonFailed: boolean,
 *   isInMarathon: boolean,
 *   daysLeft: number,
 *   rulesSoFar: string[],
 *   currentDay: null | {
 *     dayNumber: number,
 *     ruleId: string,
 *     dayStartAt: any,
 *     dayEndAt: any,
 *     isDayCompleted: boolean
 *   },
 *   currentDayTasks: Array<{
 *     ordinalNumber: number,
 *     ruleId: string,
 *     isAnswered: boolean
 *   }>
 * }>}
 */
export async function getAccountInfo(accountId, promoCode) {
    const { rows } = await pool.query(
        `
        SELECT
            email,
            status,
            is_trial,
            trial_ended_at,
            translation_limit,
            limit_time_span_seconds,
            translations_quota
        FROM accounts
        WHERE id = $1
        `,
        [accountId]
    );

    if (!rows[0]) {
        return {
            email: null,
            status: "free",
            isTrial: false,
            trialEndsOn: null,
            translationLimit: 10,            // safe fallback
            limitTimeSpanSeconds: 24 * 3600, // safe fallback
            translationsQuota: 0,
            promo: null,

            marathonFailed: false,
            isInMarathon: false,
            daysLeft: 0,
            rulesSoFar: [],
            currentDay: null,
            currentDayTasks: [],
        };
    }

    const status = rows[0].status || "free";

    let marathonFailed = false;

    let isInMarathon = false;
    let daysLeft = 0;
    let rulesSoFar = [];
    let currentDayTasks = [];
    let currentDay = null;

    // -------------------------
    // Latest marathon failed flag (soft)
    // -------------------------
    try {
        const { rows: lastRows } = await pool.query(
            `
          SELECT status
          FROM learning_marathons
          WHERE account_id = $1
          ORDER BY created_at DESC
          LIMIT 1
        `,
            [accountId]
        );

        const lastStatus = String(lastRows?.[0]?.status || "").toLowerCase();
        marathonFailed = (lastStatus === "failed" || lastStatus === "failed_cancelled");
    } catch (_) {
        marathonFailed = false;
    }

    if (status !== "free" && !marathonFailed) {
        // -------------------------
        // Marathon metadata + current day tasks (soft)
        // -------------------------
        const { rows: marathonRows } = await pool.query(
            `
                WITH current_marathon AS (
                    SELECT lm.id
                    FROM learning_marathons lm
                    WHERE lm.account_id = $1
                      AND lm.status = 'in_progress' 
                      OR  lm.status = 'completed'
                    ORDER BY lm.created_at DESC
                    LIMIT 1
                ),
                     current_day AS (
                         SELECT
                             ms.id,
                             ms.day_number,
                             ms.rule_id,
                             ms.day_start_at,
                             ms.day_end_at,
                             COALESCE(ms.is_day_completed, FALSE) AS is_day_completed
                         FROM marathon_schedules ms
                         WHERE ms.marathon_id = (SELECT id FROM current_marathon)
                           AND ms.day_start_at <= NOW()
                           AND ms.day_end_at > NOW()
                         ORDER BY ms.day_number ASC
                         LIMIT 1
                     )
                SELECT
                        (SELECT id FROM current_marathon) AS marathon_id,

                        COALESCE((
                                     SELECT COUNT(*)
                                     FROM marathon_schedules ms
                                     WHERE ms.marathon_id = (SELECT id FROM current_marathon)
                                       AND ms.day_end_at > NOW()
                                 ), 0) AS days_left,

                        COALESCE((
                                     SELECT json_agg(ms.rule_id ORDER BY ms.day_number)
                                     FROM marathon_schedules ms
                                     WHERE ms.marathon_id = (SELECT id FROM current_marathon)
                                       AND ms.day_start_at <= NOW()
                                 ), '[]'::json) AS rules_so_far,

                        -- current day
                        (SELECT id FROM current_day) AS current_schedule_id,
                        (SELECT day_number FROM current_day) AS current_day_number,
                        (SELECT rule_id FROM current_day) AS current_day_rule_id,
                        (SELECT day_start_at FROM current_day) AS current_day_start_at,
                        (SELECT day_end_at FROM current_day) AS current_day_end_at,
                        (SELECT is_day_completed FROM current_day) AS current_day_completed,

                        -- pending tasks for current day
                        COALESCE((
                                     SELECT json_agg(
                                                    json_build_object(
                                                            'ordinalNumber', mst.ordinal_number,
                                                            'ruleId', mst.rule_id,
                                                            'isAnswered', mst.is_answered
                                                    )
                                                    ORDER BY mst.ordinal_number
                                            )
                                     FROM marathon_schedule_tasks mst
                                     WHERE mst.marathon_schedule_id = (SELECT id FROM current_day)
                                       AND mst.is_answered = FALSE
                                 ), '[]'::json) AS current_day_tasks
            `,
            [accountId]
        );

        const marathonId = marathonRows?.[0]?.marathon_id ?? null;

        isInMarathon = Boolean(marathonId);
        daysLeft = Number(marathonRows?.[0]?.days_left ?? 0);

        try {
            const raw = marathonRows?.[0]?.rules_so_far;
            if (Array.isArray(raw)) {
                rulesSoFar = raw.map(String);
            } else if (raw) {
                rulesSoFar = JSON.parse(raw).map(String);
            }
        } catch (_) {
            rulesSoFar = [];
        }

        // current day
        const currentScheduleId = marathonRows?.[0]?.current_schedule_id ?? null;
        currentDay = currentScheduleId
            ? {
                dayNumber: Number(marathonRows?.[0]?.current_day_number ?? 0),
                ruleId: String(marathonRows?.[0]?.current_day_rule_id ?? ""),
                dayStartAt: marathonRows?.[0]?.current_day_start_at ?? null,
                dayEndAt: marathonRows?.[0]?.current_day_end_at ?? null,
                isDayCompleted: Boolean(marathonRows?.[0]?.current_day_completed ?? false),
            }
            : null;

        // current day pending tasks normalize
        try {
            const raw = marathonRows?.[0]?.current_day_tasks;
            const arr = Array.isArray(raw) ? raw : raw ? JSON.parse(raw) : [];
            currentDayTasks = (arr || [])
                .map((t) => ({
                    ordinalNumber: Number(t?.ordinalNumber ?? t?.ordinal_number ?? 0),
                    ruleId: String(t?.ruleId ?? t?.rule_id ?? ""),
                    isAnswered: Boolean(t?.isAnswered ?? t?.is_answered ?? false),
                }))
                .filter((t) => t.ordinalNumber > 0 && t.ruleId);
        } catch (_) {
            currentDayTasks = [];
        }
    }

    // --- Promo lookup (soft) ---
    let promo = null;

    if (typeof promoCode === "string" && promoCode.trim()) {
        const normalizedPromo = promoCode.trim().toUpperCase();

        const { rows: promoRows } = await pool.query(
            `
                SELECT
                    account_id,
                    promo_code,
                    expiration_date,
                    original_price,
                    discounted_price,
                    discount_percentage
                FROM promo_codes
                WHERE promo_code = $1
                  AND expiration_date > NOW()
                LIMIT 1
            `,
            [normalizedPromo]
        );

        if (promoRows[0]) {
            promo = {
                accountId: promoRows[0].account_id,
                promoCode: promoRows[0].promo_code,
                expirationDate: promoRows[0].expiration_date,
                originalPrice: Number(promoRows[0].original_price),
                discountedPrice: Number(promoRows[0].discounted_price),
                discountPercentage: promoRows[0].discount_percentage,
            };
        }
    }

    return {
        email: rows[0].email,
        status: rows[0].status || "free",
        isTrial: rows[0].is_trial || false,
        trialEndsOn: rows[0].trial_ended_at,
        translationsQuota: rows[0].translations_quota || 0,

        translationLimit: Number(rows[0].translation_limit ?? 7),
        limitTimeSpanSeconds: Number(rows[0].limit_time_span_seconds ?? 24 * 3600),

        promo,

        marathonFailed,
        isInMarathon,
        daysLeft,
        rulesSoFar,
        currentDay,
        currentDayTasks,
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

    const accountId = !accounts[0] ? null : accounts[0].id;

    const code = (Math.floor(100000 + Math.random() * 900000)).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await pool.query(
        `INSERT INTO sign_in_links (account_id, email, code, created_at, expires_at)
         VALUES ($1,$2,$3,NOW(),$4)
         ON CONFLICT (email) DO UPDATE SET code=$3, created_at=NOW(), expires_at=$4`,
        [accountId, email, code, expiresAt]
    );

    // send the code via email
    await sendVerificationEmail(email, code);

    return accountId;
};

/**
 * Send promo code email.
 * Soft-saves email to inquiries.
 * Does NOT create sign-in links.
 */
export async function sendPromoCode(accountId, email) {
    // 0) Basic validation
    if (typeof email !== "string" || typeof accountId !== "string") return;

    const normalizedEmail = email.trim().toLowerCase();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(normalizedEmail)) return;

    // 1) Insert into inquiries ONLY if new; if already exists -> do nothing (no email)
    const ins = await pool.query(
        `
      INSERT INTO inquiries (email)
      VALUES ($1)
      ON CONFLICT (email) DO NOTHING
      RETURNING email
    `,
        [normalizedEmail]
    );

    const isNewInquiry = ins.rows.length > 0;
    if (!isNewInquiry) return;

    // 2) Reuse existing non-expired promo_code for this account if present
    const { rows: existing } = await pool.query(
        `
      SELECT promo_code, expiration_date
      FROM promo_codes
      WHERE account_id = $1
        AND expiration_date > NOW()
      ORDER BY expiration_date DESC
      LIMIT 1
    `,
        [accountId]
    );

    let promoCode = existing[0]?.promo_code ?? null;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 3) If none, create a new Stripe promotion code (expires in 24h) tied to a lifetime 10% coupon
    if (!promoCode) {
        const couponId = await getLifetime10CouponId();

        // Your public-facing code (keep it simple and unique)
        promoCode = `GL10-${nanoid(8).toUpperCase()}`;


        // Create Stripe promotion code (the redeemable thing customers type)
        await stripe.promotionCodes.create({
            promotion: {
                type: "coupon",
                coupon: couponId,
            },
            code: promoCode,
            expires_at: Math.floor(expiresAt.getTime() / 1000),
            metadata: {
                account_id: accountId,
                email: normalizedEmail,
            },
        });


        const { original, discounted } = calcPrices();

        // Save to DB
        await pool.query(
            `
        INSERT INTO promo_codes (
          account_id,
          promo_code,
          expiration_date,
          original_price,
          discounted_price,
          discount_percentage
        )
        VALUES ($1,$2,$3,$4,$5,$6)
      `,
            [accountId, promoCode, expiresAt, original, discounted, 10]
        );
    }

    // 4) Send the promo email (now we definitely have promoCode)
    await sendPromoEmail(normalizedEmail, promoCode, expiresAt);
}

export function calcPrices() {
    // Avoid float money math by using cents
    const originalCents = 14999; // 149.99
    const discountedCents = Math.round(originalCents * 0.9); // 10% off => 13499 cents => 134.99
    const original = Number((originalCents / 100).toFixed(2));
    const discounted = Number((discountedCents / 100).toFixed(2));
    return { original, discounted };
}

function toUnixSeconds(date) {
    return Math.floor(date.getTime() / 1000);
}

/**
 * Verify code for email and return account id if valid
 */
export async function verifyCode(currentId, email, code, termsAccepted) {
    const { rows } = await pool.query(
        `SELECT account_id, expires_at FROM sign_in_links
         WHERE email=$1 AND code=$2`,
        [email, code]
    );

    if (!rows[0])
        return {
            codeAccepted: false,
            accountId: null
        }

    const now = new Date();
    if (rows[0].expires_at < now)
        return {
            codeAccepted: false,
            accountId: null
        }

    // CASE 1: Existing account
    if (rows[0].account_id) {

        // Optional: delete the code after use
        await pool.query(`DELETE FROM sign_in_links WHERE email=$1`, [email]);

        return {
            codeAccepted: true,
            accountId: rows[0].account_id
        }
    }

    if (!termsAccepted) {
        return {
            codeAccepted: true,
            accountId: null
        }
    }

    // CASE 2: No account yet → create one

    const shortLimitsEnabled = String(process.env.FEATURE_SHORT_TRANSLATION_LIMITS).toLowerCase() === "true";

    const accountInfo = await getAccountInfo(currentId, null);

    const query = shortLimitsEnabled
        ? `
            INSERT INTO accounts (email, translations_quota, translation_limit, limit_time_span_seconds)
            VALUES ($1, $2, 3, `+SHORTENED_WAIT_TIME_HOURS+` * 3600)
            RETURNING id
          `
        : `
            INSERT INTO accounts (email, translations_quota)
            VALUES ($1, $2)
            RETURNING id
          `;

    const { rows: accountRows } = await pool.query(
        query,
        [email, accountInfo.translationsQuota]
    );

    const newAccountId = accountRows[0].id;

    // Optional: delete the sign_in_link now that it's used
    await pool.query(`DELETE FROM sign_in_links WHERE email=$1`, [email]);

    return {
        codeAccepted: true,
        accountId: newAccountId
    }
}

/**
 * Unsubscribe account by token (token == accountId UUID string).
 * No auth (email link).
 *
 * Uses existing accounts.status (free/paid/attention) and stores unsubscribe state there.
 * If you want a dedicated boolean column later, add it and update this method.
 *
 * @param {string} token
 * @returns {Promise<{ok: boolean, reason?: string}>}
 */
export async function unsubscribeByToken(token) {
    if (typeof token !== "string" || !token.trim()) {
        return { ok: false, reason: "missing_token" };
    }

    const accountId = token.trim();

    // Basic UUID-ish check (optional but avoids garbage)
    const UUID_RE =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(accountId)) {
        return { ok: false, reason: "invalid_token" };
    }

    const { rowCount } = await pool.query(
        `
            UPDATE accounts
            SET email_subscribe = FALSE
            WHERE id = $1;
    `,
        [accountId]
    );

    if (!rowCount) return { ok: false, reason: "not_found" };
    return { ok: true };
}

/**
 * For all accounts with status='attention' whose LATEST marathon (by created_at)
 * was created between 8 and 7 days ago, set status='free'.
 *
 * "between 7 and 8 days ago" = created_at >= NOW() - INTERVAL '8 days'
 *                          AND created_at <  NOW() - INTERVAL '7 days'
 *
 * @returns {Promise<{updated: number}>}
 */
export async function downgradeAttentionAccountsAfterMarathonAge() {
    const { rowCount } = await pool.query(
        `
      WITH latest_marathon AS (
        SELECT DISTINCT ON (lm.account_id)
          lm.account_id,
          lm.created_at
        FROM learning_marathons lm
        ORDER BY lm.account_id, lm.created_at DESC
      ),
      target_accounts AS (
        SELECT a.id
        FROM accounts a
        JOIN latest_marathon lm ON lm.account_id = a.id
        WHERE a.status = 'attention'
          AND lm.created_at >= NOW() - INTERVAL '8 days'
          AND lm.created_at <  NOW() - INTERVAL '7 days'
      )
      UPDATE accounts a
      SET status = 'free'
      WHERE a.id IN (SELECT id FROM target_accounts)
      RETURNING a.id
    `
    );

    return { updated: rowCount || 0 };
}

/**
 * Mark all in-progress marathons as failed_by_account_status
 * for accounts whose status is 'free'.
 *
 * @returns {Promise<{updated: number}>}
 */
export async function failInProgressMarathonsForFreeAccounts() {
    const { rowCount } = await pool.query(
        `
            UPDATE learning_marathons lm
            SET status = 'failed_by_account_status'
            FROM accounts a
            WHERE lm.account_id = a.id
              AND a.status = 'free'
              AND lm.status = 'in_progress'
        `
    );

    return { updated: rowCount || 0 };
}

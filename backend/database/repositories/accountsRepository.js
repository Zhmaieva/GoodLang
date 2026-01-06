import { pool } from '../pool.js';
import {sendPromoEmail, sendVerificationEmail} from "../../core/emailSender.js";
import {getLifetime10CouponId, stripe} from "../../integrations/stripeService.js";
import {nanoid} from "nanoid";

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
 * Get account info by account ID (+ optional promo info by promo code)
 * @param {string} accountId
 * @param {string=} promoCode
 * @returns {Promise<{
 *   email: string|null,
 *   status: 'free'|'paid'|'attention',
 *   isTrial: boolean,
 *   trialEndsOn: any,
 *   promo: null | {
 *     accountId: string,
 *     promoCode: string,
 *     expirationDate: any,
 *     originalPrice: number,
 *     discountedPrice: number,
 *     discountPercentage: number
 *   }
 * }>}
 */
export async function getAccountInfo(accountId, promoCode) {
    const { rows } = await pool.query(
        "SELECT email, status, is_trial, trial_ended_at FROM accounts WHERE id = $1",
        [accountId]
    );

    if (!rows[0]) {
        return {
            email: null,
            status: "free",
            isTrial: false,
            trialEndsOn: null,
            promo: null,
        };
    }

    // --- Promo lookup (soft) ---
    let promo = null;

    if (typeof promoCode === "string" && promoCode.trim()) {
        const normalizedPromo = promoCode.trim().toUpperCase();

        // Soft format validation (optional but recommended)
        if (/^[A-Z0-9-]{3,32}$/.test(normalizedPromo)) {
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
    }

    return {
        email: rows[0].email,
        status: rows[0].status || "free",
        isTrial: rows[0].is_trial || false,
        trialEndsOn: rows[0].trial_ended_at,
        promo,
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

function calcPrices() {
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
export async function verifyCode(email, code, termsAccepted) {
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
    const { rows: accountRows } = await pool.query(
        `INSERT INTO accounts (email)
         VALUES ($1)
         RETURNING id`,
        [email]
    );

    const newAccountId = accountRows[0].id;

    // Attach the new account_id to the link row
    await pool.query(
        `UPDATE sign_in_links
         SET account_id=$1
         WHERE email=$2`,
        [newAccountId, email]
    );

    // Optional: delete the sign_in_link now that it's used
    await pool.query(`DELETE FROM sign_in_links WHERE email=$1`, [email]);

    return {
        codeAccepted: true,
        accountId: newAccountId
    }
}


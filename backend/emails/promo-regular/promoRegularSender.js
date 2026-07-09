// emails/promoRegularSender.js
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import "dotenv/config";

import { markFailed, markSent, tryInsertTrackingRow } from "../massEmailService.js";
import { calcPrices } from "../../database/repositories/accountsRepository.js";
import {applyFontFamilyTemplate} from "../../../shared/fontFamily.js";

// ✅ Stripe (adjust the path if your project differs)
import { stripe, getLifetime10CouponId } from "../../integrations/stripeService.js";

const TZ = "Europe/Warsaw";

/** ---------------- meta / parsing ---------------- */
function parseMeta(html, name) {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
        `<meta\\s+name=["']${esc}["']\\s+content=["']([^"']+)["']\\s*/?>`,
        "i"
    );
    const m = html.match(re);
    return m ? m[1].trim() : null;
}

function parsePlain(html) {
    let m = html.match(
        /<script[^>]*type=["']text\/plain["'][^>]*id=["']goodlang-plain["'][^>]*>([\s\S]*?)<\/script>/i
    );
    if (m) return m[1].replace(/\r\n/g, "\n").trim();

    m = html.match(/<pre[^>]*id=["']goodlang:plain["'][^>]*>([\s\S]*?)<\/pre>/i);
    return m ? m[1].replace(/\r\n/g, "\n").trim() : "";
}

function safeEmail(email) {
    if (typeof email !== "string") return null;
    const e = email.trim().toLowerCase();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e) ? e : null;
}

function replaceVars(s, vars) {
    let out = String(s ?? "");
    for (const [k, v] of Object.entries(vars)) {
        out = out.replaceAll(`{{${k}}}`, String(v));
    }
    return out;
}

/** ---------------- sending window ---------------- */
function getTzParts(now = new Date()) {
    const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
    return {
        weekday: parts.weekday,
        hour: Number(parts.hour),
        minute: Number(parts.minute),
    };
}

/**
 * Only Thu–Sat 16:00–19:59 local time
 */
function isAllowedWindow(now = new Date()) {
    const { weekday, hour } = getTzParts(now);
    const allowedDay = weekday === "Thu" || weekday === "Fri" || weekday === "Sat";
    const allowedHour = hour >= 14 && hour < 20;
    return allowedDay && allowedHour;
}

/** ---------------- template selection ---------------- */
async function pickLatestPromoTemplate({ promoDir }) {
    const entries = await fs.readdir(promoDir, { withFileTypes: true });
    const files = entries
        .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".html"))
        .map((e) => e.name);

    if (!files.length) return null;

    const templates = [];
    for (const file of files) {
        const full = path.join(promoDir, file);
        const html = applyFontFamilyTemplate(await fs.readFile(full, "utf8"));

        const createdAtStr = parseMeta(html, "goodlang:created_at");
        const createdMs = createdAtStr ? Date.parse(createdAtStr) : 0;

        const subject = parseMeta(html, "goodlang:subject") || "GoodLang";
        const letterId =
            (parseMeta(html, "goodlang:letter_id") || path.parse(file).name).toUpperCase();

        const text = parsePlain(html) || "";

        templates.push({ letterId, subject, html, text, createdMs, file, full });
    }

    templates.sort((a, b) => b.createdMs - a.createdMs);
    return templates[0];
}

/** ---------------- promo code generation (24h expiration) ---------------- */
function generatePromoCode() {
    // keep it short + shareable
    return `GL10-${crypto.randomBytes(4).toString("hex").toUpperCase()}`; // 8 hex chars
}

function formatUkDate(dateObj) {
    return new Intl.DateTimeFormat("uk-UA", {
        timeZone: TZ,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(dateObj);
}

function toUnixSeconds(date) {
    return Math.floor(date.getTime() / 1000);
}

/**
 * Creates a DB promo row + Stripe promotion code (redeemable) with 24h expiration.
 * Reuses an existing active code for the account if present.
 *
 * IMPORTANT: we also enforce "never send if this email EVER had any promo code"
 * (done in recipient selection, plus double-check here for safety).
 */
async function getOrCreate24hPromoCode({
                                           pool,
                                           accountId,
                                           email,
                                           discountPercentage = 10,
                                       }) {
    // 🔒 Safety double-check (recipient query already filters this)
    const { rows: everPromo } = await pool.query(
        `
            SELECT 1
            FROM promo_codes pc
                     JOIN accounts a2 ON a2.id = pc.account_id
            WHERE a2.email IS NOT NULL
              AND LOWER(a2.email) = LOWER($1)
            LIMIT 1
        `,
        [email]
    );
    if (everPromo[0]) return null;

    // Reuse existing active promo for this account + discount
    const { rows: existing } = await pool.query(
        `
      SELECT promo_code, expiration_date
      FROM promo_codes
      WHERE account_id = $1
        AND expiration_date > NOW()
        AND discount_percentage = $2
      ORDER BY expiration_date DESC
      LIMIT 1
    `,
        [accountId, discountPercentage]
    );

    if (existing[0]?.promo_code) {
        return {
            promoCode: existing[0].promo_code,
            expiresAt: new Date(existing[0].expiration_date),
            reused: true,
        };
    }

    const promoCode = generatePromoCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // ✅ Create Stripe promotion code (redeemable thing customers type)
    const couponId = await getLifetime10CouponId();

    await stripe.promotionCodes.create({
        promotion: {
            type: "coupon",
            coupon: couponId,
        },
        code: promoCode,
        expires_at: toUnixSeconds(expiresAt),
        metadata: {
            account_id: accountId,
            email: email,
            kind: "promo-regular",
            discount_percentage: String(discountPercentage),
        },
    });

    // Save to DB
    const { original, discounted } = calcPrices();

    await pool.query(
        `
            INSERT INTO promo_codes (
                account_id,
                promo_code,
                expiration_date,
                original_price,
                discounted_price,
                discount_percentage,
                created_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,NOW())
        `,
        [accountId, promoCode, expiresAt, original, discounted, discountPercentage]
    );

    return { promoCode, expiresAt, reused: false };
}

/** ---------------- recipients selection ---------------- */
async function selectEligibleRecipients({ pool, letterId, batchSize = 50 }) {
    const { rows } = await pool.query(
        `
            SELECT
                LOWER(a.email) AS email,
                a.id AS account_id
            FROM accounts a
            WHERE a.email IS NOT NULL

              AND a.email_subscribe = TRUE

              -- ✅ only NOT paid
              AND COALESCE(a.status, 'free') <> 'paid'

              -- ✅ registered at least 48h ago AND not today (previous day)
              AND a.created_at <= (NOW() - INTERVAL '48 hours')
              AND a.created_at < DATE_TRUNC('day', NOW())

--               -- ✅ account age <= 5 days
--               AND a.created_at >= (NOW() - INTERVAL '5 days')

              -- ✅ not a teacher: no 500 event, no 101 event, no promo: no 402 event
              AND NOT EXISTS (
                SELECT 1
                FROM account_log al
                WHERE al.account_id = a.id
                  AND al.action_type IN (500, 101, 402)
            )

              -- ✅ never got the same letter_id
              AND NOT EXISTS (
                SELECT 1
                FROM email_sendings es
                WHERE LOWER(es.email) = LOWER(a.email)
                  AND es.letter_id = $1
            )

              -- ✅ no emails (any) in previous 6 hours
              AND NOT EXISTS (
                SELECT 1
                FROM email_sendings es
                WHERE LOWER(es.email) = LOWER(a.email)
                  AND es.created_at >= (NOW() - INTERVAL '6 hours')
            )

              -- ✅ never had any promo code associated with this email (ever)
              AND NOT EXISTS (
                SELECT 1
                FROM promo_codes pc
                         JOIN accounts a2 ON a2.id = pc.account_id
                WHERE a2.email IS NOT NULL
                  AND LOWER(a2.email) = LOWER(a.email)
            )

            ORDER BY a.created_at DESC
            LIMIT $2
        `,
        [String(letterId).toUpperCase(), batchSize]
    );

    return rows
        .map((r) => ({
            email: safeEmail(r.email),
            accountId: r.account_id,
        }))
        .filter((r) => r.email && r.accountId);

}

/** ---------------- send gating ---------------- */
async function sendOnceIfInserted({
                                      pool,
                                      transporter,
                                      from,
                                      email,
                                      accountId,
                                      letterId,
                                      subject,
                                      html,
                                      text,
                                  }) {
    const ins = await tryInsertTrackingRow({ pool, email, accountId, letterId });
    if (!ins.inserted) {
        return { sent: false, skipped: true, reason: ins.error ? "insert_failed" : "already_tracked" };
    }

    try {
        await transporter.sendMail({
            from,
            to: email,
            subject,
            html,
            text: text || undefined,
            headers: { "X-GoodLang-Letter-Id": letterId },
        });

        await markSent({ pool, id: ins.id });
        return { sent: true, skipped: false };
    } catch (e) {
        await markFailed({ pool, id: ins.id, error: e?.message ?? e });
        return { sent: false, skipped: false, error: e };
    }
}

/**
 * runPromoRegularTick
 *
 * Promo codes are 24h only.
 * Does NOT stop based on template date.
 * Does NOT send to users whose email ever had any promo code.
 * Creates Stripe promotion codes + DB rows for new promo codes.
 */
export async function runPromoRegularTick({
                                              pool,
                                              transporter,
                                              projectRoot,
                                              batchSize = 50,
                                          }) {
    if (!isAllowedWindow()) return { skipped: true, reason: "outside_window" };

    const promoDir = path.join(projectRoot, "emails", "promo-regular");
    const tpl = await pickLatestPromoTemplate({ promoDir });
    if (!tpl) return { skipped: true, reason: "no_templates" };

    const recipients = await selectEligibleRecipients({
        pool,
        letterId: tpl.letterId,
        batchSize,
    });

    if (!recipients.length) {
        return { skipped: true, reason: "no_recipients", letterId: tpl.letterId };
    }

    const from = `"GoodLang" <${process.env.SMTP_FROM}>`;
    const discountPercentage = 10;

    let attempted = 0;
    let sent = 0;
    let alreadyTracked = 0;
    let insertFailed = 0;
    let failedSend = 0;
    let reusedPromo = 0;
    let createdPromo = 0;
    let skippedBecauseEverPromo = 0;

    for (const r of recipients) {
        attempted++;

        const promo = await getOrCreate24hPromoCode({
            pool,
            accountId: r.accountId,
            email: r.email, // needed for Stripe metadata + safety check
            discountPercentage,
        });

        // extra safety: if it suddenly became ineligible (race condition), skip
        if (!promo) {
            skippedBecauseEverPromo++;
            continue;
        }

        if (promo.reused) reusedPromo++;
        else createdPromo++;

        const subscribeUrl = `${process.env.FRONTEND_URL}/trainer?subscribe=true&code=${promo.promoCode}`;

        const unsubscribeUrl =
            r.accountId
                ? `${process.env.FRONTEND_URL}?email_unsubscribe_token=${encodeURIComponent(r.accountId)}`
                : `${process.env.FRONTEND_URL}?email_unsubscribe_token=error`; // fallback (or skip sending if you prefer)


        const vars = {
            PROMO_CODE: promo.promoCode,
            DISCOUNT_PERCENT: `${discountPercentage}%`,
            PROMO_EXPIRES_DATE: formatUkDate(promo.expiresAt),
            SUBSCRIBE_URL: subscribeUrl,
            UNSUBSCRIBE_URL: unsubscribeUrl,
        };

        const html = replaceVars(tpl.html, vars);
        const text = replaceVars(tpl.text, vars);

        const res = await sendOnceIfInserted({
            pool,
            transporter,
            from,
            email: r.email,
            accountId: r.accountId,
            letterId: tpl.letterId,
            subject: tpl.subject,
            html,
            text,
        });

        if (res.sent) sent++;
        else if (res.skipped && res.reason === "already_tracked") alreadyTracked++;
        else if (res.skipped && res.reason === "insert_failed") insertFailed++;
        else failedSend++;
    }

    return {
        skipped: sent === 0,
        letterId: tpl.letterId,
        attempted,
        sent,
        alreadyTracked,
        insertFailed,
        failedSend,
        reusedPromo,
        createdPromo,
        skippedBecauseEverPromo,
    };
}

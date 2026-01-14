import fs from "node:fs/promises";
import path from "node:path";
import { markFailed, markSent, tryInsertTrackingRow } from "../massEmailService.js";
import "dotenv/config";

const TZ = "Europe/Warsaw";

/* ----------------------------- template helpers ---------------------------- */

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
    // <pre id="goodlang:plain"> ... </pre>
    const m = html.match(/<pre[^>]*id=["']goodlang:plain["'][^>]*>([\s\S]*?)<\/pre>/i);
    return m ? m[1].replace(/\r\n/g, "\n").trim() : null;
}

async function pickLatestTipTemplate({ tipsDir }) {
    const entries = await fs.readdir(tipsDir, { withFileTypes: true });
    const files = entries
        .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".html"))
        .map((e) => e.name);

    if (!files.length) return null;

    const templates = [];
    for (const file of files) {
        const full = path.join(tipsDir, file);
        const html = await fs.readFile(full, "utf8");

        const createdAtStr = parseMeta(html, "goodlang:created_at");
        const createdMs = createdAtStr ? Date.parse(createdAtStr) : 0;

        const subject = parseMeta(html, "goodlang:subject") || "GoodLang";
        const letterId = (parseMeta(html, "goodlang:letter_id") || path.parse(file).name).toUpperCase();

        const text = parsePlain(html) || "";

        templates.push({ letterId, subject, html, text, createdMs, file, full });
    }

    templates.sort((a, b) => b.createdMs - a.createdMs);
    return templates[0];
}

/* ------------------------------ email helpers ------------------------------ */

function safeEmail(email) {
    if (typeof email !== "string") return null;
    const e = email.trim().toLowerCase();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e) ? e : null;
}

/**
 * Build an unsubscribe link for template replacement.
 * Set APP_BASE_URL in env (recommended), e.g. https://goodlang.beampie.com
 */
function buildUnsubscribeUrl({ baseUrl, id }) {
    const u = new URL("/", baseUrl);
    u.searchParams.set("email_unsubscribe_token", id);
    return u.toString();
}

/**
 * Replaces `unsubscribeurl` placeholder in both HTML and plain text.
 * Supports: "unsubscribeurl", "{{unsubscribeurl}}", "%unsubscribeurl%", "[unsubscribeurl]"
 */
function replaceUnsubscribeUrl({ html, text, unsubscribeUrl }) {
    const url = String(unsubscribeUrl);


    return {
        html: (html ?? "").replaceAll(`{{UNSUBSCRIBE_URL}}`, unsubscribeUrl),
        text: (text ?? "").replaceAll(`{{UNSUBSCRIBE_URL}}`, unsubscribeUrl),
    };
}

async function selectEligibleRecipients({ pool, letterId }) {
    const { rows } = await pool.query(
        `
      WITH candidates AS (
          SELECT LOWER(email) AS email, id AS account_id, created_at
          FROM accounts
          WHERE email IS NOT NULL
            AND email_subscribe = TRUE

          UNION ALL

          SELECT LOWER(email) AS email, NULL::uuid AS account_id, created_at
          FROM inquiries
          WHERE email IS NOT NULL
      )
      SELECT DISTINCT ON (c.email)
          c.email,
          c.account_id
      FROM candidates c
      WHERE c.created_at <= (NOW() - INTERVAL '12 hours')

        -- ✅ exclude only if this exact letter was already tracked for this email
        AND NOT EXISTS (
          SELECT 1
          FROM email_sendings es
          WHERE es.email = c.email
            AND es.letter_id = $1
        )

      ORDER BY c.email, c.account_id DESC NULLS LAST
      LIMIT 1
    `,
        [String(letterId).toUpperCase()]
    );

    return rows
        .map((r) => ({ email: safeEmail(r.email), accountId: r.account_id ?? null }))
        .filter((r) => r.email);
}

async function sendTipOnceIfInserted({
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
    // 1) Insert gate
    const ins = await tryInsertTrackingRow({ pool, email, accountId, letterId });
    if (!ins.inserted) {
        return {
            sent: false,
            skipped: true,
            reason: ins.error ? "insert_failed" : "already_tracked",
        };
    }

    // 2) Send (only after insert succeeded)
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

/* ------------------------------ scheduling -------------------------------- */

function isAllowedWindow(now = new Date()) {
    const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ,
        weekday: "short",
        hour: "2-digit",
        hour12: false,
    });
    const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
    return (
        parts.weekday !== "Sat" &&
        parts.weekday !== "Sun" &&
        Number(parts.hour) > 7 &&
        Number(parts.hour) < 13 // 07:00-13:59
    );
}

/* --------------------------------- tick ---------------------------------- */

export async function runTipsTick({
                                      pool,
                                      transporter,
                                      projectRoot, // absolute path recommended
                                  }) {
    if (!isAllowedWindow()) return { skipped: true, reason: "outside_window" };

    const tipsDir = path.join(projectRoot, "emails", "tips");
    const tpl = await pickLatestTipTemplate({ tipsDir });
    if (!tpl) return { skipped: true, reason: "no_templates" };

    const recipients = await selectEligibleRecipients({ pool, letterId: tpl.letterId });
    if (!recipients.length) return { skipped: true, reason: "no_recipients", letterId: tpl.letterId };

    const from = `"GoodLang" <${process.env.SMTP_FROM}>`;

    // ✅ used for unsubscribeurl replacement
    const baseUrl = process.env.FRONTEND_URL;

    let attempted = 0;
    let sent = 0;
    let skipped = 0;
    let insertFailed = 0;
    let failedSend = 0;

    for (const r of recipients) {
        attempted++;

        const unsubscribeUrl = buildUnsubscribeUrl({
            baseUrl,
            id: r.accountId,
        });

        const rendered = replaceUnsubscribeUrl({
            html: tpl.html,
            text: tpl.text,
            unsubscribeUrl,
        });

        const res = await sendTipOnceIfInserted({
            pool,
            transporter,
            from,
            email: r.email,
            accountId: r.accountId,
            letterId: tpl.letterId,
            subject: tpl.subject,
            html: rendered.html,
            text: rendered.text,
        });

        if (res.sent) sent++;
        else if (res.skipped && res.reason === "already_tracked") skipped++;
        else if (res.skipped && res.reason === "insert_failed") insertFailed++;
        else failedSend++;
    }

    return {
        skipped: sent === 0,
        letterId: tpl.letterId,
        attempted,
        sent,
        alreadyTracked: skipped,
        insertFailed,
        failedSend,
    };
}

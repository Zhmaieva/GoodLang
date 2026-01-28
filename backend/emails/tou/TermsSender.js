// emails/tou/touSender.js
import fs from "node:fs/promises";
import path from "node:path";
import { markFailed, markSent, tryInsertTrackingRow } from "../massEmailService.js";
import "dotenv/config";

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
    // Prefer <script type="text/plain" id="goodlang-plain">...</script>
    let m = html.match(/<script[^>]*type=["']text\/plain["'][^>]*id=["']goodlang-plain["'][^>]*>([\s\S]*?)<\/script>/i);
    if (m) return m[1].replace(/\r\n/g, "\n").trim();

    // Backward compatibility: <pre id="goodlang:plain">...</pre>
    m = html.match(/<pre[^>]*id=["']goodlang:plain["'][^>]*>([\s\S]*?)<\/pre>/i);
    return m ? m[1].replace(/\r\n/g, "\n").trim() : null;
}

async function pickLatestTouTemplate({ touDir }) {
    const entries = await fs.readdir(touDir, { withFileTypes: true });
    const files = entries
        .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".html"))
        .map((e) => e.name);

    if (!files.length) return null;

    const templates = [];
    for (const file of files) {
        const full = path.join(touDir, file);
        const html = await fs.readFile(full, "utf8");

        const createdAtStr = parseMeta(html, "goodlang:created_at");
        const createdMs = createdAtStr ? Date.parse(createdAtStr) : 0;

        const subject = parseMeta(html, "goodlang:subject") || "Оновлення умов використання GoodLang";

        // ✅ Use template FILE NAME as unique sending id (as requested)
        const letterId = String(file).toUpperCase(); // e.g. TERMSUPDATE2.HTML

        const text = parsePlain(html) || "";

        templates.push({ letterId, subject, html, text, createdMs, file, full });
    }

    templates.sort((a, b) => (b.createdMs || 0) - (a.createdMs || 0));
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
 * Select 1 recipient per tick:
 * - accounts only
 * - created BEFORE template created_at
 * - subscribed
 * - NOT yet received this exact template filename (letterId)
 */
async function selectEligibleRecipients({ pool, letterId, templateCreatedMs }) {
    if (!templateCreatedMs || !Number.isFinite(templateCreatedMs)) {
        // If template has no created_at, we should be conservative: do not send.
        return [];
    }

    const templateCreatedAtIso = new Date(templateCreatedMs).toISOString(); // UTC

    const { rows } = await pool.query(
        `
        SELECT
            LOWER(a.email) AS email,
            a.id AS account_id
        FROM accounts a
        WHERE a.email IS NOT NULL
          AND a.email_subscribe = TRUE
          AND a.created_at <= $2::timestamptz

          AND NOT EXISTS (
            SELECT 1
            FROM email_sendings es
            WHERE es.email = LOWER(a.email)
              AND es.letter_id = $1
          )

        ORDER BY a.created_at ASC
        LIMIT 1
      `,
        [String(letterId).toUpperCase(), templateCreatedAtIso]
    );

    return rows
        .map((r) => ({ email: safeEmail(r.email), accountId: r.account_id ?? null }))
        .filter((r) => r.email);
}

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
    // 1) Insert gate (prevents duplicate sends across concurrent ticks)
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

/* --------------------------------- tick ---------------------------------- */

export async function runTouTick({
                                     pool,
                                     transporter,
                                     projectRoot, // absolute path recommended
                                 }) {
    const touDir = path.join(projectRoot, "emails", "tou");
    const tpl = await pickLatestTouTemplate({ touDir });
    if (!tpl) return { skipped: true, reason: "no_templates" };

    // created_at is required for the “created before the date” rule
    if (!tpl.createdMs) return { skipped: true, reason: "template_missing_created_at", file: tpl.file };

    const recipients = await selectEligibleRecipients({
        pool,
        letterId: tpl.letterId,
        templateCreatedMs: tpl.createdMs,
    });

    if (!recipients.length) {
        return { skipped: true, reason: "no_recipients", letterId: tpl.letterId, file: tpl.file };
    }

    const from = `"GoodLang" <${process.env.SMTP_FROM}>`;

    let attempted = 0;
    let sent = 0;
    let alreadyTracked = 0;
    let insertFailed = 0;
    let failedSend = 0;

    for (const r of recipients) {
        attempted++;

        const res = await sendOnceIfInserted({
            pool,
            transporter,
            from,
            email: r.email,
            accountId: r.accountId,
            letterId: tpl.letterId, // ✅ template FILE NAME
            subject: tpl.subject,
            html: tpl.html,
            text: tpl.text,
        });

        if (res.sent) sent++;
        else if (res.skipped && res.reason === "already_tracked") alreadyTracked++;
        else if (res.skipped && res.reason === "insert_failed") insertFailed++;
        else failedSend++;
    }

    return {
        skipped: sent === 0,
        letterId: tpl.letterId,
        file: tpl.file,
        attempted,
        sent,
        alreadyTracked,
        insertFailed,
        failedSend,
    };
}

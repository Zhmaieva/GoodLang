// emails/marathon/marathonEmails.js
import fs from "node:fs/promises";
import path from "node:path";
import { markFailed, markSent, tryInsertTrackingRow } from "../massEmailService.js";
import {applyFontFamilyTemplate} from "../../../shared/fontFamily.js";

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

// tipsSender.js expects a <pre id="goodlang:plain">, but your tips template uses a <script type="text/plain"...>.
// Support BOTH so marathon template can follow whichever you prefer.
function parsePlain(html) {
    // Option A: <pre id="goodlang:plain"> ... </pre>
    const m1 = html.match(/<pre[^>]*id=["']goodlang:plain["'][^>]*>([\s\S]*?)<\/pre>/i);
    if (m1) return m1[1].replace(/\r\n/g, "\n").trim();

    // Option B: <script type="text/plain" id="goodlang-plain"> ... </script>
    const m2 = html.match(/<script[^>]*type=["']text\/plain["'][^>]*id=["']goodlang-plain["'][^>]*>([\s\S]*?)<\/script>/i);
    if (m2) return m2[1].replace(/\r\n/g, "\n").trim();

    return null;
}

function safeEmail(email) {
    if (typeof email !== "string") return null;
    const e = email.trim().toLowerCase();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e) ? e : null;
}

function buildUnsubscribeUrl({ baseUrl, id }) {
    const u = new URL("/", baseUrl);
    // keep same param name as tipsSender
    u.searchParams.set("email_unsubscribe_token", id);
    return u.toString();
}

function replaceUnsubscribeUrl({ html, text, unsubscribeUrl }) {
    return {
        html: (html ?? "").replaceAll(`{{UNSUBSCRIBE_URL}}`, unsubscribeUrl),
        text: (text ?? "").replaceAll(`{{UNSUBSCRIBE_URL}}`, unsubscribeUrl),
    };
}

/**
 * Very small mustache-like renderer for the {{#RULES}}...{{/RULES}} block.
 * Expects template block to contain {{title}} and {{url}}.
 */
function renderRulesBlock({ html, rules }) {
    const re = /{{#RULES}}([\s\S]*?){{\/RULES}}/g;
    return String(html ?? "").replace(re, (_, inner) => {
        return rules
            .map((r) =>
                inner
                    .replaceAll("{{title}}", String(r.title ?? r.ruleId))
                    .replaceAll("{{url}}", String(r.url ?? ""))
            )
            .join("");
    });
}

function renderRulesText({ text, rules }) {
    // If your plain text also uses the {{#RULES}}...{{/RULES}} block, handle it too.
    const re = /{{#RULES}}([\s\S]*?){{\/RULES}}/g;
    return String(text ?? "").replace(re, (_, inner) => {
        return rules
            .map((r) =>
                inner
                    .replaceAll("{{title}}", String(r.title ?? r.ruleId))
                    .replaceAll("{{url}}", String(r.url ?? ""))
            )
            .join("");
    });
}

/* ------------------------------ data query -------------------------------- */

/**
 * Finds in-progress marathons where:
 * - account has email_subscribe = TRUE
 * - email exists
 * - no email_sendings row for letter_id = MARATHON_START_{marathon_id}
 * Returns marathon + account email + 7 rule_ids (from schedules).
 */
async function selectEligibleMarathonStarts({ pool, limit = 50 }) {
    const lim = Math.max(1, Math.min(500, Number(limit) || 50));

    const { rows } = await pool.query(
        `
    WITH m AS (
      SELECT
        lm.id AS marathon_id,
        lm.account_id,
        LOWER(a.email) AS email,
        ARRAY_AGG(ms.rule_id ORDER BY ms.day_number ASC) AS rule_ids
      FROM learning_marathons lm
      JOIN accounts a ON a.id = lm.account_id
      JOIN marathon_schedules ms ON ms.marathon_id = lm.id
      WHERE lm.status = 'in_progress'
        AND a.email_subscribe = TRUE
        AND a.email IS NOT NULL
      GROUP BY lm.id, lm.account_id, a.email
    )
    SELECT
      m.marathon_id,
      m.account_id,
      m.email,
      m.rule_ids
    FROM m
    WHERE CARDINALITY(m.rule_ids) = 7
      AND NOT EXISTS (
        SELECT 1
        FROM email_sendings es
        WHERE es.email = m.email
          AND es.letter_id = ('MARATHON_START_' || m.marathon_id::text)
      )
    ORDER BY m.marathon_id ASC
    LIMIT $1
    `,
        [lim]
    );

    return rows
        .map((r) => ({
            marathonId: r.marathon_id,
            accountId: r.account_id,
            email: safeEmail(r.email),
            ruleIds: Array.isArray(r.rule_ids) ? r.rule_ids : [],
        }))
        .filter((r) => r.email && r.ruleIds.length === 7);
}

/* ------------------------------ email sender ------------------------------- */

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
        return {
            sent: false,
            skipped: true,
            reason: ins.error ? "insert_failed" : "already_tracked",
        };
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

/* --------------------------------- tick ---------------------------------- */

/**
 * Sends "marathon started" email for all eligible in-progress marathons.
 *
 * Template file: emails/marathon/Marathon_start.html
 * Rule URL: FRONTEND_URL + /rule/{ruleId}
 */
export async function runMarathonStartTick({
                                               pool,
                                               transporter,
                                               projectRoot, // absolute path recommended
                                               limit = 50,
                                           }) {
    const marathonDir = path.join(projectRoot, "emails", "marathon");
    const tplPath = path.join(marathonDir, "Marathon_start.html");

    const rawHtml = applyFontFamilyTemplate(await fs.readFile(tplPath, "utf8"));
    const subject = parseMeta(rawHtml, "goodlang:subject") || "Твій марафон стартував 🚀";
    const plain = parsePlain(rawHtml) || "";

    const from = `"GoodLang" <${process.env.SMTP_FROM}>`;
    const baseUrl = process.env.FRONTEND_URL;

    if (!baseUrl) {
        throw new Error("runMarathonStartTick: FRONTEND_URL env is required");
    }

    const recipients = await selectEligibleMarathonStarts({ pool, limit });
    if (!recipients.length) {
        return { skipped: true, reason: "no_recipients" };
    }

    let attempted = 0;
    let sent = 0;
    let alreadyTracked = 0;
    let insertFailed = 0;
    let failedSend = 0;

    for (const r of recipients) {
        attempted++;

        const letterId = `MARATHON_START_${r.marathonId}`;

        const unsubscribeUrl = buildUnsubscribeUrl({
            baseUrl,
            id: r.accountId,
        });

        const rules = r.ruleIds.map((ruleId) => ({
            ruleId,
            title: ruleId, // you can replace with RULE_LABELS[ruleId] later if you want
            url: `${baseUrl.replace(/\/$/, "")}/rule/${encodeURIComponent(ruleId)}`,
        }));

        // 1) Render dynamic rules block
        let html = renderRulesBlock({ html: rawHtml, rules });
        let text = renderRulesText({ text: plain, rules });

        // 2) Unsubscribe replacement
        const rendered = replaceUnsubscribeUrl({ html, text, unsubscribeUrl });
        html = rendered.html;
        text = rendered.text;

        const res = await sendOnceIfInserted({
            pool,
            transporter,
            from,
            email: r.email,
            accountId: r.accountId,
            letterId,
            subject,
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
        attempted,
        sent,
        alreadyTracked,
        insertFailed,
        failedSend,
    };
}

/**
 * Finds failed marathons where:
 * - marathon status is failed OR failed_cancelled
 * - account has email_subscribe = TRUE
 * - email exists
 * - no email_sendings row for letter_id = MARATHON_FAIL_{marathon_id}
 * Returns marathon + account email + 7 rule_ids (from schedules).
 */
async function selectEligibleMarathonFails({ pool, limit = 50 }) {
    const lim = Math.max(1, Math.min(500, Number(limit) || 50));

    const { rows } = await pool.query(
        `
        WITH m AS (
          SELECT
            lm.id AS marathon_id,
            lm.account_id,
            LOWER(a.email) AS email,
            ARRAY_AGG(ms.rule_id ORDER BY ms.day_number ASC) AS rule_ids
          FROM learning_marathons lm
          JOIN accounts a ON a.id = lm.account_id
          JOIN marathon_schedules ms ON ms.marathon_id = lm.id
          WHERE lm.status IN ('failed', 'failed_cancelled')
            AND a.email_subscribe = TRUE
            AND a.email IS NOT NULL
          GROUP BY lm.id, lm.account_id, a.email
        )
        SELECT
          m.marathon_id,
          m.account_id,
          m.email,
          m.rule_ids
        FROM m
        WHERE CARDINALITY(m.rule_ids) = 7
          AND NOT EXISTS (
            SELECT 1
            FROM email_sendings es
            WHERE es.email = m.email
              AND es.letter_id = ('MARATHON_FAIL_' || m.marathon_id::text)
          )
        ORDER BY m.marathon_id ASC
        LIMIT $1
        `,
        [lim]
    );

    return rows
        .map((r) => ({
            marathonId: r.marathon_id,
            accountId: r.account_id,
            email: safeEmail(r.email),
            ruleIds: Array.isArray(r.rule_ids) ? r.rule_ids : [],
        }))
        .filter((r) => r.email && r.ruleIds.length === 7);
}

/**
 * Sends "marathon failed" email for all eligible marathons with status:
 * failed OR failed_cancelled.
 *
 * Template file: emails/marathon/Marathon_failed.html
 * Rule URL: FRONTEND_URL + /rule/{ruleId}
 * Tracking letter id: MARATHON_FAIL_{marathon_id}
 */
export async function runMarathonFailTick({
                                              pool,
                                              transporter,
                                              projectRoot, // absolute path recommended
                                              limit = 50,
                                          }) {
    const marathonDir = path.join(projectRoot, "emails", "marathon");
    const tplPath = path.join(marathonDir, "Marathon_failed.html");

    const rawHtml = applyFontFamilyTemplate(await fs.readFile(tplPath, "utf8"));
    const subject =
        parseMeta(rawHtml, "goodlang:subject") || "Марафон завершився";
    const plain = parsePlain(rawHtml) || "";

    const from = `"GoodLang" <${process.env.SMTP_FROM}>`;
    const baseUrl = process.env.FRONTEND_URL;

    if (!baseUrl) {
        throw new Error("runMarathonFailTick: FRONTEND_URL env is required");
    }

    const recipients = await selectEligibleMarathonFails({ pool, limit });
    if (!recipients.length) {
        return { skipped: true, reason: "no_recipients" };
    }

    let attempted = 0;
    let sent = 0;
    let alreadyTracked = 0;
    let insertFailed = 0;
    let failedSend = 0;

    for (const r of recipients) {
        attempted++;

        const letterId = `MARATHON_FAIL_${r.marathonId}`;

        const unsubscribeUrl = buildUnsubscribeUrl({
            baseUrl,
            id: r.accountId,
        });

        const rules = r.ruleIds.map((ruleId) => ({
            ruleId,
            title: ruleId, // can be swapped to RULE_LABELS[ruleId] later
            url: `${baseUrl.replace(/\/$/, "")}/rule/${encodeURIComponent(ruleId)}`,
        }));

        // 1) Render dynamic rules block
        let html = renderRulesBlock({ html: rawHtml, rules });
        let text = renderRulesText({ text: plain, rules });

        // 2) Unsubscribe replacement
        const rendered = replaceUnsubscribeUrl({ html, text, unsubscribeUrl });
        html = rendered.html;
        text = rendered.text;

        const res = await sendOnceIfInserted({
            pool,
            transporter,
            from,
            email: r.email,
            accountId: r.accountId,
            letterId,
            subject,
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
        attempted,
        sent,
        alreadyTracked,
        insertFailed,
        failedSend,
    };
}

/**
 * Finds completed marathons where:
 * - status is 'completed'
 * - account has email_subscribe = TRUE
 * - email exists
 * - no email_sendings row for letter_id = MARATHON_COMPLETED_{marathon_id}
 * Returns marathon + account email + 7 rule_ids (from schedules).
 */
async function selectEligibleMarathonCompletions({ pool, limit = 50 }) {
    const lim = Math.max(1, Math.min(500, Number(limit) || 50));

    const { rows } = await pool.query(
        `
        WITH m AS (
          SELECT
            lm.id AS marathon_id,
            lm.account_id,
            LOWER(a.email) AS email,
            ARRAY_AGG(ms.rule_id ORDER BY ms.day_number ASC) AS rule_ids
          FROM learning_marathons lm
          JOIN accounts a ON a.id = lm.account_id
          JOIN marathon_schedules ms ON ms.marathon_id = lm.id
          WHERE lm.status = 'completed'
            AND a.email_subscribe = TRUE
            AND a.email IS NOT NULL
          GROUP BY lm.id, lm.account_id, a.email
        )
        SELECT
          m.marathon_id,
          m.account_id,
          m.email,
          m.rule_ids
        FROM m
        WHERE CARDINALITY(m.rule_ids) = 7
          AND NOT EXISTS (
            SELECT 1
            FROM email_sendings es
            WHERE es.email = m.email
              AND es.letter_id = ('MARATHON_COMPLETED_' || m.marathon_id::text)
          )
        ORDER BY m.marathon_id ASC
        LIMIT $1
        `,
        [lim]
    );

    return rows
        .map((r) => ({
            marathonId: r.marathon_id,
            accountId: r.account_id,
            email: safeEmail(r.email),
            ruleIds: Array.isArray(r.rule_ids) ? r.rule_ids : [],
        }))
        .filter((r) => r.email && r.ruleIds.length === 7);
}

/**
 * Sends "marathon completed" email for all eligible completed marathons.
 *
 * Template file: emails/marathon/Marathon_completed.html
 * Rule URL: FRONTEND_URL + /rule/{ruleId}
 * Tracking letter id: MARATHON_COMPLETED_{marathon_id}
 */
export async function runMarathonCompletedTick({
                                                   pool,
                                                   transporter,
                                                   projectRoot, // absolute path recommended
                                                   limit = 50,
                                               }) {
    const marathonDir = path.join(projectRoot, "emails", "marathon");
    const tplPath = path.join(marathonDir, "Marathon_completed.html");

    const rawHtml = applyFontFamilyTemplate(await fs.readFile(tplPath, "utf8"));
    const subject =
        parseMeta(rawHtml, "goodlang:subject") || "Ти завершив(ла) марафон! 🎉";
    const plain = parsePlain(rawHtml) || "";

    const from = `"GoodLang" <${process.env.SMTP_FROM}>`;
    const baseUrl = process.env.FRONTEND_URL;

    if (!baseUrl) {
        throw new Error("runMarathonCompletedTick: FRONTEND_URL env is required");
    }

    const recipients = await selectEligibleMarathonCompletions({ pool, limit });
    if (!recipients.length) {
        return { skipped: true, reason: "no_recipients" };
    }

    let attempted = 0;
    let sent = 0;
    let alreadyTracked = 0;
    let insertFailed = 0;
    let failedSend = 0;

    for (const r of recipients) {
        attempted++;

        const letterId = `MARATHON_COMPLETED_${r.marathonId}`;

        const unsubscribeUrl = buildUnsubscribeUrl({
            baseUrl,
            id: r.accountId,
        });

        const rules = r.ruleIds.map((ruleId) => ({
            ruleId,
            title: ruleId, // swap to RULE_LABELS[ruleId] later if you want
            url: `${baseUrl.replace(/\/$/, "")}/rule/${encodeURIComponent(ruleId)}`,
        }));

        // 1) Render dynamic rules block
        let html = renderRulesBlock({ html: rawHtml, rules });
        let text = renderRulesText({ text: plain, rules });

        // 2) Unsubscribe replacement
        const rendered = replaceUnsubscribeUrl({ html, text, unsubscribeUrl });
        html = rendered.html;
        text = rendered.text;

        const res = await sendOnceIfInserted({
            pool,
            transporter,
            from,
            email: r.email,
            accountId: r.accountId,
            letterId,
            subject,
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
        attempted,
        sent,
        alreadyTracked,
        insertFailed,
        failedSend,
    };
}

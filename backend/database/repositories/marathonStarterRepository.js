// marathonsRepository.js (add near top, after pool import)

import { LEVEL_RULES } from "../../core/rules.js"; // <-- adjust if needed
import { connectDB } from "../mongo.js";
import {pool} from "../pool.js";
import {startMarathon} from "./marathonsRepository.js";                // <-- adjust if needed

const LEVEL_ORDER = ["A1", "A2", "B1", "B2"];

function uniq(arr) {
    return [...new Set((arr || []).filter(Boolean))];
}

function nextLevel(lvl) {
    const i = LEVEL_ORDER.indexOf(String(lvl || "A1").toUpperCase());
    return i === -1 ? null : (LEVEL_ORDER[i + 1] ?? null);
}

function levelIndex(lvl) {
    return Math.max(0, LEVEL_ORDER.indexOf(String(lvl || "A1").toUpperCase()));
}

function averageScorePercent(attempts) {
    const arr = Array.isArray(attempts) ? attempts : [];
    if (!arr.length) return 0;
    let sum = 0;
    let n = 0;
    for (const a of arr) {
        const s = Number(a?.score);
        if (!Number.isFinite(s)) continue;
        sum += Math.max(0, Math.min(1, s));
        n++;
    }
    return n ? (sum / n) * 100 : 0;
}

function primaryLevelForRule(ruleId) {
    const r = String(ruleId || "");
    for (const L of LEVEL_ORDER) {
        if ((LEVEL_RULES?.[L] || []).includes(r)) return L;
    }
    return "A1";
}

async function getAllAnswersForAccount(accountId) {
    const db = await connectDB();
    // Assumption (same as sync): accountId === userId in Mongo
    return await db.collection("good_lang_scores")
        .find({ userId: accountId })
        .project({ rule: 1, score: 1, date: 1, level: 1 })
        .toArray();
}

function buildStatsByRule(answers) {
    const known = new Set(Object.values(LEVEL_RULES || {}).flat().map(String));
    const byRule = new Map();

    for (const a of answers || []) {
        const r = String(a?.rule || "");
        if (!r || !known.has(r)) continue;
        if (!byRule.has(r)) byRule.set(r, []);
        byRule.get(r).push(a);
    }

    const statByRule = new Map();
    for (const r of known) {
        const arr = byRule.get(r) || [];
        statByRule.set(r, {
            rule: r,
            accuracy: averageScorePercent(arr),
            attempts: arr.length,
            level: primaryLevelForRule(r),
        });
    }
    return statByRule;
}

function inferLevelFromAnswers(answers, statByRule) {
    // simplified server-side equivalent (same thresholds as client defaults)
    const minTotalAttemptsPerLevel = 4;
    const minAttemptsPerRule = 1;
    const minRulesWithAttempts = 4;
    const minAccuracy = 70;

    let inferred = "A1";

    for (const L of LEVEL_ORDER) {
        const rules = (LEVEL_RULES?.[L] || []).map(String);
        if (!rules.length) continue;

        let attempts = 0;
        let rulesWithAttempts = 0;

        let num = 0;
        let den = 0;

        for (const r of rules) {
            const s = statByRule.get(r);
            const n = Number(s?.attempts ?? 0);

            if (n >= minAttemptsPerRule) rulesWithAttempts++;
            attempts += n;

            if (n > 0) {
                num += (Number(s?.accuracy ?? 0) * n);
                den += n;
            }
        }

        const lvlAcc = den > 0 ? (num / den) : 0;

        const eligible =
            attempts >= minTotalAttemptsPerLevel &&
            rulesWithAttempts >= minRulesWithAttempts &&
            lvlAcc >= minAccuracy;

        if (eligible) inferred = L;
    }

    // same overrides you use in KPI/planner (approx overall)
    const overall = averageScorePercent(answers);
    if (inferred === "A1" && overall > 40) inferred = "A2";
    if (inferred !== "B2" && overall > 85) inferred = "B2";

    return inferred;
}

function pickNextMarathonRules({ inferredLevel, statByRule, max = 7 }) {
    const level = String(inferredLevel || "A1").toUpperCase();
    const currentLevel = LEVEL_ORDER.includes(level) ? level : "A1";

    const primaryLevel = (r) => (statByRule.get(String(r))?.level || primaryLevelForRule(r) || "A1");

    const attemptsOf = (r) => Number(statByRule.get(String(r))?.attempts ?? 0) || 0;
    const accuracyOf = (r) => Number(statByRule.get(String(r))?.accuracy ?? 0) || 0;

    const hasData = (r) => attemptsOf(r) > 0;

    // "adjusted like in AccuracyKpi": shrink very low-attempt accuracy towards 70%
    const adjustedAccuracyOf = (r) => {
        const n = attemptsOf(r);
        if (!n) return null; // no data
        const a = accuracyOf(r);
        const w = Math.min(1, n / 5);
        return a * w + 70 * (1 - w);
    };

    const sortWeak = (a, b) => {
        const aa = adjustedAccuracyOf(a);
        const bb = adjustedAccuracyOf(b);

        if (aa === null && bb !== null) return 1;
        if (aa !== null && bb === null) return -1;

        if (aa !== bb) return (aa ?? 0) - (bb ?? 0);

        const na = attemptsOf(a);
        const nb = attemptsOf(b);
        if (na !== nb) return na - nb;

        return String(a).localeCompare(String(b));
    };

    const pickWeakestWithData = (ruleIds, takeN, extraFilter = null) => {
        const arr = (ruleIds || []).map(String).filter((r) => hasData(r));
        const filtered = extraFilter ? arr.filter(extraFilter) : arr;
        return [...filtered].sort(sortWeak).slice(0, Math.max(0, takeN));
    };

    const pickRandom = (ruleIds, takeN) => {
        const arr = [...(ruleIds || [])].map(String);
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.slice(0, Math.max(0, takeN));
    };

    const levelRules = (LEVEL_RULES?.[currentLevel] || []).map(String);
    const levelWithData = levelRules.filter(hasData);

    // last fallback: if no rules with data at all in this level → random rules of the level
    if (!levelWithData.length) {
        const rnd = pickRandom(levelRules, max);
        return rnd
            .slice(0, max)
            .sort((a, b) => {
                const la = levelIndex(primaryLevel(a));
                const lb = levelIndex(primaryLevel(b));
                if (la !== lb) return la - lb;

                const na = attemptsOf(a);
                const nb = attemptsOf(b);
                if (na !== nb) return na - nb;

                return String(a).localeCompare(String(b));
            });
    }

    const selected = new Set();

    const addMany = (arr) => {
        for (const r of arr || []) {
            const id = String(r);
            if (!selected.has(id)) selected.add(id);
            if (selected.size >= max) break;
        }
    };

    const lowerLevels = LEVEL_ORDER.slice(0, Math.max(0, levelIndex(currentLevel)));
    const aboveLevel = nextLevel(currentLevel);

    // 1) base: take 4 weakest rules of the level (with data)
    addMany(pickWeakestWithData(levelRules, 4));

    // 1b) If not enough weak rules of the level (base 4), take some starting from lower level first
    if (selected.size < 4) {
        for (let i = lowerLevels.length - 1; i >= 0 && selected.size < 4; i--) {
            const L = lowerLevels[i];
            const rulesL = (LEVEL_RULES?.[L] || []).map(String);
            addMany(pickWeakestWithData(rulesL, 4 - selected.size));
        }
    }

    // 2) prepend 1 weakest rule of lower levels (attempts >= 5), if any
    if (lowerLevels.length) {
        let lowerCandidates = [];
        for (let i = lowerLevels.length - 1; i >= 0; i--) {
            const L = lowerLevels[i];
            lowerCandidates = lowerCandidates.concat((LEVEL_RULES?.[L] || []).map(String));
        }
        addMany(pickWeakestWithData(lowerCandidates, 1, (r) => attemptsOf(r) >= 5));
    }

    // 3) append 2 rules of level above (only for A2 adjusted level OR if not enough attempts-data in the level)
    const shouldAddAbove = currentLevel === "A2" || levelWithData.length < max;
    if (shouldAddAbove && aboveLevel) {
        const aboveRules = (LEVEL_RULES?.[aboveLevel] || []).map(String);
        addMany(pickWeakestWithData(aboveRules, 2));
    }

    // 4) fill rest with weakest rules of the level, otherwise lower levels, then random current level
    if (selected.size < max) {
        const remainingLevel = levelRules.filter((r) => !selected.has(String(r)));
        addMany(pickWeakestWithData(remainingLevel, max - selected.size));
    }

    if (selected.size < max) {
        for (let i = lowerLevels.length - 1; i >= 0 && selected.size < max; i--) {
            const L = lowerLevels[i];
            const rulesL = (LEVEL_RULES?.[L] || []).map(String).filter((r) => !selected.has(String(r)));
            addMany(pickWeakestWithData(rulesL, max - selected.size));
        }
    }

    if (selected.size < max) {
        const remainingAny = levelRules.filter((r) => !selected.has(String(r)));
        addMany(pickRandom(remainingAny, max - selected.size));
    }

    const out = [...selected].slice(0, max);

    // final ordering: by level (low → high), then attempts (low → high)
    return out.sort((a, b) => {
        const la = levelIndex(primaryLevel(a));
        const lb = levelIndex(primaryLevel(b));
        if (la !== lb) return la - lb;

        const na = attemptsOf(a);
        const nb = attemptsOf(b);
        if (na !== nb) return na - nb;

        return String(a).localeCompare(String(b));
    });
}

// marathonsRepository.js

/**
 * Auto-start a new marathon for a paid account when the latest marathon cycle ended:
 * - accounts.status = 'paid'
 * - latest marathon status = 'completed'
 * - NOW >= (latest.created_at + 7 days)
 * - latest.created_at >= NOW - 8 days
 */
async function autoStartNextMarathonForPaidAccount(accountId, opts = {}) {
    const maxRules = Number(opts.maxRules ?? 7) || 7;

    // 1) must be paid
    const { rows: accRows } = await pool.query(
        `SELECT status FROM accounts WHERE id = $1`,
        [accountId]
    );
    const status = accRows?.[0]?.status || "free";
    if (status !== "paid") return { started: false, reason: "not_paid" };

    // 2) latest marathon must be completed
    const { rows: mRows } = await pool.query(
        `
            SELECT id, status, created_at
            FROM learning_marathons
            WHERE account_id = $1
            ORDER BY created_at DESC
            LIMIT 1
        `,
        [accountId]
    );

    const latest = mRows?.[0];
    if (!latest) return { started: false, reason: "no_marathon" };
    if (latest.status !== "completed") return { started: false, reason: "latest_not_completed" };

    const createdAt = latest.created_at instanceof Date ? latest.created_at : new Date(latest.created_at);
    const createdMs = createdAt.getTime();
    if (!Number.isFinite(createdMs)) return { started: false, reason: "bad_created_at" };

    const now = Date.now();
    const MS_DAY = 24 * 60 * 60 * 1000;
    const endMs = createdMs + 7 * MS_DAY;

    if (now < endMs) return { started: false, reason: "not_past_end" };
    if (createdMs < now - 8 * MS_DAY) return { started: false, reason: "too_old" };

    // 3) avoid duplicates
    const { rows: inProg } = await pool.query(
        `
            SELECT 1
            FROM learning_marathons
            WHERE account_id = $1 AND status = 'in_progress'
            LIMIT 1
        `,
        [accountId]
    );
    if (inProg?.length) return { started: false, reason: "already_in_progress" };

    // 4) Pull answers from Mongo and plan next rules
    const answers = await getAllAnswersForAccount(accountId);
    const statByRule = buildStatsByRule(answers);
    const inferredLevel = inferLevelFromAnswers(answers, statByRule);
    const ruleIds = pickNextMarathonRules({ inferredLevel, statByRule, max: maxRules });

    // 5) Start marathon
    const created = await startMarathon(accountId, ruleIds);
    return { started: true, marathonId: created?.id, ruleIds };
}


/**
 * Returns account IDs eligible for automatic marathon autostart.
 *
 * Eligibility:
 * - accounts.status = 'paid'
 * - latest marathon status = 'completed'
 * - latest marathon end passed: latest.created_at + 7 days <= NOW()
 * - latest marathon created less than 8 days ago: latest.created_at >= NOW() - INTERVAL '8 days'
 * - no marathon currently in_progress
 *
 * @param {number} limit - max accounts to return (default 50)
 * @returns {Promise<string[]>} account IDs
 */
async function getEligibleAccountsForMarathonAutostart(limit = 50) {
    const lim = Math.max(1, Math.min(500, Number(limit) || 50));

    const { rows } = await pool.query(
        `
            WITH latest_marathon AS (
                SELECT DISTINCT ON (lm.account_id)
                    lm.account_id,
                    lm.status,
                    lm.created_at
                FROM learning_marathons lm
                ORDER BY lm.account_id, lm.created_at DESC
            ),
                 in_progress AS (
                     SELECT DISTINCT account_id
                     FROM learning_marathons
                     WHERE status = 'in_progress'
                 )
            SELECT a.id
            FROM accounts a
                     JOIN latest_marathon lm ON lm.account_id = a.id
                     LEFT JOIN in_progress ip ON ip.account_id = a.id
            WHERE a.status = 'paid'
              AND ip.account_id IS NULL
              AND lm.status = 'completed'
              AND lm.created_at >= NOW() - INTERVAL '8 days'
              AND (lm.created_at + INTERVAL '7 days') <= NOW()
            ORDER BY lm.created_at ASC
            LIMIT $1
        `,
        [lim]
    );

    return rows.map((r) => r.id);
}

/**
 * Safely processes eligible accounts and tries to autostart a new marathon for each.
 *
 * - pulls eligible account ids (paid + latest completed + ended + created < 8 days + no in_progress)
 * - runs autoStartNextMarathonForPaidAccount() for each id
 * - does not throw on one failure (continues)
 * - supports sequential (default) to avoid spikes + DB/Mongo load
 *
 * @param {object} opts
 * @param {number} opts.limit - max eligible accounts to process (default 50)
 * @param {number} opts.maxRules - number of rules in a new marathon (default 7)
 * @returns {Promise<{processed:number, started:number, skipped:number, failed:number, results:Array}>}
 */
export async function safelyAutostartMarathonsForEligibleAccounts(opts = {}) {
    const limit = Math.max(1, Math.min(500, Number(opts.limit) || 50));
    const maxRules = Number(opts.maxRules ?? 7) || 7;

    const ids = await getEligibleAccountsForMarathonAutostart(limit);

    const results = [];
    let started = 0;
    let skipped = 0;
    let failed = 0;

    for (const accountId of ids) {
        try {
            const res = await autoStartNextMarathonForPaidAccount(accountId, { maxRules });

            if (res?.started) started++;
            else skipped++;

            results.push({
                accountId,
                ok: true,
                ...res,
            });
        } catch (err) {
            failed++;
            results.push({
                accountId,
                ok: false,
                reason: "exception",
                error: String(err?.message || err),
            });
        }
    }

    return {
        processed: ids.length,
        started,
        skipped,
        failed,
        results,
    };
}

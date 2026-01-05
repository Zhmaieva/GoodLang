import { LEVEL_RULES, RULE_LABELS } from "../utils/rules";
import {callDataSyncApi} from "./api.js";
import {emit} from "./events.js";

const STORAGE_KEY = "answers_data";
const STORAGE_KEY_SEED = "samples_seed";
const STORAGE_KEY_SKIP = "samples_skip";
const STORAGE_KEY_LAST_SYNC = "answers_lastSync";
const STORAGE_KEY_SEED_UPDATED = "seed_updatedAt";
const STORAGE_KEY_DEVICE_ID = "device_id";
const STORAGE_KEY_PAYMENT_INTENT_ENABLED = "payment_intent_enabled";

const CHUNK_SIZE = 100;

export function setPaymentIntent(value) {
    localStorage.setItem(STORAGE_KEY_PAYMENT_INTENT_ENABLED, value);
}

export function getPaymentIntent() {
    const value = localStorage.getItem(STORAGE_KEY_PAYMENT_INTENT_ENABLED);
    return value === "true";
}

function chunkArray(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

function mergeAnswersById(localAll, serverAnswers, serverTime) {
    const map = new Map();

    for (const a of localAll) {
        if (a?.id) map.set(a.id, a);
    }

    for (const a of serverAnswers || []) {
        if (!a?.id) continue;

        map.set(a.id, {
            id: a.id,
            rule: a.rule,
            score: a.score,
            level: a.level ?? null,
            date: a.date,
            deviceId: a.deviceId ?? null,
            _serverUpdatedAt: serverTime ?? null,
        });
    }

    return [...map.values()].sort((x, y) => new Date(x.date) - new Date(y.date));
}

export async function syncWithServer() {
    let lastServerSync =
        localStorage.getItem(STORAGE_KEY_LAST_SYNC) || "1970-01-01T00:00:00.000Z";

    const all = getAnswers();

    // Send only local answers that server hasn't seen yet
    const recentLocal = all.filter(a => !a._serverUpdatedAt);

    const seedLocal = {
        seed: Number(localStorage.getItem(STORAGE_KEY_SEED)) || 0,
        skip: Number(localStorage.getItem(STORAGE_KEY_SKIP)) || 0,
        updatedAt: localStorage.getItem(STORAGE_KEY_SEED_UPDATED) || null,
    };

    const chunks = chunkArray(recentLocal, CHUNK_SIZE);

    let mergedAll = all;

    // If there are no answers to send, still do a "pull" once (optional but recommended)
    if (chunks.length === 0) {
        const payload = {
            since: lastServerSync,
            deviceId: getDeviceId(),
            answers: [],
            seedState: seedLocal,
        };

        const server = await callDataSyncApi(payload);
        if (!server?.isSuccess) return;

        mergedAll = mergeAnswersById(mergedAll, server.answers, server.serverTime);
        saveAnswers(mergedAll);

        // seed merge (same logic you had)
        if (server.seedState?.updatedAt) {
            const serverUpdated = new Date(server.seedState.updatedAt);
            const localUpdated = localStorage.getItem(STORAGE_KEY_SEED_UPDATED)
                ? new Date(localStorage.getItem(STORAGE_KEY_SEED_UPDATED))
                : null;

            if (!localUpdated || serverUpdated > localUpdated) {
                saveSeed({ seed: server.seedState.seed, skip: server.seedState.skip }, true);
                localStorage.setItem(STORAGE_KEY_SEED_UPDATED, server.seedState.updatedAt);
            }
        }

        if (server.serverTime) {
            localStorage.setItem(STORAGE_KEY_LAST_SYNC, server.serverTime);
        }

        return;
    }

    // Send chunks sequentially
    for (const answersChunk of chunks) {
        const payload = {
            since: lastServerSync,
            deviceId: getDeviceId(),
            answers: answersChunk,
            seedState: seedLocal,
        };

        const server = await callDataSyncApi(payload);
        if (!server?.isSuccess) return;

        // merge and persist after each chunk
        mergedAll = mergeAnswersById(mergedAll, server.answers, server.serverTime);
        saveAnswers(mergedAll);

        // update lastServerSync as we go (authoritative)
        if (server.serverTime) {
            lastServerSync = server.serverTime;
            localStorage.setItem(STORAGE_KEY_LAST_SYNC, server.serverTime);
        }

        // seed merge (same logic; safe to run each time)
        if (server.seedState?.updatedAt) {
            const serverUpdated = new Date(server.seedState.updatedAt);
            const localUpdated = localStorage.getItem(STORAGE_KEY_SEED_UPDATED)
                ? new Date(localStorage.getItem(STORAGE_KEY_SEED_UPDATED))
                : null;

            if (!localUpdated || serverUpdated > localUpdated) {
                saveSeed({ seed: server.seedState.seed, skip: server.seedState.skip }, true);
                localStorage.setItem(STORAGE_KEY_SEED_UPDATED, server.seedState.updatedAt);
            }
        }
    }

    emit("weeklyProgressUpdate");
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getDeviceId() {
    let id = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
    if (!id) {
        id = uuidv4();
        localStorage.setItem(STORAGE_KEY_DEVICE_ID, id);
    }
    return id;
}

export function saveAnswers(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveSeed({seed, skip}, keepTimestamp = false) {
    localStorage.setItem(STORAGE_KEY_SEED, seed);
    localStorage.setItem(STORAGE_KEY_SKIP, skip);

    if (!keepTimestamp) {
        const updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY_SEED_UPDATED, updatedAt);
    }
}


export function getSeed() {
    let seed = localStorage.getItem(STORAGE_KEY_SEED);
    let skip = localStorage.getItem(STORAGE_KEY_SKIP);

    if (seed == null) {
        // deterministic seed per device
        seed = Math.floor(Math.random() * 1000000);
        localStorage.setItem(STORAGE_KEY_SEED, seed);
        localStorage.setItem(STORAGE_KEY_SEED_UPDATED, new Date().toISOString());
    }

    if (skip == null) skip = 0;

    return { seed: Number(seed), skip: Number(skip) };
}


export function addAnswer(scores, rules, level) {
    const deviceId = getDeviceId();
    const now = new Date().toISOString();

    const data = [...getAnswers()];

    for (let i = 0; i < rules.length; i++) {
        const answer = {
            id: uuidv4(),    // stable unique id for this answer
            rule: rules[i],
            score: Number(scores[i]) * 100,
            level: level ?? null,
            date: now,                  // original creation time
            deviceId,
        };
        data.push(answer);
    }

    saveAnswers(data);
}

// --- Cached loader mirroring your pattern ---
export function getAnswers() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return JSON.parse(data) ?? [];
    } catch (error) {
        return []
    }
}

// --- Helpers ---
function toPercent(score) {
    return typeof score === "number" ? score : 0;
}

export function averageAccuracyPercent(items) {
    if (!items.length) return 0;

    const now = Date.now();

    // thresholds
    const MS2W  = 14 * 24 * 60 * 60 * 1000;
    const MS1M  = 30 * 24 * 60 * 60 * 1000;
    const MS3M  = 90 * 24 * 60 * 60 * 1000;

    let weightedSum = 0;
    let weightTotal = 0;

    for (const x of items) {
        if (!x?.date) continue;

        const age = now - new Date(x.date).getTime();
        const score = toPercent(x.score);

        let w = 1; // default

        if (age > MS3M) w = 0.1;
        else if (age > MS1M) w = 0.25;
        else if (age > MS2W) w = 0.5;
        else w = 1;

        weightedSum += score * w;
        weightTotal += w;
    }

    if (weightTotal === 0) return 0;

    const avg = weightedSum / weightTotal;

    return Math.round(avg * 100) / 100;
}

function latestDateISO(items) {
    if (!items.length) return null;
    const ts = items
        .map((x) => (x?.date ? new Date(x.date).getTime() : NaN))
        .filter((n) => Number.isFinite(n));
    if (!ts.length) return null;
    return new Date(Math.max(...ts)).toISOString();
}

export function statusFor(accuracy, attempts) {
    if (attempts === 0)
        return "not defined";
    // needs practice: (<5 attempts AND accuracy < 75) OR accuracy < 30
    if (accuracy < 50) return "needs practice";
    // learned: accuracy > 80 AND attempts > 5
    if (accuracy > 75) return "learned";
    return "in progress";
}

// --- API ---
// Utility: flatten all rules from LEVEL_RULES into a Set
function allRulesFromLevels(LEVEL_RULES) {
    const s = new Set();
    Object.values(LEVEL_RULES || {}).forEach(arr => (arr || []).forEach(r => s.add(r)));
    return s;
}

// Utility: which levels contain this rule (could be multiple)
function levelsForRule(rule, LEVEL_RULES) {
    return Object.entries(LEVEL_RULES || {}).reduce((acc, [lvl, rules]) => {
        if ((rules || []).includes(rule)) acc.push(lvl);
        return acc;
    }, []);
}

/**
 * Get statistics for all known rules.
 * @param {string|null} levelOpt - (optional) limit to a specific level; pass null/undefined to get ALL rules across levels.
 */
export function getAllStatistics() {
    const allAnswers = getAnswers(); // [{ rule, isCorrect, date, ... }]

    // 1️⃣ Canonical rule set (single source of truth)
    const KNOWN_RULES = new Set(allRulesFromLevels(LEVEL_RULES));

    // 2️⃣ Filter answers to known rules only
    const validAnswers = allAnswers.filter(
        a => a && a.rule && KNOWN_RULES.has(a.rule)
    );

    // 3️⃣ Final list of rules to report on
    const ruleIds = [...KNOWN_RULES];

    const attemptsForRule = (ruleId) =>
        validAnswers.filter(a => a.rule === ruleId);

    const primaryLevelFor = (ruleId) => {
        const lvls = levelsForRule(ruleId, LEVEL_RULES);
        return lvls[0] || null;
    };

    const now = Date.now();
    const MS7 = 7 * 24 * 60 * 60 * 1000;

    const attemptsLast7DaysForRule = (ruleId) =>
        validAnswers.filter(a =>
            a.rule === ruleId &&
            a.date &&
            now - new Date(a.date).getTime() <= MS7
        );

    return ruleIds
        .map((ruleId) => {
            const attempts = attemptsForRule(ruleId);
            const attemptsNumber = attempts.length;
            const accuracy = averageAccuracyPercent(attempts);
            const lastAttemptDate = latestDateISO(attempts);

            const primaryLevel = primaryLevelFor(ruleId);

            return {
                rule: ruleId,
                ruleName: RULE_LABELS?.[ruleId] ?? ruleId,
                level: primaryLevel,
                levelName: primaryLevel ?? "—",
                accuracy,
                attemptsNumber,
                lastAttemptDate,
                attemptsLast7Days: attemptsLast7DaysForRule(ruleId),
                status: statusFor(accuracy, attemptsNumber),
            };
        })
        .sort((a, b) =>
            String(a.ruleName).localeCompare(String(b.ruleName))
        );
}



export function getOverallAccuracy() {
    const answers = getAnswers();

    const uniqueAttempts = new Set(
        answers
            .map(a => a.date) // or a.timestamp — adjust field name if needed
            .filter(Boolean)
    );

    const total = uniqueAttempts.size;
    const required = 10;

    if (total < required) {
        return {
            attemptsLeft: Math.max(0, required - total),
            accuracy: 0
        };
    }

    const inf = inferUserLevel(); // { level, levels }
    const curLvl = String(inf?.level ?? "a1").toLowerCase();

    const accOf = (lvl, withCoverage = false) => {
        const want = String(lvl).toLowerCase();
        const hit = (inf?.levels ?? []).find(
            x => String(x?.level ?? "").toLowerCase() === want
        );
        return Number.isFinite(hit?.accuracy) ? hit.accuracy * (withCoverage ? hit.coverage : 1) : 0; // 0..100
    };

    const levelAcc = accOf(curLvl); // 0..100

    const BANDS = {
        a1: { low: 0, cap: 30 },
        a2: { low: 30, cap: 55 },
        b1: { low: 55, cap: 80 },
        b2: { low: 80, cap: 100 },
    };

    const band = BANDS[curLvl] ?? BANDS.a1;
    const bandWidth = band.cap - band.low;

    // (4) lower border
    let bandAcc = band.low;

    // ✅ (5) within-band contribution uses ONLY 75% of band width
    const effectiveWidth = bandWidth * 0.75;

    bandAcc += clamp01(levelAcc / 100) * effectiveWidth;

    // (6) pull from higher levels
    const ABOVE = {
        a1: ["b2", "b1", "a2"],
        a2: ["b2", "b1"],
        b1: ["b2"],
        b2: [],
    };

    for (const lvlAbove of ABOVE[curLvl] ?? []) {
        const band = BANDS[lvlAbove];
        const bandWidth = band.cap - band.low;
        const effectiveWidth = bandWidth * 0.75;

        const acc = accOf(lvlAbove, true);
        bandAcc += clamp01(acc / 100) * effectiveWidth;
    }

    // (3) enforce band limits
    bandAcc = Math.min(bandAcc, 100);

    bandAcc = Math.max(band.low, bandAcc);

    return {
        attemptsLeft: 0,
        accuracy: Math.round(bandAcc * 100) / 100,
    };
}

// Count of all answers
export function getAllAnswersCount() {
    return getAnswers().length;
}

// Count of learned rules (all levels combined)
export function getLearnedRulesCount() {
    const all = getAnswers();

    // All known rules from LEVEL_RULES
    const allRules = Object.values(LEVEL_RULES).flat();

    // Group attempts by rule (ignore level)
    const byRule = new Map();
    for (const a of all) {
        if (!byRule.has(a.rule)) byRule.set(a.rule, []);
        byRule.get(a.rule).push(a);
    }

    let learned = 0;
    for (const rule of allRules) {
        const attempts = byRule.get(rule) || [];
        const acc = averageAccuracyPercent(attempts);
        const n = attempts.length;
        if (statusFor(acc, n) === "learned") learned++;
    }
    return learned;
}

/**
 * Infer user's level from stored answers, collapsing CEFR bands (A1..B2)
 * into GoodLang levels (beginner/intermediate/advanced).
 *
 * Options you can tweak:
 * - levelBands: mapping GoodLang -> CEFR bands
 * - thresholds & weights (same as before)
 */
export function inferUserLevel() {
    const {
        // Map GoodLang levels → CEFR bands
        levelBands = {
            beginner: ["A1"],
            intermediate: ["A2", "B1"],
            advanced: ["B2"],
        },

        // Minimum total attempts required to "trust" a level
        minTotalAttemptsPerLevel = 5,
        // A rule counts toward coverage if it has at least this many attempts
        minAttemptsPerRule = 1,
        // Need at least this many covered rules in a level
        minRulesWithAttempts = 5,
        // Minimum overall accuracy (percent) in the level to consider it "proficient"
        minAccuracy = 70,

        // Composite scoring weights (tune as you like)
        weights = {
            accuracy: 0.5,     // accuracy in the level (0..100 → normalized)
            coverage: 0.25,    // fraction of rules with >= minAttemptsPerRule
            learned: 0.2,      // share of rules with status "learned"
            volumeBonus: 0.05, // bonus for more attempts (log-scaled)
        },
    } = {};

    const stepLevels = Object.keys(LEVEL_RULES || {}); // e.g. ["beginner","intermediate","advanced"]
    if (!stepLevels.length) {
        return { level: null, decidedBy: "noData", confidence: 0, levels: [] };
    }

    // Build a CEFR → GoodLang lookup (e.g. "A2" -> "intermediate")
    const cefrToStep = {};
    for (const [step, bands] of Object.entries(levelBands || {})) {
        (bands || []).forEach((b) => { cefrToStep[b] = step; });
    }

    const answers = getAnswers(); // [{score, rule, level, date}, ...]
    if (!answers.length) {
        return {
            level: "a1",
            decidedBy: "noData",
            confidence: 0,
            levels: stepLevels.map((l) => ({
                level: l,
                attempts: 0,
                accuracy: 0,
                rulesWithMinAttempts: 0,
                coverage: 0,
                learnedShare: 0,
                score: 0,
                eligible: false,
            })),
        };
    }

    // Helper: map rule -> levels it belongs to (if some answers miss level)
    const ruleToLevels = new Map();
    for (const [lvl, rules] of Object.entries(LEVEL_RULES || {})) {
        (rules || []).forEach((r) => {
            if (!ruleToLevels.has(r)) ruleToLevels.set(r, []);
            ruleToLevels.get(r).push(lvl);
        });
    }

    // Group answers by GoodLang level:
    // 1) If answer.level is already a GoodLang level → use it
    // 2) Else if answer.level is CEFR → collapse via cefrToStep
    // 3) Else infer by rule → credit to all step levels that contain that rule
    const byLevel = new Map(stepLevels.map((l) => [l, []]));
    for (const a of answers) {
        const raw = a?.level;
        let targetLevel = null;

        if (raw && byLevel.has(raw)) {
            // already a GoodLang level
            targetLevel = raw;
            byLevel.get(targetLevel).push(a);
            continue;
        }

        if (raw && cefrToStep[raw]) {
            // CEFR provided, collapse to GoodLang
            targetLevel = cefrToStep[raw];
            if (byLevel.has(targetLevel)) byLevel.get(targetLevel).push(a);
            continue;
        }

        // No reliable level field; infer by rule membership
        if (a?.rule && ruleToLevels.has(a.rule)) {
            for (const l of ruleToLevels.get(a.rule)) {
                if (byLevel.has(l)) byLevel.get(l).push(a);
            }
        }
    }

// Compute per-level stats (same logic as before)
    const levelStats = (() => {
        // how much previous level affects NEXT level
        const wAcc = weights.prevToNextAccuracy ?? 0.2; // 0..1 (blends accuracy)
        const wScore = weights.prevToNextScore ?? 0.15; // nudges score
        const wEligAcc = weights.prevToNextEligibilityAccuracy ?? wAcc; // usually same as wAcc

        // 1) compute raw stats per level
        const raw = stepLevels.map((lvl) => {
            const lvlAnswers = byLevel.get(lvl) || [];
            const rulesInLevel = LEVEL_RULES[lvl] || [];

            // Per-rule grouping (within this level)
            const byRule = new Map();
            for (const a of lvlAnswers) {
                const r = a.rule;
                if (!r || !rulesInLevel.includes(r)) continue; // only rules that belong to this level
                if (!byRule.has(r)) byRule.set(r, []);
                byRule.get(r).push(a);
            }

            // Coverage: rules that meet minAttemptsPerRule & learned count
            let rulesWithMinAttempts = 0;
            let learnedCount = 0;

            for (const r of rulesInLevel) {
                const attempts = byRule.get(r) || [];
                if (attempts.length >= minAttemptsPerRule) rulesWithMinAttempts++;
                const accR = averageAccuracyPercent(attempts);
                const statusR = statusFor(accR, attempts.length);
                if (statusR === "learned") learnedCount++;
            }

            const attempts = lvlAnswers.length;
            const accuracy = averageAccuracyPercent(lvlAnswers);
            const coverage = rulesInLevel.length ? (rulesWithMinAttempts / rulesInLevel.length) : 0;
            const learnedShare = rulesInLevel.length ? (learnedCount / rulesInLevel.length) : 0;

            // Volume bonus: gentle log boost
            const volume = Math.log10(Math.max(1, attempts)) / 2; // ~0..1
            const acc01 = Math.max(0, Math.min(1, accuracy / 100));

            const score =
                weights.accuracy * acc01 +
                weights.coverage * coverage +
                weights.learned * learnedShare +
                weights.volumeBonus * volume;

            const eligible =
                attempts >= minTotalAttemptsPerLevel &&
                rulesWithMinAttempts >= minRulesWithAttempts &&
                accuracy >= minAccuracy;

            return { level: lvl, attempts, accuracy, rulesWithMinAttempts, coverage, learnedShare, score, eligible };
        });

        // 2) influence NEXT level using previous level's accuracy
        for (let i = 1; i < raw.length; i++) {
            const prev = raw[i - 1];
            const cur = raw[i];

            const prevAcc = Number.isFinite(prev.accuracy) ? prev.accuracy : 0;
            const prevAcc01 = clamp01(prevAcc / 100);

            // penaltyStrength: 0..1 (0 = no penalty, 1 = max penalty)
            // Only active when prevAcc01 < 0.75
            const penaltyStrength = clamp01((0.75 - prevAcc01) / 0.75);

            // (a) accuracy: only pull DOWN (never raise)
            const curAcc0 = cur.accuracy ?? 0;
            const blendedAcc = (1 - wAcc) * curAcc0 + wAcc * prevAcc;

            // apply only if it would decrease accuracy
            cur.accuracy = Math.max(
                0,
                Math.min(100, Math.min(curAcc0, blendedAcc))
            );

            // (b) score: only punish (never boost)
            // previous formula: + wScore * (prevAcc01 - 0.75)
            // punishment-only version:
            cur.score = clamp01((cur.score ?? 0) - wScore * penaltyStrength);

            // (c) eligibility: use influenced accuracy, but also penalty-only
            const eligBlended = (1 - wEligAcc) * curAcc0 + wEligAcc * prevAcc;
            const eligAcc = Math.max(0, Math.min(100, Math.min(curAcc0, eligBlended)));

            cur.eligible =
                cur.attempts >= minTotalAttemptsPerLevel &&
                cur.rulesWithMinAttempts >= minRulesWithAttempts &&
                eligAcc >= minAccuracy;
        }


        return raw;
    })();


    // Prefer best eligible (ties → harder level wins)
    const eligible = levelStats.filter((s) => s.eligible);
    if (eligible.length) {
        eligible.sort(
            (a, b) => (stepLevels.indexOf(b.level) - stepLevels.indexOf(a.level) || (b.score - a.score))
        );
        const best = eligible[0];
        return {
            level: best.level,
            decidedBy: "eligibility",
            confidence: clamp01(best.score),
            levels: levelStats,
        };
    }

    // Otherwise best overall (soft fallback)
    const bestOverall = [...levelStats].sort(
        (a, b) => (b.accuracy * b.score - a.accuracy * a.score) || (stepLevels.indexOf(b.level) - stepLevels.indexOf(a.level))
    ).filter(x => x.accuracy >= 75).find(_=>true);

    return {
        level: bestOverall?.level ?? "a1",
        decidedBy: answers.length ? "bestScore" : "noData",
        confidence: clamp01(bestOverall?.score ?? 0),
        levels: levelStats,
    };
}

// Small util
function clamp01(x) {
    return Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0));
}


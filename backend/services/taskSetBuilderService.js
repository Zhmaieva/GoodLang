// services/taskSetBuilderService.js — FULL DROP-IN
//
// Implements:
// 1) buildRecommendedQuotasForStudents({ studentIds, seed, numberOfTasksPerStudent })
//    -> returns per-student structured quotas based on analytics priorities
//
// 2) buildTaskSetTasks(...)
//    - Non-recommended: uses taskMode + ruleIds (caps by available samples, never throws for shortage)
//    - Recommended: does NOT require level/studentIds/seed/taskMode anymore.
//      Accepts recommendedPlan (the structured quotas object),
//      generates tasks per student using per-student seed,
//      mixed mode with 2:1 translations:gaps per rule,
//      never picks more than available samples for a rule.

import { shuffleBySeed } from "../core/сore.js";
import { ALL_RULES_SAMPLES } from "../core/allRulesSamples.js";
import { ALL_GAPS_SAMPLES } from "../core/allGapsSamples.js";
import { GrammarRule } from "../core/rules.js";
import { getRuleStatsForStudent } from "../database/repositories/schoolTaskRepository.js";

// -----------------------------
// Helpers
// -----------------------------
function clampInt(n, min, max, fallback) {
    const x = Number.parseInt(String(n ?? ""), 10);
    if (!Number.isFinite(x)) return fallback;
    return Math.max(min, Math.min(max, x));
}

function uniq(arr) {
    return [...new Set((arr || []).filter(Boolean).map((x) => String(x)))];
}

function hashSalt(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h % 10000;
}

function seededShuffle(arr, seed, salt) {
    const s = Number(seed ?? 1) + hashSalt(String(salt));
    return shuffleBySeed(arr, s);
}

function ruleKey(ruleId) {
    return GrammarRule?.[String(ruleId)] ?? String(ruleId);
}

function normalizeMode(taskMode) {
    const m = String(taskMode ?? "translations").toLowerCase();
    if (m === "translations" || m === "gaps" || m === "mixed") return m;
    return "translations";
}

function getRuleSamplesTranslations(ruleId) {
    const k = ruleKey(ruleId);
    const samples = ALL_RULES_SAMPLES?.[k] ?? ALL_RULES_SAMPLES?.[ruleId] ?? [];
    return Array.isArray(samples) ? samples : [];
}

function getRuleSamplesGaps(ruleId) {
    const k = ruleKey(ruleId);
    const samples = ALL_GAPS_SAMPLES?.[k] ?? ALL_GAPS_SAMPLES?.[ruleId] ?? [];
    return Array.isArray(samples) ? samples : [];
}

function normalizeTranslationSample(ruleId, sample) {
    const text = sample?.ua ?? sample?.["ua"] ?? sample?.en ?? sample?.["en"];
    if (!text) return null;

    return {
        taskType: "translation",
        ruleIds: Array.isArray(sample.rules) ? sample.rules : [String(ruleId)],
        textToTranslate: String(text),
        options: null,
        correctAnswer: null,
        tipIfWrong: null,
    };
}

function normalizeGapSample(ruleId, sample) {
    const en = sample?.en ?? sample?.["en"];
    if (!en) return null;

    const options = Array.isArray(sample.options) ? sample.options : null;
    if (!options || options.length < 2) return null;

    return {
        taskType: "gap",
        ruleIds: Array.isArray(sample.rules) ? sample.rules : [String(ruleId)],
        textToTranslate: String(en),
        options,
        correctAnswer: sample.correct ?? sample.answer ?? null,
        tipIfWrong: null,
    };
}

function finalShuffleTasks(tasks, seed) {
    const shuffled = shuffleBySeed(tasks, Number(seed ?? 1));
    return shuffled.map((t, idx) => ({
        ...t,
        taskOrderNumber: idx + 1,
    }));
}

// -----------------------------
// Non-recommended pool builders
// (used when ruleIds provided)
// -----------------------------
function buildPoolTranslationsFromRules({ rulesOrdered, seed }) {
    const pool = [];

    for (const r of rulesOrdered) {
        const samples = getRuleSamplesTranslations(r);
        if (!samples.length) continue;

        const shuffled = seededShuffle(samples, seed, `tr:${r}`);
        for (const s of shuffled) {
            const item = normalizeTranslationSample(r, s);
            if (item) pool.push(item);
        }
    }

    return pool;
}

function buildPoolGapsFromRules({ rulesOrdered, seed }) {
    const pool = [];

    for (const r of rulesOrdered) {
        const samples = getRuleSamplesGaps(r);
        if (!samples.length) continue;

        const shuffled = seededShuffle(samples, seed, `gap:${r}`);
        for (const s of shuffled) {
            const item = normalizeGapSample(r, s);
            if (item) pool.push(item);
        }
    }

    return pool;
}

function takeNFromPool(pool, n, seed, salt) {
    if (!Array.isArray(pool) || pool.length === 0) return [];
    const shuffled = seededShuffle(pool, seed, salt);
    return shuffled.slice(0, n);
}

// ============================================================
// RECOMMENDED QUOTAS (PREVIEW) — EXACT PRIORITIES
// ============================================================

/**
 * buildRecommendedQuotasForStudents
 *
 * Inputs:
 * - studentIds
 * - seed
 * - numberOfTasksPerStudent
 *
 * Output:
 * {
 *   items: [
 *     {
 *       studentId,
 *       seed,
 *       numberOfTasks,
 *       quotas: [
 *         { source, rules:[...], count }
 *       ]
 *     }
 *   ]
 * }
 *
 * PRIORITIES (your spec):
 * 1) 50% of tasks (or 1) => random from top4 weak rules
 * 2) 10% (or 1) => rule with no practice at all
 * 3) 10% (or 1) => rule with no practice during last 30 days
 * 4) 20% (or 1) => rules accuracy < 70 ordered bottom->top (lowest first)
 * 5) 10% (or 1) => rules accuracy >= 70
 * 6) remainder => top10 lowest accuracy
 */
export async function buildRecommendedQuotasForStudents({
                                                            studentIds,
                                                            seed,
                                                            numberOfTasksPerStudent,
                                                        }) {
    const n = clampInt(numberOfTasksPerStudent, 1, 50, 10);
    const ids = Array.isArray(studentIds) ? studentIds : [];
    const result = [];

    // deterministic helper:
    // "percent or 1" means floor(n*percent/100) but min 1.
    const alloc = (percent) => Math.max(1, Math.floor((n * percent) / 100));

    for (const studentId of ids) {
        const stats = await getRuleStatsForStudent(studentId);
        // expected:
        // {
        //   weakTop4,
        //   neverPracticed,
        //   notPracticed30d,
        //   lowAccuracy,          // already lowest->highest
        //   highAccuracy,
        //   lowestAccuracyTop10
        // }

        const quotas = [];
        let remaining = n;

        // 1) 50% (or 1)
        const q1 = Math.min(alloc(50), remaining);
        quotas.push({
            source: "weak_top_4",
            rules: seededShuffle(uniq(stats.weakTop4), seed, `weak4:${studentId}`),
            count: q1,
        });
        remaining -= q1;

        // 2) 10% (or 1)
        if (remaining > 0) {
            const q2 = Math.min(alloc(10), remaining);
            quotas.push({
                source: "never_practiced",
                rules: seededShuffle(uniq(stats.neverPracticed), seed, `never:${studentId}`),
                count: q2,
            });
            remaining -= q2;
        }

        // 3) 10% (or 1)
        if (remaining > 0) {
            const q3 = Math.min(alloc(10), remaining);
            quotas.push({
                source: "not_practiced_30d",
                rules: seededShuffle(uniq(stats.notPracticed30d), seed, `np30:${studentId}`),
                count: q3,
            });
            remaining -= q3;
        }

        // 4) 20% (or 1) — bottom to top (already lowest-first)
        if (remaining > 0) {
            const q4 = Math.min(alloc(20), remaining);
            quotas.push({
                source: "low_accuracy",
                rules: uniq(stats.lowAccuracy), // keep order low->high
                count: q4,
            });
            remaining -= q4;
        }

        // 5) 10% (or 1)
        if (remaining > 0) {
            const q5 = Math.min(alloc(10), remaining);
            quotas.push({
                source: "high_accuracy",
                rules: seededShuffle(uniq(stats.highAccuracy), seed, `hi:${studentId}`),
                count: q5,
            });
            remaining -= q5;
        }

        // 6) remainder
        if (remaining > 0) {
            quotas.push({
                source: "fallback_lowest_accuracy",
                rules: uniq(stats.lowestAccuracyTop10),
                count: remaining,
            });
            remaining = 0;
        }

        result.push({
            studentId,
            seed,
            numberOfTasks: n,
            quotas,
        });
    }

    return { items: result };
}

// ============================================================
// RECOMMENDED TASK BUILDER (uses quotas, no level needed)
// ============================================================

function expandRulesByQuotas({ quotas, seed, salt }) {
    // quotas: [{ rules:[], count }]
    // produce a list of ruleIds of length <= sum(count),
    // by sampling from each quota bucket (with replacement if needed, but de-dupe within same pick pass).
    const out = [];

    for (const q of quotas || []) {
        const rules = Array.isArray(q?.rules) ? uniq(q.rules) : [];
        const count = clampInt(q?.count, 0, 50, 0);
        if (!count || !rules.length) continue;

        // deterministic shuffle for this bucket
        const shuffled = seededShuffle(rules, seed, `${salt}:${q.source || "bucket"}`);

        // If bucket has fewer rules than count, we cycle (still deterministic)
        for (let i = 0; i < count; i++) {
            out.push(shuffled[i % shuffled.length]);
        }
    }

    return out;
}

function buildRecommendedTasksForStudent({ ruleList, numberOfTasks, seed }) {
    // Always "mixed" with 2:1 translations:gaps CHANCE per chosen task.
    // Never exceed available samples for a rule.
    // We treat translation samples and gap samples as separate pools per rule and consume them.
    const n = clampInt(numberOfTasks, 1, 50, 10);
    const rules = Array.isArray(ruleList) ? ruleList.map(String) : [];

    // Build per-rule shuffled pools
    const trPools = new Map(); // rule -> [taskItem...]
    const gapPools = new Map();

    const ensurePools = (rule) => {
        if (!trPools.has(rule)) {
            const tr = seededShuffle(getRuleSamplesTranslations(rule), seed, `rec:tr:${rule}`)
                .map((s) => normalizeTranslationSample(rule, s))
                .filter(Boolean);
            trPools.set(rule, tr);
        }
        if (!gapPools.has(rule)) {
            const gp = seededShuffle(getRuleSamplesGaps(rule), seed, `rec:gap:${rule}`)
                .map((s) => normalizeGapSample(rule, s))
                .filter(Boolean);
            gapPools.set(rule, gp);
        }
    };

    const tasks = [];

    // Deterministic task type random: use a seeded shuffle stream
    // 2:1 means ~66% translation, ~33% gap.
    const typeStream = seededShuffle(
        Array.from({ length: n }, (_, i) => i),
        seed,
        "rec:typeStream"
    );

    // Consume rules in order but allow skipping if pools empty
    let ruleIdx = 0;
    let guard = 0;

    while (tasks.length < n && guard < n * 20) {
        guard++;

        const rule = rules[ruleIdx % Math.max(1, rules.length)];
        ruleIdx++;

        if (!rule) break;

        ensurePools(rule);

        const tr = trPools.get(rule) || [];
        const gp = gapPools.get(rule) || [];

        // choose type based on deterministic stream index
        const k = typeStream[tasks.length] ?? tasks.length;
        const wantTranslation = (k % 3) !== 0; // 2 out of 3 -> translation

        let picked = null;

        if (wantTranslation) {
            // pick translation if available, else gap if available
            picked = tr.shift() || gp.shift() || null;
        } else {
            picked = gp.shift() || tr.shift() || null;
        }

        // If nothing left for this rule, skip it; continue (we never exceed available samples)
        if (!picked) continue;

        tasks.push(picked);
    }

    // Final shuffle (still deterministic) and order numbers
    return finalShuffleTasks(tasks, seed);
}

// ============================================================
// MAIN TASK SET BUILDER
// ============================================================

/**
 * buildTaskSetTasks
 *
 * NON-RECOMMENDED:
 * - requires ruleIds
 * - uses taskMode ("translations" | "gaps" | "mixed")
 * - seed required for determinism
 * - caps to available samples, never throws for shortage
 *
 * RECOMMENDED:
 * - recommended=true
 * - accepts recommendedPlan (from buildRecommendedQuotasForStudents endpoint)
 * - does NOT require level/studentIds/seed/taskMode
 * - returns per-student tasks: { items: [{ studentId, tasks: [...] }] }
 */
export async function buildTaskSetTasks({
                                            // non-recommended inputs
                                            taskMode,
                                            ruleIds,
                                            numberOfTasks,
                                            seed,

                                            // recommended mode inputs
                                            recommended,
                                            recommendedPlan, // { items: [{ studentId, seed, numberOfTasks, quotas:[...] }] }
                                        }) {
    const n = clampInt(numberOfTasks, 1, 50, 10);
    const mode = normalizeMode(taskMode);

    // -----------------------------
    // Recommended mode (NEW)
    // -----------------------------
    if (recommended) {
        const items = Array.isArray(recommendedPlan?.items) ? recommendedPlan.items : [];

        if (!items.length) {
            throw new Error("recommended=true requires recommendedPlan.items (from recommended-preview endpoint).");
        }

        // Output per student
        const out = [];

        for (const it of items) {
            const studentId = String(it?.studentId || "").trim();
            if (!studentId) continue;

            const studentSeed = Number(it?.seed ?? 1);
            const studentTasksCount = clampInt(it?.numberOfTasks ?? n, 1, 50, n);

            // Expand quota buckets into concrete rule list (deterministic per student)
            const expandedRules = expandRulesByQuotas({
                quotas: it?.quotas,
                seed: studentSeed,
                salt: `student:${studentId}`,
            });

            // If quotas returned nothing (rare), fallback to lowestAccuracyTop10 rules list by asking stats
            let rulesForBuild = expandedRules;
            if (!rulesForBuild.length) {
                const stats = await getRuleStatsForStudent(studentId);
                rulesForBuild = uniq(stats.lowestAccuracyTop10);
            }

            // Build tasks (mixed 2:1, capped by samples)
            const tasks = buildRecommendedTasksForStudent({
                ruleList: rulesForBuild,
                numberOfTasks: studentTasksCount,
                seed: studentSeed,
            });

            out.push({
                studentId,
                tasks,
            });
        }

        return { items: out };
    }

    // -----------------------------
    // Non-recommended mode (old behavior but capped, no throwing)
    // -----------------------------
    const rules = Array.isArray(ruleIds) ? uniq(ruleIds) : [];
    if (!rules.length) {
        throw new Error("Non-recommended mode requires ruleIds.");
    }

    const rulesOrdered = seededShuffle(rules, seed, "explicitRules");

    const translationsPool = buildPoolTranslationsFromRules({ rulesOrdered, seed });
    const gapsPool = buildPoolGapsFromRules({ rulesOrdered, seed });

    let tasks = [];

    if (mode === "translations") {
        tasks = takeNFromPool(translationsPool, n, seed, "take:translations");
    } else if (mode === "gaps") {
        tasks = takeNFromPool(gapsPool, n, seed, "take:gaps");
    } else {
        // mixed
        const wantTr = Math.floor(n / 2);
        const wantGap = n - wantTr;

        const t1 = takeNFromPool(translationsPool, wantTr, seed, "take:mixed:tr");
        const t2 = takeNFromPool(gapsPool, wantGap, seed, "take:mixed:gap");

        tasks = seededShuffle([...t1, ...t2], seed, "take:mixed:final");
    }

    // IMPORTANT: cap only. No throwing if shortage.
    return finalShuffleTasks(tasks, seed);
}

// services/taskSetBuilderService.js — FULL DROP-IN (UPDATED)
//
// Changes:
// 1) Recommended mode NO LONGER needs `level`.
// 2) New function: buildRecommendedQuotasForStudents({ studentIds, seed, numberOfTasksPerStudent })
//    -> returns structured plan per student (rule quotas), based on your 6 priorities.
// 3) In recommended mode, builder CONSUMES that plan (no studentIds/level/taskMode needed).
// 4) Recommended mode generates MIXED per rule (2:1 translations:gaps).
// 5) Never requests more tasks from a rule than available samples.
// 6) Non-recommended mode caps to what’s available (no “fail loudly” throw).

import { shuffleBySeed } from "../core/сore.js";
import { ALL_RULES_SAMPLES } from "../core/allRulesSamples.js";
import { ALL_GAPS_SAMPLES } from "../core/allGapsSamples.js";
import { GrammarRule } from "../core/rules.js";
import { getRuleStatsForStudents } from "../database/repositories/scoresRepository.js";

// -----------------------------
// Helpers
// -----------------------------
function clampInt(n, min, max, fallback) {
    const x = Number.parseInt(String(n ?? ""), 10);
    if (!Number.isFinite(x)) return fallback;
    return Math.max(min, Math.min(max, x));
}

function ruleKey(ruleId) {
    return GrammarRule?.[String(ruleId)] ?? String(ruleId);
}

function hashSalt(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h % 10000;
}

function seededShuffle(arr, seed, salt) {
    const s = Number(seed ?? 1) + hashSalt(String(salt));
    return shuffleBySeed(arr, s);
}

function uniq(arr) {
    return [...new Set((arr || []).filter(Boolean).map((x) => String(x)))];
}

function nowMinusDays(days) {
    const d = new Date();
    d.setDate(d.getDate() - Number(days || 0));
    return d;
}

function parseIsoOrNull(s) {
    if (!s) return null;
    const d = new Date(s);
    return Number.isFinite(d.getTime()) ? d : null;
}

// Build the global “candidate rules” list based on sample banks
function getAllCandidateRules() {
    const keys = new Set();

    // Note: dataset keys can be GrammarRule mapped keys OR raw rule ids.
    // We keep both sources; later we resolve availability via ruleKey(ruleId).
    for (const k of Object.keys(ALL_RULES_SAMPLES || {})) keys.add(String(k));
    for (const k of Object.keys(ALL_GAPS_SAMPLES || {})) keys.add(String(k));

    // Additionally include raw GrammarRule values if present (helps when banks use mapped keys).
    if (GrammarRule && typeof GrammarRule === "object") {
        for (const v of Object.values(GrammarRule)) keys.add(String(v));
    }

    return Array.from(keys);
}

// availability for a given “rule id” as used by analytics (best-effort)
function getRuleAvailability(ruleId) {
    const k = ruleKey(ruleId);

    const tr = ALL_RULES_SAMPLES?.[k] ?? ALL_RULES_SAMPLES?.[ruleId] ?? [];
    const gp = ALL_GAPS_SAMPLES?.[k] ?? ALL_GAPS_SAMPLES?.[ruleId] ?? [];

    return {
        translations: Array.isArray(tr) ? tr.length : 0,
        gaps: Array.isArray(gp) ? gp.length : 0,
    };
}

// For recommended mode, each rule is “always mixed 2:1 translations:gaps”
function maxTasksForRuleRecommended(ruleId) {
    const a = getRuleAvailability(ruleId);
    const tr = a.translations;
    const gp = a.gaps;

    // Need roughly: for X tasks -> ceil(2/3 X) translations and floor(1/3 X) gaps.
    // Maximum X is limited by both pools.
    // We find max X such that:
    //   needTr = Math.ceil((2*X)/3) <= tr
    //   needGp = Math.floor((1*X)/3) <= gp   (or Math.ceil(X/3) depending on rounding)
    //
    // Use conservative gaps rounding: needGp = Math.ceil(X/3) to avoid over-asking gaps.
    let lo = 0;
    let hi = tr + gp; // upper bound
    while (lo < hi) {
        const mid = Math.floor((lo + hi + 1) / 2);
        const needTr = Math.ceil((2 * mid) / 3);
        const needGp = Math.ceil(mid / 3);
        if (needTr <= tr && needGp <= gp) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}

// -----------------------------
// Recommended quotas (per student)
// -----------------------------

function quotaCount(n, pct) {
    const desired = Math.ceil(n * pct);
    return Math.max(1, desired);
}

function pickRoundRobinRules({ rules, seed, salt, need }) {
    const list = seededShuffle(uniq(rules), seed, salt);
    if (!list.length) return [];
    const out = [];
    let i = 0;
    while (out.length < need) {
        out.push(list[i % list.length]);
        i++;
        if (i > 100000) break;
    }
    return out;
}

function addQuotaCount(map, ruleId, add) {
    const r = String(ruleId);
    map[r] = (map[r] || 0) + Number(add || 0);
}

function capQuotasByRuleCapacity(quotasMap) {
    const capped = {};
    for (const [ruleId, cnt] of Object.entries(quotasMap || {})) {
        const max = maxTasksForRuleRecommended(ruleId);
        const c = Math.max(0, Math.min(Number(cnt || 0), max));
        if (c > 0) capped[ruleId] = c;
    }
    return capped;
}

function totalQuotas(quotasMap) {
    return Object.values(quotasMap || {}).reduce((a, b) => a + (Number(b) || 0), 0);
}

// Priority buckets builder per student
function buildRecommendedPlanForStudent({
                                            studentId,
                                            seed,
                                            numberOfTasks,
                                            statsByRule,
                                            candidateRules,
                                        }) {
    const n = clampInt(numberOfTasks, 1, 50, 10);

    const thirtyDaysAgo = nowMinusDays(30);

    // Normalize stats
    // statsByRule: { [ruleId]: { attemptsNumber, accuracy, lastDate } }
    const attempted = [];
    const never = [];
    const stale30 = [];
    const lowAcc = [];
    const highAcc = [];

    for (const ruleId of candidateRules) {
        const s = statsByRule?.[ruleId];
        const attempts = Number(s?.attemptsNumber) || 0;
        const accuracy = Number.isFinite(s?.accuracy) ? s.accuracy : 0;
        const lastDate = parseIsoOrNull(s?.lastDate);

        // If rule has no samples at all for recommended mixed, ignore it
        if (maxTasksForRuleRecommended(ruleId) <= 0) continue;

        if (attempts <= 0) {
            never.push(ruleId);
            continue;
        }

        attempted.push({ ruleId, attempts, accuracy, lastDate });

        if (!lastDate || lastDate < thirtyDaysAgo) stale30.push(ruleId);
        if (accuracy < 70) lowAcc.push(ruleId);
        if (accuracy >= 70) highAcc.push(ruleId);
    }

    // Weak top4 = lowest accuracy among attempted rules
    attempted.sort((a, b) => (a.accuracy - b.accuracy) || (a.attempts - b.attempts));
    const weakTop4 = attempted.slice(0, 4).map((x) => x.ruleId);

    // lowAcc ordered bottom->top (already sorted by acc asc)
    const lowAccSorted = uniq(attempted.filter((x) => x.accuracy < 70).map((x) => x.ruleId));

    // top10 lowest accuracy (attempted only; if none, falls back later)
    const lowest10 = uniq(attempted.slice(0, 10).map((x) => x.ruleId));

    const quotas = {}; // ruleId -> count
    let remaining = n;

    const takeFromBucket = (bucketRules, need, salt) => {
        if (remaining <= 0) return;
        const want = Math.min(need, remaining);
        const picks = pickRoundRobinRules({
            rules: bucketRules,
            seed,
            salt: `${studentId}:${salt}`,
            need: want,
        });

        for (const r of picks) addQuotaCount(quotas, r, 1);
        remaining -= picks.length;
    };

    // 1) 50% (or 1)
    takeFromBucket(weakTop4, quotaCount(n, 0.50), "p1_weakTop4");

    // 2) 10% (or 1): no practice at all
    takeFromBucket(never, quotaCount(n, 0.10), "p2_never");

    // 3) 10% (or 1): no practice last 30 days
    takeFromBucket(stale30, quotaCount(n, 0.10), "p3_stale30");

    // 4) 20% (or 1): accuracy < 70 bottom->top
    takeFromBucket(lowAccSorted, quotaCount(n, 0.20), "p4_lowAcc");

    // 5) 10% (or 1): accuracy >= 70
    takeFromBucket(highAcc, quotaCount(n, 0.10), "p5_highAcc");

    // 6) remainder: top10 lowest accuracy
    takeFromBucket(lowest10, remaining, "p6_lowest10");

    // Cap by capacity
    let capped = capQuotasByRuleCapacity(quotas);

    // If capping removed tasks, refill from lowest10 then from any candidate rule by lowest accuracy
    let missing = n - totalQuotas(capped);
    if (missing > 0) {
        // Try lowest10 first
        const refill1 = pickRoundRobinRules({
            rules: lowest10.length ? lowest10 : candidateRules,
            seed,
            salt: `${studentId}:refill_lowest10`,
            need: missing,
        });
        for (const r of refill1) addQuotaCount(capped, r, 1);

        capped = capQuotasByRuleCapacity(capped);
        missing = n - totalQuotas(capped);

        if (missing > 0) {
            const fallback = pickRoundRobinRules({
                rules: candidateRules,
                seed,
                salt: `${studentId}:refill_any`,
                need: missing,
            });
            for (const r of fallback) addQuotaCount(capped, r, 1);
            capped = capQuotasByRuleCapacity(capped);
        }
    }

    // Build structured breakdown (nice for UI)
    const toList = (rules) =>
        rules
            .filter((r) => capped[r] > 0)
            .map((r) => ({ ruleId: r, count: capped[r] }));

    return {
        studentId: String(studentId),
        numberOfTasks: n,
        seed: Number(seed ?? 1),

        // The actual quotas to be consumed by the builder
        quotas: capped, // { ruleId: count }

        // Optional breakdown by priority buckets for UI preview
        breakdown: {
            p1_weakTop4: toList(weakTop4),
            p2_never: toList(never),
            p3_stale30: toList(stale30),
            p4_lowAcc: toList(lowAccSorted),
            p5_highAcc: toList(highAcc),
            p6_lowest10: toList(lowest10),
        },
    };
}

/**
 * Build recommended quotas plan for each student.
 * No level, no taskMode, no explicit rules.
 */
export async function buildRecommendedQuotasForStudents({
                                                            studentIds,
                                                            seed,
                                                            numberOfTasksPerStudent,
                                                            teacherId = null,
                                                        }) {
    const ids = Array.isArray(studentIds) ? studentIds.map(String).filter(Boolean) : [];
    const n = clampInt(numberOfTasksPerStudent, 1, 50, 10);
    const baseSeed = Number.isFinite(Number(seed)) ? Number(seed) : 1;

    const candidateRules = getAllCandidateRules();

    // pull stats for all students at once
    const statsByStudent = await getRuleStatsForStudents({
        studentIds: ids,
        teacherId,
    });

    const plans = [];
    for (const sid of ids) {
        const perRule = statsByStudent?.[sid] || {};
        const studentSeed = baseSeed + hashSalt(String(sid));

        plans.push(
            buildRecommendedPlanForStudent({
                studentId: sid,
                seed: studentSeed,
                numberOfTasks: n,
                statsByRule: perRule,
                candidateRules,
            })
        );
    }

    return { numberOfTasksPerStudent: n, seed: baseSeed, items: plans };
}

// -----------------------------
// Sampling pools (existing style)
// -----------------------------
function samplePoolFromRulesTranslations({ rulesOrdered, seed }) {
    const pool = [];
    for (const r of rulesOrdered) {
        const k = ruleKey(r);
        const samples = ALL_RULES_SAMPLES?.[k] ?? ALL_RULES_SAMPLES?.[r] ?? [];
        if (!Array.isArray(samples) || samples.length === 0) continue;

        const shuffled = seededShuffle(samples, seed, `tr:${r}`);
        for (const s of shuffled) {
            if (!s) continue;
            const text = s.ua ?? s["ua"] ?? s.en ?? s["en"];
            if (!text) continue;

            pool.push({
                taskType: "translation",
                ruleIds: Array.isArray(s.rules) ? s.rules : [String(r)],
                textToTranslate: String(text),
                options: null,
                correctAnswer: null,
                tipIfWrong: null,
            });
        }
    }
    return pool;
}

function samplePoolFromRulesGaps({ rulesOrdered, seed }) {
    const pool = [];
    for (const r of rulesOrdered) {
        const k = ruleKey(r);
        const samples = ALL_GAPS_SAMPLES?.[k] ?? ALL_GAPS_SAMPLES?.[r] ?? [];
        if (!Array.isArray(samples) || samples.length === 0) continue;

        const shuffled = seededShuffle(samples, seed, `gap:${r}`);
        for (const s of shuffled) {
            if (!s) continue;

            const en = s.en ?? s["en"];
            if (!en) continue;

            const options = Array.isArray(s.options) ? s.options : null;
            if (!options || options.length < 2) continue;

            pool.push({
                taskType: "gap",
                ruleIds: Array.isArray(s.rules) ? s.rules : [String(r)],
                textToTranslate: en,
                options,
                correctAnswer: s.correct ?? s.answer ?? null,
                tipIfWrong: null,
            });
        }
    }
    return pool;
}

function takeNFromPool(pool, n, seed, salt) {
    if (!Array.isArray(pool) || pool.length === 0) return [];
    const shuffled = seededShuffle(pool, seed, salt);
    return shuffled.slice(0, n);
}

function finalShuffleTasks(tasks, seed) {
    const shuffled = shuffleBySeed(tasks, Number(seed ?? 1));
    return shuffled.map((t, idx) => ({ ...t, taskOrderNumber: idx + 1 }));
}

// -----------------------------
// Recommended task generation from plan (2:1 mixed)
// -----------------------------
export function buildTasksFromRecommendedPlan({
                                                  studentId,
                                                  seed,
                                                  numberOfTasks,
                                                  plan, // { quotas: { ruleId: count } }
                                              }) {
    const n = clampInt(numberOfTasks, 1, 50, 10);
    const baseSeed = Number.isFinite(Number(seed)) ? Number(seed) : 1;
    const sid = String(studentId || "").trim();
    if (!sid) throw new Error("buildTasksFromRecommendedPlan: missing studentId");

    const quotas = plan?.quotas || {};
    const ruleIds = Object.keys(quotas).filter((r) => Number(quotas[r]) > 0);

    // Deterministic order of rules for this student
    const rulesOrdered = seededShuffle(ruleIds, baseSeed, `rec:${sid}:rules`);

    const tasks = [];

    for (const r of rulesOrdered) {
        const want = Math.max(0, Number(quotas[r] || 0));
        if (!want) continue;

        // Cap by rule mixed capacity
        const cap = maxTasksForRuleRecommended(r);
        const take = Math.min(want, cap);
        if (take <= 0) continue;

        const trNeed = Math.ceil((2 * take) / 3);
        const gpNeed = take - trNeed;

        const trPool = samplePoolFromRulesTranslations({ rulesOrdered: [r], seed: baseSeed + hashSalt(`tr:${sid}:${r}`) });
        const gpPool = samplePoolFromRulesGaps({ rulesOrdered: [r], seed: baseSeed + hashSalt(`gp:${sid}:${r}`) });

        const tr = takeNFromPool(trPool, trNeed, baseSeed, `take:rec:tr:${sid}:${r}`);
        const gp = takeNFromPool(gpPool, gpNeed, baseSeed, `take:rec:gp:${sid}:${r}`);

        // If one side is short, try to fill from the other side but still respect availability
        let combined = [...tr, ...gp];

        const missing = take - combined.length;
        if (missing > 0) {
            // fill from translations first (because ratio is 2:1)
            const moreTr = takeNFromPool(trPool, trNeed + missing, baseSeed, `fill:rec:tr:${sid}:${r}`).slice(tr.length);
            combined = [...combined, ...moreTr];
        }

        // If still missing, try gaps
        const missing2 = take - combined.length;
        if (missing2 > 0) {
            const moreGp = takeNFromPool(gpPool, gpNeed + missing2, baseSeed, `fill:rec:gp:${sid}:${r}`).slice(gp.length);
            combined = [...combined, ...moreGp];
        }

        // Final cap to take
        combined = combined.slice(0, take);

        // Shuffle within rule so it’s not “all translations then gaps”
        combined = seededShuffle(combined, baseSeed, `mix:rec:${sid}:${r}`);

        tasks.push(...combined);

        if (tasks.length >= n) break;
    }

    // If we’re short, just return what we could generate (no throw)
    const trimmed = tasks.slice(0, n);
    return finalShuffleTasks(trimmed, baseSeed + hashSalt(`final:${sid}`));
}

// -----------------------------
// Main builder (legacy + updated)
// -----------------------------
export async function buildTaskSetTasks({
                                            // legacy args
                                            teacherId,
                                            studentIds,
                                            taskMode, // "translations" | "gaps" | "mixed"
                                            ruleIds,  // optional
                                            recommended, // boolean

                                            // legacy (was required for recommended) -> NO LONGER used
                                            level,

                                            numberOfTasks,
                                            seed,

                                            // NEW: recommendedPlan (for a SINGLE student)
                                            // { studentId, numberOfTasks, seed, quotas, breakdown }
                                            recommendedPlan,
                                        }) {
    const n = clampInt(numberOfTasks, 1, 50, 10);

    // ----------------------------
    // RECOMMENDED MODE (NEW FLOW)
    // ----------------------------
    if (recommended) {
        if (!recommendedPlan?.studentId) {
            throw new Error("recommended=true requires recommendedPlan with studentId");
        }
        const sid = String(recommendedPlan.studentId);
        const planSeed = Number.isFinite(Number(recommendedPlan.seed)) ? Number(recommendedPlan.seed) : Number(seed ?? 1);

        // Ignore taskMode and ruleIds in recommended flow (always mixed 2:1)
        return buildTasksFromRecommendedPlan({
            studentId: sid,
            seed: planSeed,
            numberOfTasks: n,
            plan: recommendedPlan,
        });
    }

    // ----------------------------
    // NON-RECOMMENDED MODE (legacy)
    // ----------------------------
    const mode = String(taskMode ?? "translations").toLowerCase();
    const rulesOrdered = seededShuffle(uniq(ruleIds), seed, "explicitRules");

    if (!rulesOrdered.length) {
        throw new Error("Non-recommended mode requires ruleIds (non-empty).");
    }

    const translationsPool = samplePoolFromRulesTranslations({ rulesOrdered, seed });
    const gapsPool = samplePoolFromRulesGaps({ rulesOrdered, seed });

    let tasks = [];

    if (mode === "translations") {
        tasks = takeNFromPool(translationsPool, n, seed, "take:translations");
    } else if (mode === "gaps") {
        tasks = takeNFromPool(gapsPool, n, seed, "take:gaps");
    } else if (mode === "mixed") {
        const n1 = Math.floor(n / 2);
        const n2 = n - n1;

        const t1 = takeNFromPool(translationsPool, n1, seed, "take:mixed:tr");
        const t2 = takeNFromPool(gapsPool, n2, seed, "take:mixed:gap");

        tasks = seededShuffle([...t1, ...t2], seed, "take:mixed:final");
    } else {
        throw new Error("taskMode must be one of: translations | gaps | mixed");
    }

    // ✅ CAP (no throw). Return whatever we have.
    tasks = finalShuffleTasks(tasks, seed);
    return tasks;
}

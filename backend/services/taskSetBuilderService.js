// services/taskSetBuilderService.js — FULL DROP-IN
//
// Builds tasks for a teacher task set based on:
// - taskMode: "translations" | "gaps" | "mixed"
// - explicit ruleIds OR recommended weak-rule selection by level
// - seed for deterministic randomness
// - numberOfTasks (1..50)
//
// Uses same shuffle/rule mapping style as translationsController. :contentReference[oaicite:2]{index=2}

import { shuffleBySeed } from "../core/сore.js";
import { ALL_RULES_SAMPLES } from "../core/allRulesSamples.js";
import { ALL_GAPS_SAMPLES } from "../core/allGapsSamples.js";
import { GrammarRule, LEVEL_RULES } from "../core/rules.js";
import { getWeakRulesForStudent } from "../database/repositories/scoresRepository.js";

// -----------------------------
// Helpers
// -----------------------------
function clampInt(n, min, max, fallback) {
    const x = Number.parseInt(String(n ?? ""), 10);
    if (!Number.isFinite(x)) return fallback;
    return Math.max(min, Math.min(max, x));
}

function normalizeLevel(level) {
    const up = String(level ?? "").trim().toUpperCase();
    if (!["A1", "A2", "B1", "B2"].includes(up)) return null;
    return up;
}

function ruleKey(ruleId) {
    // Same “GrammarRule mapping” style as translationsController. :contentReference[oaicite:3]{index=3}
    return GrammarRule?.[String(ruleId)] ?? String(ruleId);
}

function seededRuleShuffle(arr, seed, salt) {
    // deterministic per seed + salt
    // salt should be stable string (ruleId)
    const s = Number(seed ?? 1) + hashSalt(String(salt));
    return shuffleBySeed(arr, s);
}

function hashSalt(str) {
    // small deterministic hash → int 0..9999
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h % 10000;
}

function uniq(arr) {
    return [...new Set((arr || []).filter(Boolean).map((x) => String(x)))];
}

function pickRulesForRecommended({ weakRulesUnion, levelRules, seed }) {
    const weak = seededRuleShuffle(uniq(weakRulesUnion), seed, "weak");
    const rest = seededRuleShuffle(
        levelRules.filter((r) => !weak.includes(r)),
        seed,
        "rest"
    );

    // "pick those rules and continue with the rest of random shuffle"
    return [...weak, ...rest];
}

function getLevelRules(level) {
    const lvl = normalizeLevel(level);
    if (!lvl) return [];
    return Array.isArray(LEVEL_RULES?.[lvl]) ? LEVEL_RULES[lvl].map(String) : [];
}

function samplePoolFromRulesTranslations({ rulesOrdered, seed }) {
    const pool = [];

    for (const r of rulesOrdered) {
        const k = ruleKey(r);
        const samples = ALL_RULES_SAMPLES?.[k] ?? ALL_RULES_SAMPLES?.[r] ?? [];

        if (!Array.isArray(samples) || samples.length === 0) continue;

        const shuffled = seededRuleShuffle(samples, seed, `tr:${r}`);

        for (const s of shuffled) {
            if (!s) continue;

            // Prefer UA prompt (teacher sets are UA→EN translation tasks)
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

        const shuffled = seededRuleShuffle(samples, seed, `gap:${r}`);

        for (const s of shuffled) {
            if (!s) continue;

            const en = s.en ?? s["en"];
            if (!en) continue;

            const options = Array.isArray(s.options) ? s.options : null;
            if (!options || options.length < 2) continue;

            pool.push({
                taskType: "gap",
                ruleIds: Array.isArray(s.rules) ? s.rules : [String(r)],
                textToTranslate: en, // can be string or array; store as-is
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
    const shuffled = seededRuleShuffle(pool, seed, salt);
    return shuffled.slice(0, n);
}

function finalShuffleTasks(tasks, seed) {
    const shuffled = shuffleBySeed(tasks, Number(seed ?? 1));
    // set order numbers 1..N
    return shuffled.map((t, idx) => ({
        ...t,
        taskOrderNumber: idx + 1,
    }));
}

// -----------------------------
// Main builder
// -----------------------------
export async function buildTaskSetTasks({
                                            teacherId,
                                            studentIds,
                                            taskMode, // "translations" | "gaps" | "mixed"
                                            ruleIds,  // optional
                                            recommended, // boolean
                                            level, // required if recommended
                                            numberOfTasks,
                                            seed,
                                        }) {
    const n = clampInt(numberOfTasks, 1, 50, 10);
    const mode = String(taskMode ?? "translations").toLowerCase();

    // 1) Determine rule order
    let rulesOrdered = [];

    if (Array.isArray(ruleIds) && ruleIds.length > 0) {
        rulesOrdered = seededRuleShuffle(uniq(ruleIds), seed, "explicitRules");
    } else {
        if (!recommended) {
            throw new Error("Either ruleIds must be provided, or recommended=true with level.");
        }

        const lvl = normalizeLevel(level);
        if (!lvl) throw new Error("recommended=true requires level in [A1,A2,B1,B2].");

        const levelRules = getLevelRules(lvl);
        if (!levelRules.length) throw new Error(`No LEVEL_RULES found for level ${lvl}.`);

        // 2) Compute union of top-4 weakest rules across selected students
        const weakUnion = [];
        const students = Array.isArray(studentIds) ? studentIds : [];

        for (const sid of students) {
            const weakTop = await getWeakRulesForStudent({
                userId: sid,
                level: lvl,
                limit: 4,
                teacherId: null, // reserved for future “scores belong to teacher”
            });
            for (const w of weakTop) weakUnion.push(w);
        }

        rulesOrdered = pickRulesForRecommended({
            weakRulesUnion: weakUnion,
            levelRules,
            seed,
        });
    }

    // 3) Build pools
    const translationsPool = samplePoolFromRulesTranslations({ rulesOrdered, seed });
    const gapsPool = samplePoolFromRulesGaps({ rulesOrdered, seed });

    // 4) Take N tasks based on mode
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

        tasks = [...t1, ...t2];
        // shuffle again after combining
        tasks = seededRuleShuffle(tasks, seed, "take:mixed:final");
    } else {
        throw new Error("taskMode must be one of: translations | gaps | mixed");
    }

    // 5) Final shuffle and order
    tasks = finalShuffleTasks(tasks, seed);

    // 6) If we couldn't produce enough (missing samples), fail loudly
    if (tasks.length < n) {
        throw new Error(
            `Not enough samples for taskMode=${mode}. Requested=${n}, produced=${tasks.length}.`
        );
    }

    return tasks;
}

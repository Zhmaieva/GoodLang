
import { LEVEL_RULES, RULE_LABELS } from "../utils/rules";

const STORAGE_KEY = "answers_data";
const STORAGE_KEY_SEED = "samples_seed";
const STORAGE_KEY_SKIP = "samples_skip";

export class AnswerData {
    constructor() {
        this.score = 0;
        this.date = new Date();
        this.rule = '';
        this.level = '';
    }
}

let _answersCache = null;

export function saveAnswers(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveSeed({seed, skip}) {
    localStorage.setItem(STORAGE_KEY_SEED, seed);
    localStorage.setItem(STORAGE_KEY_SKIP, skip);
}

export function getSeed() {
   const seed = Number.parseInt(localStorage.getItem(STORAGE_KEY_SEED) ?? (Math.random() * 1000));
   const skip = Number.parseInt(localStorage.getItem(STORAGE_KEY_SKIP) ?? 0);
   return {seed, skip};
}

export function addAnswer(scores, rules, level) {
    const data = [...getAnswers()];
    for (let i = 0; i < rules.length; i++) {
        const answer = new AnswerData();
        answer.score = scores[i];
        answer.rule = rules[i];
        answer.level = level;

        data.push(answer);
    }

    _answersCache = data;

    saveAnswers(data);
}

// --- Cached loader mirroring your pattern ---
function getAnswers() {
    try {
        if (!_answersCache) {
            const data = localStorage.getItem(STORAGE_KEY);
            _answersCache = JSON.parse(data) || [];
        }
    } catch (error) {
        console.error("Error parsing answers data from localStorage:", error);
        _answersCache = [];
    }
    return _answersCache;
}

// --- Helpers ---
function scoresArePercents(arr) {
    return arr.some((x) => typeof x.score === "number" && x.score > 1);
}
function toPercent(score, asPercents) {
    if (typeof score !== "number") return 0;
    return asPercents ? score : score * 100;
}
function averageAccuracyPercent(items) {
    if (!items.length) return 0;
    const perc = scoresArePercents(items);
    const sum = items.reduce((acc, x) => acc + toPercent(x.score, perc), 0);
    return Math.round((sum / items.length) * 100) / 100;
}
function latestDateISO(items) {
    if (!items.length) return null;
    const ts = items
        .map((x) => (x?.date ? new Date(x.date).getTime() : NaN))
        .filter((n) => Number.isFinite(n));
    if (!ts.length) return null;
    return new Date(Math.max(...ts)).toISOString();
}
function statusFor(accuracy, attempts) {
    if (attempts === 0)
        return "not defined";
    // needs practice: (<5 attempts AND accuracy < 75) OR accuracy < 30
    if (accuracy < 50) return "needs practice";
    // learned: accuracy > 80 AND attempts > 5
    if (accuracy > 85) return "learned";
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
    const allAnswers = getAnswers(); // [{ rule, isCorrect, ts, ...}, ...]
    // Build a comprehensive set of rule IDs
    const set = new Set([
        // from labels
        ...Object.keys(RULE_LABELS || {}),
        // from per-level mapping
        ...allRulesFromLevels(LEVEL_RULES),
        // from actual answer history
        ...allAnswers.map(a => a.rule).filter(Boolean),
    ]);

    // If a level is specified, keep only rules that belong to that level
    const ruleIds = [...set];

    // Helper: attempts per rule (optionally you could also filter by level if answers have level)
    const attemptsForRule = (ruleId) =>
        allAnswers.filter(a => a && a.rule === ruleId);

    // Choose a primary level for display (if a rule belongs to many, take the first)
    const primaryLevelFor = (ruleId) => {
        const lvls = levelsForRule(ruleId, LEVEL_RULES);
        return lvls[0] || null;
    };

    return ruleIds.map((ruleId) => {
        const attempts = attemptsForRule(ruleId);
        const attemptsNumber = attempts.length;
        const accuracy = averageAccuracyPercent(attempts);     // should return 0 if empty
        const lastAttemptDate = latestDateISO(attempts);       // should return null if empty

        const primaryLevel = primaryLevelFor(ruleId);
        const levelName = primaryLevel ?? "—";

        return {
            rule: ruleId,                                        // rule id
            ruleName: RULE_LABELS?.[ruleId] || ruleId,           // human label
            level: primaryLevel,                                  // level id (or null)
            levelName,                                            // alias for display
            accuracy,                                             // 0 if no records
            attemptsNumber,
            lastAttemptDate,                                      // ISO or null
            status: statusFor(accuracy, attemptsNumber),
        };
    })
        // (optional) sort by label
        .sort((a, b) => String(a.ruleName).localeCompare(String(b.ruleName)));
}


// Overall accuracy across ALL answers
export function getOverallAccuracy() {
    const all = getAnswers();
    return averageAccuracyPercent(all);
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
 * into StepLang levels (beginner/intermediate/advanced).
 *
 * Options you can tweak:
 * - levelBands: mapping StepLang -> CEFR bands
 * - thresholds & weights (same as before)
 */
export function inferUserLevel(options = {}) {
    const {
        // Map StepLang levels → CEFR bands
        levelBands = {
            beginner: ["A1"],
            intermediate: ["A2", "B1"],
            advanced: ["B2"],
        },

        // Minimum total attempts required to "trust" a level
        minTotalAttemptsPerLevel = 12,
        // A rule counts toward coverage if it has at least this many attempts
        minAttemptsPerRule = 2,
        // Need at least this many covered rules in a level
        minRulesWithAttempts = 3,
        // Minimum overall accuracy (percent) in the level to consider it "proficient"
        minAccuracy = 70,

        // Composite scoring weights (tune as you like)
        weights = {
            accuracy: 0.5,     // accuracy in the level (0..100 → normalized)
            coverage: 0.25,    // fraction of rules with >= minAttemptsPerRule
            learned: 0.2,      // share of rules with status "learned"
            volumeBonus: 0.05, // bonus for more attempts (log-scaled)
        },
    } = options;

    const stepLevels = Object.keys(LEVEL_RULES || {}); // e.g. ["beginner","intermediate","advanced"]
    if (!stepLevels.length) {
        return { level: null, decidedBy: "noData", confidence: 0, levels: [] };
    }

    // Build a CEFR → StepLang lookup (e.g. "A2" -> "intermediate")
    const cefrToStep = {};
    for (const [step, bands] of Object.entries(levelBands || {})) {
        (bands || []).forEach((b) => { cefrToStep[b] = step; });
    }

    const answers = getAnswers(); // [{score, rule, level, date}, ...]
    if (!answers.length) {
        return {
            level: "beginner",
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

    // Group answers by StepLang level:
    // 1) If answer.level is already a StepLang level → use it
    // 2) Else if answer.level is CEFR → collapse via cefrToStep
    // 3) Else infer by rule → credit to all step levels that contain that rule
    const byLevel = new Map(stepLevels.map((l) => [l, []]));
    for (const a of answers) {
        const raw = a?.level;
        let targetLevel = null;

        if (raw && byLevel.has(raw)) {
            // already a StepLang level
            targetLevel = raw;
            byLevel.get(targetLevel).push(a);
            continue;
        }

        if (raw && cefrToStep[raw]) {
            // CEFR provided, collapse to StepLang
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
    const levelStats = stepLevels.map((lvl) => {
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
        (a, b) => (b.score - a.score) || (stepLevels.indexOf(b.level) - stepLevels.indexOf(a.level))
    )[0];

    return {
        level: bestOverall?.level ?? "beginner",
        decidedBy: answers.length ? "bestScore" : "noData",
        confidence: clamp01(bestOverall?.score ?? 0),
        levels: levelStats,
    };
}

// Small util
function clamp01(x) {
    return Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0));
}



import { LEVEL_RULES, RULE_LABELS } from "../utils/rules";

const STORAGE_KEY = "answers_data";

export class AnswerData {
    constructor() {
        this.score = 0;
        this.date = new Date();
        this.rule = '';
        this.level = '';
    }
}

let answers = null;

export function saveAnswers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function addAnswer(score, rule, level) {
    const answer = new AnswerData();
    answer.score = score;
    answer.rule = rule;
    answer.level = level;

    getAnswers().push(answer);

    saveAnswers();
}

// --- Cached loader mirroring your pattern ---
let _answersCache = null;
function getAnswers() {
    try {
        if (!_answersCache) {
            const data = localStorage.getItem(STORAGE_KEY);
            _answersCache = data ? JSON.parse(data) : [];
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
    // needs practice: (<5 attempts AND accuracy < 75) OR accuracy < 30
    if ((attempts < 5 && accuracy < 75) || accuracy < 30) return "needs practice";
    // learned: accuracy > 80 AND attempts > 5
    if (accuracy > 80 && attempts > 5) return "learned";
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

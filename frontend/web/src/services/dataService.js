
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

function addAnswer(score, rule, level) {
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
// Per-level statistics array
export function getStatisticsByLevel(level) {
    const all = getAnswers();
    const rules = LEVEL_RULES[level] || [];

    return rules.map((rule) => {
        const attempts = all.filter((a) => a.level === level && a.rule === rule);
        const attemptsNumber = attempts.length;
        const accuracy = averageAccuracyPercent(attempts);
        const lastAttemptDate = latestDateISO(attempts);

        return {
            rule,                                   // rule id
            ruleName: RULE_LABELS[rule] || rule,    // human label
            level,                                  // level id
            levelName: level,                       // alias (as requested)
            accuracy,                               // 0 if no records
            attemptsNumber,
            lastAttemptDate,                        // ISO or null
            status: statusFor(accuracy, attemptsNumber),
        };
    });
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

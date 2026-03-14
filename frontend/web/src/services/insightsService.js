import {averageAccuracyPercent, getAnswers, inferUserLevel, statusFor} from "./dataService.js";
import {LEVEL_RULES} from "../utils/rules.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const PENALTY_FACTOR = 1.5; // can tweak to 1.3 / 2.0 later

export const LEVEL_MAP_TO = {
    A1: { label: "beginner", percent: 33 },
    A2: { label: "intermediate", percent: 66 },
    B1: { label: "intermediate", percent: 66 },
    B2: { label: "advanced", percent: 100 },
};

function computeRuleLearningDurations() {
    const answers = getAnswers();
    if (!answers.length) return [];

    const byRule = new Map();
    for (const a of answers) {
        if (!a?.rule || !a?.date) continue;
        if (!byRule.has(a.rule)) byRule.set(a.rule, []);
        byRule.get(a.rule).push(a);
    }

    const durations = [];

    for (const [ruleId, list] of byRule.entries()) {

        if (!list.length) continue;

        // Sort attempts by real timestamp
        const sorted = [...list].sort(
            (x, y) => new Date(x.date).getTime() - new Date(y.date).getTime()
        );

        let firstTs = new Date(sorted[0].date).getTime();
        if (!Number.isFinite(firstTs)) continue;

        // --- group attempts by day ---
        const byDay = new Map(); // day string -> { attempts: [], lastTs }
        for (const a of sorted) {
            const ts = new Date(a.date).getTime();
            if (!Number.isFinite(ts)) continue;
            const day = a.date.slice(0, 10); // YYYY-MM-DD

            if (!byDay.has(day)) {
                byDay.set(day, { attempts: [], lastTs: ts });
            }
            const bucket = byDay.get(day);
            bucket.attempts.push(a);
            if (ts > bucket.lastTs) bucket.lastTs = ts;
        }

        // process days in chronological order
        const days = [...byDay.entries()].sort(
            (a, b) => a[1].lastTs - b[1].lastTs
        );

        let cumulative = [];
        let lastStatus = null;

        // we keep only the **latest** stable learned moment
        let latestLearned = null; // { rule, days, learnedAt }

        for (const [, info] of days) {
            const { attempts, lastTs } = info;

            // accumulate all attempts up to this day
            cumulative.push(...attempts);

            // accuracy based on all attempts so far
            const acc = averageAccuracyPercent(cumulative);
            const status = statusFor(acc, cumulative.length);

            // if 'forgot' the rule, then reset learning clock
            if (status !== "learned" && lastStatus === "learned") {
                firstTs = lastTs;
            }

            // transition: non-learned -> learned
            if (status === "learned" && lastStatus !== "learned") {
                let diffDays = (lastTs - firstTs) / DAY_MS;
                if (!Number.isFinite(diffDays) || diffDays < 0) diffDays = 0;

                // overwrite previous candidate: we only need the **latest** one
                latestLearned = {
                    rule: ruleId,
                    days: diffDays,
                    learnedAt: lastTs,
                };
            }

            lastStatus = status;
        }

        // overall last timestamp for this rule (last day)
        const lastGlobalTs = Date.now();

        // CASE 1: rule is currently learned → use the last stable learned moment
        if (latestLearned && lastStatus === "learned") {
            durations.push(latestLearned);
            continue;
        }

        // CASE 2: rule has attempts but is NOT learned enough → include with penalty
        if (sorted.length > 0 && Number.isFinite(lastGlobalTs)) {
            let daysSoFar = (lastGlobalTs - firstTs) / DAY_MS;
            if (!Number.isFinite(daysSoFar) || daysSoFar < 0) daysSoFar = 0;

            const penalizedDays = daysSoFar * PENALTY_FACTOR;

            durations.push({
                rule: ruleId,
                days: penalizedDays,
                learnedAt: lastGlobalTs, // "current horizon"
            });
        }
    }

    return durations;
}


// 2) Знаходимо медіанний час до "learned" для правил,
//    спочатку дивимося лише на ті, що стали learned за останні N днів,
//    якщо таких немає — беремо весь час.
function medianLearningTimeDays(lastNDays = 30) {
    const durations = computeRuleLearningDurations();
    if (!durations.length) return null;

    const now = Date.now();
    const from = now - lastNDays * DAY_MS;

    let sample = durations.filter(d => d.learnedAt >= from);

    // Якщо за останні N днів немає нових "learned" → використовуємо all-time
    if (!sample.length) {
        sample = durations;
    }

    const values = sample
        .map(d => d.days)
        .filter(n => Number.isFinite(n) && n > 0)
        .sort((a, b) => a - b);

    if (!values.length) return null;

    const mid = Math.floor(values.length / 2);
    if (values.length % 2 === 1) {
        return values[mid];
    } else {
        return (values[mid - 1] + values[mid]) / 2;
    }
}

export function getLearningState() {
    const answers = getAnswers();
    if (!answers.length)
        return {
            medianDays: null,
            nextLevels: null,
            answers: null,
        }

    // 1) Швидкість навчання: медіанний час до "learned" для одного правила
    const medianDays = medianLearningTimeDays(30); // спочатку 30 днів, потім all-time
    if (medianDays == null || !Number.isFinite(medianDays) || medianDays <= 0) {
        // Немає адекватних даних — формально "немає прогресу"
        return {
            medianDays: null,
            nextLevels: null,
            answers: null,
        }
    }

    // 2) Поточний рівень та порядок рівнів
    const levelInfo = inferUserLevel();

    const currentStepLevel = levelInfo?.level || "A1";

    const stepLevelsOrder = Object.keys(LEVEL_RULES || {}); // наприклад ["beginner","intermediate","advanced"]
    if (!stepLevelsOrder.length)
        return {
            medianDays: null,
            nextLevels: null,
            answers: null,
        }

    const nextLevels = [];

    if (currentStepLevel === 'A1') {
        nextLevels.push('A2');
        nextLevels.push('B1');
    } else if (currentStepLevel !== 'B2') {
        nextLevels.push('B2');
    }

    return {
        medianDays: medianDays,
        nextLevels: nextLevels,
        answers: answers,
    }
}

export function rawEstimate() {
    const { answers, medianDays, nextLevels } = getLearningState();

    // Якщо наступного рівня немає — вважай, що ми вже на максимумі
    if ((nextLevels?.length ?? 0) === 0) {
        return { nextLevels: null, days: null };
    }

    let rulesInNextLevel = []
    nextLevels?.forEach(n => {
        rulesInNextLevel = rulesInNextLevel.concat(LEVEL_RULES[n] || [])
    })
    if (!rulesInNextLevel.length) {
        return { nextLevels: null, days: null };
    }

    // 3) Поточний статус правил наступного рівня
    const byRule = new Map();
    for (const a of answers) {
        if (!a?.rule) continue;
        if (!rulesInNextLevel.includes(a.rule)) continue;

        if (!byRule.has(a.rule)) byRule.set(a.rule, []);
        byRule.get(a.rule).push(a);
    }

    let learnedNow = 0;
    for (const ruleId of rulesInNextLevel) {
        const attempts = byRule.get(ruleId) || [];
        const acc = averageAccuracyPercent(attempts);
        const st = statusFor(acc, attempts.length);
        if (st === "learned") learnedNow++;
    }

    const totalRules = rulesInNextLevel.length;

    // 🎯 Цільова частка вивчених правил на наступному рівні.
    // Це пов'язано з тим, як inferUserLevel використовує learnedShare у score.
    const TARGET_LEARNED_SHARE_FOR_NEXT_LEVEL = 0.6; // 60% правил рівня у статусі "learned"
    const targetLearned = Math.min(
        totalRules,
        Math.ceil(totalRules * TARGET_LEARNED_SHARE_FOR_NEXT_LEVEL)
    );

    const remainingRules = Math.max(0, targetLearned - learnedNow);

    // Уже досягли цілі за кількістю "learned" правил
    if (remainingRules <= 0) {
        return { nextLevels, days: 0 };
    }

    // 4) Прогноз: скільки днів потрібно, якщо кожне нове правило "долернюється"
    // за медіанний час (days/rule)
    const daysNeeded = remainingRules * medianDays;

    // Округляємо вгору — бо "ще трохи" це все одно плюс день :)
    return {nextLevels, days: Math.ceil(daysNeeded) };
}

function pluralDays(n) {
    const i = Math.floor(n);
    const mod10 = i % 10;
    const mod100 = i % 100;

    if (i === 1) return "day";
    return "days";
}

function pluralWeeks(n) {
    const i = Math.floor(n);
    if (i === 1) return "week";
    return "weeks";
}

export function estimateTimeToNextLevelText() {
    const {days, nextLevels} = rawEstimate();
    const nextLevel = nextLevels?.length > 0 ? nextLevels[0] : 'B2';

    // 2) Поточний рівень та порядок рівнів
    const levelInfo = inferUserLevel();

    const totalAttempts = levelInfo.levels.reduce((acc, level) => acc + level.attempts, 0);

    if (totalAttempts < 40) {
        return  { levelNameTo: LEVEL_MAP_TO[nextLevel]?.label, text: "Level assessment — continue practicing" };
    }

    if (levelInfo.level === 'B2')
        return { text: null };

    if (days === null) return { text: "Not enough data to estimate." };
    if (days === Infinity) return { text: "No progress yet to level up." };
    const d = Number(days);

    let text;

    if (d < 0.1) {
        text = "less than a day";
    } else if (d < 1) {
        const fraction = d - Math.floor(d);
        const fmt = fraction < 0.1 ? d.toFixed(0) : d.toFixed(1);
        text = `${fmt} ${pluralDays(fmt)}`;
    } else if (d < 7) {
        const fraction = d - Math.floor(d);
        const fmt = fraction < 0.1 ? d.toFixed(0) : d.toFixed(1);
        text = `${fmt} ${pluralDays(fmt)}`;
    } else if (d === 7) {
        text = "1 week";
    } else if (d % 7 === 0) {
        text = `${d / 7} weeks`;
    }
    else if (d < 60) {
        const fraction = d - Math.floor(d);
        const fmt = fraction < 0.1 ? d.toFixed(0) : d.toFixed(1);
        text = `${fmt} ${pluralDays(fmt)}`;
    } else {
        const weeks = Math.ceil(d / 7);
        text = `${weeks} ${pluralWeeks(weeks)}`;
    }

    return  {
        levelNameTo: LEVEL_MAP_TO[nextLevel].label,
        text: `To ${LEVEL_MAP_TO[nextLevel]?.label} level: ${text}.`
    };
}


import {averageAccuracyPercent, getAnswers, inferUserLevel, statusFor} from "./dataService.js";
import {LEVEL_RULES} from "../utils/rules.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const PENALTY_FACTOR = 1.5; // can tweak to 1.3 / 2.0 later

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

        const firstTs = new Date(sorted[0].date).getTime();
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
        const lastGlobalTs = days.length
            ? days[days.length - 1][1].lastTs
            : firstTs;

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




// Utility: group answers by day
function groupByDay(answers) {
    const map = new Map();
    for (const a of answers) {
        const day = a.date.slice(0, 10);
        if (!map.has(day)) map.set(day, []);
        map.get(day).push(a);
    }
    return map;
}

export function rawEstimate() {
    const answers = getAnswers();
    if (!answers.length) return null;

    // 1) Швидкість навчання: медіанний час до "learned" для одного правила
    const medianDays = medianLearningTimeDays(30); // спочатку 30 днів, потім all-time
    if (medianDays == null || !Number.isFinite(medianDays) || medianDays <= 0) {
        // Немає адекватних даних — формально "немає прогресу"
        return Infinity;
    }

    // 2) Поточний рівень та порядок рівнів
    const levelInfo = inferUserLevel(); // твоя функція знизу файла
    const currentStepLevel = levelInfo?.level || "beginner";

    const stepLevelsOrder = Object.keys(LEVEL_RULES || {}); // наприклад ["beginner","intermediate","advanced"]
    if (!stepLevelsOrder.length) return null;

    const currentIndex = stepLevelsOrder.indexOf(currentStepLevel);
    const nextLevelId = currentIndex >= 0 ? stepLevelsOrder[currentIndex + 1] : null;

    // Якщо наступного рівня немає — вважай, що ми вже на максимумі
    if (!nextLevelId) {
        return null; // estimateTimeToNextLevelText поверне "Недостатньо даних..."
    }

    const rulesInNextLevel = LEVEL_RULES[nextLevelId] || [];
    if (!rulesInNextLevel.length) {
        return null;
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
        return 0;
    }

    // 4) Прогноз: скільки днів потрібно, якщо кожне нове правило "долернюється"
    // за медіанний час (days/rule)
    const daysNeeded = remainingRules * medianDays;

    // Округляємо вгору — бо "ще трохи" це все одно плюс день :)
    return Math.ceil(daysNeeded);
}

function pluralDays(n) {
    const i = Math.floor(n);
    const mod10 = i % 10;
    const mod100 = i % 100;

    if (i === 1) return "день";
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14))
        return "дні";
    return "днів";
}

function pluralWeeks(n) {
    const i = Math.floor(n);
    if (i === 1) return "тиждень";
    if (i >= 2 && i <= 4) return "тижні";
    return "тижнів";
}

export function estimateTimeToNextLevelText() {
    const days = rawEstimate();

    if (days === null) return "Недостатньо даних для оцінки.";
    if (days === Infinity) return "Поки немає прогресу для підвищення рівня.";

    const d = Number(days);

    let text;

    if (d < 0.1) {
        text = "менше ніж за день";
    } else if (d < 1) {
        const fraction = d - Math.floor(d);
        const fmt = fraction < 0.1 ? d.toFixed(0) : d.toFixed(1);
        text = `приблизно ${fmt} ${pluralDays(fmt)}`;
    } else if (d < 7) {
        const fraction = d - Math.floor(d);
        const fmt = fraction < 0.1 ? d.toFixed(0) : d.toFixed(1);
        text = `${fmt} ${pluralDays(fmt)}`;
    } else if (d === 7) {
        text = "тиждень";
    } else if (d % 7 === 0) {
        text = `${d / 7} тижнів`;
    } else if (d < 60) {
        const fraction = d - Math.floor(d);
        const fmt = fraction < 0.1 ? d.toFixed(0) : d.toFixed(1);
        text = `${fmt} ${pluralDays(fmt)}`;
    } else {
        const weeks = Math.ceil(d / 7);
        text = `приблизно ${weeks} ${pluralWeeks(weeks)}`;
    }

    return `До наступного рівня: ${text}.`;
}


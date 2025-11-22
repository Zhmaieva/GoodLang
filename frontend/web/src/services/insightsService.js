import {averageAccuracyPercent, getAnswers, inferUserLevel} from "./dataService.js";

function getWeeklyProgress(days = 7) {
    const all = getAnswers();
    if (!all.length) return null;

    const now = Date.now();
    const weekAgo = now - days * 24 * 60 * 60 * 1000;

    const recent = all.filter(a => new Date(a.date).getTime() >= weekAgo);
    if (!recent.length) return null;

    const byDay = new Map();
    for (let i = 0; i < days; i++) {
        const day = new Date(now - i * 24*60*60*1000).toISOString().slice(0,10);
        byDay.set(day, []);
    }

    for (const a of recent) {
        const day = a.date.slice(0,10);
        if (byDay.has(day)) byDay.get(day).push(a);
    }

    const dailyAccuracy = [...byDay.entries()].map(([day, items]) => ({
        day,
        avg: items.length ? averageAccuracyPercent(items) : 0
    }));

    const avgs = dailyAccuracy.map(d => d.avg);
    const minAvg = Math.min(...avgs);
    const maxAvg = Math.max(...avgs);
    const delta = maxAvg - minAvg;

    return { delta, minAvg, maxAvg, dailyAccuracy };
}

export function getProgressSummary(days = 7) {
    const weekly = getWeeklyProgress(days);
    if (!weekly) return "";

    const rawPercent = weekly.delta > 0 ? weekly.delta : weekly.maxAvg || 0;

    const fraction = rawPercent - Math.floor(rawPercent);
    const percent = (fraction < 0.1) ? rawPercent.toFixed(0) : rawPercent.toFixed(1);

    const period = days === 7 ? "тиждень" : `останні ${days} дні`;

    return `Об'єм знань: +${percent}% за ${period}`;
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

// Weighted progress calculator
function getWeightedAccuracyProgress() {
    const all = getAnswers();
    if (!all.length) return null;

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const weekAgo = now - 7 * dayMs;
    const threeWeeksAgo = now - 21 * dayMs;

    const lastWeek = all.filter(a => new Date(a.date).getTime() >= weekAgo);
    const last3Weeks = all.filter(a => {
        const t = new Date(a.date).getTime();
        return t < weekAgo && t >= threeWeeksAgo;
    });
    const older = all.filter(a => new Date(a.date).getTime() < threeWeeksAgo);

    const lastWeekMap = groupByDay(lastWeek);
    const last3WeeksMap = groupByDay(last3Weeks);
    const olderMap = groupByDay(older);

    function avg(map) {
        if (map.size === 0) return 0;
        let sum = 0, count = 0;
        for (const list of map.values()) {
            sum += averageAccuracyPercent(list);
            count++;
        }
        return count ? sum / count : 0;
    }

    const a1 = avg(lastWeekMap);
    const a05 = avg(last3WeeksMap);
    const a01 = avg(olderMap);

    const weighted = (a1 * 1 + a05 * 0.5 + a01 * 0.1) / (1 + 0.5 + 0.1);

    return {
        weightedGrowth: weighted,
        hasWeekData: lastWeek.length > 0,
        has3WeekData: last3Weeks.length > 0
    };
}

export function rawEstimate() {
    const accuracy = getWeightedAccuracyProgress();
    if (!accuracy) return null;

    const { weightedGrowth, hasWeekData, has3WeekData } = accuracy;
    const answers = getAnswers();
    if (!answers.length) return null;

    // Determine current level
    const level = inferUserLevel(answers);
    const currentLevel = level?.name || "A1";

    // Precision at current level
    const currentAccuracy = level?.accuracy || 0;

    // Determine target level accuracy
    const nextLevel = level?.next || null;

    let targetAccuracy;
    let hasNextLevelData = !!nextLevel && nextLevel.accuracyHistory?.length > 0;

    if (hasNextLevelData) {
        // Actual required accuracy for next level
        targetAccuracy = nextLevel.requiredAccuracy ?? 85;
    } else {
        // Use 85% for current level if no next-level data or no progress
        targetAccuracy = 85;
    }

    // Delta needed to reach target
    const delta = targetAccuracy - currentAccuracy;
    if (delta <= 0) return 0; // already above requirement

    // Progress speed per day (very simplified)
    const dailyIncrease = weightedGrowth / 7; // growth normalized

    if (dailyIncrease <= 0) {
        // No progress at all — return infinity or large number
        return Infinity;
    }

    // Days required
    let days = delta / dailyIncrease;

    // 🔥 If there is no data or progress in the next level → multiply by 2
    if (!hasNextLevelData) {
        days *= 2;
    }

    return Math.ceil(days);
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

    // < 0.1 → менше ніж за день
    if (d < 0.1) {
        text = "менше ніж за день";

        // 0.1–1 → приблизно за X дня (2.5 -> "2.5 дня")
    } else if (d < 1) {
        const fraction = d - Math.floor(d);
        const fmt = fraction < 0.1 ? d.toFixed(0) : d.toFixed(1);
        text = `приблизно ${fmt} ${pluralDays(fmt)}`;

        // 1–6 днів
    } else if (d < 7) {
        const fraction = d - Math.floor(d);
        const fmt = fraction < 0.1 ? d.toFixed(0) : d.toFixed(1);
        text = `за ${fmt} ${pluralDays(fmt)}`;

        // точно 7 → "за тиждень"
    } else if (d === 7) {
        text = "тиждень";

        // >7 → округлюємо тижні догори
    } else {
        const weeks = Math.ceil(d / 7);
        text = `приблизно ${weeks} ${pluralWeeks(weeks)}`;
    }

    return `До наступного рівня: ${text}.`;
}

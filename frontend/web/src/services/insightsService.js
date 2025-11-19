import { averageAccuracyPercent, getAnswers } from "./dataService.js";

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

    return `Знання: +${percent}% за ${period}`;
}

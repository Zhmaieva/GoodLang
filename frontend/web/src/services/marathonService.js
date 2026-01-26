import { callAccountInfoApi, callCompleteMarathonDayApi } from "./api.js";
import { getAllStatistics } from "./dataService.js";

const STORAGE_KEY_ACCOUNT_INFO = "account_info";
const WEAK_BAR = 75; // %

function readAccountInfoFromLS() {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNT_INFO);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function safeArray(v) {
    return Array.isArray(v) ? v : [];
}

function normalizeDayTasks(accountInfo) {
    const tasks = safeArray(accountInfo?.currentDayTasks);
    // Normalize fields + sort by ordinal
    return tasks
        .map((t) => ({
            ordinalNumber: Number(t?.ordinalNumber ?? t?.ordinal_number ?? 0),
            ruleId: String(t?.ruleId ?? t?.rule_id ?? ""),
            isAnswered: Boolean(t?.isAnswered ?? t?.is_answered ?? false),
        }))
        .filter((t) => t.ordinalNumber > 0 && t.ruleId)
        .sort((a, b) => a.ordinalNumber - b.ordinalNumber);
}

function statsMap() {
    // getAllStatistics(): [{ rule, accuracy, attemptsNumber, lastAttemptDate, ... }]
    const arr = getAllStatistics() || [];
    const m = new Map();
    for (const s of arr) m.set(s.rule, s);
    return m;
}

function ruleAccuracy(ruleId, statByRule) {
    const s = statByRule.get(ruleId);
    const acc = Number(s?.accuracy);
    return Number.isFinite(acc) ? acc : 0;
}

function mostRecentWeakRuleFromRulesSoFar(rulesSoFar, statByRule) {
    // "ordered by the most recent rule" → interpret as the most recent in rulesSoFar array
    // (rulesSoFar is accumulated chronologically in your backend query)
    for (let i = rulesSoFar.length - 1; i >= 0; i--) {
        const r = rulesSoFar[i];
        if (ruleAccuracy(r, statByRule) < WEAK_BAR) return r;
    }
    return null;
}

export const marathonService = {
    // --- base getters ---
    _getAccountInfo() {
        return readAccountInfoFromLS();
    },

    isInMarathon() {
        const a = readAccountInfoFromLS();
        return Boolean(a?.isInMarathon);
    },

    isMarathonView() {
        return this.isInMarathon() && !this.isScheduleCompleted();
    },

    isDayCompleted() {
        const a = readAccountInfoFromLS();
        return Boolean(a?.currentDay?.isDayCompleted);
    },

    /**
     * Returns { total, remaining } for today's schedule tasks.
     * NOTE: your backend currently returns currentDayTasks; depending on query it might be:
     * - all tasks with isAnswered flags, OR
     * - only not-answered tasks.
     * This function handles both.
     */
    getRulesLeftForToday() {
        const a = readAccountInfoFromLS();
        const tasks = normalizeDayTasks(a);

        const total = tasks.length;
        const remaining = tasks.filter((t) => !t.isAnswered).length;

        return { total, remaining };
    },

    /**
     * Array of weak rules among rulesSoFar (<75% accuracy), with their accuracy.
     * Returned as: [{ ruleId, accuracy }]
     */
    getWeakTodaysRules() {
        const a = readAccountInfoFromLS();
        const rulesSoFar = safeArray(a?.rulesSoFar).map(String).filter(Boolean);

        if (!rulesSoFar.length) return [];

        const statByRule = statsMap();

        const weak = rulesSoFar
            .map((r) => ({ ruleId: r, accuracy: ruleAccuracy(r, statByRule) }))
            .filter((x) => x.accuracy < WEAK_BAR);

        // Sort: lowest accuracy first (more urgent)
        weak.sort((x, y) => x.accuracy - y.accuracy);

        return weak;
    },

    /**
     * Next rule to train:
     * 1) next not-answered task in today's schedule (by ordinal_number)
     * 2) if none left → from rulesSoFar with accuracy <75%, pick most recent rule
     * 3) if still none → fallback to today's main rule (or last rulesSoFar)
     */
    getNextMarathonRule() {
        const a = readAccountInfoFromLS();
        const tasks = normalizeDayTasks(a);

        // 1) next task from schedule
        const nextTask = tasks.find((t) => !t.isAnswered);
        if (nextTask?.ruleId) return nextTask.ruleId;

        // 2) fallback: weak rules so far, most recent first
        const rulesSoFar = safeArray(a?.rulesSoFar).map(String).filter(Boolean);
        const statByRule = statsMap();

        const recWeak = mostRecentWeakRuleFromRulesSoFar(rulesSoFar, statByRule);
        if (recWeak) return recWeak;

        // 3) fallback: today's rule, else last rulesSoFar
        const todayRule = a?.currentDay?.ruleId ? String(a.currentDay.ruleId) : null;
        if (todayRule) return todayRule;

        return rulesSoFar[rulesSoFar.length - 1] || "";
    },



    /**
     * Schedule completed = all tasks completed AND no weak rules under 75% (rulesSoFar).
     *
     * If account cache says NOT completed, we do a real check:
     * - if tasks remaining == 0 AND weak rules list is empty:
     *    -> call API to mark day completed
     *    -> re-fetch account info API to refresh cache
     *    -> return true
     *
     * @returns {Promise<boolean>}
     */
    async isScheduleCompleted() {
        const a = readAccountInfoFromLS();

        // If backend already says completed, trust it
        if (a?.currentDay?.isDayCompleted === true) return true;

        // If not in marathon or no current day, treat as completed (nothing to do)
        if (!a?.isInMarathon || !a?.currentDay) return true;

        const left = this.getRulesLeftForToday(); // {total, remaining}
        const weak = this.getWeakTodaysRules();   // [{ruleId, accuracy}]

        const noTasksLeft = left.remaining === 0;
        const noWeakLeft = weak.length === 0;

        if (!(noTasksLeft && noWeakLeft)) {
            return false;
        }

        // ✅ At this point schedule is effectively completed:
        // Mark day completed on backend + refresh account cache.
        await callCompleteMarathonDayApi({ requireAllTasksAnswered: false });
        await callAccountInfoApi(); // updates LS cache in your api.js

        return true;
    },
};

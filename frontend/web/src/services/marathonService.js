import {callAccountInfoApi, callCompleteMarathonDayApi, callUpdateMarathonStatusApi} from "./api.js";
import { getAllStatistics } from "./dataService.js";
import {emit} from "./events.js";

const STORAGE_KEY_ACCOUNT_INFO = "account_info";
const STORAGE_KEY_ACCOUNT_INFO_PREV = "account_info_old";
const STORAGE_KEY_MARATHON_FAILED_MODAL = "marathon_failed_modal";
const WEAK_BAR = 70; // %
const SECONDS_PER_TRANSLATION = 60;

const WINDOW_N = 8;

/**
 * Try to extract recent answer scores for a rule from the stats object.
 * Expected scores are either 0..1 or 0..100; we normalize to 0..100.
 *
 * Adjust the field names here to match what your getAllStatistics() returns.
 */
function getRecentScoresFromStat(stat, windowN = WINDOW_N) {
    if (!stat) return [];

    // Try common field names (pick whichever exists in your data)
    const candidate =
        stat.attemptsLast7Days ??
        null;

    const arr = Array.isArray(candidate) ? candidate : [];
    if (!arr.length) return [];

    // Normalize to numbers 0..100
    const normalized = arr
        .map((x) => x.score)
        .filter((v) => Number.isFinite(v));

    // Keep only the last N
    return normalized.slice(-windowN);
}

/**
 * Window-based accuracy: average of last N answers.
 * Fallback to overall stat.accuracy if recent scores aren't available.
 */
function ruleAccuracyWindowed(ruleId, statByRule, windowN = WINDOW_N) {
    const s = statByRule.get(ruleId);
    const recent = getRecentScoresFromStat(s, windowN);

    if (recent.length > 0) {
        const sum = recent.reduce((acc, v) => acc + v, 0);
        return sum / recent.length;
    }

    // fallback: old behavior
    const acc = Number(s?.accuracy);
    return Number.isFinite(acc) ? acc : 0;
}

/**
 * Minimal number of extra perfect answers needed so that
 * avg(last N of (recentScores + perfects)) >= target.
 *
 * Rolling window behavior is modeled by slicing last N after appending.
 */
function extraPerfectAnswersNeededWindowed(recentScores, targetPercent, windowN = WINDOW_N) {
    const t = Number.isFinite(Number(targetPercent)) ? Number(targetPercent) : WEAK_BAR;
    const base = Array.isArray(recentScores)
        ? recentScores.map(Number).filter((v) => Number.isFinite(v))
        : [];

    // If no recent answers: 1 perfect answer makes window avg 100
    if (base.length === 0) return 1;

    // Search k from 0..windowN (after windowN perfect answers, window is all perfect)
    for (let k = 0; k <= windowN; k++) {
        const withPerfects = base.concat(Array(k).fill(100));
        const window = withPerfects.slice(-windowN);
        const avg = window.reduce((acc, v) => acc + v, 0) / window.length;
        if (avg >= t) return k;
    }

    return windowN; // safe fallback
}


export function readAccountInfoFromLS() {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNT_INFO);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function readPrevAccountInfoFromLS() {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNT_INFO_PREV);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function syncPrevAccountInfoToLS() {
    localStorage.setItem(STORAGE_KEY_ACCOUNT_INFO_PREV, JSON.stringify(readAccountInfoFromLS()));
}

function enableMarathonFailedModal() {
    localStorage.setItem(STORAGE_KEY_MARATHON_FAILED_MODAL, "true");
}

export function disableMarathonFailedModal() {
    localStorage.setItem(STORAGE_KEY_MARATHON_FAILED_MODAL, "false");
}

export function isMarathonFailedModalEnabled() {
    return localStorage.getItem(STORAGE_KEY_MARATHON_FAILED_MODAL) === "true";
}


function translationsNeededToReachTarget(avgPercent, attempts, targetPercent) {
    const a = Number.isFinite(Number(avgPercent)) ? Number(avgPercent) : 0;
    const n = Number.isFinite(Number(attempts)) ? Number(attempts) : 0;
    const t = Number.isFinite(Number(targetPercent)) ? Number(targetPercent) : 70;

    if (a >= t) return 0;

    // If no attempts yet, 1 perfect translation immediately puts avg at 100%
    if (n <= 0) return 1;

    // Need k such that: (a*n + 100*k) / (n+k) >= t
    // => k >= n*(t - a) / (100 - t)
    const denom = Math.max(1e-9, 100 - t);
    const k = Math.ceil((n * (t - a)) / denom);

    return Math.max(0, k);
}

function formatEtaFromSeconds(totalSeconds) {
    const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const mins = Math.ceil(s / 60);

    if (mins < 60) return `${mins} хв`;

    const h = Math.floor(mins / 60);
    const m = mins % 60;

    return m > 0 ? `${h} год ${m} хв` : `${h} год`;
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

    async isMarathonView(cache = false) {
        return this.isInMarathon() && !(await this.isScheduleCompleted(cache));
    },

    isDayCompleted() {
        const a = readAccountInfoFromLS();
        return Boolean(a?.currentDay?.isDayCompleted);
    },

    /**
     * Estimates total ETA to raise ALL weak rules in rulesSoFar to WEAK_BAR (default 70),
     * assuming each new translation is perfect (score 1.0 => 100%),
     * and 1 translation takes 30 seconds.
     *
     * @returns {string} e.g. "18 хв" or "2 год 10 хв"
     */
    estimateEtaForWeakRules(target = WEAK_BAR) {
        const a = readAccountInfoFromLS();
        const rulesSoFar = safeArray(a?.rulesSoFar).map(String).filter(Boolean);

        if (!rulesSoFar.length) return "0 хв";

        const statByRule = statsMap();
        let totalTranslations = 0;

        for (const ruleId of rulesSoFar) {
            const s = statByRule.get(ruleId);

            // last-8 window accuracy
            const recent = getRecentScoresFromStat(s, WINDOW_N);
            const accNow = recent.length
                ? recent.reduce((sum, v) => sum + v, 0) / recent.length
                : (Number.isFinite(Number(s?.accuracy)) ? Number(s.accuracy) : 0);

            if (accNow >= target) continue;

            // minimal k perfect answers, taking rolling window into account
            totalTranslations += extraPerfectAnswersNeededWindowed(recent, target, WINDOW_N);
        }

        const totalSeconds = totalTranslations * SECONDS_PER_TRANSLATION;
        return formatEtaFromSeconds(totalSeconds);
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

        // No schedule tasks at all
        if (!tasks.length) return { total: 0, remaining: 0 };

        // Ordinal range (use lowest - 1 as baseline)
        const lowest = tasks[0].ordinalNumber;
        const highest = tasks[tasks.length - 1].ordinalNumber;

        // total tasks in today's ordinal window
        const total = highest;

        // remaining tasks in today's ordinal window:
        // - if backend includes answered tasks -> find first not answered
        // - if backend includes ONLY not answered tasks -> first is not answered anyway
        const firstNotAnswered = tasks.find((t) => !t.isAnswered);

        // all answered
        if (!firstNotAnswered) return { total, remaining: 0 };

        const remaining = Math.max(0, highest - (firstNotAnswered.ordinalNumber - 1));

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
            .map((r) => ({ ruleId: r, accuracy: ruleAccuracyWindowed(r, statByRule) }))
            .filter((x) => x.accuracy < WEAK_BAR);

        weak.sort((x, y) => x.accuracy - y.accuracy);

        return weak;
    },

    getRuleRecentAccuracy(ruleId) {
        const statByRule = statsMap();
        const result = ruleAccuracyWindowed(ruleId, statByRule);

        return result;
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
    async isScheduleCompleted(cache = false) {
        if (!cache) {
            await callAccountInfoApi(); // updates LS cache in your api.js
        }

        let a = readAccountInfoFromLS();
        let old = readPrevAccountInfoFromLS();

        let dayTasksJustCompleted = false;

        if (!old && a) {
            syncPrevAccountInfoToLS();
        } else if (!old.marathonFailed && a.marathonFailed) {
            syncPrevAccountInfoToLS();
            enableMarathonFailedModal();
            emit('marathonFailed');
        }
        else if (old?.currentDay && a?.currentDay || old?.isInMarathon !== a?.isInMarathon) {
            if (old?.currentDay?.dayStartAt !== a?.currentDay?.dayStartAt
                || old?.currentDay?.dayNumber !== a?.currentDay?.dayNumber) {
                syncPrevAccountInfoToLS();
                window.location.reload();
            } else if (old?.currentDayTasks?.length > 0 && (a?.currentDayTasks?.length ?? 0) === 0) {
                dayTasksJustCompleted = true;
                syncPrevAccountInfoToLS();
            }
        }

        // ✅ If LS day is stale (dayEndAt already passed), refresh account info first
        const dayEndAt = a?.currentDay?.dayEndAt;
        if (a?.isInMarathon && dayEndAt) {
            const endMs = Date.parse(dayEndAt); // ISO UTC-safe
            if (Number.isFinite(endMs) && endMs < Date.now()) {
                await callAccountInfoApi();      // refresh LS cache
                window.location.reload();
            }
        }

        // If backend already says completed, trust it
        if (a?.currentDay?.isDayCompleted === true) return true;

        // If not in marathon or no current day, treat as completed (nothing to do)
        if (!a?.isInMarathon || !a?.currentDay) return true;

        const left = this.getRulesLeftForToday(); // {total, remaining}
        const weak = this.getWeakTodaysRules();   // [{ruleId, accuracy}]

        const noTasksLeft = left.remaining === 0;
        const noWeakLeft = weak.length === 0;

        if (!(noTasksLeft && noWeakLeft)) {
            if (dayTasksJustCompleted)
                emit('marathonDailyNeedsPractice');
            return false;
        }

        // ✅ At this point schedule is effectively completed:
        // Mark day completed on backend + refresh account cache.
        callCompleteMarathonDayApi({ requireAllTasksAnswered: false }).then();
        if (a?.currentDay?.dayNumber === 7) {
            callUpdateMarathonStatusApi('completed').then();
            emit('marathonCompleted');
        } else {
            emit('marathonDailyCompleted');
        }
        callAccountInfoApi().then(); // updates LS cache in your api.js

        return true;
    },

};

setInterval(async () => {
    await marathonService.isScheduleCompleted(true);
}, 1000);
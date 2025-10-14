import { pct, daysSince } from "./fmt";

export const MASTERED_ACC = 0.85;
export const WEAK_ACC = 0.6;

export const statusOf = (r) => {
    const a = r.attempts ? r.correct / r.attempts : 0;
    if (r.attempts >= 10 && a >= MASTERED_ACC) return { label: "Засвоєно", cls: "ok" };
    if (a < WEAK_ACC || r.attempts < 5) return { label: "Потребує практики", cls: "bad" };
    return { label: "У процесі", cls: "warn" };
};

export function computeKPIs(rows) {
    const totalAttempts = rows.reduce((s, r) => s + r.attempts, 0);
    const totalCorrect = rows.reduce((s, r) => s + r.correct, 0);
    const accuracy = pct(totalCorrect, totalAttempts);
    const mastered = rows.filter((r) => {
        const a = r.attempts ? r.correct / r.attempts : 0;
        return r.attempts >= 10 && a >= MASTERED_ACC;
    }).length;
    return { accuracy, totalAttempts, mastered };
}

// vocab helpers
const acc = (nCorrect, nAll) => (nAll ? nCorrect / nAll : 0);

export function isWordLearned(w) {
    if (!w.hadError) return false;
    const last3ok = w.last3 && w.last3.length === 3 && w.last3.every((v) => v === 1);
    const goodAcc = w.attempts >= 2 && acc(w.correct, w.attempts) >= 0.85;
    return last3ok || goodAcc;
}

export function computeVocab(map) {
    const items = Array.from(map.values()).map((w) => ({
        ...w,
        accuracy: acc(w.correct, w.attempts),
        learned: isWordLearned(w),
        lastWrong: w.last3 && w.last3.length > 0 ? w.last3[w.last3.length - 1] === 0 : false,
    }));

    const learnedList = items
        .filter((w) => w.learned)
        .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
        .slice(0, 12);

    const riskList = items
        .filter((w) => w.attempts >= 2 && w.accuracy < 0.6)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 12);

    const kpiLearned = items.filter((w) => w.learned).length;

    return { items, kpiLearned, learnedList, riskList };
}

export const bucketOf = (w) => {
    const accuracy = w.accuracy ?? acc(w.correct, w.attempts);
    if (accuracy < 0.6 && w.attempts >= 2) return "risk";
    if (w.last3 && w.last3.length > 0 && w.last3[w.last3.length - 1] === 0) return "risk";
    if (w.attempts <= 1) return "new";
    if (!w.learned && w.attempts >= 2 && accuracy < 0.85) return "learn";
    return "other";
};

export const priorityOf = (w) => {
    const accuracy = w.accuracy ?? (w.attempts ? w.correct / w.attempts : 0);
    const days = Math.max(0, daysSince(w.lastSeen));
    const lastWrongBonus = w.last3 && w.last3[w.last3.length - 1] === 0 ? 0.5 : 0;
    const base = bucketOf(w) === "risk" ? 3 : bucketOf(w) === "learn" ? 2 : bucketOf(w) === "new" ? 1.5 : 1;
    return base * (1 - accuracy + 0.15) * (1 + days / 7) + lastWrongBonus;
};

export function getSmartQueue(n, items) {
    const candidates = items.filter((w) => !( (w.correct / (w.attempts||1)) >= 0.9 && w.attempts >= 3 ));
    candidates.forEach((w) => (w._prio = priorityOf(w)));

    const risk = candidates.filter((w) => bucketOf(w) === "risk").sort((a, b) => b._prio - a._prio).slice(0, 4);
    const learn = candidates.filter((w) => bucketOf(w) === "learn").sort((a, b) => b._prio - a._prio).slice(0, 3);
    const nnew = candidates.filter((w) => bucketOf(w) === "new").sort((a, b) => b._prio - a._prio).slice(0, 3);

    const picked = [];
    const take = (arr, tag) =>
        arr.forEach((w) => {
            if (!picked.find((x) => x.word === w.word)) picked.push({ ...w, reason: tag });
        });
    take(risk, "risk");
    take(learn, "learn");
    take(nnew, "new");

    if (picked.length < n) {
        const rest = candidates.filter((w) => !picked.find((x) => x.word === w.word)).sort((a, b) => b._prio - a._prio);
        for (const w of rest) {
            if (picked.length >= n) break;
            picked.push({ ...w, reason: bucketOf(w) });
        }
    }
    return picked.slice(0, n);
}

const STORAGE_KEY = "goodlang_vocabulary_local";
const STORAGE_VERSION_KEY = "goodlang_vocabulary_local_version";
const STORAGE_VERSION = "8";
const CEFR_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const LOCAL_STOP_WORDS = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "been",
    "being",
    "but",
    "by",
    "can",
    "could",
    "did",
    "do",
    "does",
    "for",
    "from",
    "had",
    "has",
    "have",
    "he",
    "her",
    "him",
    "his",
    "i",
    "if",
    "in",
    "is",
    "it",
    "its",
    "may",
    "might",
    "more",
    "must",
    "my",
    "not",
    "now",
    "of",
    "on",
    "or",
    "our",
    "she",
    "should",
    "so",
    "than",
    "that",
    "the",
    "their",
    "them",
    "there",
    "they",
    "this",
    "to",
    "was",
    "we",
    "were",
    "will",
    "with",
    "would",
    "you",
    "your",
]);

function canUseStorage() {
    return typeof window !== "undefined" && !!window.localStorage;
}

function normalizeWord(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[“”]/g, "\"")
        .replace(/[’‘]/g, "'")
        .replace(/^[^a-z]+|[^a-z]+$/gi, "");
}

function readMap() {
    if (!canUseStorage()) return {};

    try {
        if (window.localStorage.getItem(STORAGE_VERSION_KEY) !== STORAGE_VERSION) {
            window.localStorage.removeItem(STORAGE_KEY);
            window.localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
            return {};
        }

        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
}

function writeMap(value) {
    if (!canUseStorage()) return;

    try {
        window.localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
        // Local vocabulary is a fallback cache, so storage failures should not block practice.
    }
}

function getLastMistakeLabel(value) {
    if (!value) return "Ages ago";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Ages ago";

    const elapsedDays = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (elapsedDays <= 0) return "Today";
    if (elapsedDays === 1) return "Yesterday";
    if (elapsedDays <= 7) return "Last week";
    return "Ages ago";
}

function getStatus(record) {
    if ((record.mistakeCount ?? 0) === 0) return null;

    if ((record.correctStreak ?? 0) < 2) {
        return "needsPractice";
    }

    if ((record.correctStreak ?? 0) >= 4) {
        return "learned";
    }

    if ((record.mistakeCount ?? 0) > 0) return "recovered";
    return null;
}

function toVocabularyItem(record, locale = record.displayLocale) {
    const word = normalizeWord(record.word);
    const displayLocale = locale || record.displayLocale || "uk-UA";
    const status = getStatus(record);
    const attempts = Math.max(0, Number(record.attempts) || 0);
    const correctCount = Math.max(0, Number(record.correctCount) || 0);
    const isAlwaysCorrect = attempts > 0
        && (Number(record.mistakeCount) || 0) === 0
        && correctCount === attempts;

    return {
        id: `local-${word}`,
        word,
        meaning: record.translations?.[displayLocale]
            || record.translations?.[String(displayLocale).split("-")[0]]
            || record.translations?.uk || "",
        translations: record.translations || {},
        level: record.level || "-",
        status,
        displayStatus: status || (isAlwaysCorrect ? "learned" : null),
        attempts,
        correctCount,
        previousMistakes: Number(record.mistakeCount) || 0,
        correctStreak: Number(record.correctStreak) || 0,
        lastMistake: getLastMistakeLabel(record.lastMistakeAt),
        example: record.example || "",
        source: "local",
    };
}

export function getLocalVocabularyWords(locale = null) {
    return Object.values(readMap())
        .map((record) => toVocabularyItem(record, locale || record.displayLocale))
        .filter((item) => item.word && item.displayStatus);
}

export function buildLocalVocabularySummary(words = []) {
    const safeWords = Array.isArray(words) ? words : [];
    const count = (status) => safeWords.filter((word) => (word.displayStatus || word.status) === status).length;
    const records = Object.values(readMap());
    const cutoff = Date.now() - ONE_MONTH_MS;
    const bands = [
        { value: "Advanced", label: "B2+", levels: new Set(["B2", "C1", "C2"]) },
        { value: "Intermediate", label: "A2–B1", levels: new Set(["A2", "B1"]) },
        { value: "Beginner", label: "A1", levels: new Set(["A1"]) },
    ];

    const scoredBands = bands.map((band) => {
        let weightedAttempts = 0;
        let weightedCorrect = 0;
        for (const record of records) {
            const recordLevel = String(record?.level ?? "").toUpperCase();
            if (!band.levels.has(recordLevel)) continue;
            const history = Array.isArray(record.usageHistory) ? record.usageHistory : [];
            if (history.length) {
                const trackedCorrect = history.filter((attempt) => attempt?.correct === true).length;
                const untrackedAttempts = Math.max(0, (Number(record?.attempts) || 0) - history.length);
                const untrackedCorrect = Math.max(0, Math.min(
                    untrackedAttempts,
                    (Number(record?.correctCount) || 0) - trackedCorrect,
                ));
                if (untrackedAttempts > 0) {
                    const baselineTime = new Date(record?.createdAt || record?.updatedAt).getTime();
                    const baselineWeight = Number.isFinite(baselineTime) && baselineTime < cutoff ? 0.5 : 1;
                    weightedAttempts += untrackedAttempts * baselineWeight;
                    weightedCorrect += untrackedCorrect * baselineWeight;
                }
                for (const attempt of history) {
                    const occurredAt = new Date(attempt?.occurredAt).getTime();
                    const weight = Number.isFinite(occurredAt) && occurredAt < cutoff ? 0.5 : 1;
                    weightedAttempts += weight;
                    if (attempt?.correct === true) weightedCorrect += weight;
                }
            } else {
                const attempts = Math.max(0, Number(record?.attempts) || 0);
                const correct = Math.max(0, Math.min(attempts, Number(record?.correctCount) || 0));
                const recordTime = new Date(record?.updatedAt || record?.createdAt).getTime();
                const weight = Number.isFinite(recordTime) && recordTime < cutoff ? 0.5 : 1;
                weightedAttempts += attempts * weight;
                weightedCorrect += correct * weight;
            }
        }
        const accuracy = weightedAttempts > 0 ? weightedCorrect / weightedAttempts : null;
        return { ...band, accuracy };
    });
    const earnedLevel = scoredBands.find((band) => band.accuracy !== null && band.accuracy >= 0.75);
    const beginnerBand = scoredBands.find((band) => band.value === "Beginner");
    const vocabularyLevel = earnedLevel
        ? {
            value: earnedLevel.value,
            note: `${earnedLevel.label} · ${Math.round(earnedLevel.accuracy * 100)}% weighted accuracy`,
            progress: Math.round(earnedLevel.accuracy * 100),
        }
        : {
            value: "Beginner",
            note: beginnerBand?.accuracy != null
                ? `A1 · ${Math.round(beginnerBand.accuracy * 100)}% weighted accuracy`
                : "Not enough data yet",
            progress: beginnerBand?.accuracy != null
                ? Math.round(beginnerBand.accuracy * 100)
                : 0,
        };

    return {
        vocabularyLevel,
        learnedWords: { value: count("learned"), note: "Stable in recent tasks" },
        needsPractice: { value: count("needsPractice"), note: "Should return in the queue" },
        recovered: { value: count("recovered"), note: "Was weak, now correct" },
    };
}

export function saveLocalVocabularyEvaluation({ words = [], translations = {}, level = null, locale = "uk" } = {}) {
    const current = readMap();
    const now = new Date().toISOString();
    for (const evaluation of Array.isArray(words) ? words : []) {
        const word = normalizeWord(evaluation?.word);
        if (!word) continue;
        const existing = current[word] ?? {
            word, attempts: 0, correctCount: 0, mistakeCount: 0, correctStreak: 0,
            translations: {}, createdAt: now,
        };
        const correct = evaluation?.correct === true;
        existing.attempts += 1;
        existing.correctCount += correct ? 1 : 0;
        existing.mistakeCount += correct ? 0 : 1;
        existing.correctStreak = correct ? existing.correctStreak + 1 : 0;
        const evaluatedLevel = String(evaluation?.level ?? "").toUpperCase();
        const fallbackLevel = String(level ?? "").toUpperCase();
        if (existing.levelSource !== "evaluation") {
            existing.level = CEFR_LEVELS.has(evaluatedLevel)
                ? evaluatedLevel
                : CEFR_LEVELS.has(fallbackLevel) ? fallbackLevel : "-";
            existing.levelSource = "evaluation";
        }
        existing.usageHistory = Array.isArray(existing.usageHistory) ? existing.usageHistory : [];
        existing.usageHistory.push({ correct, occurredAt: now });
        existing.updatedAt = now;
        existing._synced = false;
        existing.displayLocale = String(locale || "uk-UA");
        existing.translations = { ...existing.translations, ...(translations[word] ? { [existing.displayLocale]: translations[word] } : {}) };
        if (!correct) existing.lastMistakeAt = now;
        current[word] = existing;
    }
    writeMap(current);
    return getLocalVocabularyWords();
}

export function saveLocalVocabularyTranslations(translations = {}, locale = null) {
    const current = readMap();
    for (const [rawWord, values] of Object.entries(translations || {})) {
        const word = normalizeWord(rawWord);
        if (!word || !current[word]) continue;
        current[word].translations = {
            ...(current[word].translations || {}),
            ...(values && typeof values === "object" ? values : {}),
        };
        if (locale) current[word].displayLocale = locale;
        current[word]._synced = false;
    }
    writeMap(current);
    return getLocalVocabularyWords();
}

export function saveLocalVocabularyCandidates(candidates = []) {
    if (!Array.isArray(candidates) || candidates.length === 0) return getLocalVocabularyWords();

    const now = new Date().toISOString();
    const current = readMap();

    for (const candidate of candidates) {
        const word = normalizeWord(candidate?.word);
        if (!word || LOCAL_STOP_WORDS.has(word)) continue;

        const existing = current[word] ?? {
            word,
            attempts: 0,
            correctCount: 0,
            mistakeCount: 0,
            correctStreak: 0,
            createdAt: now,
        };
        const isCorrect = candidate?.isCorrect === true || Number(candidate?.score) >= 100;
        const meaning = candidate?.meaning || "";

        existing.word = word;
        existing.meaning = meaning || existing.meaning || "";
        existing.level = candidate?.level || existing.level || "-";
        existing.example = candidate?.example || existing.example || "";
        existing.attempts = (Number(existing.attempts) || 0) + 1;
        existing.updatedAt = now;

        if (isCorrect) {
            existing.correctCount = (Number(existing.correctCount) || 0) + 1;
            existing.correctStreak = (Number(existing.correctStreak) || 0) + 1;
        } else {
            existing.mistakeCount = (Number(existing.mistakeCount) || 0) + 1;
            existing.correctStreak = 0;
            existing.lastMistakeAt = candidate?.occurredAt || now;
        }

        current[word] = existing;
    }

    writeMap(current);
    return getLocalVocabularyWords();
}

export function mergeVocabularyWords(remoteWords = [], locale = "uk-UA") {
    const merged = new Map();

    for (const word of Array.isArray(remoteWords) ? remoteWords : []) {
        const key = normalizeWord(word?.word || word?.id);
        if (key && (word?.displayStatus || word?.status)) {
        merged.set(key, {
            ...word,
            meaning: word?.translations?.[locale]
                || word?.translations?.[String(locale).split("-")[0]]
                || word?.meaning || word?.translations?.uk || "",
            });
        }
    }

    for (const word of getLocalVocabularyWords(locale)) {
        const key = normalizeWord(word.word);
        if (!key) continue;

        const existing = merged.get(key) || {};
        merged.set(key, {
            ...existing,
            ...word,
            meaning: word.meaning || existing.meaning || word.translations?.[word.displayLocale] || word.translations?.uk || "",
            level: word.level && word.level !== "-" ? word.level : existing.level || word.level,
        });
    }

    return [...merged.values()];
}

export function getLocalVocabularyRecords() {
    return Object.values(readMap()).filter((record) => record?.word);
}

export function markLocalVocabularySynced() {
    const current = readMap();
    for (const record of Object.values(current)) record._synced = true;
    writeMap(current);
}

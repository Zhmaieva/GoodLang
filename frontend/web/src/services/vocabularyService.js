const STORAGE_KEY = "goodlang_vocabulary_local";
const STORAGE_VERSION_KEY = "goodlang_vocabulary_local_version";
const STORAGE_VERSION = "8";
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
    if ((record.mistakeCount ?? 0) > 0 && (record.correctStreak ?? 0) < 2) {
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

    return {
        id: `local-${word}`,
        word,
        meaning: record.translations?.[displayLocale]
            || record.translations?.[String(displayLocale).split("-")[0]]
            || record.translations?.uk || "",
        translations: record.translations || {},
        level: record.level || "-",
        status: getStatus(record),
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
        .filter((item) => item.word && item.status && !LOCAL_STOP_WORDS.has(item.word));
}

export function buildLocalVocabularySummary(words = []) {
    const safeWords = Array.isArray(words) ? words : [];
    const count = (status) => safeWords.filter((word) => word.status === status).length;
    const level = safeWords.some((word) => word.level === "B2")
        ? "B2"
        : safeWords.some((word) => word.level === "B1") ? "B1" : "-";

    return {
        vocabularyLevel: { value: level, note: "Based on practiced words" },
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
        if (!word || LOCAL_STOP_WORDS.has(word)) continue;
        const existing = current[word] ?? {
            word, attempts: 0, correctCount: 0, mistakeCount: 0, correctStreak: 0,
            translations: {}, createdAt: now,
        };
        const correct = evaluation?.correct === true;
        existing.attempts += 1;
        existing.correctCount += correct ? 1 : 0;
        existing.mistakeCount += correct ? 0 : 1;
        existing.correctStreak = correct ? existing.correctStreak + 1 : 0;
        existing.level = level || existing.level || "-";
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
        if (key && !LOCAL_STOP_WORDS.has(key) && word?.status) {
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

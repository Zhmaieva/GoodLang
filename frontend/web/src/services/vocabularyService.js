const STORAGE_KEY = "goodlang_vocabulary_local";
const STORAGE_VERSION_KEY = "goodlang_vocabulary_local_version";
const STORAGE_VERSION = "7";
const FALLBACK_TRANSLATIONS_UK = {
    another: "інший",
    book: "книга",
    books: "книги",
    city: "місто",
    closer: "ближче",
    different: "інший, різний",
    easily: "легко",
    english: "англійська",
    "hadn't": "не мав / не зробив",
    hadnt: "не мав / не зробив",
    learn: "вчити, вивчати",
    learned: "вивчив",
    learning: "навчання",
    listen: "слухати",
    listening: "слухання",
    live: "жити",
    lived: "жив",
    move: "переїжджати, рухатися",
    moved: "переїхав, рухався",
    music: "музика",
    professional: "професійний",
    reading: "читання",
    ride: "їхати, кататися",
    ridden: "їздив, катався",
    sell: "продавати",
    sold: "продав",
    speak: "говорити",
    studied: "вчився, вивчав",
    study: "вчитися, вивчати",
    university: "університет",
    work: "робота, працювати",
};
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
    if ((record.mistakeCount ?? 0) > 0 && (record.correctStreak ?? 0) < 3) {
        return "needsPractice";
    }

    if ((record.correctStreak ?? 0) >= 5) {
        return "learned";
    }

    return "recovered";
}

function toVocabularyItem(record) {
    const attempts = Math.max(1, Number(record.attempts) || 1);
    const correctCount = Number(record.correctCount) || 0;
    const word = normalizeWord(record.word);

    return {
        id: `local-${word}`,
        word,
        meaning: record.meaning || FALLBACK_TRANSLATIONS_UK[word] || "",
        level: record.level || "-",
        status: getStatus(record),
        accuracy: Math.round((correctCount / attempts) * 100),
        previousMistakes: Number(record.mistakeCount) || 0,
        correctStreak: Number(record.correctStreak) || 0,
        lastMistake: getLastMistakeLabel(record.lastMistakeAt),
        example: record.example || "",
        source: "local",
    };
}

export function getLocalVocabularyWords() {
    return Object.values(readMap())
        .map(toVocabularyItem)
        .filter((item) => item.word && !LOCAL_STOP_WORDS.has(item.word));
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
        const meaning = candidate?.meaning || FALLBACK_TRANSLATIONS_UK[word] || "";

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

export function mergeVocabularyWords(remoteWords = []) {
    const merged = new Map();

    for (const word of Array.isArray(remoteWords) ? remoteWords : []) {
        const key = normalizeWord(word?.word || word?.id);
        if (key && !LOCAL_STOP_WORDS.has(key)) {
            merged.set(key, {
                ...word,
                meaning: word?.meaning || FALLBACK_TRANSLATIONS_UK[key] || "",
            });
        }
    }

    for (const word of getLocalVocabularyWords()) {
        const key = normalizeWord(word.word);
        if (!key) continue;

        const existing = merged.get(key) || {};
        merged.set(key, {
            ...existing,
            ...word,
            meaning: word.meaning || existing.meaning || "",
            level: word.level && word.level !== "-" ? word.level : existing.level || word.level,
        });
    }

    return [...merged.values()];
}

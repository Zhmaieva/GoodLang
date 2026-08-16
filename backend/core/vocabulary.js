import { translateVocabularyWords } from "./сore.js";

const FALLBACK_TRANSLATIONS_UK = Object.freeze({
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
});

const TRACKED_PARTS_OF_SPEECH = Object.freeze([
    "noun",
    "verb",
    "adjective",
    "adverb",
    "phrasal_verb",
    "phrase",
]);

const VOCABULARY_STOP_WORDS = new Set([
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

const STATUS_BY_SCORE = Object.freeze({
    learned: 90,
    recovered: 70,
});

export const VOCABULARY_POLICY = Object.freeze({
    trackedPartsOfSpeech: TRACKED_PARTS_OF_SPEECH,
    minWordLength: 3,
    statusByScore: STATUS_BY_SCORE,
    sourcePriority: [
        "learner_mistake",
        "correct_answer",
        "task_sentence",
        "manual",
    ],
});

export const VOCABULARY_WORDS = Object.freeze([
    {
        id: "appointment",
        word: "appointment",
        meaning: "зустріч, запис",
        level: "B1",
        status: "recovered",
        accuracy: 92,
        previousMistakes: 5,
        correctStreak: 6,
        lastMistake: "Ages ago",
        example: "I have an appointment at nine.",
    },
    {
        id: "borrow",
        word: "borrow",
        meaning: "позичати у когось",
        level: "A2",
        status: "needsPractice",
        accuracy: 38,
        previousMistakes: 7,
        correctStreak: 1,
        lastMistake: "Yesterday",
        example: "Can I borrow your pen?",
    },
    {
        id: "receipt",
        word: "receipt",
        meaning: "чек, квитанція",
        level: "B1",
        status: "needsPractice",
        accuracy: 64,
        previousMistakes: 3,
        correctStreak: 2,
        lastMistake: "Today",
        example: "Keep the receipt after you pay.",
    },
    {
        id: "neighbourhood",
        word: "neighbourhood",
        meaning: "район",
        level: "B1",
        status: "learned",
        accuracy: 100,
        previousMistakes: 2,
        correctStreak: 8,
        lastMistake: "Ages ago",
        example: "This neighbourhood is quiet.",
    },
    {
        id: "afford",
        word: "afford",
        meaning: "мати змогу оплатити",
        level: "B1",
        status: "needsPractice",
        accuracy: 44,
        previousMistakes: 6,
        correctStreak: 0,
        lastMistake: "Today",
        example: "I cannot afford a new laptop.",
    },
    {
        id: "eventually",
        word: "eventually",
        meaning: "зрештою",
        level: "B2",
        status: "recovered",
        accuracy: 88,
        previousMistakes: 4,
        correctStreak: 5,
        lastMistake: "Last week",
        example: "Eventually, we found the answer.",
    },
    {
        id: "refund",
        word: "refund",
        meaning: "повернення коштів",
        level: "B1",
        status: "needsPractice",
        accuracy: 71,
        previousMistakes: 2,
        correctStreak: 3,
        lastMistake: "Last week",
        example: "I asked for a refund.",
    },
]);

export const VOCABULARY_SUMMARY = Object.freeze({
    vocabularyLevel: {
        value: "B1",
        progress: 62,
        note: "Moving toward B2",
    },
    learnedWords: {
        value: 148,
        progress: 74,
        note: "Stable in recent tasks",
    },
    needsPractice: {
        value: 17,
        progress: 28,
        note: "Should return in the queue",
    },
    recovered: {
        value: 23,
        progress: 58,
        note: "Was weak, now correct",
    },
});

export function normalizeVocabularyWord(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[“”]/g, "\"")
        .replace(/[’‘]/g, "'")
        .replace(/^[^a-z]+|[^a-z]+$/gi, "")
        .replace(/\s+/g, " ");
}

export function getFallbackVocabularyMeaning(word, locale = "uk-UA") {
    const safeLocale = String(locale ?? "").toLowerCase();
    if (!safeLocale.startsWith("uk")) return "";

    return FALLBACK_TRANSLATIONS_UK[normalizeVocabularyWord(word)] ?? "";
}

export function shouldTrackVocabularyWord(value) {
    const word = normalizeVocabularyWord(value);
    if (word.length < VOCABULARY_POLICY.minWordLength) return false;
    if (VOCABULARY_STOP_WORDS.has(word)) return false;
    if (!/[a-z]/i.test(word)) return false;
    return true;
}

export function getVocabularyStatus({ attempts = 0, correctCount = 0, mistakeCount = 0 }) {
    const safeAttempts = Math.max(0, Number(attempts) || 0);
    const safeCorrect = Math.max(0, Number(correctCount) || 0);
    const safeMistakes = Math.max(0, Number(mistakeCount) || 0);
    const accuracy = safeAttempts > 0
        ? Math.round((safeCorrect / safeAttempts) * 100)
        : 0;

    if (accuracy >= STATUS_BY_SCORE.learned && safeMistakes === 0) return "learned";
    if (accuracy >= STATUS_BY_SCORE.recovered) return "recovered";
    return "needsPractice";
}

export function normalizeVocabularyCandidate(candidate = {}) {
    const word = normalizeVocabularyWord(candidate.word);
    if (!shouldTrackVocabularyWord(word)) return null;

    const score = Number(candidate.score);
    const isCorrect = candidate.isCorrect === true || score >= 100;

    return {
        word,
        meaning: String(candidate.meaning ?? "").trim(),
        level: String(candidate.level ?? "").trim().toUpperCase() || null,
        partOfSpeech: TRACKED_PARTS_OF_SPEECH.includes(candidate.partOfSpeech)
            ? candidate.partOfSpeech
            : null,
        source: String(candidate.source ?? "manual").trim() || "manual",
        example: String(candidate.example ?? "").trim(),
        isCorrect,
        score: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : isCorrect ? 100 : 0,
        occurredAt: candidate.occurredAt ? new Date(candidate.occurredAt) : new Date(),
    };
}

export function extractVocabularyCandidatesFromText(text, options = {}) {
    const sourceText = String(text ?? "");
    const tokens = sourceText.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
    const seen = new Set();

    return tokens
        .map((token) => normalizeVocabularyWord(token))
        .filter((word) => {
            if (!shouldTrackVocabularyWord(word) || seen.has(word)) return false;
            seen.add(word);
            return true;
        })
        .map((word) => normalizeVocabularyCandidate({
            word,
            level: options.level,
            source: options.source ?? "task_sentence",
            example: sourceText,
            isCorrect: options.isCorrect,
            score: options.score,
            occurredAt: options.occurredAt,
        }))
        .filter(Boolean);
}

export async function enrichVocabularyCandidates(candidates = [], options = {}) {
    if (!Array.isArray(candidates) || candidates.length === 0) return [];

    const wordsNeedingTranslation = [...new Set(candidates
        .filter((candidate) => !String(candidate?.meaning ?? "").trim())
        .map((candidate) => normalizeVocabularyWord(candidate?.word))
        .filter(shouldTrackVocabularyWord))];

    if (!wordsNeedingTranslation.length) return candidates;

    let translations = {};
    try {
        translations = await translateVocabularyWords({
            words: wordsNeedingTranslation,
            locale: options.userLocale ?? "uk-UA",
        });
    } catch (error) {
        console.error("Failed to translate vocabulary words:", error);
    }

    return candidates.map((candidate) => {
        if (String(candidate?.meaning ?? "").trim()) return candidate;

        const word = normalizeVocabularyWord(candidate?.word);
        return {
            ...candidate,
            meaning: translations[word]
                ?? getFallbackVocabularyMeaning(word, options.userLocale)
                ?? "",
        };
    });
}

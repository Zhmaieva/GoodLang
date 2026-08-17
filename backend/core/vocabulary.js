import { translateVocabularyWords } from "./сore.js";

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

export const VOCABULARY_POLICY = Object.freeze({
    trackedPartsOfSpeech: TRACKED_PARTS_OF_SPEECH,
    minWordLength: 3,
    sourcePriority: [
        "learner_mistake",
        "correct_answer",
        "task_sentence",
        "manual",
    ],
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
    return "";
}

export function shouldTrackVocabularyWord(value) {
    const word = normalizeVocabularyWord(value);
    if (word.length < VOCABULARY_POLICY.minWordLength) return false;
    if (VOCABULARY_STOP_WORDS.has(word)) return false;
    if (!/[a-z]/i.test(word)) return false;
    return true;
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

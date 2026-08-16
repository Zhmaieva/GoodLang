import { connectDB } from "../mongo.js";
import {
    getVocabularyStatus,
    normalizeVocabularyCandidate,
} from "../../core/vocabulary.js";

const COLLECTION = "good_lang_vocabulary";
const CAPTURE_VERSION = 5;

function getLastMistakeLabel(lastMistakeAt) {
    if (!lastMistakeAt) return "Ages ago";

    const date = lastMistakeAt instanceof Date ? lastMistakeAt : new Date(lastMistakeAt);
    if (Number.isNaN(date.getTime())) return "Ages ago";

    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return "Last week";
    return "Ages ago";
}

function toVocabularyItem(doc) {
    const attempts = Math.max(0, Number(doc.attempts) || 0);
    const correctCount = Math.max(0, Number(doc.correctCount) || 0);
    const mistakeCount = Math.max(0, Number(doc.mistakeCount) || 0);
    const accuracy = attempts > 0
        ? Math.round((correctCount / attempts) * 100)
        : 0;

    return {
        id: doc.word,
        word: doc.word,
        meaning: doc.meaning ?? "",
        level: doc.level ?? "",
        status: getVocabularyStatus({ attempts, correctCount, mistakeCount }),
        accuracy,
        previousMistakes: mistakeCount,
        correctStreak: Math.max(0, Number(doc.correctStreak) || 0),
        lastMistake: getLastMistakeLabel(doc.lastMistakeAt),
        example: doc.example ?? "",
        captureVersion: doc.captureVersion ?? 0,
    };
}

export async function upsertVocabularyCandidates(userId, candidates = [], updatedOn = new Date()) {
    const normalized = candidates
        .map((candidate) => normalizeVocabularyCandidate(candidate))
        .filter(Boolean);

    if (!normalized.length) return { inserted: 0 };

    const db = await connectDB();
    const bulk = db.collection(COLLECTION).initializeUnorderedBulkOp();

    for (const candidate of normalized) {
        const isCorrect = candidate.isCorrect === true;
        const setFields = {
            userId,
            word: candidate.word,
            level: candidate.level,
            partOfSpeech: candidate.partOfSpeech,
            source: candidate.source,
            example: candidate.example,
            captureVersion: CAPTURE_VERSION,
            updatedAt: updatedOn,
            ...(isCorrect ? {} : { lastMistakeAt: candidate.occurredAt }),
        };

        if (candidate.meaning) {
            setFields.meaning = candidate.meaning;
        }

        bulk.find({ userId, word: candidate.word })
            .upsert()
            .updateOne({
                $set: setFields,
                $inc: {
                    attempts: 1,
                    correctCount: isCorrect ? 1 : 0,
                    mistakeCount: isCorrect ? 0 : 1,
                },
                $setOnInsert: {
                    createdAt: updatedOn,
                    correctStreak: 0,
                },
            });
    }

    await bulk.execute();

    for (const candidate of normalized) {
        const isCorrect = candidate.isCorrect === true;
        await db.collection(COLLECTION).updateOne(
            { userId, word: candidate.word },
            isCorrect
                ? { $inc: { correctStreak: 1 } }
                : { $set: { correctStreak: 0 } }
        );
    }

    return { inserted: normalized.length };
}

export async function getVocabularyForUser(userId) {
    const db = await connectDB();
    const docs = await db.collection(COLLECTION)
        .find({ userId, captureVersion: { $gte: CAPTURE_VERSION } })
        .sort({ updatedAt: -1, word: 1 })
        .toArray();

    return docs.map(toVocabularyItem);
}

export function buildVocabularySummary(words = []) {
    const learnedWords = words.filter((word) => word.status === "learned").length;
    const needsPractice = words.filter((word) => word.status === "needsPractice").length;
    const recovered = words.filter((word) => word.status === "recovered").length;
    const averageAccuracy = words.length
        ? Math.round(words.reduce((sum, word) => sum + (Number(word.accuracy) || 0), 0) / words.length)
        : 0;

    return {
        vocabularyLevel: {
            value: words.some((word) => word.level === "B2") ? "B2" : "B1",
            progress: averageAccuracy,
            note: "Based on your recent practice",
        },
        learnedWords: {
            value: learnedWords,
            progress: words.length ? Math.round((learnedWords / words.length) * 100) : 0,
            note: "Stable in recent tasks",
        },
        needsPractice: {
            value: needsPractice,
            progress: words.length ? Math.round((needsPractice / words.length) * 100) : 0,
            note: "Should return in the queue",
        },
        recovered: {
            value: recovered,
            progress: words.length ? Math.round((recovered / words.length) * 100) : 0,
            note: "Was weak, now correct",
        },
    };
}

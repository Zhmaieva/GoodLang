import { connectDB } from "../mongo.js";
import { normalizeVocabularyCandidate } from "../../core/vocabulary.js";

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
    const mistakeCount = Math.max(0, Number(doc.mistakeCount) || 0);
    const correctStreak = Math.max(0, Number(doc.correctStreak) || 0);
    const attempts = Math.max(0, Number(doc.attempts) || 0);
    const correctCount = Math.max(0, Number(doc.correctCount) || 0);
    const status = mistakeCount === 0
        ? null
        : correctStreak >= 4 ? "learned" : correctStreak >= 2 ? "recovered" : "needsPractice";
    const isAlwaysCorrect = attempts > 0 && mistakeCount === 0 && correctCount === attempts;

    return {
        id: doc.word,
        word: doc.word,
        meaning: doc.translations?.uk ?? doc.meaning ?? "",
        translations: doc.translations ?? {},
        level: doc.level ?? "",
        status,
        displayStatus: status || (isAlwaysCorrect ? "learned" : null),
        attempts,
        correctCount,
        previousMistakes: mistakeCount,
        correctStreak,
        lastPracticeAt: doc.lastPracticeAt ?? doc.updatedAt ?? null,
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
            lastPracticeAt: candidate.occurredAt ?? updatedOn,
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

export async function upsertLocalVocabularyRecords(userId, records = [], updatedOn = new Date()) {
    const valid = Array.isArray(records) ? records.filter((record) => record?.word) : [];
    if (!valid.length) return;
    const db = await connectDB();
    const bulk = db.collection(COLLECTION).initializeUnorderedBulkOp();
    for (const record of valid) {
        const word = String(record.word).trim().toLowerCase();
        const usageHistory = Array.isArray(record.usageHistory) ? record.usageHistory : [];
        const lastPracticeAt = record.lastPracticeAt
            ?? usageHistory[usageHistory.length - 1]?.occurredAt
            ?? record.updatedAt
            ?? updatedOn;
        const parsedLastPracticeAt = new Date(lastPracticeAt);
        const safeLastPracticeAt = Number.isNaN(parsedLastPracticeAt.getTime())
            ? updatedOn
            : parsedLastPracticeAt;
        bulk.find({ userId, word }).upsert().updateOne({
            $set: {
                userId, word, level: record.level ?? null, levelSource: record.levelSource ?? null,
                translations: record.translations ?? {}, example: record.example ?? "",
                attempts: Math.max(0, Number(record.attempts) || 0),
                correctCount: Math.max(0, Number(record.correctCount) || 0),
                mistakeCount: Math.max(0, Number(record.mistakeCount) || 0),
                correctStreak: Math.max(0, Number(record.correctStreak) || 0),
                usageHistory,
                lastPracticeAt: safeLastPracticeAt,
                lastMistakeAt: record.lastMistakeAt ? new Date(record.lastMistakeAt) : null,
                updatedAt: updatedOn, captureVersion: CAPTURE_VERSION,
            },
            $setOnInsert: { createdAt: updatedOn },
        });
    }
    await bulk.execute();
}

export function buildVocabularySummary(words = []) {
    const displayStatus = (word) => word.displayStatus || word.status;
    const learnedWords = words.filter((word) => displayStatus(word) === "learned").length;
    const needsPractice = words.filter((word) => displayStatus(word) === "needsPractice").length;
    const recovered = words.filter((word) => displayStatus(word) === "recovered").length;
    return {
        vocabularyLevel: {
            value: words.some((word) => word.level === "B2") ? "B2" : words.some((word) => word.level === "B1") ? "B1" : "-",
            note: "Based on practiced words",
        },
        learnedWords: {
            value: learnedWords,
            note: "Stable in recent tasks",
        },
        needsPractice: {
            value: needsPractice,
            note: "Should return in the queue",
        },
        recovered: {
            value: recovered,
            note: "Was weak, now correct",
        },
    };
}

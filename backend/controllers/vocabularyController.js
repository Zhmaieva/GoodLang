import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    enrichVocabularyCandidates,
    extractVocabularyCandidatesFromText,
} from "../core/vocabulary.js";
import {
    evaluateVocabularyUsage,
    SUPPORTED_VOCABULARY_LOCALES,
    translateVocabularyWords,
    translateVocabularyWordsForLocales,
} from "../core/сore.js";
import {
    checkTranslationLimit,
    getTranslationCallCountSince,
} from "../database/repositories/accountLogRepository.js";
import {
    buildVocabularySummary,
    getVocabularyForUser,
    upsertVocabularyCandidates,
} from "../database/repositories/vocabularyRepository.js";

const name = "vocabulary";

async function ensureVocabularyQuota(accountId, res) {
    const { allowed, waitTimeSeconds } = await checkTranslationLimit(accountId, true);

    if (allowed) return true;

    res.status(429).json({
        message: "Free translation limit reached. Wait or upgrade to premium.",
        waitTimeSeconds,
    });
    return false;
}

export const vocabularyController = {
    mapRoutes: function (app) {
        app.get(`/${name}`, authMiddleware, async (req, res) => {
            try {
                const translationCount = await getTranslationCallCountSince(req.user.id, new Date(0));

                if (translationCount === 0) {
                    return res.json({
                        state: "noPracticeYet",
                        words: [],
                        summary: null,
                    });
                }

                const userWords = await getVocabularyForUser(req.user.id);

                if (userWords.length > 0) {
                    return res.json({
                        state: "ready",
                        source: "user",
                        words: userWords,
                        summary: buildVocabularySummary(userWords),
                    });
                }

                return res.json({ state: "ready", source: "user", words: [], summary: buildVocabularySummary([]) });
            } catch (error) {
                console.error("Failed to load vocabulary:", error);
                return res.status(500).json({ error: "Failed to load vocabulary" });
            }
        });

        app.post(`/${name}/evaluate`, authMiddleware, async (req, res) => {
            try {
                if (!(await ensureVocabularyQuota(req.user.id, res))) return;

                const result = await evaluateVocabularyUsage({
                    targetSentence: req.body?.targetSentence,
                    userAnswer: req.body?.userAnswer,
                    targetLocale: req.body?.targetLocale ?? "uk-UA",
                    fallbackLevel: req.body?.level ?? "A1",
                });
                return res.json({ isSuccess: true, ...result });
            } catch (error) {
                console.error("Failed to evaluate vocabulary usage:", error);
                return res.status(500).json({ error: "Failed to evaluate vocabulary usage" });
            }
        });

        app.post(`/${name}/translations`, authMiddleware, async (req, res) => {
            try {
                if (!(await ensureVocabularyQuota(req.user.id, res))) return;

                const words = Array.isArray(req.body?.words) ? req.body.words : [];
                const translations = req.body?.allLocales
                    ? await translateVocabularyWordsForLocales({
                        words,
                        locales: SUPPORTED_VOCABULARY_LOCALES,
                    })
                    : Object.fromEntries(Object.entries(await translateVocabularyWords({
                        words,
                        locale: req.body?.locale ?? "uk-UA",
                    })).map(([word, translation]) => [word, {
                        [req.body?.locale ?? "uk-UA"]: translation,
                    }]));
                return res.json({ isSuccess: true, translations });
            } catch (error) {
                console.error("Failed to translate vocabulary words:", error);
                return res.status(500).json({ error: "Failed to translate vocabulary words" });
            }
        });

        app.post(`/${name}/candidates`, authMiddleware, async (req, res) => {
            try {
                const candidates = Array.isArray(req.body?.candidates)
                    ? req.body.candidates
                    : [];
                const textCandidates = Array.isArray(req.body?.texts)
                    ? req.body.texts.flatMap((item) => extractVocabularyCandidatesFromText(item?.text, {
                        level: item?.level,
                        source: item?.source,
                        isCorrect: item?.isCorrect,
                        score: item?.score,
                        occurredAt: item?.occurredAt,
                    }))
                    : [];

                const enrichedCandidates = await enrichVocabularyCandidates([
                    ...candidates,
                    ...textCandidates,
                ], {
                    userLocale: req.body?.userLocale ?? req.query?.userLocale ?? "uk-UA",
                });

                const result = await upsertVocabularyCandidates(req.user.id, enrichedCandidates);
                const userWords = await getVocabularyForUser(req.user.id);

                return res.json({
                    isSuccess: true,
                    ...result,
                    words: userWords,
                    summary: buildVocabularySummary(userWords),
                });
            } catch (error) {
                console.error("Failed to save vocabulary candidates:", error);
                return res.status(500).json({ error: "Failed to save vocabulary candidates" });
            }
        });
    },
};

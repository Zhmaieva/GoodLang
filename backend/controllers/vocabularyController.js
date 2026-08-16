import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    enrichVocabularyCandidates,
    extractVocabularyCandidatesFromText,
    VOCABULARY_SUMMARY,
    VOCABULARY_WORDS,
} from "../core/vocabulary.js";
import { getTranslationCallCountSince } from "../database/repositories/accountLogRepository.js";
import {
    buildVocabularySummary,
    getVocabularyForUser,
    upsertVocabularyCandidates,
} from "../database/repositories/vocabularyRepository.js";

const name = "vocabulary";

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

                return res.json({
                    state: "ready",
                    source: "seed",
                    words: VOCABULARY_WORDS,
                    summary: VOCABULARY_SUMMARY,
                });
            } catch (error) {
                console.error("Failed to load vocabulary:", error);
                return res.status(500).json({ error: "Failed to load vocabulary" });
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

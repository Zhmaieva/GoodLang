import {clearText, evaluateAndCoach, preEvaluate, randomRule, shuffleBySeed} from "../core/сore.js";
import { ALL_RULES_SAMPLES } from "../core/allRulesSamples.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkTranslationLimit, recordTranslationUsage } from "../database/repositories/accountLogRepository.js";
import { GrammarRule } from "../core/rules.js";

const name = "translations";
const locale = "ua";

export const translationsController = {
    mapRoutes: function (app) {
        app.get(`/${name}/`, authMiddleware, async (req, res, next) => {
            return this.handleTranslationRequest(req, res, next);
        });
    },

    /**
     * Основна логіка обробки перекладу / отримання нового прикладу.
     * Можна викликати з різних роутів з різними опціями (наприклад, skipCoach).
     */
    handleTranslationRequest: async function (req, res, next, { skipCoach = false } = {}) {
        try {
            const accountId = req.user.id;

            const {
                level,
                rules,
                translation,
                textToTranslate,
                skip,
                seed,
                freeTraining,
            } = req.query;

            // --- нормалізація rules ---
            let rulesArr = [];
            if (Array.isArray(rules)) {
                rulesArr = rules;
            } else if (typeof rules === "string" && rules.trim()) {
                rulesArr = rules.split(",").map((r) => r.trim()).filter(Boolean);
            }

            // --- якщо textToTranslate немає — віддаємо новий приклад ---
            if (!textToTranslate) {
                const selectedRule =
                    rulesArr.length > 0 ? GrammarRule[rulesArr[0]] : randomRule(level ?? "A1");

                const samples = shuffleBySeed(ALL_RULES_SAMPLES[selectedRule], seed ?? 1);
                const skipRaw = typeof skip === "string" ? skip : "0";
                const adjustedSkip = Math.floor(Number(skipRaw || "0") % samples.length);
                const sample = samples[adjustedSkip];

                return res.json({
                    rules: sample.rules,
                    textToTranslate: sample[locale],
                    isAnswerCorrect: false,
                    correctAnswer: "",
                    tipIfWrong: "",
                    score: 0,
                    skip: adjustedSkip + 1,
                });
            }

            if (!skipCoach) {
                // --- ліміт перекладів ---
                const { allowed, waitTimeSeconds } = await checkTranslationLimit(accountId);

                if (!allowed) {
                    return res.status(429).json({
                        message: `Free translation limit reached. Wait or upgrade to premium.`,
                        waitTimeSeconds: waitTimeSeconds,
                    });
                }
            }

            // --- попередня оцінка ---
            let result = preEvaluate({
                rules: rulesArr,
                targetLanguage: "Ukrainian",
                userEnglish: translation ?? "",
                textToTranslate: textToTranslate ?? "",
            });

            // --- повна оцінка з коучингом (якщо не просили пропустити) ---
            if (!result.answer_is_correct && !skipCoach) {
                result = await evaluateAndCoach({
                    rules: rulesArr,
                    targetLanguage: "Ukrainian",
                    userEnglish: translation ?? "",
                    textToTranslate: textToTranslate ?? "",
                });
            }

            // --- підбір наступного прикладу ---
            let newTextToTranslate = "";
            let newRules = rulesArr;

            const currentSkip = Number.parseInt(skip || "0", 10) || 0;
            const newSkip = currentSkip + 1;

            let scores = result.scores || [];

            for (let i = 0; i < scores.length; i++) {
                if (scores[i] < 1 || (!level && !freeTraining)) {
                    const targetRule = rulesArr[i];

                    const ruleSamples = ALL_RULES_SAMPLES[targetRule] || [];
                    if (ruleSamples.length === 0) break;

                    const shuffled = shuffleBySeed(ruleSamples, seed ?? 1);
                    const adjustedSkip = Math.floor(Number(currentSkip + 1 || "0") % shuffled.length);
                    const nextSample = shuffled[adjustedSkip];

                    if (nextSample) {
                        newRules = nextSample.rules;
                        newTextToTranslate = nextSample[locale];
                    }

                    break;
                }
            }

            if (!skipCoach)
                await recordTranslationUsage(accountId);

            if (!result.answer_is_correct && clearText(result.correct_answer) === clearText(translation)) {
                scores = rulesArr.map(_ => 1);
                result.tip_if_wrong = null;
                result.correct_answer = null;
                result.answer_is_correct = true;
            }

            return res.json({
                rules: newRules,
                textToTranslate: newTextToTranslate,
                isAnswerCorrect: result.answer_is_correct,
                correctAnswer: result.correct_answer,
                tipIfWrong: result.tip_if_wrong,
                scores: scores,
                skip: newSkip,
            });
        } catch (e) {
            if (!skipCoach)
                console.log(e);
            next(e);
        }
    },
};

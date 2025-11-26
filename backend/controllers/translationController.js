import {evaluateAndCoach, preEvaluate, randomRule, shuffleBySeed} from "../core/сore.js";
import {ALL_RULES_SAMPLES} from "../core/allRulesSamples.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {checkTranslationLimit, recordTranslationUsage} from "../database/repositories/accountLogRepository.js";
import {GrammarRule} from "../core/rules.js";

const name = 'translations';
const locale = 'ua';

export const translationsController = {
    mapRoutes: function (app) {
        app.get(`/${name}/`, authMiddleware, async (req, res, next) => {
            try {
                const accountId = req.user.id;

                const { level, rules, translation, textToTranslate, skip, seed, freeTraining } = req.query;

                let rulesArr = Array.isArray(rules) ? (rules ?? []) : (rules.trim() ? rules.split(',') : []);

                if (!textToTranslate) {
                    const selectedRule = rulesArr.length > 0 ? GrammarRule[rulesArr[0]] : randomRule(level ?? 'A1');

                    const samples = shuffleBySeed(ALL_RULES_SAMPLES[selectedRule], seed ?? 1);
                    const skipNumber = Math.floor((skip ?? '0') % samples.length);
                    const sample = samples[skipNumber];

                    return res.json({
                        rules: sample.rules,
                        textToTranslate: sample[locale],
                        isAnswerCorrect: false,
                        correctAnswer: "",
                        tipIfWrong: "",
                        score: 0,
                        skip: skipNumber + 1
                    });
                }

                const { allowed, waitTimeSeconds } = await checkTranslationLimit(accountId);

                if (!allowed) {
                    return res.status(429).json({
                        message: `Free translation limit reached. Wait or upgrade to premium.`,
                        waitTimeSeconds: waitTimeSeconds
                    });
                }

                let result = preEvaluate({
                    rules: rulesArr,
                    targetLanguage: "Ukrainian",
                    userEnglish: translation ?? "",
                    textToTranslate: textToTranslate ?? ""
                });

                if (!result.answer_is_correct) {
                    result = await evaluateAndCoach({
                        rules: rulesArr,
                        targetLanguage: "Ukrainian",
                        userEnglish: translation ?? "",
                        textToTranslate: textToTranslate ?? ""
                    });
                }

                let newTextToTranslate = "";
                let newRules = rulesArr;
                let newSkip = Number.parseInt(skip) + 1;

                const scores = result.scores;
                for (let i = 0; i < scores.length; i++) {
                    if (scores[i] < 1 || (!level && !freeTraining)) { // keep training failed rule or if it is a dedicated per-rule training
                        const targetRule = rulesArr[i];
                        const newSample = shuffleBySeed(ALL_RULES_SAMPLES[targetRule], seed ?? 1)[newSkip];
                        newRules = newSample.rules;
                        newTextToTranslate = newSample[locale];
                        break;
                    }
                }

                await recordTranslationUsage(accountId);

                return res.json({
                    rules: newRules,
                    textToTranslate: newTextToTranslate,
                    isAnswerCorrect: result.answer_is_correct,
                    correctAnswer: result.correct_answer,
                    tipIfWrong: result.tip_if_wrong,
                    scores: scores,
                    skip: newSkip
                });
            }  catch (e) {
                next(e);
            }
        });

    }
}

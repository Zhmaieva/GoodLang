import {
    clearText,
    evaluateAndCoach,
    evaluateGapAndCoach,
    preEvaluate,
    randomRule,
    shuffleBySeed
} from "../core/сore.js";
import { ALL_RULES_SAMPLES } from "../core/allRulesSamples.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkTranslationLimit, recordTranslationUsage } from "../database/repositories/accountLogRepository.js";
import {GrammarRule, LEVEL_RULES} from "../core/rules.js";
import {ALL_GAPS_SAMPLES} from "../core/allGapsSamples.js";

const name = "translations";
const locale = "ua";

const RULE_TO_LEVEL = (() => {
    const map = Object.create(null);
    for (const [lvl, arr] of Object.entries(LEVEL_RULES)) {
        for (const r of arr) map[r] = lvl;
    }
    return Object.freeze(map);
})();

function getRuleLevel(ruleId) {
    return RULE_TO_LEVEL[String(ruleId)] ?? null;
}

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
                task_type = "0",
                use_same_task_type = "true",
            } = req.query;

            const taskType = Number(task_type) || 0;
            const useSameTaskType =
                String(use_same_task_type).toLowerCase() === "true" ||
                String(use_same_task_type) === "1";

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
                console.log(selectedRule);

                // -------------------------------
                // TASK TYPE 1: GAPS (A1 only for now)
                // -------------------------------
                if (taskType === 1) {
                    const samples = shuffleBySeed(ALL_GAPS_SAMPLES[selectedRule], seed ?? 1);

                    const skipRaw = typeof skip === "string" ? skip : "0";
                    const adjustedSkip = Math.floor(Number(skipRaw || "0") % samples.length);
                    const sample = samples[adjustedSkip];

                    const { allowed, waitTimeSeconds } = skipCoach
                        ? { allowed: true, waitTimeSeconds: 0 }
                        : await checkTranslationLimit(accountId);

                    return res.json({
                        taskType: 1,
                        rules: sample.rules,
                        textToTranslate: sample.en,
                        options: sample.options,
                        isAnswerCorrect: false,
                        correctAnswer: "",
                        tipIfWrong: "",
                        scores: [],
                        skip: adjustedSkip + 1,
                        allowed,
                        waitTimeSeconds,
                    });
                }

                // -------------------------------
                // TASK TYPE 0: TRANSLATION
                // -------------------------------

                const samples = shuffleBySeed(ALL_RULES_SAMPLES[selectedRule], seed ?? 1);
                const skipRaw = typeof skip === "string" ? skip : "0";
                const adjustedSkip = Math.floor(Number(skipRaw || "0") % samples.length);
                const sample = samples[adjustedSkip];

                const { allowed, waitTimeSeconds } = skipCoach
                    ? { allowed: true, waitTimeSeconds: 0 }
                    : await checkTranslationLimit(accountId);

                return res.json({
                    taskType: 0,
                    rules: sample.rules,
                    textToTranslate: sample[locale],
                    isAnswerCorrect: false,
                    correctAnswer: "",
                    tipIfWrong: "",
                    score: 0,
                    hint: sample.hint,
                    skip: adjustedSkip + 1,
                    allowed,
                    waitTimeSeconds,
                });
            }

            if ((translation?.length ?? 0) >= 200) {
                return res.status(400).send("Message too long.");
            }

            if (!skipCoach) {
                const { allowed, waitTimeSeconds } = await checkTranslationLimit(accountId, false);
                if (!allowed) {
                    return res.status(429).json({
                        message: `Free translation limit reached. Wait or upgrade to premium.`,
                        waitTimeSeconds,
                    });
                }
            }

            // -------------------------------
            // EVALUATION
            // -------------------------------
            let result;

            if (taskType === 1) {
                const selectedRule = GrammarRule[rulesArr[0]];
                // Find the gap sample by its "en" prompt (must exist so we know correct/options)
                const gapSample = ALL_GAPS_SAMPLES[selectedRule].find((s) => {
                    if (!s) return false;

                    const enVal = s.en;

                    const sameOption = s.options.some(o => o === translation);

                    const sameEn = Array.isArray(enVal)
                        ? enVal.includes(textToTranslate)
                        : String(enVal) === String(textToTranslate);

                    // If rulesArr is provided, try to match at least rule[0]
                    const sameRule =
                        !rulesArr?.length ||
                        (Array.isArray(s.rules) && s.rules[0] === rulesArr[0]);

                    return sameOption && sameEn && sameRule;
                });

                if (!gapSample) {
                    return res.status(400).json({
                        message: "Gap task not found for evaluation.",
                    });
                }

                // Use your hybrid evaluator (LLM only for tip if wrong; sample/scores deterministic)
                result = await evaluateGapAndCoach({
                    task: gapSample,
                    userAnswer: translation ?? "",
                    targetLanguage: "Ukrainian",
                });
            } else {
                // Translation path (keeps your current behavior)
                result = preEvaluate({
                    rules: rulesArr,
                    targetLanguage: "Ukrainian",
                    userEnglish: translation ?? "",
                    textToTranslate: textToTranslate ?? "",
                });

                if (!result.answer_is_correct && !skipCoach) {
                    result = await evaluateAndCoach({
                        rules: rulesArr,
                        targetLanguage: "Ukrainian",
                        userEnglish: translation ?? "",
                        textToTranslate: textToTranslate ?? "",
                    });
                }
            }

            // -------------------------------
            // PICK NEXT TASK
            // -------------------------------
            let newTextToTranslate = "";
            let newRules = rulesArr;
            let newOptions = null; // only for gaps
            let newTaskType = taskType;

            const currentSkip = Number.parseInt(skip || "0", 10) || 0;
            const newSkip = currentSkip + 1;

            let scores = result.scores || [];

            // decide next task type rule (only if we actually select a new task below)
            const decideNextTaskType = (targetRule) => {
                if (useSameTaskType) return taskType;

                // "always gaps after gaps"
                if (taskType === 1) return 1;

                const nextRuleLevel = getRuleLevel(targetRule);
                if (taskType === 0 && nextRuleLevel === "A1") return 1;

                return 0;
            };

            for (let i = 0; i < scores.length; i++) {
                if (scores[i] < 1 || (!level && !freeTraining)) {
                    const targetRule = rulesArr[i];

                    // determine which task type we should serve next
                    newTaskType = decideNextTaskType(targetRule);

                    if (newTaskType === 1) {
                        const selectedRule =
                            rulesArr.length > 0 ? GrammarRule[rulesArr[0]] : randomRule(level ?? "A1");
                        // pick next from gaps samples (filtered by rule)
                        const gapRuleSamples = ALL_GAPS_SAMPLES[selectedRule].filter(
                            (s) => Array.isArray(s.rules) && s.rules[0] === targetRule
                        );

                        if (gapRuleSamples.length === 0) break;

                        const shuffled = shuffleBySeed(gapRuleSamples, seed ?? 1);
                        const adjustedSkip = Math.floor(Number(currentSkip + 1 || "0") % shuffled.length);
                        const nextSample = shuffled[adjustedSkip];

                        if (nextSample) {
                            newRules = nextSample.rules;
                            newTextToTranslate = nextSample.en;
                            newOptions = nextSample.options;
                        }
                    } else {
                        // translation samples
                        const ruleSamples = ALL_RULES_SAMPLES[targetRule] || [];
                        if (ruleSamples.length === 0) break;

                        const shuffled = shuffleBySeed(ruleSamples, seed ?? 1);
                        const adjustedSkip = Math.floor(Number(currentSkip + 1 || "0") % shuffled.length);
                        const nextSample = shuffled[adjustedSkip];

                        if (nextSample) {
                            newRules = nextSample.rules;
                            newTextToTranslate = nextSample[locale];
                        }
                    }

                    break;
                }
            }

            if (!skipCoach) {
                await recordTranslationUsage(accountId);
            }

            // preserve your "correct_answer matches translation but model said wrong" fix
            if (
                !result.answer_is_correct &&
                clearText(result.correct_answer) === clearText(translation)
            ) {
                scores = rulesArr.map(() => 1);
                result.tip_if_wrong = null;
                result.correct_answer = null;
                result.answer_is_correct = true;
            }

            const { allowed, waitTimeSeconds } = skipCoach
                ? { allowed: true, waitTimeSeconds: 0 }
                : await checkTranslationLimit(accountId);

            return res.json({
                taskType: newTaskType,
                rules: newRules,
                textToTranslate: newTextToTranslate,
                options: newTaskType === 1 ? newOptions : undefined,

                isAnswerCorrect: result.answer_is_correct,
                correctAnswer: result.correct_answer,
                tipIfWrong: result.tip_if_wrong,
                scores: scores,
                skip: newSkip,
                allowed,
                waitTimeSeconds,
            });
        } catch (e) {
            if (!skipCoach) console.log(e);
            next(e);
        }
    },
};

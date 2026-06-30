import {
    clearText,
    evaluateAndCoach,
    evaluateGapAndCoach,
    generateGapSample,
    generateTranslationSample,
    preEvaluate,
    randomRule
} from "../core/сore.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkTranslationLimit, recordTranslationUsage } from "../database/repositories/accountLogRepository.js";
import {GrammarRule, LEVEL_RULES} from "../core/rules.js";
import {answerNextMarathonTaskByRuleId} from "../database/repositories/marathonsRepository.js";
import {getAccountById} from "../database/repositories/accountsRepository.js";

const name = "translations";
const PROJECT_RULES = Object.freeze(Object.values(GrammarRule));
const PROJECT_RULE_SET = new Set(PROJECT_RULES);

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

function normalizeRulesInput(rules) {
    const raw = Array.isArray(rules)
        ? rules
        : typeof rules === "string" && rules.trim()
            ? rules.split(",")
            : [];

    const normalized = [];
    for (const item of raw) {
        const ruleId = String(item ?? "").trim();
        const resolved = GrammarRule[ruleId] ?? ruleId;
        if (!PROJECT_RULE_SET.has(resolved) || normalized.includes(resolved)) continue;
        normalized.push(resolved);
    }

    return normalized;
}

function parseSkip(skip) {
    const parsed = Number.parseInt(String(skip ?? "0"), 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function parseOptionsInput(options) {
    if (Array.isArray(options)) {
        return options.map((o) => String(o ?? "").trim());
    }
    if (typeof options === "string") {
        return options.split(",").map((o) => String(o ?? "").trim());
    }
    return [];
}

function normalizeScores(scores, rules, isCorrect) {
    const normalized = Array.isArray(scores) ? scores.slice(0, rules.length) : [];
    while (normalized.length < rules.length) {
        normalized.push(isCorrect ? 1 : 0);
    }
    return normalized.map((score) => {
        const n = Number(score);
        if (!Number.isFinite(n)) return isCorrect ? 1 : 0;
        return Math.max(0, Math.min(1, n));
    });
}

function uniqueValidRules(rules) {
    const out = [];
    for (const rule of Array.isArray(rules) ? rules : []) {
        const ruleId = String(rule ?? "").trim();
        if (!PROJECT_RULE_SET.has(ruleId) || out.includes(ruleId)) continue;
        out.push(ruleId);
    }
    return out;
}

async function buildRuntimeTask({
                                    taskType,
                                    targetRules,
                                    level,
                                    seed,
                                    skip,
                                    userLocale,
                                }) {
    const requestedRules = uniqueValidRules(targetRules);
    const rulesForSample = requestedRules.length ? requestedRules : [randomRule(level ?? "A1")];

    if (taskType === 1) {
        const sample = await generateGapSample({
            targetRules: rulesForSample,
            allRules: PROJECT_RULES,
            level,
            seed,
            skip,
        });

        return {
            taskType: 1,
            rules: sample.rules,
            textToTranslate: sample.en,
            options: sample.options,
            textToTranslateOriginal: "",
            hint: "",
        };
    }

    const sample = await generateTranslationSample({
        targetRules: rulesForSample,
        allRules: PROJECT_RULES,
        level,
        seed,
        skip,
        targetLocale: userLocale,
    });

    return {
        taskType: 0,
        rules: sample.rules,
        textToTranslate: sample.text,
        textToTranslateOriginal: sample.text,
        hint: sample.hint,
        options: undefined,
    };
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
                textToTranslateOriginal,
                options,
                skip,
                seed,
                freeTraining,
                task_type = "0",
                use_same_task_type = "true",
                userLocale = 'uk-UA'
            } = req.query;

            const taskType = Number(task_type) || 0;
            const useSameTaskType =
                String(use_same_task_type).toLowerCase() === "true" ||
                String(use_same_task_type) === "1";

            // --- нормалізація rules ---
            const rulesArr = normalizeRulesInput(rules);
            const currentSkip = parseSkip(skip);

            // --- якщо textToTranslate немає — віддаємо новий приклад ---
            if (!textToTranslate) {
                const task = await buildRuntimeTask({
                    taskType,
                    targetRules: rulesArr,
                    level: level ?? "A1",
                    seed,
                    skip: currentSkip,
                    userLocale,
                });

                const { allowed, waitTimeSeconds } = skipCoach
                    ? { allowed: true, waitTimeSeconds: 0 }
                    : await checkTranslationLimit(accountId);

                return res.json({
                    taskType: task.taskType,
                    rules: task.rules,
                    textToTranslate: task.textToTranslate,
                    textToTranslateOriginal: task.textToTranslateOriginal,
                    isAnswerCorrect: false,
                    correctAnswer: "",
                    tipIfWrong: "",
                    score: 0,
                    hint: task.hint,
                    options: task.taskType === 1 ? task.options : undefined,
                    skip: currentSkip + 1,
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
                const optionList = parseOptionsInput(options);

                result = await evaluateGapAndCoach({
                    task: {
                        rules: rulesArr,
                        en: textToTranslate,
                        options: optionList,
                    },
                    userAnswer: translation ?? "",
                    allRules: PROJECT_RULES,
                    targetLocale: userLocale || "uk-UA",
                });
            } else {
                const accountShortInfo = await getAccountById(req.user.id);

                try {
                    // Translation path (keeps your current behavior)
                    result = preEvaluate({
                        rules: rulesArr,
                        userEnglish: translation ?? "",
                        textToTranslateOriginal: textToTranslateOriginal || textToTranslate || "",
                    });
                } catch {
                    result = {
                        answer_is_correct: false,
                    }
                }

                if (!result.answer_is_correct && !skipCoach) {
                    result = await evaluateAndCoach({
                        rules: rulesArr,
                        allRules: PROJECT_RULES,
                        targetLocale: userLocale || "uk-UA",
                        userEnglish: translation ?? "",
                        textToTranslate: textToTranslate ?? "",
                    });
                }

                // Track marathon task completion
                if (accountShortInfo?.status !== 'free')
                    await answerNextMarathonTaskByRuleId(req.user.id, rulesArr[0]);
            }

            // -------------------------------
            // PICK NEXT TASK
            // -------------------------------
            let newTextToTranslateOriginal = "";
            let newTextToTranslate = "";
            let newHint = "";
            let newRules = rulesArr;
            let newOptions = null; // only for gaps
            let newTaskType = taskType;
            const newSkip = currentSkip + 1;

            let scores = normalizeScores(result.scores, rulesArr, !!result.answer_is_correct);

            // decide next task type rule (only if we actually select a new task below)
            const decideNextTaskType = (targetRule) => {
                if (useSameTaskType) return taskType;

                // "always gaps after gaps"
                if (taskType === 1) return 1;

                const nextRuleLevel = getRuleLevel(targetRule);
                if (taskType === 0 && nextRuleLevel === "A1") return 1;

                return 0;
            };

            const violatedRules = uniqueValidRules(result.violated_rules);
            const scoredWeakRules = rulesArr.filter((_, i) => scores[i] < 1);
            const fallbackRules = !level && !freeTraining ? rulesArr : [];
            const nextRuleCandidates = uniqueValidRules([
                ...violatedRules,
                ...scoredWeakRules,
                ...fallbackRules,
            ]);

            for (const targetRule of nextRuleCandidates) {
                // determine which task type we should serve next
                newTaskType = decideNextTaskType(targetRule);

                try {
                    const nextTask = await buildRuntimeTask({
                        taskType: newTaskType,
                        targetRules: [targetRule],
                        level: getRuleLevel(targetRule) ?? level ?? "A1",
                        seed,
                        skip: newSkip,
                        userLocale,
                    });

                    newTaskType = nextTask.taskType;
                    newRules = nextTask.rules;
                    newTextToTranslate = nextTask.textToTranslate;
                    newTextToTranslateOriginal = nextTask.textToTranslateOriginal;
                    newHint = nextTask.hint;
                    newOptions = nextTask.options ?? null;
                    break;
                } catch (e) {
                    console.log(`Failed to generate runtime task for ${targetRule}:`, e?.message || e);
                }
            }

            if (!skipCoach) {
                await recordTranslationUsage(accountId, taskType);
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
                result.violated_rules = [];
            }

            const { allowed, waitTimeSeconds } = skipCoach
                ? { allowed: true, waitTimeSeconds: 0 }
                : await checkTranslationLimit(accountId);

            return res.json({
                taskType: newTaskType,
                rules: newRules,
                textToTranslate: newTextToTranslate,
                textToTranslateOriginal: newTextToTranslateOriginal,
                hint: newHint,
                options: newTaskType === 1 ? newOptions : undefined,
                isAnswerCorrect: result.answer_is_correct,
                correctAnswer: result.correct_answer,
                tipIfWrong: result.tip_if_wrong,
                scores: scores,
                violatedRules: uniqueValidRules(result.violated_rules),
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

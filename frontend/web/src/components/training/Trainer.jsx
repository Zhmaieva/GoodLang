import TaskCard from "./TaskCard.jsx";
import ResultCard from "./ResultCard.jsx";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {addAnswer, getAllStatistics, getOverallAccuracy, getSeed, saveSeed} from "../../services/dataService.js";
import {
    callAccountInfoApi,
    callAccountVerifyApi,
    callQuickTranslateAPI,
    callTranslateAPI,
    callVocabularyEvaluationApi,
    callVocabularyTranslationsApi,
} from "../../services/api.js";
import {
    getSavedTaskMode,
    getSavedTaskModeSync,
    getTrainingLevel,
    saveTaskMode
} from "../../services/trainingDirector.js";
import {LEVEL_RULES} from "../../utils/rules.js";
import {emit, off, on} from "../../services/events.js";
import {logInfo} from "../../services/logger.js";
import {ensureAnalytics, trackMetaCustomEvent, trackPageView} from "../../services/gaService.js";
import {ACTION_TYPES} from "../../utils/constants.js";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import {acceptCookies, getCookieConsent, rejectCookies} from "../../services/settingsService.js";
import MarathonInfoModal from "../modals/MarathonInfoModal.jsx";
import {marathonService} from "../../services/marathonService.js";
import LimitModal from "../subscription/LimitModal.jsx";
import {localizationService} from "../../localization/localizationService.js";
import TermsOfUseModal from "../subscription/TermsOfUseModal.jsx";
import {
    buildTrainingTaskCacheKey,
    clearCachedTrainingTask,
    getCachedTrainingTask,
    prefetchTrainingTask,
    setCachedTrainingTask
} from "../../services/trainingTaskCache.js";
import {
    getLocalVocabularyWords,
    saveLocalVocabularyEvaluation,
    saveLocalVocabularyTranslations,
} from "../../services/vocabularyService.js";

export default function Trainer({
                                    theme,
                                    onLoadingChange = _ => {},
                                    freeTraining = false,
                                    nextLevel = null,
                                    nextRule = null,
                                    onAnswerEvaluated = _ => {},
                                    notFocused = false,
                                }) {
    const LEVEL_TO_DIFFICULTY = useMemo(
        () => ({ beginner: ["A1"], intermediate: ["A2", "B1"], advanced: ["B2"] }),
        []
    );

    const gridStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    };

    const randomDifficulty = (level) => {
        const pool = LEVEL_TO_DIFFICULTY[level] || ["A1"];

        try {
            const { level: directorLevel } = getTrainingLevel();

            // map training director → CEFR
            const directorMap = {
                beginner: ["A1"],
                intermediate: ["A2", "B1"],
                advanced: ["B2"],
            };

            const directorPool = directorMap[directorLevel] || [];

            // intersection with allowed pool
            const intersection = pool.filter(l => directorPool.includes(l));

            if (intersection.length > 0) {
                return intersection[Math.floor(Math.random() * intersection.length)];
            }
        } catch {
            // ignore and fallback to random
        }

        return pool[Math.floor(Math.random() * pool.length)];
    };

    // -----------------------------
    // Task type + gap state
    // -----------------------------
    const [taskType, setTaskType] = useState("translate"); // "translate" | "gap"
    const [gapSentence, setGapSentence] = useState("");
    const [gapOptions, setGapOptions] = useState([]);
    const [gapSelected, setGapSelected] = useState(null);

    // -----------------------------
    // Mode selector (UI)
    // -----------------------------
    // "translations" | "gaps" | "combined"
    const [taskMode, setTaskMode] = useState(getSavedTaskModeSync());
    const [taskModeLocked, setTaskModeLocked] = useState(false);
    const [taskModeLockReason, setTaskModeLockReason] = useState("");

    // In combined: which type to request next (0 translation, 1 gaps)
    const [nextRequestedTaskType, setNextRequestedTaskType] = useState(0);

    // -----------------------------
    // ✅ Calibration forcing
    // -----------------------------
    const [calibrationNextTaskType, setCalibrationNextTaskType] = useState(0); // 0 translate, 1 gap
    const isCalibrationNow = () => {
        if (nextLevel !== "managed") return false;
        try {
            const { isCalibration } = getTrainingLevel();
            return !!isCalibration;
        } catch {
            return false;
        }
    };

    // -----------------------------
    // Core state
    // -----------------------------
    const [level, setLevel] = useState(null);
    const [difficulty, setDifficulty] = useState(() => null);

    const [textToTranslate, setTextToTranslate] = useState("");
    const [textToTranslateOriginal, setTextToTranslateOriginal] = useState("");
    const [rules, setRules] = useState([]);

    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("check"); // "check" | "next"
    const [isError, setIsError] = useState(false);
    const [locked, setLocked] = useState(false);

    const [taskText, setTaskText] = useState("Loading task…");
    const [hint, setHintValue] = useState("");
    const [taskHint, setTaskHint] = useState(null);

    const [account, setAccount] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [naturalAnswer, setNaturalAnswer] = useState("");
    const [vocabularyFeedback, setVocabularyFeedback] = useState("");
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isDetailedFeedbackLoading, setIsDetailedFeedbackLoading] = useState(false);
    const [quickVerdict, setQuickVerdict] = useState(null);
    const textareaRef = useRef(null);
    const evaluationRunRef = useRef(0);
    const currentTaskCacheKeyRef = useRef(null);
    const lastPracticeRuleCacheRef = useRef(null);

    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [waitTimeSeconds, setWaitTimeSeconds] = useState(false);

    const [cookieOpen, setCookieOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);

    // weak rules
    const [weakRules, setWeakRules] = useState([]);

    const setHint = (value) => {
        setHintValue(value);

    }


    // -----------------------------
    // Preloading state (supports gaps too)
    // -----------------------------
    const [nextTextToTranslate, setNextTextToTranslate] = useState("");
    const [nextTextToTranslateOriginal, setNextTextToTranslateOriginal] = useState("");
    const [nextRules, setNextRules] = useState([]);
    const [nextHint, setNextHint] = useState(null);
    const [nextTaskType, setNextTaskType] = useState(0); // 0 translation, 1 gaps
    const [nextOptions, setNextOptions] = useState([]);  // gaps only

    // -----------------------------
    // Simple caches so "Next" can invalidate both
    // -----------------------------
    const [cachedTranslateTask, setCachedTranslateTask] = useState(null);
    const [cachedGapTask, setCachedGapTask] = useState(null);

    const loadAccount = async () => {
        const data = await callAccountInfoApi();
        setAccount(data);
        await callAccountVerifyApi(ACTION_TYPES.PAGE_OPEN_TRAINER);
    };

    useEffect(() => {
        loadAccount().then();
        refreshTaskMode().then();
    }, []);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (cancelled) return;
            await Promise.all([
                prefetchLevelCaches(),
                prefetchPracticeRuleCache(),
            ]);
        };

        run().then();

        const refreshPracticeRule = () => {
            prefetchPracticeRuleCache().then();
        };

        on("weeklyProgressUpdate", refreshPracticeRule);

        return () => {
            cancelled = true;
            off("weeklyProgressUpdate", refreshPracticeRule);
        };
    }, [taskMode, nextLevel, nextRule, difficulty]);

    const refreshTaskMode = async () => {
        const saved = await getSavedTaskMode();
        if (freeTraining && await marathonService.isMarathonView(true)) {
            setTaskMode("translations")
            return;
        }
        if (saved) setTaskMode(saved);
    }

    function setControlsDisabled(disabled) {
        onLoadingChange(disabled);
        setLoading(disabled);
    }

    function resetToLoadingPlaceholders() {
        evaluationRunRef.current += 1;
        setTaskText("Loading task…");
        setHint("");
        setCorrectAnswer("");
        setNaturalAnswer("");
        setWeakRules([]);
        setQuickVerdict(null);
        setIsDetailedFeedbackLoading(false);
    }

    // -----------------------------
    // Helpers for task type + server params
    // -----------------------------
    const gapsAvailable = true; // difficulty === "A1";

    function getUseSameTaskType() {
        // as you specified:
        // - translations/gaps => true
        // - combined => false
        return taskMode === "combined" ? "false" : "true";
    }

    function getRequestedTaskType() {
        // ✅ calibration: always request translation by default
        if (isCalibrationNow()) return 0;

        // lock: if not A1, force translations
        if (!gapsAvailable) return 0;

        if (taskMode === "translations") return 0;
        if (taskMode === "gaps") return 1;

        // ✅ combined: NEVER request gaps. Only use gaps if server returned them as preload.
        return 0;
    }

    function buildTaskCacheKey({
                                   levelKey = nextLevel,
                                   ruleId = nextRule,
                                   taskTypeOverride = null,
                               } = {}) {
        const taskTypeForKey = Number(taskTypeOverride ?? getRequestedTaskType()) || 0;
        const locale = localizationService.getLocale();

        if (ruleId) {
            return buildTrainingTaskCacheKey({
                scope: "rule",
                ruleId,
                taskType: taskTypeForKey,
                taskMode,
                locale,
            });
        }

        return buildTrainingTaskCacheKey({
            scope: "level",
            level: levelKey || "managed",
            taskType: taskTypeForKey,
            taskMode,
            locale,
        });
    }

    function taskFromData(data) {
        if (!data?.textToTranslate || !(data.rules?.length > 0)) return null;

        return {
            taskType: Number(data.taskType ?? 0),
            textToTranslate: data.textToTranslate || "",
            textToTranslateOriginal: data.textToTranslateOriginal || "",
            rules: data.rules || [],
            hint: data.hint || null,
            options: Array.isArray(data.options) ? data.options : [],
            skip: data.skip,
            allowed: data.allowed,
            waitTimeSeconds: data.waitTimeSeconds,
        };
    }

    function applyTask(data) {
        const serverTaskType = Number(data.taskType ?? 0);
        if (serverTaskType === 1) applyGapTask(data);
        else applyTranslationTask(data);
    }

    function cacheCurrentTask(data, cacheKey) {
        const task = taskFromData(data);
        if (!task || !cacheKey) return null;

        setCachedTrainingTask(cacheKey, task);
        currentTaskCacheKeyRef.current = cacheKey;
        return task;
    }

    function clearCurrentTaskCache() {
        clearCachedTrainingTask(currentTaskCacheKeyRef.current);
        currentTaskCacheKeyRef.current = null;
    }

    function getPracticeRuleForCache() {
        const stats = getAllStatistics();
        if (!Array.isArray(stats) || !stats.length) return null;

        const sorted = [...stats]
            .filter((x) => x?.rule)
            .sort((a, b) => {
                const aNeeds = a.status === "needs practice" ? 0 : 1;
                const bNeeds = b.status === "needs practice" ? 0 : 1;
                if (aNeeds !== bNeeds) return aNeeds - bNeeds;

                const accA = Number.isFinite(a.accuracy) ? a.accuracy : 0;
                const accB = Number.isFinite(b.accuracy) ? b.accuracy : 0;
                if (accA !== accB) return accA - accB;

                return (a.attemptsNumber ?? 0) - (b.attemptsNumber ?? 0);
            });

        return sorted[0]?.rule || null;
    }

    function buildRecommendedRules(data, scores = []) {
        const out = [];
        const add = (rule) => {
            const value = String(rule ?? "").trim();
            if (!value || out.includes(value)) return;
            out.push(value);
        };

        for (const rule of Array.isArray(data?.violatedRules) ? data.violatedRules : []) add(rule);
        for (const rule of Array.isArray(data?.violated_rules) ? data.violated_rules : []) add(rule);
        rules.forEach((rule, index) => {
            if (Number(scores[index] ?? 1) < 1) add(rule);
        });
        rules.forEach(add);
        for (const rule of Array.isArray(data?.rules) ? data.rules : []) add(rule);

        return out.slice(0, 3);
    }

    function getVocabularyForSample() {
        const words = getLocalVocabularyWords(localizationService.getLocale());
        const needsPractice = words.filter((word) => word.status === "needsPractice");
        const recovered = words.filter((word) => word.status === "recovered");
        const candidates = needsPractice.length && recovered.length
            ? (Math.random() < 0.75 ? needsPractice : recovered)
            : needsPractice.length ? needsPractice : recovered;
        if (!candidates.length) return null;
        return candidates[Math.floor(Math.random() * candidates.length)] || null;
    }

    /* eslint-disable no-unused-vars */
    const vocabularyStopWords = new Set([
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

    function normalizeVocabularyToken(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase()
            .replace(/[“”]/g, "\"")
            .replace(/[’‘]/g, "'")
            .replace(/^[^a-z]+|[^a-z]+$/gi, "");
    }

    function getVocabularyTokens(text) {
        return (String(text ?? "").match(/[A-Za-z][A-Za-z'-]*/g) ?? [])
            .map(normalizeVocabularyToken)
            .filter((token) => token.length >= 3 && !vocabularyStopWords.has(token));
    }

    function getEditDistance(a, b) {
        const source = String(a ?? "");
        const target = String(b ?? "");
        const matrix = Array.from({ length: source.length + 1 }, () => []);

        for (let i = 0; i <= source.length; i += 1) matrix[i][0] = i;
        for (let j = 0; j <= target.length; j += 1) matrix[0][j] = j;

        for (let i = 1; i <= source.length; i += 1) {
            for (let j = 1; j <= target.length; j += 1) {
                const substitutionCost = source[i - 1] === target[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + substitutionCost
                );
            }
        }

        return matrix[source.length][target.length];
    }

    function getAllowedTypoDistance(word) {
        if (word.length <= 5) return 1;
        return 2;
    }

    function stripDoubleFinalConsonant(value) {
        return String(value ?? "").replace(/([bcdfghjklmnpqrstvwxyz])\1$/i, "$1");
    }

    function isLikelyGrammarInflection(userToken, correctToken) {
        if (!userToken || !correctToken) return false;

        const user = normalizeVocabularyToken(userToken);
        const correct = normalizeVocabularyToken(correctToken);
        const variants = new Set([
            `${correct}s`,
            `${correct}es`,
            `${correct}d`,
            `${correct}ed`,
            `${correct}ing`,
            `${correct.slice(0, -1)}ies`,
        ]);

        if (correct.endsWith("e")) {
            variants.add(`${correct.slice(0, -1)}ed`);
            variants.add(`${correct.slice(0, -1)}ing`);
        }

        if (correct.endsWith("y")) {
            variants.add(`${correct.slice(0, -1)}ied`);
        }

        if (user.endsWith("ed")) {
            variants.add(`${stripDoubleFinalConsonant(correct)}ed`);
        }

        if (user.endsWith("ing")) {
            variants.add(`${stripDoubleFinalConsonant(correct)}ing`);
        }

        return variants.has(user);
    }

    function findCorrectedTypo(userToken, correctTokens) {
        if (!userToken || correctTokens.includes(userToken)) return null;

        let bestMatch = null;
        let bestDistance = Infinity;

        for (const correctToken of correctTokens) {
            if (!correctToken || correctToken[0] !== userToken[0]) continue;
            if (isLikelyGrammarInflection(userToken, correctToken)) continue;

            const distance = getEditDistance(userToken, correctToken);
            const allowedDistance = getAllowedTypoDistance(correctToken);

            if (distance > 0 && distance <= allowedDistance && distance < bestDistance) {
                bestMatch = correctToken;
                bestDistance = distance;
            }
        }

        return bestMatch;
    }

    function buildMistakeVocabularyCandidates({ userAnswer, correctAnswer, level, occurredAt }) {
        const userTokens = getVocabularyTokens(userAnswer);
        const correctTokens = getVocabularyTokens(correctAnswer);
        const seen = new Set();

        return userTokens
            .map((token) => findCorrectedTypo(token, correctTokens))
            .filter((word) => {
                if (!word || seen.has(word)) return false;
                seen.add(word);
                return true;
            })
            .map((word) => ({
                word,
                level,
                source: "learner_mistake",
                example: correctAnswer,
                isCorrect: false,
                score: 0,
                occurredAt,
            }));
    }

    function saveVocabularyFromEvaluation({
                                              userAnswer,
                                              result,
                                              fallbackLevel,
                                              isQuick = false,
                                          }) {
        // Vocabulary evaluation is performed together with the detailed translation request.
        // This legacy helper remains temporarily for cached task compatibility.
        return { userAnswer, result, fallbackLevel, isQuick };
    }
    /* eslint-enable no-unused-vars */

    function resetCurrentTaskOnly() {
        evaluationRunRef.current += 1;
        setTaskType("translate");
        setTextToTranslate("");
        setTextToTranslateOriginal("");
        setGapSentence("");
        setGapOptions([]);
        setGapSelected(null);
        setRules([]);
        setAnswer("");
        setCorrectAnswer("");
        setNaturalAnswer("");
        setWeakRules([]);
        setQuickVerdict(null);
        setIsDetailedFeedbackLoading(false);
        setTaskHint(null);
        setMode("check");
    }

    // -----------------------------
    // Render gap with blank / selected option
    // -----------------------------
    const renderedTaskText = useMemo(() => {
        if (taskType !== "gap") return taskText;

        const gap = gapSelected || gapSelected === ""
            ? `<span style="color:#fe6137;font-weight:800;">${gapSelected}</span>`
            : `<span style="
            display:inline-block;
            min-width:80px;
            border-bottom:2px solid ${theme.text};
            border-color:#fe6137;
            transform: translateY(2px);
         "></span>`;

        return (gapSentence[0] || "").replace("{GAP}", gap);
    }, [taskType, taskText, gapSentence, gapSelected, theme.text]);

    // -----------------------------
    // Reset/invalidate both tasks (used on Next sentence, and on hard mode switches)
    // -----------------------------
    function invalidateBothTasks() {
        evaluationRunRef.current += 1;
        // current task UI
        setTaskType("translate");
        setTextToTranslate("");
        setTextToTranslateOriginal("");
        setGapSentence("");
        setGapOptions([]);
        setGapSelected(null);
        setRules([]);
        setAnswer("");
        setCorrectAnswer("");
        setNaturalAnswer("");
        setWeakRules([]);
        setQuickVerdict(null);
        setIsDetailedFeedbackLoading(false);
        setTaskHint(null);
        setMode("check");

        // preload
        setNextTextToTranslate("");
        setNextTextToTranslateOriginal("");
        setNextRules([]);
        setNextHint(null);
        setNextTaskType(0);
        setNextOptions([]);

        // caches
        setCachedTranslateTask(null);
        setCachedGapTask(null);
    }

    // Apply task objects (used internally)
    function applyTranslationTask(data) {
        setTaskType("translate");
        setTextToTranslate(data.textToTranslate || "");
        setTextToTranslateOriginal(data.textToTranslateOriginal || "");
        setTaskText(data.textToTranslate || "—");
        setTaskHint(data.hint || null);
        setHint("");
        setRules(data.rules || []);
        setAnswer("");
        setGapSelected(null);
        setCorrectAnswer("");
        setNaturalAnswer("");
        setWeakRules([]);
        setQuickVerdict(null);
        setIsDetailedFeedbackLoading(false);
        setMode("check");

        setCachedTranslateTask({
            text: data.textToTranslate || "",
            rules: data.rules || [],
            hint: data.hint || null,
        });
    }

    function applyGapTask(data) {
        setTaskType("gap");
        setGapSentence(data.textToTranslate || "");
        setGapOptions(Array.isArray(data.options) ? data.options : []);
        setGapSelected(null);
        setTaskText(data.textToTranslate || "—");
        setTaskHint(null);
        setHint("");
        setRules(data.rules || []);
        setAnswer("");
        setCorrectAnswer("");
        setNaturalAnswer("");
        setWeakRules([]);
        setQuickVerdict(null);
        setIsDetailedFeedbackLoading(false);
        setMode("check");

        setCachedGapTask({
            en: data.textToTranslate || "",
            rules: data.rules || [],
            options: Array.isArray(data.options) ? data.options : [],
        });
    }

    // -----------------------------
    // Fetch next task from server
    // -----------------------------
    async function fetchNextSentence({
                                         nextLevel,
                                         nextRule,
                                         selectedDifficulty,
                                         seed,
                                         skip,
                                         overrideTaskType = null,
                                         suppressLimitState = false,
                                         avoidSentence = "",
                                     }) {
        const vocabulary = getVocabularyForSample();
        if (freeTraining && await marathonService.isMarathonView(true)) {
            const nextMarathonRule = marathonService.getNextMarathonRule();
            return await callTranslateAPI({
                rules: [nextMarathonRule],
                seed,
                skip,
                taskType: "translations",
                use_same_task_type: true,
                userLocale: localizationService.getLocale(),
                vocabularyWord: vocabulary?.word || null,
                vocabularyWordTranslation: vocabulary?.meaning || null,
            });
        }

        let ruleToSend = nextRule;

        const task_type = String(overrideTaskType ?? getRequestedTaskType());
        const use_same_task_type = getUseSameTaskType();

        const allStats = getAllStatistics();
        const {level} = nextLevel === "managed" ? getTrainingLevel() : {level: selectedDifficulty};

        const allowedRules = LEVEL_RULES[level] ?? [];
        const stats = allStats.filter(s => allowedRules.includes(s.rule));

        if (!ruleToSend) {
            const noAttempts = stats.filter(r => r.attemptsNumber === 0);

            if (noAttempts.length > 0) {
                ruleToSend = noAttempts[Math.floor(Math.random() * noAttempts.length)].rule;
            } else {
                const lowestAcc = stats.reduce((a, b) => (a.accuracy < b.accuracy ? a : b));
                const below75 = stats.filter(r => r.accuracy < 75);
                const rnd = Math.random() * 100;

                const fewDataRules = stats.filter(r => r.attemptsLast7Days <= 4);
                if (rnd < 60) {
                    ruleToSend = lowestAcc.rule;
                } else if (rnd < 90 && below75.length > 0 && fewDataRules.length > 0) {
                    ruleToSend = fewDataRules[Math.floor(Math.random() * fewDataRules.length)].rule;
                } else {
                    const pick = stats[Math.floor(Math.random() * stats.length)];
                    ruleToSend = pick.rule;
                }
            }
        }

        logInfo("getting training sentence...");
        const result = await callTranslateAPI({
            rules: [ruleToSend],
            seed,
            skip,
            task_type,
            use_same_task_type,
            userLocale: localizationService.getLocale(),
            avoidSentence,
            vocabularyWord: vocabulary?.word || null,
            vocabularyWordTranslation: vocabulary?.meaning || null,
        });

        if (!result.allowed && !suppressLimitState) {
            setLocked(true);
            setWaitTimeSeconds(result.waitTimeSeconds);
        }
        return result;
    }

    function prefetchTaskForCache({
                                      levelKey = nextLevel,
                                      ruleId = nextRule,
                                      selectedDifficulty,
                                      overrideTaskType = null,
                                      avoidSentence = "",
                                  } = {}) {
        const cacheKey = buildTaskCacheKey({
            levelKey,
            ruleId,
            taskTypeOverride: overrideTaskType,
        });

        return prefetchTrainingTask(cacheKey, async () => {
            const {seed, skip} = getSeed();
            return taskFromData(await fetchNextSentence({
                nextLevel: levelKey,
                nextRule: ruleId,
                selectedDifficulty,
                seed,
                skip,
                overrideTaskType,
                suppressLimitState: true,
                avoidSentence,
            }));
        });
    }

    async function prefetchLevelCaches() {
        if (await marathonService.isMarathonView(true)) return;

        const levelsToCache = ["managed", "beginner", "intermediate", "advanced"];
        const taskTypeForCache = getRequestedTaskType();

        await Promise.all(levelsToCache.map((levelKey) => {
            const selectedDifficulty = randomDifficulty(levelKey);
            return prefetchTaskForCache({
                levelKey,
                ruleId: null,
                selectedDifficulty,
                overrideTaskType: taskTypeForCache,
            });
        }));
    }

    async function prefetchPracticeRuleCache() {
        if (await marathonService.isMarathonView(true)) return;

        const ruleId = nextRule || getPracticeRuleForCache();
        const taskTypeForCache = getRequestedTaskType();
        const cacheIdentity = `${ruleId || ""}|${taskMode || ""}|${taskTypeForCache}|${localizationService.getLocale() || ""}`;
        if (!ruleId || lastPracticeRuleCacheRef.current === cacheIdentity) return;

        lastPracticeRuleCacheRef.current = cacheIdentity;

        await prefetchTaskForCache({
            levelKey: null,
            ruleId,
            selectedDifficulty: difficulty || "A1",
            overrideTaskType: taskTypeForCache,
        });
    }

    // -----------------------------
    // Load task (uses preload if available)
    // -----------------------------
    async function loadNewTask(selectedDifficulty = difficulty, {overrideTaskType = null} = {}) {
        if (!selectedDifficulty && !nextRule) return;

        try {
            setControlsDisabled(true);
            setAnswer("");
            setGapSelected(null);
            setWeakRules([]);

            const hasPreload = !!(nextTextToTranslate && nextRules && nextRules.length > 0);
            const cacheKey = buildTaskCacheKey({
                levelKey: nextLevel,
                ruleId: nextRule,
                taskTypeOverride: overrideTaskType,
            });
            const cachedTask = getCachedTrainingTask(cacheKey);

            if (cachedTask) {
                applyTask(cachedTask);
                currentTaskCacheKeyRef.current = cacheKey;
                setNextTextToTranslate("");
                setNextTextToTranslateOriginal("");
                setNextRules([]);
                setNextHint(null);
                setNextTaskType(0);
                setNextOptions([]);
            } else if (!hasPreload) {
                const {seed, skip} = getSeed();
                saveSeed({seed, skip});

                const task = await prefetchTrainingTask(cacheKey, async () => {
                    return taskFromData(await fetchNextSentence({
                        nextLevel,
                        nextRule,
                        selectedDifficulty,
                        seed,
                        skip,
                        overrideTaskType,
                    }));
                });

                if (!task) throw new Error("Failed to load training task.");

                setCachedTrainingTask(cacheKey, task);
                currentTaskCacheKeyRef.current = cacheKey;
                applyTask(task);

                saveSeed({seed, skip: task.skip ?? (skip + 1)});
            } else {
                // Apply preloaded task
                const preloadedTask = {
                    taskType: Number(nextTaskType ?? 0),
                    textToTranslate: nextTextToTranslate,
                    textToTranslateOriginal: nextTextToTranslateOriginal,
                    rules: nextRules,
                    hint: nextHint,
                    options: nextOptions,
                };

                cacheCurrentTask(preloadedTask, cacheKey);
                applyTask(preloadedTask);

                // consume preload
                setNextTextToTranslate("");
                setNextTextToTranslateOriginal("");
                setNextRules([]);
                setNextHint(null);
                setNextTaskType(0);
                setNextOptions([]);
            }
        } catch (e) {
            console.error(e);
            setIsError(true);

            try {
                callAccountVerifyApi(ACTION_TYPES.ERROR_TRANSLATOR).then();
            } catch {}

        } finally {
            setControlsDisabled(false);
        }
    }

    // -----------------------------
    // Evaluate current task
    // -----------------------------
    async function evaluateCurrentTask() {
        const userAns =
            taskType === "gap" ? String(gapSelected ?? "").trim() : answer.trim();

        if (taskType === "gap" && !gapSelected && gapSelected !== "") {
            setHint("Select an option before checking.");
            return;
        }
        if (taskType !== "gap" && !userAns) {
            setHint("Enter your translation before checking.");
            return;
        }

        try {
            setIsEvaluating(true);
            setIsDetailedFeedbackLoading(true);
            setQuickVerdict(null);
            setHint("");
            setWeakRules([]);
            setCorrectAnswer("");
            setNaturalAnswer("");
            setVocabularyFeedback("");

            const {seed, skip} = getSeed();
            logInfo("evaluating answer...");

            const currentTaskTypeParam = taskType === "gap" ? "1" : "0";
            const answeredCacheKey = currentTaskCacheKeyRef.current;
            const evaluationRun = evaluationRunRef.current + 1;
            evaluationRunRef.current = evaluationRun;
            let completionHandled = false;
            let quickCorrectApplied = false;
            const vocabularyForNextSample = getVocabularyForSample();
            const evaluationParams = {
                freeTraining,
                textToTranslate: taskType === "gap" ? (gapSentence || "") : (textToTranslate || ""),
                textToTranslateOriginal: taskType === "gap" ? (gapSentence || "") : (textToTranslateOriginal || ""),
                translation: userAns,
                rules,
                ...(taskType === "gap" ? { options: gapOptions } : {}),
                seed,
                skip,
                task_type: currentTaskTypeParam,
                use_same_task_type: getUseSameTaskType(),
                userLocale: localizationService.getLocale(),
                vocabularyWord: vocabularyForNextSample?.word || null,
                vocabularyWordTranslation: vocabularyForNextSample?.meaning || null,
            };

            callQuickTranslateAPI(evaluationParams)
                .then((quickData) => {
                    if (evaluationRunRef.current !== evaluationRun) return quickData;
                    if (!quickData.isSuccess) return quickData;
                    if (completionHandled) return quickData;

                    const isQuickCorrect = !!quickData.isAnswerCorrect;

                    if (!isQuickCorrect) {
                        return quickData;
                    }

                    completionHandled = true;
                    quickCorrectApplied = true;
                    setQuickVerdict(true);
                    setIsDetailedFeedbackLoading(false);
                    setHint("Well done!");
                    setCorrectAnswer("");
                    setNaturalAnswer("");
                    setWeakRules([]);
                    clearCurrentTaskCache();

                    const prevAttemptsLeft = getOverallAccuracy()?.attemptsLeft ?? 0;
                    addAnswer(rules.map(() => 1), rules, null);
                    const newAttemptsLeft = getOverallAccuracy()?.attemptsLeft ?? 0;
                    if (prevAttemptsLeft === 1 && newAttemptsLeft === 0) trackMetaCustomEvent("CompleteEvaluation");

                    const { isCalibration } = getTrainingLevel();
                    setTaskModeLocked(!!isCalibration);

                    if (isCalibrationNow()) {
                        setCalibrationNextTaskType(0);
                    }

                    emit("weeklyProgressUpdate");

                    if (freeTraining) {
                        emit("marathonProgressUpdate");
                        emit("marathonProgressUpdateHardRefresh");
                    }

                    setMode("next");
                    saveSeed({seed, skip: skip + 1});
                    onAnswerEvaluated();
                    setIsEvaluating(false);

                    if (answeredCacheKey) {
                        prefetchTaskForCache({
                            levelKey: nextLevel,
                            ruleId: nextRule,
                            selectedDifficulty: difficulty,
                            overrideTaskType: Number(currentTaskTypeParam),
                            avoidSentence: taskType === "gap" ? (gapSentence || "") : (textToTranslate || ""),
                        }).then();
                    }

                    return quickData;
                })
                .catch((e) => {
                    console.error(e);
                    return null;
                });

            const detailedPromise = callTranslateAPI(evaluationParams);
            const vocabularyPromise = callVocabularyEvaluationApi({
                targetSentence: evaluationParams.textToTranslateOriginal,
                userAnswer: userAns,
                targetLocale: localizationService.getLocale(),
                level: difficulty,
            }).catch((error) => {
                console.error("Vocabulary evaluation failed", error);
                return { isSuccess: false, words: [], feedback: "" };
            });
            const [data, vocabularyData] = await Promise.all([
                detailedPromise,
                vocabularyPromise,
            ]);
            if (evaluationRunRef.current !== evaluationRun) return;

            if (vocabularyData?.isSuccess) {
                setVocabularyFeedback(vocabularyData.feedback || "");
                saveLocalVocabularyEvaluation({
                    words: vocabularyData.words,
                    level: difficulty,
                    locale: localizationService.getLocale(),
                });
                if (vocabularyData.translations) {
                    saveLocalVocabularyTranslations(
                        vocabularyData.translations,
                        localizationService.getLocale(),
                    );
                }
                emit("vocabularyUpdated");
                void callVocabularyTranslationsApi({
                    words: (vocabularyData.words || []).map((item) => item?.word).filter(Boolean),
                    allLocales: true,
                }).then((allLocaleData) => {
                    if (!allLocaleData?.isSuccess) return;
                    saveLocalVocabularyTranslations(allLocaleData.translations);
                    emit("vocabularyUpdated");
                }).catch((error) => {
                    console.error("Background vocabulary translations failed", error);
                });
            }

            if (!data.isSuccess) {
                setIsDetailedFeedbackLoading(false);
                setNaturalAnswer("");
                setHint("Continue learning with a subscription, or wait");
                setWaitTimeSeconds(data.waitTimeSeconds);
                setLimitModalOpen(true);
                setLocked(true);
                return;
            }

            if (!data.allowed) {
                setIsDetailedFeedbackLoading(false);
                setNaturalAnswer("");
                setHint("Continue learning with a subscription, or wait");
                setWaitTimeSeconds(data.waitTimeSeconds);
                setLimitModalOpen(true);
                setLocked(true);
                return;
            }

            const serverReturnedNextTask = taskFromData(data);
            if (!quickCorrectApplied) {
                clearCachedTrainingTask(answeredCacheKey);
                currentTaskCacheKeyRef.current = null;
                if (!data.isAnswerCorrect && serverReturnedNextTask && answeredCacheKey) {
                    setCachedTrainingTask(answeredCacheKey, serverReturnedNextTask);
                }
            } else if (serverReturnedNextTask && answeredCacheKey) {
                setCachedTrainingTask(answeredCacheKey, serverReturnedNextTask);
            }

            const { isCalibration } = getTrainingLevel();

            if (quickCorrectApplied && data.isAnswerCorrect) {
                setNaturalAnswer(data.naturalAnswer || "");
            }

            if (!quickCorrectApplied) {
                completionHandled = true;
                setQuickVerdict(!!data.isAnswerCorrect);
                setIsDetailedFeedbackLoading(false);

                const prevAttemptsLeft = getOverallAccuracy()?.attemptsLeft ?? 0;
                addAnswer(data.scores || [], rules, data.level);
                const newAttemptsLeft = getOverallAccuracy()?.attemptsLeft ?? 0;
                if (prevAttemptsLeft === 1 && newAttemptsLeft === 0) trackMetaCustomEvent("CompleteEvaluation");

                setTaskModeLocked(!!isCalibration);

                if (data.isAnswerCorrect) {
                    setHint(data.naturalAnswer ? "Nice work! You expressed the idea well." : "Well done!");
                    setCorrectAnswer("");
                    setNaturalAnswer(data.naturalAnswer || "");
                    setWeakRules([]);
                } else {
                    setWeakRules(buildRecommendedRules(data, data.scores || []));
                    const tip = data.tipIfWrong ? " " + data.tipIfWrong : "";
                    setHint(tip);
                    setCorrectAnswer(data.correctAnswer || "");
                    setNaturalAnswer("");
                }

                if (isCalibrationNow()) {
                    const forced = data.isAnswerCorrect ? 0 : 1;
                    setCalibrationNextTaskType(!gapsAvailable ? 0 : forced);
                }

                emit("weeklyProgressUpdate");

                if (freeTraining)
                    emit("marathonProgressUpdate");
            }

            const serverNextType = Number(data.taskType ?? 0);
            const serverProvidedNextTask = !!(data.textToTranslate && (data.rules?.length ?? 0) > 0);

            // ✅ combined: we only "accept" gaps if server provided the actual gap task payload
            if (taskMode === "combined") {
                if (gapsAvailable && serverProvidedNextTask && serverNextType === 1) {
                    setNextRequestedTaskType(1);
                } else {
                    setNextRequestedTaskType(0);
                }
            }

            if (freeTraining)
                emit("marathonProgressUpdateHardRefresh");

            // ✅ Preload next task
            // During calibration you already prevent preloading below; kept as-is.
            if (!(await marathonService.isMarathonView()) && freeTraining && !(nextLevel === "managed" && isCalibration)) {
                setNextTextToTranslate(data.textToTranslate || "");
                setNextTextToTranslateOriginal(data.textToTranslateOriginal || "");
                setNextRules(data.rules || []);
                setNextHint(data.hint || null);
                setNextTaskType(serverNextType);
                setNextOptions(Array.isArray(data.options) ? data.options : []);
            } else {
                // clear preload (either calibration or we don't preload here)
                setNextTextToTranslate("");
                setNextTextToTranslateOriginal("");
                setNextRules([]);
                setNextHint(null);
                setNextTaskType(0);
                setNextOptions([]);
            }

            if (!quickCorrectApplied) {
                setMode("next");
                if (data.isAnswerCorrect && answeredCacheKey) {
                    prefetchTaskForCache({
                        levelKey: nextLevel,
                        ruleId: nextRule,
                        selectedDifficulty: difficulty,
                        overrideTaskType: Number(currentTaskTypeParam),
                        avoidSentence: taskType === "gap" ? (gapSentence || "") : (textToTranslate || ""),
                    }).then();
                }
            }

            saveSeed({seed, skip: data.skip ?? (skip + 1)});
            if (!quickCorrectApplied) {
                onAnswerEvaluated();
            }
        } catch (e) {
            setIsDetailedFeedbackLoading(false);
            setNaturalAnswer("");
            console.error(e);
            setIsError(true);

            try {
                callAccountVerifyApi(ACTION_TYPES.ERROR_TRANSLATOR).then();
            } catch {}
        } finally {
            setIsEvaluating(false);
        }
    }

    function handleKeyDown(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onMainButtonClick().then(_ => {});
        }
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onMainButtonClick().then(_ => {});
        }
    }

    // -----------------------------
    // Main button (Check / Next)
    // -----------------------------
    async function onMainButtonClick() {
        if (locked) {
            // try {
            //     callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_MARATHON_BEFORE_START).then();
            // } catch {}

            setLimitModalOpen(true);
            return;
        }

        if (!getCookieConsent()) {
            setCookieOpen(true);
            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);
            return;
        }

        if (mode === "check") {
            await evaluateCurrentTask();
            return;
        }

        // ✅ NEXT:
        resetCurrentTaskOnly();
        resetToLoadingPlaceholders();

        const diff = randomDifficulty(level);
        setDifficulty(diff);

        // ✅ calibration override:
        // - wrong => 1 gap
        // - correct => 0 translation
        // - initial calibration is forced to 0 in the nextLevel effect
        const override =
            isCalibrationNow()
                ? (!gapsAvailable ? 0 : calibrationNextTaskType)
                : getRequestedTaskType();

        await loadNewTask(diff, { overrideTaskType: override });
    }

    function closeLimitModal() {
        setLimitModalOpen(false);
        setIsEvaluating(false);
        setIsDetailedFeedbackLoading(false);
    }

    function retryCurrentTask() {
        evaluationRunRef.current += 1;
        setMode("check");
        setCorrectAnswer("");
        setNaturalAnswer("");
        setWeakRules([]);
        setQuickVerdict(null);
        setHint("");
        setIsDetailedFeedbackLoading(false);
        setIsEvaluating(false);

        window.setTimeout(() => {
            if (taskType !== "gap" && !notFocused && textareaRef.current) {
                textareaRef.current.focus({ preventScroll: true });
            }
        }, 0);
    }

    // -----------------------------
    // Mode switch handling (your latest rule)
    // -----------------------------
    async function onTaskModeSelected(newMode) {
        if (taskModeLocked) return;

        if (newMode === taskMode) return;

        saveTaskMode(newMode);

        // Combined: DOES NOT reset anything (only affects upcoming tasks)
        if (newMode === "combined") {
            setTaskMode("combined");
            // start upcoming tasks with translation
            if (gapsAvailable) setNextRequestedTaskType(0);
            return;
        }

        // If user selected opposite mode (translations/gaps): reset + load fresh task of that mode
        setTaskMode(newMode);

        // Force same type for subsequent tasks in this mode
        if (newMode === "translations") setNextRequestedTaskType(0);
        if (newMode === "gaps") setNextRequestedTaskType(1);

        // hard reset everything to avoid mixing tasks
        invalidateBothTasks();
        resetToLoadingPlaceholders();

        // Load a fresh task of selected mode
        const forced = newMode === "gaps" ? 1 : 0;
        await loadNewTask(difficulty, {overrideTaskType: forced});
    }

    const loadedLevelRef = useRef(null);

    useEffect(() => {
        // skip if same level already initialized
        if (loadedLevelRef.current === nextLevel && !nextRule) return;

        loadedLevelRef.current = nextLevel;

        invalidateBothTasks();
        setLevel(nextLevel);
        initCalibration().then();
    }, [nextLevel, nextRule]);

    const initCalibration = async () => {
        const diff = randomDifficulty(nextLevel);
        setDifficulty(diff);

        const { isCalibration } = getTrainingLevel();

        setTaskModeLocked(!!isCalibration || (freeTraining && await marathonService.isMarathonView(true)));
        setTaskModeLockReason("");
        if (taskMode === "combined") setNextRequestedTaskType(0);

        // ✅ calibration always starts with translation
        if (isCalibrationNow()) {
            setCalibrationNextTaskType(0);
        }

        resetToLoadingPlaceholders();

        const initialOverride = isCalibrationNow() ? 0 : getRequestedTaskType();
        loadNewTask(diff, { overrideTaskType: initialOverride }).then(_ => {});
    }

    // Focus textarea only for translation tasks
    useEffect(() => {
        if (taskType === "gap") return;
        if (mode === "check" && !notFocused && textareaRef.current && !loading) textareaRef.current.focus();
    }, [mode, loading, taskType, notFocused]);

    // Also enforce lock if difficulty changes away from A1
    useEffect(() => {
        if (!difficulty) return;

        initCalibrationSimple().then();
    }, [difficulty]);

    const initCalibrationSimple = async () => {
        const { isCalibration } = getTrainingLevel();

        setTaskModeLocked(!!isCalibration || (freeTraining && await marathonService.isMarathonView(true)));
        setTaskModeLockReason("");
        if (taskMode === "combined") setNextRequestedTaskType(0);
    }

    return isError ? (
        <div
            role="alert"
            style={{
                alignSelf: "center",
                width: "100%",
                maxWidth: 520,
                fontSize: 16,
                lineHeight: 1.45,
                fontWeight: 400,
                textAlign: "center",
                color: "#000",
            }}
        >
            <div style={{fontSize: 18, fontWeight: 600, marginBottom: 6}}>
                Oops, something went wrong.
            </div>
            <div>
                Please write to{" "}
                <a style={{color: theme.accent, fontWeight: 400, textDecoration: "none"}} href="mailto:goodlang.app@gmail.com">
                    goodlang.app@gmail.com
                </a>{" "}
                and we will help you.
            </div>
        </div>
    ) : (
        <section id="trainer" style={gridStyle}>
            {(mode === "check" || loading) && (
                <TaskCard
                    waitTimeSeconds={waitTimeSeconds}
                    hint={
                        taskType === "gap"
                            ? null
                            : (freeTraining ? taskHint : null)
                    }
                    theme={theme}
                    taskText={renderedTaskText}
                    answer={answer}
                    setAnswer={setAnswer}
                    isInputDisabled={loading || isEvaluating || mode === "next"}
                    mainBtnText={mode === "check"
                        ? 'Check answer'
                        : 'NEXT SENTENCE'}
                    onMainButtonClick={onMainButtonClick}
                    loading={loading}
                    actionDisabled={isEvaluating}
                    textareaRef={textareaRef}
                    onKeyDown={handleKeyDown}
                    locked={locked}
                    account={account}

                    taskType={taskType}
                    gapOptions={gapOptions}
                    gapSelected={gapSelected}
                    setGapSelected={setGapSelected}

                    // ✅ mode selector props
                    taskMode={taskMode}
                    setTaskMode={onTaskModeSelected}
                    taskModeLocked={taskModeLocked}
                    taskModeLockReason={taskModeLockReason}
                />
            )}

            {mode === "next" && (
                <ResultCard
                    theme={theme}
                    hint={hint}
                    userAnswer={taskType === "gap" ? String(gapSelected ?? "") : answer}
                    correctAnswer={correctAnswer}
                    naturalAnswer={naturalAnswer}
                    rules={rules}
                    weakRules={weakRules}
                    vocabularyFeedback={vocabularyFeedback}
                    quickVerdict={quickVerdict}
                    isDetailedLoading={isDetailedFeedbackLoading}
                    onContinue={onMainButtonClick}
                />
            )}

            <LimitModal
                waitTimeSeconds={waitTimeSeconds}
                isLimitReached={true}
                theme={theme}
                open={limitModalOpen}
                onClose={closeLimitModal}
            />

            {/*<MarathonInfoModal*/}
            {/*    open={limitModalOpen}*/}
            {/*    onClose={() => setLimitModalOpen(false)}*/}
            {/*    theme={theme}*/}
            {/*    account={account}               // from callAccountInfoApi()*/}
            {/*    ruleIds={[]}         // exactly 7 items*/}
            {/*/>*/}


            {termsOpen && (
                <TermsOfUseModal
                    readOnly
                    theme={theme}
                    onClose={() => {
                        setTermsOpen(false);
                        setCookieOpen(true);
                    }}
                />
            )}

            {cookieOpen && !termsOpen && (
                <CookieConsentModal
                    theme={theme}
                    onAccept={async () => {
                        setCookieOpen(false);
                        acceptCookies();
                        ensureAnalytics();
                        if (localStorage.getItem("teacher") === "true") trackPageView("/greetings");
                        trackPageView(window.location.pathname);
                        trackMetaCustomEvent("StartUsing");

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);
                        await onMainButtonClick();
                    }}
                    onReject={async () => {
                        setCookieOpen(false);
                        rejectCookies();

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);
                        await onMainButtonClick();
                    }}
                    onOpenPolicy={async () => {
                        setCookieOpen(false);
                        setTermsOpen(true);
                        await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_TOU);
                    }}
                />
            )}
        </section>
    );
}

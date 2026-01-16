import TaskCard from "./TaskCard.jsx";
import ResultCard from "./ResultCard.jsx";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {addAnswer, getAllStatistics, getOverallAccuracy, getSeed, saveSeed} from "../../services/dataService.js";
import {callAccountInfoApi, callAccountVerifyApi, callTranslateAPI} from "../../services/api.js";
import LimitModal from "../subscription/LimitModal.jsx";
import {getTrainingLevel} from "../../services/trainingDirector.js";
import {LEVEL_RULES} from "../../utils/rules.js";
import {emit} from "../../services/events.js";
import {logInfo} from "../../services/logger.js";
import {ensureAnalytics, trackMetaCustomEvent, trackPageView} from "../../services/gaService.js";
import {ACTION_TYPES} from "../../utils/constants.js";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import {acceptCookies, getCookieConsent, rejectCookies} from "../../services/settingsService.js";

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
    const [taskMode, setTaskMode] = useState("combined");
    const [taskModeLocked, setTaskModeLocked] = useState(false);
    const [taskModeLockReason, setTaskModeLockReason] = useState("");

    // In combined: which type to request next (0 translation, 1 gaps)
    const [nextRequestedTaskType, setNextRequestedTaskType] = useState(0);

    // -----------------------------
    // Core state
    // -----------------------------
    const [level, setLevel] = useState(null);
    const [difficulty, setDifficulty] = useState(() => null);

    const [textToTranslate, setTextToTranslate] = useState("");
    const [rules, setRules] = useState([]);

    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("check"); // "check" | "next"
    const [isError, setIsError] = useState(false);
    const [locked, setLocked] = useState(false);

    const [taskText, setTaskText] = useState("Завантаження завдання…");
    const [hint, setHint] = useState("Порада: переклади і натисни «Перевірити»");
    const [taskHint, setTaskHint] = useState(null);

    const [account, setAccount] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const textareaRef = useRef(null);

    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [waitTimeSeconds, setWaitTimeSeconds] = useState(false);

    const [cookieOpen, setCookieOpen] = useState(false);

    // weak rules
    const [weakRules, setWeakRules] = useState([]);

    // -----------------------------
    // Preloading state (supports gaps too)
    // -----------------------------
    const [nextTextToTranslate, setNextTextToTranslate] = useState("");
    const [nextRules, setNextRules] = useState([]);
    const [nextHint, setNextHint] = useState(null);
    const [nextTaskType, setNextTaskType] = useState(0); // 0 translation, 1 gaps
    const [nextOptions, setNextOptions] = useState([]);  // gaps only

    // -----------------------------
    // Simple caches so "Next" can invalidate both
    // -----------------------------
    // NOTE: We do not reuse these on mode switch anymore (you asked mode switch should reload),
    // but we keep them so "Next" can invalidate both cleanly and prevent old leftovers.
    const [cachedTranslateTask, setCachedTranslateTask] = useState(null);
    const [cachedGapTask, setCachedGapTask] = useState(null);

    const loadAccount = async () => {
        const data = await callAccountInfoApi();
        setAccount(data);
        await callAccountVerifyApi(ACTION_TYPES.PAGE_OPEN_TRAINER);
    };

    useEffect(() => {
        loadAccount().then();
    }, []);

    function setControlsDisabled(disabled) {
        onLoadingChange(disabled);
        setLoading(disabled);
    }

    function resetToLoadingPlaceholders() {
        setTaskText("Завантаження завдання…");
        setHint("Завантаження нового завдання…");
        setCorrectAnswer("");
        setWeakRules([]);
    }

    // -----------------------------
    // Helpers for task type + server params
    // -----------------------------
    const gapsAvailable = difficulty === "A1";

    function getUseSameTaskType() {
        // as you specified:
        // - translations/gaps => true
        // - combined => false
        return taskMode === "combined" ? "false" : "true";
    }

    function getRequestedTaskType() {
        // lock: if not A1, force translations
        if (!gapsAvailable) return 0;

        if (taskMode === "translations") return 0;
        if (taskMode === "gaps") return 1;

        // ✅ combined: NEVER request gaps. Only use gaps if server returned them as preload.
        return 0;
    }

    function resetCurrentTaskOnly() {
        setTaskType("translate");
        setTextToTranslate("");
        setGapSentence("");
        setGapOptions([]);
        setGapSelected(null);
        setRules([]);
        setAnswer("");
        setCorrectAnswer("");
        setWeakRules([]);
        setTaskHint(null);
        setMode("check");
    }


    // -----------------------------
    // Render gap with blank / selected option
    // -----------------------------
    const renderedTaskText = useMemo(() => {
        if (taskType !== "gap") return taskText;

        const gap = gapSelected
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
        // current task UI
        setTaskType("translate");
        setTextToTranslate("");
        setGapSentence("");
        setGapOptions([]);
        setGapSelected(null);
        setRules([]);
        setAnswer("");
        setCorrectAnswer("");
        setWeakRules([]);
        setTaskHint(null);
        setMode("check");

        // preload
        setNextTextToTranslate("");
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
        setTaskText(data.textToTranslate || "—");
        setTaskHint(data.hint || null);
        setHint("Порада: переклади і натисни «Перевірити»");
        setRules(data.rules || []);
        setAnswer("");
        setGapSelected(null);
        setCorrectAnswer("");
        setWeakRules([]);
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
        setHint("Порада: обери правильний варіант.");
        setRules(data.rules || []);
        setAnswer("");
        setCorrectAnswer("");
        setWeakRules([]);
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
                                     }) {
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
        });

        if (!result.allowed) {
            setLocked(true);
            setWaitTimeSeconds(result.waitTimeSeconds);
        }
        return result;

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

            if (!hasPreload) {
                const {seed, skip} = getSeed();
                saveSeed({seed, skip});

                const data = await fetchNextSentence({
                    nextLevel,
                    nextRule,
                    selectedDifficulty,
                    seed,
                    skip,
                    overrideTaskType,
                });

                const serverTaskType = Number(data.taskType ?? 0);
                if (serverTaskType === 1) applyGapTask(data);
                else applyTranslationTask(data);

                saveSeed({seed, skip: data.skip ?? (skip + 1)});
            } else {
                // Apply preloaded task
                const t = Number(nextTaskType ?? 0);

                if (t === 1) {
                    applyGapTask({
                        taskType: 1,
                        textToTranslate: nextTextToTranslate,
                        rules: nextRules,
                        options: nextOptions,
                    });
                } else {
                    applyTranslationTask({
                        taskType: 0,
                        textToTranslate: nextTextToTranslate,
                        rules: nextRules,
                        hint: nextHint,
                    });
                }

                // consume preload
                setNextTextToTranslate("");
                setNextRules([]);
                setNextHint(null);
                setNextTaskType(0);
                setNextOptions([]);
            }
        } catch (e) {
            console.error(e);
            setIsError(true);
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

        if (taskType === "gap" && !gapSelected) {
            setHint("Обери варіант перед перевіркою.");
            return;
        }
        if (taskType !== "gap" && !userAns) {
            setHint("Введи переклад перед перевіркою.");
            return;
        }

        try {
            setControlsDisabled(true);
            setWeakRules([]);

            const {seed, skip} = getSeed();
            logInfo("evaluating answer...");

            const currentTaskTypeParam = taskType === "gap" ? "1" : "0";

            const data = await callTranslateAPI({
                freeTraining,
                textToTranslate: taskType === "gap" ? (gapSentence || "") : (textToTranslate || ""),
                translation: userAns,
                rules,
                seed,
                skip,
                task_type: currentTaskTypeParam,
                use_same_task_type: getUseSameTaskType(),
            });

            if (!data.isSuccess) {
                setHint("Навчайся більше з підпискою, або почекай");
                setWaitTimeSeconds(data.waitTimeSeconds);
                setLimitModalOpen(true);
                setLocked(true);
                return;
            }

            if (!data.allowed) {
                setWaitTimeSeconds(data.waitTimeSeconds);
                setLimitModalOpen(true);
                setLocked(true);
            }

            let nextWeakRules = [];
            if (!data.isAnswerCorrect) nextWeakRules = rules.map(r => r);

            setWeakRules([...new Set(nextWeakRules)]);

            const prevAttemptsLeft = getOverallAccuracy()?.attemptsLeft ?? 0;
            addAnswer(data.scores || [], rules, data.level);
            const newAttemptsLeft = getOverallAccuracy()?.attemptsLeft ?? 0;
            if (prevAttemptsLeft === 1 && newAttemptsLeft === 0) trackMetaCustomEvent("CompleteEvaluation");

            if (data.isAnswerCorrect) {
                setHint("✔ Правильно!");
                setCorrectAnswer("");
            } else {
                const tip = data.tipIfWrong ? " " + data.tipIfWrong : "";
                setHint("❌ Не зовсім." + tip);
                setCorrectAnswer(data.correctAnswer || "");
            }

            emit("weeklyProgressUpdate");

            const serverNextType = Number(data.taskType ?? 0);
            const serverProvidedNextTask = !!(data.textToTranslate && (data.rules?.length ?? 0) > 0);

// ✅ combined: we only "accept" gaps if server provided the actual gap task payload
            if (taskMode === "combined") {
                if (gapsAvailable && serverProvidedNextTask && serverNextType === 1) {
                    // optional: keep this state if you still display it somewhere
                    setNextRequestedTaskType(1);
                } else {
                    setNextRequestedTaskType(0);
                }
            }


// ✅ Preload next task (always keep server-provided next task if we’re allowed to preload)
            const { isCalibration } = getTrainingLevel();

            if (freeTraining && !(nextLevel === "managed" && isCalibration)) {
                setNextTextToTranslate(data.textToTranslate || "");
                setNextRules(data.rules || []);
                setNextHint(data.hint || null);
                setNextTaskType(serverNextType);
                setNextOptions(Array.isArray(data.options) ? data.options : []);
            } else {
                // clear preload (either calibration or we don't preload here)
                setNextTextToTranslate("");
                setNextRules([]);
                setNextHint(null);
                setNextTaskType(0);
                setNextOptions([]);
            }

            setMode("next");

            saveSeed({seed, skip: data.skip ?? (skip + 1)});
            onAnswerEvaluated();
        } catch (e) {
            console.error(e);
            setIsError(true);
        } finally {
            setControlsDisabled(false);
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
        // "reload both tasks" => invalidate both tasks/preloads/caches so everything is fresh
        resetCurrentTaskOnly();
        resetToLoadingPlaceholders();

        const diff = randomDifficulty(level);
        setDifficulty(diff);

        // In combined, we choose the type for upcoming tasks (0 or 1) via nextRequestedTaskType.
        // In translations/gaps, getRequestedTaskType() already forces it.
        await loadNewTask(diff, {overrideTaskType: getRequestedTaskType()});
    }

    // -----------------------------
    // Mode switch handling (your latest rule)
    // -----------------------------
    async function onTaskModeSelected(newMode) {
        if (taskModeLocked) return;

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

    // -----------------------------
    // Initial load when nextLevel changes
    // -----------------------------
    useEffect(() => {
        if (loading) return;
        if (nextLevel === level && !nextRule) return;

        if (level !== nextLevel) {
            invalidateBothTasks();
        }

        setLevel(nextLevel);

        const diff = randomDifficulty(nextLevel);
        setDifficulty(diff);

        // lock selector if gaps not available
        const isA1 = diff === "A1";
        if (!isA1) {
            setTaskMode("translations");
            setTaskModeLocked(true);
            setTaskModeLockReason("Gaps are available only for A1 for now.");
            setNextRequestedTaskType(0);
        } else {
            setTaskModeLocked(false);
            setTaskModeLockReason("");
            // if in combined, upcoming starts with translation
            if (taskMode === "combined") setNextRequestedTaskType(0);
        }

        resetToLoadingPlaceholders();
        loadNewTask(diff, {overrideTaskType: isA1 ? getRequestedTaskType() : 0}).then(_ => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextLevel]);

    // Focus textarea only for translation tasks
    useEffect(() => {
        if (taskType === "gap") return;
        if (mode === "check" && !notFocused && textareaRef.current && !loading) textareaRef.current.focus();
    }, [mode, loading, taskType, notFocused]);

    // Also enforce lock if difficulty changes away from A1
    useEffect(() => {
        if (!difficulty) return;

        if (difficulty !== "A1") {
            setTaskMode("translations");
            setTaskModeLocked(true);
            setTaskModeLockReason("Gaps are available only for A1 for now.");
            setNextRequestedTaskType(0);
        } else {
            setTaskModeLocked(false);
            setTaskModeLockReason("");
            if (taskMode === "combined") setNextRequestedTaskType(0);
        }
    }, [difficulty]);

    return isError ? (
        <div style={{
            fontSize: "24px",
            alignSelf: "center",
            width: "100%",
            fontWeight: 800,
            textAlign: "center"
        }}>
            Ой, помилка :( <br/>
            Напиши до{" "}
            <a style={{color: theme.accent, textDecoration: "none"}} href="mailto:goodlang.app@gmail.com">
                goodlang.app@gmail.com
            </a>{" "}
            і ми допоможемо.
        </div>
    ) : (
        <section id="trainer" style={gridStyle}>
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
                isInputDisabled={loading || mode === "next"}
                mainBtnText={mode === "check" ? "Перевірити" : "Наступне речення"}
                onMainButtonClick={onMainButtonClick}
                loading={loading}
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

            <ResultCard
                theme={theme}
                hint={hint}
                correctAnswer={correctAnswer}
                weakRules={weakRules}
            />

            <LimitModal
                waitTimeSeconds={waitTimeSeconds}
                isLimitReached={true}
                theme={theme}
                open={limitModalOpen}
                onClose={() => setLimitModalOpen(false)}
            />

            {cookieOpen && (
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
                />
            )}
        </section>
    );
}

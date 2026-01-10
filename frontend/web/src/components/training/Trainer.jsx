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
import {ensureAnalytics, trackMetaCustomEvent, trackMetaEvent, trackPageView} from "../../services/gaService.js";
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
        const pool = LEVEL_TO_DIFFICULTY[level] || ["A1", "A2"];
        return pool[Math.floor(Math.random() * pool.length)];
    };

    // State
    const [level, setLevel] = useState(null);
    const [difficulty, setDifficulty] = useState(() => null);
    const [textToTranslate, setTextToTranslate] = useState("");
    const [nextTextToTranslate, setNextTextToTranslate] = useState("");
    const [rules, setRules] = useState([]);
    const [nextRules, setNextRules] = useState([]);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("check"); // 'check' | 'next'
    const [isError, setIsError] = useState(false);
    const [locked, setLocked] = useState(false);

    const [taskText, setTaskText] = useState("Завантаження завдання…");
    const [hint, setHint] = useState('Порада: переклади і натисни «Перевірити»');
    const [taskHint, setTaskHint] = useState(null);
    const [nextHint, setNextHint] = useState(null);
    const [account, setAccount] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const textareaRef = useRef(null);

    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [waitTimeSeconds, setWaitTimeSeconds] = useState(false);

    const [cookieOpen, setCookieOpen] = useState(false);

    // 🔹 NEW: rules that need attention (score < 1)
    const [weakRules, setWeakRules] = useState([]);

    const loadAccount = async () => {
        const data = await callAccountInfoApi();
        setAccount(data);

        await callAccountVerifyApi(ACTION_TYPES.PAGE_OPEN_TRAINER);
    }

    useEffect(() => {
        loadAccount().then()
    }, []);

    useEffect(() => {
        if (loading) return;
        if (nextLevel === level && !nextRule) return;

        if (level !== nextLevel) {
            setRules([])
            setNextRules([])
            setNextHint(null)
        }

        setLevel(nextLevel);

        const diff = randomDifficulty(nextLevel)
        setDifficulty(diff);
        setTextToTranslate("");
        setMode("check");
        resetToLoadingPlaceholders();

        loadNewTask(diff).then(_=>{});
    }, [nextLevel]);

    useEffect(() => {
        if (mode === "check" && !notFocused && textareaRef.current && !loading) textareaRef.current.focus();
    }, [mode, loading]);

    function setControlsDisabled(disabled) {
        onLoadingChange(disabled)
        setLoading(disabled);
    }

    function resetToLoadingPlaceholders() {
        setTaskText("Завантаження завдання…");
        setHint("Завантаження нового завдання…");
        setCorrectAnswer("");
        setWeakRules([]); // 🔹 reset list of weak rules
    }

    async function fetchNextSentence({ nextLevel, nextRule, selectedDifficulty, seed, skip }) {
        let ruleToSend = nextRule;

        if (nextLevel === "managed") {
            const allStats = getAllStatistics(); // full list of {rule, accuracy, attemptsNumber}

            // Filter only rules belonging to the real CEFR current level
            const {level, isCalibration} = getTrainingLevel();
            const allowedRules = LEVEL_RULES[level] ?? [];

            const stats = allStats.filter(s => allowedRules.includes(s.rule));

            // If no nextRule → pick one based on stats
            if (!ruleToSend) {
                // 1. Rules never answered
                const noAttempts = stats.filter(r => r.attemptsNumber === 0);

                if (noAttempts.length > 0) {
                    ruleToSend = noAttempts[Math.floor(Math.random() * noAttempts.length)].rule;

                } else {
                    // 2. Weighted selection
                    const lowestAcc = stats.reduce((a, b) =>
                        a.accuracy < b.accuracy ? a : b
                    );

                    const below75 = stats.filter(r => r.accuracy < 75);

                    const rnd = Math.random() * 100;

                    const fewDataRules = stats.filter(r => r.attemptsLast7Days <= 4);
                    if (rnd < 60) {
                        // 60% lowest accuracy
                        ruleToSend = lowestAcc.rule;
                    } else if (rnd < 90 && below75.length > 0 && fewDataRules.length > 0) {
                        // 30% random with a few data
                        ruleToSend = fewDataRules[Math.floor(Math.random() * noAttempts.length)].rule;
                    } else {
                        // 10% any rule
                        const pick = stats[Math.floor(Math.random() * stats.length)];
                        ruleToSend = pick.rule;
                    }
                }
            }

            // Managed mode → DO NOT send level
            logInfo("getting training sentence...");
            const result = await callTranslateAPI({
                rules: [ruleToSend],
                seed,
                skip
            });
            if (!result.allowed) {
                setLocked(true);
                setWaitTimeSeconds(result.waitTimeSeconds);
            }
            return result;
        }

        // --- Old logic for non-managed ---
        const currentLevel = selectedDifficulty;

        logInfo("getting training sentence...");
        const result =  await callTranslateAPI({
            level: currentLevel,
            rules: [ruleToSend],
            seed,
            skip
        });

        if (!result.allowed) {
            setLocked(true);
            setWaitTimeSeconds(result.waitTimeSeconds);
        }
        return result;
    }

    async function loadNewTask(selectedDifficulty = difficulty) {
        if (!selectedDifficulty && !nextRule)
            return;

        try {
            setControlsDisabled(true);
            setAnswer("");
            setWeakRules([]); // 🔹 clear when loading a fresh task

            if (!nextRules || !nextTextToTranslate) {
                const {seed, skip} = getSeed();
                saveSeed({seed, skip});

                const data = await fetchNextSentence({ nextLevel, nextRule, selectedDifficulty, seed, skip });
                setTextToTranslate(data.textToTranslate || "");
                setRules(data.rules || null);
                setTaskText(data.textToTranslate || "—");
                setTaskHint(data.hint || null);

                saveSeed({seed, skip: data.skip ?? (skip+1) });
            } else {
                setTextToTranslate(nextTextToTranslate || "");
                setRules(nextRules || null);
                setTaskText(nextTextToTranslate || "—");
                setTaskHint(nextHint || null);
            }

            setNextTextToTranslate('');
            setNextRules([]);

            setHint('Порада: переклади і натисни «Перевірити»');
            setCorrectAnswer("");
            setMode("check");
        } catch (e) {
            console.error(e);
            setIsError(true);
        } finally {
            setControlsDisabled(false);
        }
    }

    async function evaluateAnswer() {
        const userAns = answer.trim();
        if (!userAns) { setHint("Введи переклад перед перевіркою."); return; }
        try {
            setControlsDisabled(true);
            setWeakRules([]); // 🔹 reset before new evaluation

            const {seed, skip} = getSeed();
            logInfo('evaluating answer...');
            const data = await callTranslateAPI({ freeTraining, textToTranslate, translation: userAns, rules, seed, skip });

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

            // 🔹 Detect rules with score < 1 for this evaluation
            let nextWeakRules = [];
            if (!data.isAnswerCorrect)
                nextWeakRules = rules.map(r => r);

            const uniqueWeakRules = [...new Set(nextWeakRules)];

            setWeakRules(uniqueWeakRules);

            const prevAttemptsLeft = getOverallAccuracy()?.attemptsLeft ?? 0;
            addAnswer(data.scores, rules, data.level);
            const newAttemptsLeft = getOverallAccuracy()?.attemptsLeft ?? 0;
            if (prevAttemptsLeft === 1 && newAttemptsLeft === 0)
                trackMetaCustomEvent("CompleteEvaluation");

            if (data.isAnswerCorrect) {
                setHint("✔ Правильно!");
                setCorrectAnswer("");
            } else {
                const tip = data.tipIfWrong ? " " + data.tipIfWrong : "";
                setHint("❌ Не зовсім." + tip);
                setCorrectAnswer(data.correctAnswer || "");
            }
            emit("weeklyProgressUpdate");
            setMode("next");

            const {isCalibration} = getTrainingLevel();
            if (freeTraining && !(nextLevel === 'managed' && isCalibration)) {
                setNextTextToTranslate(data.textToTranslate || "");
                setNextRules(data.rules);
                setNextHint(data.hint || null);
            } else if (nextLevel === 'managed' && isCalibration) {
                setNextRules([]);
                setNextTextToTranslate("");
                setNextRules(data.rules);
                setNextHint(null);
            }

            saveSeed({seed, skip: data.skip ?? (skip+1) });

            onAnswerEvaluated();
        } catch (e) {
            console.error(e);
            setIsError(true);
        } finally {
            setControlsDisabled(false);
        }
    }

    function handleKeyDown(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onMainButtonClick().then(_=>{}); }
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onMainButtonClick().then(_=>{}); }
    }

    async function onMainButtonClick() {
        if (locked) {
            setLimitModalOpen(true);
            return
        }

        if (!getCookieConsent()) {
            setCookieOpen(true);
            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);

            return;
        }

        if (mode === "check") await evaluateAnswer();
        else {
            const diff = randomDifficulty(level);
            setDifficulty(diff);
            resetToLoadingPlaceholders();
            await loadNewTask(diff);
        }
    }

    return (isError) ? (
        <div style={{
            fontSize: "24px",
            alignSelf: "center",
            width: "100%",
            fontWeight: 800,
            textAlign: "center"
        }}>Ой, помилка :( <br/> Напиши до <a style={{
            color: theme.accent,
            textDecoration: "none",
        }} href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a> і ми допоможемо.</div>
    ) : (
        <section id="trainer" style={gridStyle}>
            <TaskCard
                waitTimeSeconds={waitTimeSeconds}
                hint={freeTraining ? taskHint : null}
                theme={theme}
                taskText={taskText}
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
            />
            <ResultCard
                theme={theme}
                hint={hint}
                correctAnswer={correctAnswer}
                weakRules={weakRules} // 🔹 pass down
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
                        trackPageView(window.location.pathname);
                        trackMetaEvent("CompleteRegistration");

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);

                        await onMainButtonClick()
                    }}
                    onReject={async () => {
                        setCookieOpen(false);
                        rejectCookies();

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);

                        await onMainButtonClick()
                    }}
                />
            )}
        </section>
    );
}

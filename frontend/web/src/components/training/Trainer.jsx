import TaskCard from "./TaskCard.jsx";
import ResultCard from "./ResultCard.jsx";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {addAnswer, getAllStatistics, getSeed, saveSeed} from "../../services/dataService.js";
import {callTranslateAPI} from "../../services/api.js";
import LimitModal from "../subscription/LimitModal.jsx";
import {getTrainingLevel} from "../../services/trainingDirector.js";
import {LEVEL_RULES} from "../../utils/rules.js";
import {emit} from "../../services/events.js";

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

    const [taskText, setTaskText] = useState("Завантаження завдання…");
    const [hint, setHint] = useState('Порада: перекладіть і натисніть «Перевірити»');
    const [taskHint, setTaskHint] = useState(null);
    const [nextHint, setNextHint] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const textareaRef = useRef(null);

    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [waitTimeSeconds, setWaitTimeSeconds] = useState(false);

    // 🔹 NEW: rules that need attention (score < 1)
    const [weakRules, setWeakRules] = useState([]);

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
            const level = getTrainingLevel();
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
            console.log("getting training sentence...");
            return await callTranslateAPI({
                rules: [ruleToSend],
                seed,
                skip
            });
        }

        // --- Old logic for non-managed ---
        const currentLevel = selectedDifficulty;

        console.log("getting training sentence...");
        return await callTranslateAPI({
            level: currentLevel,
            rules: [ruleToSend],
            seed,
            skip
        });
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

            setHint('Порада: перекладіть і натисніть «Перевірити»');
            setCorrectAnswer("");
            setMode("check");
        } catch (e) {
            console.error(e);
            setHint("❌ Сталася помилка при отриманні завдання. Спробуйте ще раз.");
        } finally {
            setControlsDisabled(false);
        }
    }

    async function evaluateAnswer() {
        const userAns = answer.trim();
        if (!userAns) { setHint("Введіть переклад перед перевіркою."); return; }
        try {
            setControlsDisabled(true);
            setWeakRules([]); // 🔹 reset before new evaluation

            const {seed, skip} = getSeed();
            console.log('evaluating answer...');
            const data = await callTranslateAPI({ freeTraining, textToTranslate, translation: userAns, rules, seed, skip });

            if (!data.isSuccess) {
                setHint("Досягнуто ліміт користування, спробуйте пізніше.");
                setWaitTimeSeconds(data.waitTimeSeconds);
                setLimitModalOpen(true);
                return;
            }

            // 🔹 Detect rules with score < 1 for this evaluation
            let nextWeakRules = [];
            if (!data.isAnswerCorrect)
                nextWeakRules = rules.map(r => r);
            // if (Array.isArray(data.scores)) {
            //     data.scores.forEach(s => {
            //         const index = data.scores.indexOf(s);
            //         if (s < 1 && (rules.length - 1 >= index)) {
            //             nextWeakRules.push(rules[index]);
            //         }
            //     });
            // }
            const uniqueWeakRules = [...new Set(nextWeakRules)];

            setWeakRules(uniqueWeakRules);

            addAnswer(data.scores, rules, data.level);

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

            if (freeTraining) {
                setNextTextToTranslate(data.textToTranslate || "");
                setNextRules(data.rules);
                setNextHint(data.hint || null);
            }

            saveSeed({seed, skip: data.skip ?? (skip+1) });

            onAnswerEvaluated();
        } catch (e) {
            console.error(e);
            setHint("❌ Помилка перевірки. Перевірте підключення до сервера.");
        } finally {
            setControlsDisabled(false);
        }
    }

    function handleKeyDown(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onMainButtonClick().then(_=>{}); }
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onMainButtonClick().then(_=>{}); }
    }

    async function onMainButtonClick() {
        if (mode === "check") await evaluateAnswer();
        else {
            const diff = randomDifficulty(level);
            setDifficulty(diff);
            resetToLoadingPlaceholders();
            await loadNewTask(diff);
        }
    }

    return (
        <section id="trainer" style={gridStyle}>
            <TaskCard
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
        </section>
    );
}

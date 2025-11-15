import TaskCard from "./TaskCard.jsx";
import ResultCard from "./ResultCard.jsx";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {addAnswer, getSeed, saveSeed} from "../../services/dataService.js";
import {callTranslateAPI} from "../../services/api.js";
import LimitModal from "../subscription/LimitModal.jsx";

export default function Trainer({theme, onLoadingChange = _ => {}, nextLevel = null, nextRule = null}) {
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

    const didInit = useRef(false);

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
    const [correctAnswer, setCorrectAnswer] = useState("");
    const textareaRef = useRef(null);

    const [limitModalOpen, setLimitModalOpen] = useState(false);

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        if (loading) return;
        if (nextLevel === level) return;

        setLevel(nextLevel);
        const diff = randomDifficulty(nextLevel)
        setDifficulty(diff);
        setTextToTranslate("");
        setMode("check");
        resetToLoadingPlaceholders();
        loadNewTask(diff).then(_=>{});
    }, [nextLevel]);

    useEffect(() => {
        if (mode === "check" && textareaRef.current && !loading) textareaRef.current.focus();
    }, [mode, loading]);

    function setControlsDisabled(disabled) {
        onLoadingChange(disabled)
        setLoading(disabled);
    }

    function resetToLoadingPlaceholders() {
        setTaskText("Завантаження завдання…");
        setHint("Завантаження нового завдання…");
        setCorrectAnswer("");
    }

    async function loadNewTask(selectedDifficulty = difficulty) {
        if (!selectedDifficulty && !nextRule)
            return;

        try {
            setControlsDisabled(true);
            setAnswer("");

            if (!nextRules || !nextTextToTranslate) {
                const {seed, skip} = getSeed();
                saveSeed({seed, skip});

                const data = await callTranslateAPI({ level: selectedDifficulty, rules: [nextRule], seed, skip });
                setTextToTranslate(data.textToTranslate || "");
                setRules(data.rules || null);
                setTaskText(data.textToTranslate || "—");

                saveSeed({seed, skip: data.skip ?? (skip+1) });
            } else {
                setTextToTranslate(nextTextToTranslate || "");
                setRules(nextRules || null);
                setTaskText(nextTextToTranslate || "—");
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

            const {seed, skip} = getSeed();
            const data = await callTranslateAPI({ textToTranslate, translation: userAns, rules, seed, skip });

            if (!data.isSuccess) {
                setHint("Досягнуто ліміт користування, спробуйте пізніше.");
                setLimitModalOpen(true);
                return;
            }

            addAnswer(data.scores, rules, data.level);

            if (data.isAnswerCorrect) {
                setHint("✔ Правильно!");
                setCorrectAnswer("");
            } else {
                const tip = data.tipIfWrong ? " " + data.tipIfWrong : "";
                setHint("❌ Не зовсім." + tip);
                setCorrectAnswer(data.correctAnswer || "");
            }
            setMode("next");

            setNextTextToTranslate(data.textToTranslate || "");
            setNextRules(data.rules);

            saveSeed({seed, skip: data.skip ?? (skip+1) });
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
            <ResultCard theme={theme} hint={hint} correctAnswer={correctAnswer}/>
            <LimitModal
                isLimitReached={true}
                theme={theme}
                open={limitModalOpen}
                onClose={() => setLimitModalOpen(false)}
            />
        </section>
    );
}
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../AppShell";
import Header from "../Header";
import TaskCard from "../TaskCard";
import ResultCard from "../ResultCard";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { callAPI } from "../../services/api";
import {addAnswer, getSeed, saveSeed} from "../../services/dataService.js";

export default function HomePage({ theme }) {
    const LEVEL_TO_DIFFICULTY = useMemo(
        () => ({ beginner: ["A1"], intermediate: ["A2", "B1"], advanced: ["B2"] }),
        []
    );
    const randomDifficulty = (level) => {
        const pool = LEVEL_TO_DIFFICULTY[level] || ["A1", "A2"];
        return pool[Math.floor(Math.random() * pool.length)];
    };

    // State
    const [level, setLevel] = useState("beginner");
    const [difficulty, setDifficulty] = useState(() => randomDifficulty("beginner"));
    const [textToTranslate, setTextToTranslate] = useState("");
    const [nextTextToTranslate, setNextTextToTranslate] = useState("");
    const [rules, setRules] = useState([]);
    const [nextRules, setNextRules] = useState([]);
    const [mode, setMode] = useState("check"); // 'check' | 'next'
    const [loading, setLoading] = useState(false);
    const [hint, setHint] = useState('Порада: перекладіть і натисніть «Перевірити»');
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [uaTask, setUaTask] = useState("Завантаження завдання…");
    const [answer, setAnswer] = useState("");
    const textareaRef = useRef(null);

    // Responsive grid (container-based)
    const { ref: containerRef, isWide: twoCols } = useBreakpoint(880);
    const didInit = useRef(false);

    useEffect(() => {
        if (didInit.current) return;   // skip the 2nd StrictMode mount
        didInit.current = true;

        resetToLoadingPlaceholders();
        loadNewTask().then();
    }, []);

    useEffect(() => {
        if (mode === "check" && textareaRef.current && !loading) textareaRef.current.focus();
    }, [mode, loading]);

    function resetToLoadingPlaceholders() {
        setUaTask("Завантаження завдання…");
        setHint("Завантаження нового завдання…");
        setCorrectAnswer("");
    }
    function setControlsDisabled(disabled) { setLoading(disabled); }

    async function loadNewTask(selectedDifficulty = difficulty) {
        try {
            setControlsDisabled(true);
            setAnswer("");

            if (!nextRules || !nextTextToTranslate) {
                const {seed, skip} = getSeed();
                saveSeed({seed, skip});

                const data = await callAPI({ level: selectedDifficulty, seed, skip });
                setTextToTranslate(data.textToTranslate || "");
                setRules(data.rules || null);
                setUaTask(data.textToTranslate || "—");

                saveSeed({seed, skip: data.skip ?? (skip+1) });
            } else {
                setTextToTranslate(nextTextToTranslate || "");
                setRules(nextRules || null);
                setUaTask(nextTextToTranslate || "—");
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
            const data = await callAPI({ level: difficulty, textToTranslate, translation: userAns, rules, seed, skip });

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

    async function onMainButtonClick() {
        if (mode === "check") await evaluateAnswer();
        else {
            const diff = randomDifficulty(level);
            setDifficulty(diff);
            resetToLoadingPlaceholders();
            await loadNewTask(diff);
        }
    }

    async function handleLevelChange(nextLevel) {
        if (loading) return;
        if (nextLevel === level) return;

        setLevel(nextLevel);
        const diff = randomDifficulty(nextLevel)
        setDifficulty(diff);
        setTextToTranslate("");
        //setRule(null);
        setMode("check");
        resetToLoadingPlaceholders();
        await loadNewTask(diff);
    }

    function handleKeyDown(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onMainButtonClick(); }
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onMainButtonClick(); }
    }

    const gridStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    };

    // Analytics button (LevelSwitch style)
    const [hoveredAnalytics, setHoveredAnalytics] = useState(false);
    const analyticsButtonStyles = {
        container: { display: "flex", justifyContent: "center", margin: "16px 0 0", flexDirection: "row",},
        button: (isHover) => ({
            appearance: "none",
            padding: "10px 18px",
            fontWeight: 800,
            fontSize: 14,
            lineHeight: 1,
            borderRadius: 999,
            cursor: "pointer",
            background: "#fffdf8",
            color: theme.text,
            border: `2px solid ${theme.accent}`,
            boxShadow: `2px 2px 0 ${theme.accentDark}`,
            transform: isHover ? "translateY(1px)" : "none",
            transition: "transform 120ms ease",
        }),
    };

    const navigate = useNavigate();
    const handleAnalyticsClick = () => navigate("/analytics");

    return (
        <AppShell theme={theme}>
            <div ref={containerRef}>
                <Header
                    theme={theme}
                    level={level}
                    defaultLevel="beginner"
                    loading={loading}
                    onLevelChange={handleLevelChange}
                />
                <section style={gridStyle}>
                    <TaskCard
                        theme={theme}
                        uaTask={uaTask}
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
                    <button
                        onMouseEnter={() => setHoveredAnalytics(true)}
                        onMouseLeave={() => setHoveredAnalytics(false)}
                        style={analyticsButtonStyles.button(hoveredAnalytics)}
                        onClick={handleAnalyticsClick}
                    >
                        Що мені підтягнути? →
                    </button>
                </section>

                <footer style={{
                    marginTop: 32,
                    textAlign: "center",
                    color: theme.muted,
                    fontSize: 13,
                    borderTop: `2px solid ${theme.accent}`,
                    paddingTop: 12
                }}>
                    <div style={analyticsButtonStyles.container}>
                        <div>© 2025 StepLang</div>
                    </div>
                </footer>
            </div>
        </AppShell>
    );
}

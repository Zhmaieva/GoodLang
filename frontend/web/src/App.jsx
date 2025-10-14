import React, { useEffect, useMemo, useRef, useState } from "react";
import AppShell from "./components/AppShell";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";
import ResultCard from "./components/ResultCard";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { callAPI } from "./services/api";

export default function App() {
    const LEVEL_TO_DIFFICULTY = useMemo(
        () => ({ beginner: ["A1", "A2"], intermediate: ["B1", "B2"], advanced: ["C1", "C2"] }),
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
    const [rule, setRule] = useState(null);
    const [mode, setMode] = useState("check"); // 'check' | 'next'
    const [loading, setLoading] = useState(false);
    const [hint, setHint] = useState('Порада: перекладіть і натисніть «Перевірити»');
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [uaTask, setUaTask] = useState("Завантаження завдання…");
    const [answer, setAnswer] = useState("");
    const textareaRef = useRef(null);

    // Responsive grid (container-based)
    const { ref: containerRef, isWide: twoCols } = useBreakpoint(880);

    const gridStyle = {
        display: "flex",
        flexDirection: "column",
        gridTemplateColumns: twoCols ? "1fr 1fr" : "1fr",
        gap: 24,
    };

    const [hoveredAnalytics, setHoveredAnalytics] = useState(false);

    const analyticsButtonStyles = {
        container: {
            display: "flex",
            justifyContent: "flex-end",
            margin: "16px 0",
        },
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


    useEffect(() => {
        resetToLoadingPlaceholders();
        loadNewTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    async function loadNewTask() {
        try {
            setControlsDisabled(true);
            setAnswer("");
            const data = await callAPI({ level: difficulty });
            setTextToTranslate(data.textToTranslate || "");
            setRule(data.rule || null);
            setUaTask(data.textToTranslate || "—");
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
            const data = await callAPI({ level: difficulty, textToTranslate, translation: userAns, rule });
            if (data.isAnswerCorrect) {
                setHint("✔ Правильно!");
                setCorrectAnswer("");
            } else {
                const tip = data.tipIfWrong ? " " + data.tipIfWrong : "";
                setHint("❌ Не зовсім." + tip);
                setCorrectAnswer(data.correctAnswer || "");
            }
            setMode("next");
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
            setDifficulty(randomDifficulty(level));
            resetToLoadingPlaceholders();
            await loadNewTask();
        }
    }

    async function handleLevelChange(nextLevel) {
        if (loading) return;
        setLevel(nextLevel);
        setDifficulty(randomDifficulty(nextLevel));
        setTextToTranslate("");
        setRule(null);
        setMode("check");
        resetToLoadingPlaceholders();
        await loadNewTask();
    }

    function handleKeyDown(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onMainButtonClick(); }
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onMainButtonClick(); }
    }

    // Simple click handler for now — later you can navigate or open analytics modal
    const handleAnalyticsClick = () => {
        alert("Перейти до аналітики (пізніше — сторінка/модальне вікно)");
    };

    return (
        <AppShell theme={theme}>
            <div ref={containerRef}>
                <Header
                    theme={theme}
                    level={level}
                    loading={loading}
                    onLevelChange={handleLevelChange}
                />

                <div style={analyticsButtonStyles.container}>
                    <button
                        onMouseEnter={() => setHoveredAnalytics(true)}
                        onMouseLeave={() => setHoveredAnalytics(false)}
                        style={analyticsButtonStyles.button(hoveredAnalytics)}
                        onClick={handleAnalyticsClick}
                    >
                        Аналітика →
                    </button>
                </div>

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
                </section>
                <footer style={{
                    marginTop: 32,
                    textAlign: "center",
                    color: theme.muted,
                    fontSize: 13,
                    borderTop: `2px solid ${theme.accent}`,
                    paddingTop: 12
                }}>
                    © 2025 StepLang
                </footer>
            </div>
        </AppShell>
    );
}

// Theme (kept simple; later you can move to context)
const theme = {
    bg: "#fff3df",
    accent: "#ff6138",
    accentDark: "#d74e2a",
    green: "#4ba36e",
    greenDark: "#2d6f48",
    blue: "#3a6ea5",
    text: "#3a2a1d",
    muted: "#a47856",
    white: "#fffdf8",
    radius: 20,
};

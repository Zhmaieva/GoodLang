import { useEffect, useState } from "react";

export default function TaskCard({
                                     theme, taskText, answer, setAnswer,
                                     isInputDisabled, mainBtnText, onMainButtonClick, loading, textareaRef, onKeyDown,
                                     hint, locked = false, waitTimeSeconds = 0, account,

                                     // ✅ NEW (for gap mode)
                                     taskType = "translate",
                                     gapOptions = [],
                                     gapSelected = null,
                                     setGapSelected = _ => {},
                                 }) {
    const [hovered, setHovered] = useState(false);

    // ✅ countdown state
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        // start / reset timer only when locked + positive wait time
        if (locked && waitTimeSeconds > 0) {
            setSecondsLeft(waitTimeSeconds);

            const interval = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        window.location.reload();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }

        // if unlocked, clear timer
        setSecondsLeft(0);
    }, [locked, waitTimeSeconds]);

    const formatTime = (s) => {
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;

        const hh = String(hours).padStart(2, "0");
        const mm = String(minutes).padStart(2, "0");
        const ss = String(seconds).padStart(2, "0");

        // show HH:MM:SS only if hours > 0
        return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
    };

    const isLockedNow = locked && secondsLeft > 0;
    const buttonText = isLockedNow ? `Підпишись або почекай ${formatTime(secondsLeft)}` : mainBtnText;

    const styles = {
        card: {
            background: "#fffdf8",
            border: `3px solid ${theme.accent}`,
            borderRadius: theme.radius,
            boxShadow: `4px 4px 0 ${theme.accentDark}`,
            padding: 20,
        },
        taskText: { fontSize: "1.5rem", fontWeight: 800, color: theme.text },
        inputWrap: { marginTop: 14, display: "flex", flexDirection: "column", gap: 12 },
        textarea: {
            fontFamily: "Nunito, system-ui, sans-serif",
            resize: "none",
            flex: 1,
            minHeight: 70,
            borderRadius: theme.radius,
            border: `3px solid ${theme.accent}`,
            background: "#fffaf3",
            padding: "12px 14px",
            fontWeight: 800,
            fontSize: "1rem",
            color: theme.text,
            opacity: isInputDisabled ? 0.7 : 1,
        },
        btn: {
            appearance: "none",
            padding: "10px 14px",
            fontWeight: 800,
            fontSize: "clamp(0.85rem, 3.5vw, 1.3rem)",
            lineHeight: 1,
            borderRadius: 999,
            cursor: (loading) ? "not-allowed" : "pointer",
            background: theme.accent ?? "#4ba36e",
            color: "#fff",
            border: "2px solid rgba(0,0,0,0.12)",
            boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
            fontFamily: "Nunito, system-ui, sans-serif",
            whiteSpace: "nowrap",
            opacity: (loading) ? 0.7 : 1,
            transform: hovered ? "translateY(1px)" : "none",
            filter: hovered ? "brightness(0.95)" : "none",
            transition: "transform 120ms ease, filter 120ms ease",
        },
        hintText: {
            background: "#fffaf3",
            border: `2px dashed ${theme.accent}`,
            padding: "2px 14px",
            borderRadius: theme.radius,
            color: theme.text,
            whiteSpace: "pre-wrap",
        },

        // ✅ loader styles
        loaderWrap: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            paddingTop: 2,
            paddingBottom: 2,
        },
        bars: {
            display: "inline-flex",
            alignItems: "flex-end",
            gap: 8,
            height: 26,
            marginLeft: 12,
        },
        optionsWrap: {
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
        },
        optionBtn: (active) => ({
            appearance: "none",
            padding: "10px 14px",
            borderRadius: 999,
            fontWeight: 800,
            fontSize: "1rem",
            fontFamily: "Nunito, system-ui, sans-serif",
            cursor: "pointer",
            border: `2px solid ${theme.accent}`,
            background: active ? theme.accent : "#fffef6",
            color: active ? "#fff" : theme.text,
            boxShadow: `2px 2px 0 ${theme.accentDark}`,
        }),
        bar: (white) => ({
            width: 7,              // thick
            borderRadius: 999,
            background: white ? "#fff" : theme.text // same as task title color
        })
    };

    const BarsLoader = ({white = false}) => (
        <div style={styles.loaderWrap} aria-label="Loading" role="status">
            <div style={styles.bars}>
                <span style={{ ...styles.bar(white), height: 12, animation: "glWave 700ms ease-in-out infinite" }} />
                <span style={{ ...styles.bar(white), height: 18, animation: "glWave 700ms ease-in-out infinite 120ms" }} />
                <span style={{ ...styles.bar(white), height: 12, animation: "glWave 700ms ease-in-out infinite 240ms" }} />
            </div>

            {/* local keyframes (no deps) */}
            <style>{`
        @keyframes glWave {
          0%, 100% { transform: translateY(4px) scaleY(1); opacity: 0.65; }
          25% { transform: translateY(0px) scaleY(1.5); opacity: 1; }
          70% { transform: translateY(-8px) scaleY(1); opacity: 1; }
        }
      `}</style>
        </div>
    );

    return (
        <div style={styles.card} aria-live="polite">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {/* ✅ if loading, show bars instead of task text */}
                {loading ? (
                    <BarsLoader />
                ) : (
                    <div
                        style={styles.taskText}
                        dangerouslySetInnerHTML={{__html: taskText}}
                    />
                )}

                {/* keep hint behavior */}
                {hint && !loading && <div style={styles.hintText}>{hint}</div>}
            </div>

            <div style={styles.inputWrap}>
                {taskType === "gap" ? (
                    <div style={styles.optionsWrap}>
                        {gapOptions.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                style={styles.optionBtn(gapSelected === opt)}
                                onClick={() => setGapSelected(opt)}
                                disabled={loading || isInputDisabled}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        placeholder="Введи переклад англійською…"
                        autoComplete="off"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={onKeyDown}
                        readOnly={isInputDisabled}
                        style={styles.textarea}
                    />
                )}

                <button
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    aria-label="Перевірити переклад"
                    onClick={onMainButtonClick}
                    disabled={loading}
                    style={styles.btn}
                >
                    {loading ? (
                    <BarsLoader white />
                    ) : buttonText}

                </button>
            </div>
        </div>
    );
}

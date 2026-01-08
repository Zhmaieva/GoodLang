import { useEffect, useState } from "react";

export default function TaskCard({
                                     theme, taskText, answer, setAnswer,
                                     isInputDisabled, mainBtnText, onMainButtonClick, loading, textareaRef, onKeyDown,
                                     hint, locked = false, waitTimeSeconds = 0, account
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
            fontSize: "clamp(0.9rem, 3.5vw, 1.3rem)",
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
    };

    return (
        <div style={styles.card} aria-live="polite">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <div style={styles.taskText}>{taskText}</div>
                {hint && <div style={styles.hintText}>{hint}</div>}
            </div>

            <div style={styles.inputWrap}>
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

                <button
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    aria-label="Перевірити переклад"
                    onClick={onMainButtonClick}
                    disabled={loading}
                    style={styles.btn}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

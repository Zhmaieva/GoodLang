import {useState} from "react";

export default function TaskCard({
                                     theme, taskText, answer, setAnswer,
                                     isInputDisabled, mainBtnText, onMainButtonClick, loading, textareaRef, onKeyDown,
                                     hint
                                 }) {
    const [hovered, setHovered] = useState(null);

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
            flex: 1, minHeight: 70, borderRadius: theme.radius, border: `3px solid ${theme.accent}`,
            background: "#fffaf3", padding: "12px 14px", fontWeight: 800, fontSize: "1rem", color: theme.text,
            opacity: isInputDisabled ? 0.7 : 1,
        },
        btn: {
            appearance: "none",
            padding: "10px 14px",
            fontWeight: 800,
            fontSize: "1.3rem",
            lineHeight: 1,
            borderRadius: 999,
            cursor: loading ? "not-allowed" : "pointer",
            background: theme.accent ?? "#4ba36e",
            color: "#fff",
            border: "2px solid rgba(0,0,0,0.12)",
            boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
            fontFamily: "Nunito, system-ui, sans-serif",
            whiteSpace: "nowrap",
            opacity: loading ? 0.7 : 1,

            transform: hovered ? "translateY(1px)" : "none",
            filter: hovered ? "brightness(0.95)" : "none",
            transition: "transform 120ms ease, filter 120ms ease",
        },
        // }
        // btn: {
        //     background: theme.accent, color: "#fff", fontWeight: 800, border: "none", borderRadius: 999,
        //     padding: "12px 20px", fontFamily: "Nunito, system-ui, sans-serif", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
        //     boxShadow: `3px 3px 0 ${theme.accentDark}`, width: "100%", opacity: loading ? 0.7 : 1,transform: hovered ? "translateY(1px)" : "none",
        // },
        hintText: {
            background: "#fffaf3", border: `2px dashed ${theme.accent}`,
            padding: "2px 14px", borderRadius: theme.radius, color: theme.text, whiteSpace: "pre-wrap",
        },
    };

    return (
        <div style={styles.card} aria-live="polite">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <div style={styles.taskText}>{taskText}</div>
                {hint && <div style={styles.hintText}>
                    {hint}
                </div>}
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
                    {mainBtnText}
                </button>
            </div>
        </div>
    );
}

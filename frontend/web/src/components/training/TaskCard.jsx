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
            background: theme.accent, color: "#fff", fontWeight: 800, border: "none", borderRadius: 999,
            padding: "12px 20px", fontFamily: "Nunito, system-ui, sans-serif", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: `3px 3px 0 ${theme.accentDark}`, width: "100%", opacity: loading ? 0.7 : 1,transform: hovered ? "translateY(1px)" : "none",
        },
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

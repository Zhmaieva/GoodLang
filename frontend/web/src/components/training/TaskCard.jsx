export default function TaskCard({
                                     theme, taskText, answer, setAnswer,
                                     isInputDisabled, mainBtnText, onMainButtonClick, loading, textareaRef, onKeyDown,
                                     hint
                                 }) {
    const styles = {
        card: {
            background: "#fffdf8",
            border: `3px solid ${theme.accent}`,
            borderRadius: theme.radius,
            boxShadow: `4px 4px 0 ${theme.accentDark}`,
            padding: 20,
        },
        taskText: { fontSize: 22, fontWeight: 700, color: theme.text },
        inputWrap: { marginTop: 14, display: "flex", flexDirection: "column", gap: 12 },
        textarea: {
            resize: "none",
            flex: 1, minHeight: 70, borderRadius: theme.radius, border: `3px solid ${theme.accent}`,
            background: "#fffaf3", padding: "12px 14px", fontSize: 16, color: theme.text,
            opacity: isInputDisabled ? 0.7 : 1,
        },
        btn: {
            background: theme.accent, color: "#fff", fontWeight: 700, border: "none", borderRadius: 999,
            padding: "12px 20px", fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: `3px 3px 0 ${theme.accentDark}`, width: "100%", opacity: loading ? 0.7 : 1,
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
            placeholder="Введіть переклад англійською…"
            autoComplete="off"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isInputDisabled}
            style={styles.textarea}
        />
                <button
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

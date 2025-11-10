export default function TaskCard({
                                     theme, uaTask, answer, setAnswer,
                                     isInputDisabled, mainBtnText, onMainButtonClick, loading, textareaRef, onKeyDown
                                 }) {
    const styles = {
        card: {
            background: "#fffdf8",
            border: `3px solid ${theme.accent}`,
            borderRadius: theme.radius,
            boxShadow: `4px 4px 0 ${theme.accentDark}`,
            padding: 20,
        },
        ua: { fontSize: 22, fontWeight: 700, color: theme.text },
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
    };

    return (
        <div style={styles.card} aria-live="polite">
            <div style={styles.ua}>{uaTask}</div>
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

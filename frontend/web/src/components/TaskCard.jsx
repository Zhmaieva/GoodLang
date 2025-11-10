import PrimaryButton from "./PrimaryButton.jsx";
import Card from "./Card.jsx";

export default function TaskCard({
                                     theme, uaTask, answer, setAnswer,
                                     isInputDisabled, mainBtnText, onMainButtonClick, loading, textareaRef, onKeyDown
                                 }) {
    const styles = {
        ua: { fontSize: 32, fontWeight: 700, color: theme.primaryText },
        inputWrap: { marginTop: 14, display: "flex", flexDirection: "column", alignItems:"center", gap: 12 },
        textarea: {
            width: "100%",
            resize: 'none',
            flex: 1,
            minHeight: 70,

            background: theme.backgroundGlass,
            backdropFilter: "blur(3px) brightness(1) grayscale(0)",
            border: theme.borderGlass,
            boxShadow: `inset ${theme.boxShadowGlass}`,
            borderRadius: 12,
            padding: '8px 8px 18px 8px',
            outline: 'none',

            // fontFamily:
            //     'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
            fontSize: 16,
            color: theme.primaryText,
        },
        btn: {
            padding: "12px 20px",
            width: "100%",
            background: theme.backgroundGlassHighlightBtn,
        },
        card: {
            width: "100%",
            padding: "12px 20px",
            background: theme.backgroundGlassThick,
            backdropFilter: "blur(8px) brightness(1) grayscale(0)",
        }
    };

    return (
        <Card style={styles.card} theme={theme} aria-live="polite">
            <div style={styles.ua}>{uaTask}</div>
            <div style={styles.inputWrap}>
                <textarea
                    className={'glass-textarea'}
                    ref={textareaRef}
                    placeholder="Введіть переклад англійською…"
                    autoComplete="off"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={isInputDisabled}
                    style={styles.textarea}
                />
                <PrimaryButton loading={loading}
                               onPressed={onMainButtonClick}
                               style={styles.btn}
                               label={loading ? 'Перевіряємо...' : mainBtnText}
                               selected={false}
                               theme={theme} />
            </div>
        </Card>
    );
}

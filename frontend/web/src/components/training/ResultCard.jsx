import {RULE_LABELS} from "../../utils/rules.js";

export default function ResultCard({ theme, hint, correctAnswer, weakRules = [] }) {
    const styles = {
        card: {
            background: "#fffdf8",
            border: `3px solid ${theme.accent}`,
            borderRadius: theme.radius,
            boxShadow: `4px 4px 0 ${theme.accentDark}`,
            padding: 20,
        },
        title: {
            fontSize: 16, textTransform: "uppercase", color: theme.text,
            fontWeight: 700, marginBottom: 10, letterSpacing: ".05em",
        },
        feedback: {
            background: "#fffaf3", border: `2px dashed ${theme.accent}`,
            padding: "12px 14px", borderRadius: theme.radius, color: theme.text, minHeight: 44, whiteSpace: "pre-wrap",
        },
        correctWrap: {
            marginTop: 8, background: "#fff", border: `2px solid ${theme.green}`,
            borderRadius: theme.radius, boxShadow: `2px 2px 0 ${theme.green}`, padding: "10px 12px",
        },
        correctTitle: {
            fontSize: 13, fontWeight: 800, color: theme.green, marginBottom: 6,
            textTransform: "uppercase", letterSpacing: ".04em",
        },
        correctText: {
            fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
            fontSize: 15, background: "#f4fff7", border: `1.5px dashed ${theme.green}`,
            borderRadius: 12, padding: "8px 10px", display: "inline-block",
        },
        rulesOuterWrap: {
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: 8,
        },
        rulesWrap: {
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
        },
        ruleButton: {
            cursor: "pointer",
            borderRadius: theme.radius,
            border: `2px solid ${theme.accent}`,
            background: "#fffef6",
            padding: "6px 10px",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: ".04em",
            color: theme.text,
            boxShadow: `2px 2px 0 ${theme.accentDark}`,
        },
        rulesTitle: {
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".04em",
            color: theme.text,
            marginBottom: 4,
        },
    };

    const openRuleInNewTab = (rule) => {
        // 🔹 adjust URL pattern if your routing is different
        const url = `/rule/${rule}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Результат</h2>
            <div style={styles.feedback}>{hint}</div>

            {correctAnswer ? (
                <div style={styles.correctWrap}>
                    <div style={styles.correctTitle}>Правильна відповідь</div>
                    <div style={styles.correctText}>{correctAnswer}</div>
                </div>
            ) : null}

            {weakRules.length > 0 && (
                <div style={styles.rulesOuterWrap}>
                    <div style={styles.rulesTitle}>
                        Важливі правила:
                    </div>
                    <div style={styles.rulesWrap}>
                        {weakRules.map((rule) => (
                            <button
                                key={rule}
                                type="button"
                                style={styles.ruleButton}
                                onClick={() => openRuleInNewTab(rule)}
                            >
                                {RULE_LABELS[rule]}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

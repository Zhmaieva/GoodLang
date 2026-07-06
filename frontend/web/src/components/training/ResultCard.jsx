import { RULE_LABELS } from "../../utils/rules.js";

export default function ResultCard({ theme, hint, correctAnswer, weakRules = [] }) {
    // ----- same “TaskCard” styling tokens -----
    const CARD_BG = "#fffbf0";
    const CARD_BORDER_IDLE = "#40a6ff";
    const CARD_SHADOW_IDLE = "0 10px 26px rgba(0,0,0,0.12)";
    const SOFT_INNER = "#fffbf0";
    const SOFT_RED = "rgba(255, 230, 228, 0.92)";
    const SOFT_GREEN = "rgba(232, 247, 238, 0.92)";
    const SOFT_STROKE = "rgba(0,0,0,0.12)";
    const SOFT_STROKE_ACCENT = "#40a6ff";
    const SOFT_STROKE_ACCENT_2 = "#40a6ff";

    const styles = {
        card: {
            background: CARD_BG,
            border: `2px solid #40a6ff`,
            borderRadius: 5,
            boxShadow: CARD_SHADOW_IDLE,
            padding: 20,
        },

        title: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: "1.2rem",
            color: theme.text,
            fontWeight: 700,
            marginBottom: 10,
            marginTop: 0,
            letterSpacing: ".02em",
        },

        // animated wrappers (same animation, different keys)
        floatIn: {
            animation: "glFloatIn 420ms ease-out both",
            willChange: "transform, opacity",
        },

        feedback: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            background: SOFT_INNER,
            border: `1px solid #6F625B`,
            padding: "12px 14px",
            borderRadius: 5,
            color: theme.text,
            minHeight: 44,
            fontWeight: 500,
            whiteSpace: "pre-wrap",
            fontSize: "1rem",
        },

        correctWrap: {
            marginTop: 14,
            background: SOFT_INNER,
            border: `2px solid ${SOFT_STROKE_ACCENT}`,
            borderRadius: 5,
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            padding: "12px 14px",
        },

        correctTitle: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: "0.95rem",
            fontWeight: 900,
            color: theme.text,
            marginBottom: 8,
            letterSpacing: ".03em",
            opacity: 0.95,
        },

        correctText: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: "1rem",
            fontWeight: 800,
            color: theme.text,
            background: "rgba(255,255,255,0.78)",
            border: `2px solid ${SOFT_STROKE}`,
            borderRadius: 5,
            padding: "10px 12px",
            display: "inline-block",
            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
            whiteSpace: "pre-wrap",
        },

        rulesOuterWrap: {
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
        },

        rulesTitle: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: "0.95rem",
            fontWeight: 900,
            letterSpacing: ".03em",
            color: theme.text,
            marginBottom: 2,
            opacity: 0.95,
        },

        rulesWrap: {
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
        },

        ruleButton: {
            appearance: "none",
            cursor: "pointer",
            borderRadius: 5,
            border: `2px solid ${SOFT_STROKE_ACCENT}`,
            background: "#fffbf0",
            padding: "10px 14px",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: '"Source Serif 4", Georgia, serif',
            letterSpacing: ".02em",
            color: theme.text,
            boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
            transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
        },
    };

    const openRuleInNewTab = (rule) => {
        const url = `/rule/${rule}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    // ✅ keying forces remount => animation replays on content change
    const hintKey = `hint:${hint ?? ""}`;
    const correctKey = `correct:${correctAnswer ?? ""}`;

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Result</h2>

            <div key={hintKey} style={styles.floatIn}>
                <div style={styles.feedback}>{hint.replaceAll('❌','').replaceAll('✔','').trim()}</div>
            </div>

            {correctAnswer ? (
                <div key={correctKey} style={{ ...styles.floatIn, marginTop: 14 }}>
                    <div style={styles.correctWrap}>
                        <div style={styles.correctTitle}>Correct answer</div>
                        <div style={styles.correctText}>{correctAnswer}</div>
                    </div>
                </div>
            ) : null}

            {weakRules.length > 0 && (
                <div style={styles.rulesOuterWrap}>
                    <div style={styles.rulesTitle}>Important rules:</div>

                    <div style={styles.rulesWrap}>
                        {weakRules.map((rule) => (
                            <button
                                key={rule}
                                type="button"
                                style={styles.ruleButton}
                                onClick={() => openRuleInNewTab(rule)}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = "translateY(1px)";
                                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.10)";
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = "none";
                                    e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.10)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "none";
                                    e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.10)";
                                }}
                            >
                                {RULE_LABELS[rule]}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
            @keyframes glFloatIn {
                0%   { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0px); }
            }
        `}</style>
        </div>
    );
}

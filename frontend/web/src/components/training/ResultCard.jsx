import { RULE_LABELS } from "../../utils/rules.js";
import { Button } from "../Buttons.jsx";
import { APP_BACKGROUND_COLOR } from "../../theme.js";

export default function ResultCard({
                                       theme,
                                       hint,
                                       correctAnswer,
                                       weakRules = [],
                                       quickVerdict = null,
                                       isDetailedLoading = false,
                                   }) {
    // ----- same “TaskCard” styling tokens -----
    const CARD_BG = theme?.bg ?? APP_BACKGROUND_COLOR;
    const CARD_BORDER_IDLE = "#40a6ff";
    const CARD_SHADOW_IDLE = "none";
    const SOFT_INNER = theme?.bg ?? APP_BACKGROUND_COLOR;
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
            fontFamily: 'var(--font-family-base)',
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
            fontFamily: 'var(--font-family-base)',
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

        feedbackRow: {
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
        },

        loaderWrap: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 22,
        },

        bars: {
            display: "inline-flex",
            alignItems: "flex-end",
            gap: 8,
            height: 22,
        },

        bar: {
            width: 7,
            borderRadius: 999,
            background: theme.text,
            boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
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
            fontFamily: 'var(--font-family-base)',
            fontSize: "0.95rem",
            fontWeight: 900,
            color: theme.text,
            marginBottom: 8,
            letterSpacing: ".03em",
            opacity: 0.95,
        },

        correctText: {
            fontFamily: 'var(--font-family-base)',
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
            fontFamily: 'var(--font-family-base)',
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
            background: theme?.bg ?? APP_BACKGROUND_COLOR,
            padding: "10px 14px",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: 'var(--font-family-base)',
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
    const cleanHint = String(hint ?? "").replaceAll('❌','').replaceAll('✔','').trim();
    const feedbackText = isDetailedLoading
        ? quickVerdict === false
            ? "Not quite, summarizing feedback"
            : "Checking..."
        : cleanHint;
    const showLoader = isDetailedLoading && quickVerdict !== true;
    const recommendedRules = weakRules.slice(0, 3);

    const BarsLoader = () => (
        <div style={styles.loaderWrap} aria-label="Loading detailed feedback" role="status">
            <div style={styles.bars}>
                <span style={{ ...styles.bar, height: 10, animation: "glWave 700ms ease-in-out infinite" }} />
                <span style={{ ...styles.bar, height: 16, animation: "glWave 700ms ease-in-out infinite 120ms" }} />
                <span style={{ ...styles.bar, height: 10, animation: "glWave 700ms ease-in-out infinite 240ms" }} />
            </div>
        </div>
    );

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Result</h2>

            <div key={hintKey} style={styles.floatIn}>
                <div style={styles.feedback}>
                    <span style={styles.feedbackRow}>
                        <span>{feedbackText}</span>
                        {showLoader ? <BarsLoader /> : null}
                    </span>
                </div>
            </div>

            {correctAnswer ? (
                <div key={correctKey} style={{ ...styles.floatIn, marginTop: 14 }}>
                    <div style={styles.correctWrap}>
                        <div style={styles.correctTitle}>Correct answer</div>
                        <div style={styles.correctText}>{correctAnswer}</div>
                    </div>
                </div>
            ) : null}

            {recommendedRules.length > 0 && (
                <div style={styles.rulesOuterWrap}>
                    <div style={styles.rulesTitle}>Recommended rules:</div>

                    <div style={styles.rulesWrap}>
                        {recommendedRules.map((rule) => (
                            <Button
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
                                {RULE_LABELS[rule] || rule}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
            @keyframes glFloatIn {
                0%   { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0px); }
            }
            @keyframes glWave {
                0%, 100% { transform: translateY(4px) scaleY(1); opacity: 0.65; }
                25% { transform: translateY(0px) scaleY(1.5); opacity: 1; }
                70% { transform: translateY(-8px) scaleY(1); opacity: 1; }
            }
        `}</style>
        </div>
    );
}

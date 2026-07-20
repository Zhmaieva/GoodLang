import { RULE_LABELS } from "../../utils/rules.js";
import { Button } from "../Buttons.jsx";
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR } from "../../theme.js";
import { BookOpen } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

function removeTrailingCorrectAnswer(feedback, correctAnswer) {
    let next = String(feedback ?? "").trim();
    const answer = String(correctAnswer ?? "").trim();

    if (!answer) {
        return next;
    }

    const answerWithoutEndPunctuation = answer.replace(/[.!?]+$/u, "");
    const candidates = [answer, answerWithoutEndPunctuation]
        .filter(Boolean)
        .flatMap((value) => [
            value,
            `**${value}**`,
            `"${value}"`,
            `“${value}”`,
        ])
        .sort((a, b) => b.length - a.length);

    for (const candidate of candidates) {
        if (next.endsWith(candidate)) {
            next = next.slice(0, -candidate.length).trim();
            break;
        }
    }

    return next.replace(/\s*[:;,—-]\s*$/u, ".").trim();
}

function renderInlineMarkdown(value) {
    const text = String(value ?? "");
    const parts = [];
    const pattern = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;

    for (const match of text.matchAll(pattern)) {
        const start = match.index ?? 0;

        if (start > lastIndex) {
            parts.push(text.slice(lastIndex, start));
        }

        parts.push(
            <strong key={`feedback-bold-${start}`} style={{ fontWeight: 700 }}>
                {match[1]}
            </strong>
        );

        lastIndex = start + match[0].length;
    }

    if (!parts.length) {
        return text;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}

export default function ResultCard({
                                       theme,
                                       hint,
                                       correctAnswer,
                                       weakRules = [],
                                       quickVerdict = null,
                                       isDetailedLoading = false,
                                   }) {
    const navigate = useNavigate();

    // ----- same “TaskCard” styling tokens -----
    const CARD_BG = theme?.bg ?? APP_BACKGROUND_COLOR;
    const CARD_BORDER_IDLE = theme?.accent ?? APP_ACCENT_COLOR;
    const CARD_SHADOW_IDLE = "none";
    const SOFT_INNER = theme?.bg ?? APP_BACKGROUND_COLOR;
    const SOFT_RED = "rgba(255, 230, 228, 0.92)";
    const SOFT_GREEN = "rgba(232, 247, 238, 0.92)";
    const SOFT_STROKE = "rgba(0,0,0,0.12)";
    const SOFT_STROKE_ACCENT = theme?.accent ?? APP_ACCENT_COLOR;
    const SOFT_STROKE_ACCENT_2 = theme?.accent ?? APP_ACCENT_COLOR;

    const styles = {
        card: {
            background: CARD_BG,
            border: `0px solid ${CARD_BORDER_IDLE}`,
            borderRadius: 5,
            boxShadow: CARD_SHADOW_IDLE,
            padding: 0,
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
            background: SOFT_INNER,
            border: `1px solid #6F625B`,
            borderRadius: 5,
            padding: "12px 14px",
        },

        correctTitle: {
            fontFamily: 'var(--font-family-base)',
            fontSize: "1.2rem",
            fontWeight: 700,
            color: theme.text,
            marginBottom: 10,
            letterSpacing: ".02em",
        },

        correctText: {
            fontFamily: 'var(--font-family-base)',
            fontSize: "1rem",
            fontWeight: 500,
            color: theme.text,
            whiteSpace: "pre-wrap",
        },

        rulesOuterWrap: {
            marginTop: 12,
            paddingTop: 10,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            borderTop: "1px solid #000",
        },

        rulesLabel: {
            fontFamily: 'var(--font-family-base)',
            fontSize: "0.88rem",
            fontWeight: 400,
            color: "#000",
        },

        rulesWrap: {
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
        },

        ruleButton: {
            appearance: "none",
            cursor: "pointer",
            borderRadius: 5,
            border: "1px solid #000",
            background: "transparent",
            padding: "4px 10px",
            fontSize: "0.95rem",
            fontWeight: 400,
            fontFamily: 'var(--font-family-base)',
            letterSpacing: 0,
            color: theme.text,
            boxShadow: "none",
            gap: 6,
            transition: "background-color 140ms ease, color 140ms ease",
        },

        ruleIcon: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
        },
    };

    const openRule = (rule) => {
        navigate(`/rule/${rule}`);
    };

    // ✅ keying forces remount => animation replays on content change
    const hintKey = `hint:${hint ?? ""}`;
    const correctKey = `correct:${correctAnswer ?? ""}`;
    const cleanHint = removeTrailingCorrectAnswer(
        String(hint ?? "").replaceAll('❌','').replaceAll('✔','').trim(),
        correctAnswer
    );
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
                        <span>{renderInlineMarkdown(feedbackText)}</span>
                        {showLoader ? <BarsLoader /> : null}
                    </span>

                    {recommendedRules.length > 0 && (
                        <div style={styles.rulesOuterWrap}>
                            <span style={styles.rulesLabel}>Rule reference</span>
                            <div style={styles.rulesWrap}>
                                {recommendedRules.map((rule) => (
                                    <Button
                                        key={rule}
                                        type="button"
                                        style={styles.ruleButton}
                                        onClick={() => openRule(rule)}
                                    >
                                        <span style={styles.ruleIcon}>
                                            <BookOpen size={16} weight="regular" />
                                        </span>
                                        {RULE_LABELS[rule] || rule}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {correctAnswer ? (
                <div key={correctKey} style={{ ...styles.floatIn, marginTop: 14 }}>
                    <div style={styles.correctTitle}>Correct answer</div>
                    <div style={styles.correctWrap}>
                        <div style={styles.correctText}>{correctAnswer}</div>
                    </div>
                </div>
            ) : null}

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

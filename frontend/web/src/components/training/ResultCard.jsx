import { useEffect } from "react";
import { RULE_LABELS } from "../../utils/rules.js";
import { Button } from "../Buttons.jsx";
import {
    APP_ACCENT_COLOR,
    APP_ACCENT_SOFT_COLOR,
    APP_BORDER_COLOR,
    APP_DARK_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../../theme.js";
import { CheckCircle, Lightbulb, Sparkle, XCircle } from "@phosphor-icons/react";

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

function normalizeAnswer(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[’]/g, "'")
        .replace(/[.!?]+$/u, "")
        .replace(/\s+/g, " ");
}

export default function ResultCard({
    theme,
    hint,
    userAnswer = "",
    correctAnswer,
    naturalAnswer = "",
    rules = [],
    weakRules = [],
    quickVerdict = null,
    isDetailedLoading = false,
    onContinue,
}) {
    const SURFACE = theme?.surface ?? APP_SURFACE_COLOR;
    const BORDER = theme?.border ?? APP_BORDER_COLOR;
    const TEXT = theme?.text ?? APP_TEXT_COLOR;
    const MUTED = theme?.muted ?? APP_MUTED_TEXT_COLOR;
    const ACCENT = theme?.accent ?? APP_ACCENT_COLOR;
    const ACCENT_SOFT = theme?.accentSoft ?? APP_ACCENT_SOFT_COLOR;
    const DARK = theme?.dark ?? APP_DARK_COLOR;
    const SUCCESS = "#2f9f5f";
    const SUCCESS_SOFT = "#effaf3";
    const DANGER = "#e5484d";
    const DANGER_SOFT = "#fff4f4";
    const INSIGHT_SOFT = "#f7f4ff";

    const cleanHint = removeTrailingCorrectAnswer(
        String(hint ?? "").replaceAll("❌", "").replaceAll("✔", "").trim(),
        correctAnswer
    );
    const isCorrect = quickVerdict === true;
    const isIncorrect = quickVerdict === false || Boolean(correctAnswer);
    const hasResult = isCorrect || isIncorrect;
    const hasNeutralMessage = !hasResult && Boolean(cleanHint);
    const shouldRender = hasResult || hasNeutralMessage;
    const isContinueDisabled = isDetailedLoading && isIncorrect;

    useEffect(() => {
        if (!hasResult || hasNeutralMessage || isContinueDisabled || typeof onContinue !== "function") {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key !== "Enter") {
                return;
            }

            const target = event.target;
            const tagName = target?.tagName;
            const isTypingField = target?.isContentEditable
                || tagName === "INPUT"
                || tagName === "TEXTAREA"
                || tagName === "SELECT";

            if (isTypingField) {
                return;
            }

            event.preventDefault();
            onContinue();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hasResult, hasNeutralMessage, isContinueDisabled, onContinue]);

    if (!shouldRender) {
        return null;
    }

    const primaryRule = rules[0] || weakRules[0] || "";
    const primaryRuleLabel = RULE_LABELS[primaryRule] || "this rule";
    const answerToShow = String(correctAnswer || userAnswer || "").trim();
    const naturalAnswerText = String(naturalAnswer ?? "").trim();
    const hasNaturalAnswer = isCorrect
        && naturalAnswerText
        && normalizeAnswer(naturalAnswerText) !== normalizeAnswer(answerToShow);
    const explanationText = cleanHint || (
        isCorrect
            ? `Great job. You used ${primaryRuleLabel} correctly.`
            : "We are checking the details."
    );
    const styles = {
        shell: {
            width: "100%",
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 18,
            animation: "glFeedbackEnter 420ms cubic-bezier(0.22, 1, 0.36, 1) both",
        },

        headingWrap: {
            textAlign: "center",
            display: "grid",
            gap: 8,
        },

        title: {
            margin: 0,
            color: TEXT,
            fontFamily: "var(--font-family-base)",
            fontSize: "clamp(2rem, 4.2vw, 2.8rem)",
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: "-0.03em",
        },

        subtitle: {
            margin: 0,
            color: MUTED,
            fontFamily: "var(--font-family-base)",
            fontSize: "1rem",
            lineHeight: 1.5,
            fontWeight: 500,
        },

        panel: ({ tone = "neutral", delay = 0 } = {}) => {
            const toneMap = {
                success: {
                    background: SUCCESS_SOFT,
                    border: "rgba(47, 159, 95, 0.22)",
                    color: "#175c35",
                },
                danger: {
                    background: DANGER_SOFT,
                    border: "rgba(229, 72, 77, 0.22)",
                    color: TEXT,
                },
                insight: {
                    background: INSIGHT_SOFT,
                    border: BORDER,
                    color: TEXT,
                },
                neutral: {
                    background: SURFACE,
                    border: BORDER,
                    color: TEXT,
                },
            };
            const current = toneMap[tone] ?? toneMap.neutral;

            return {
                width: "100%",
                border: `1px solid ${current.border}`,
                borderRadius: 20,
                background: current.background,
                color: current.color,
                padding: "20px 24px",
                boxSizing: "border-box",
                boxShadow: "0 18px 42px rgba(31, 36, 54, 0.06)",
                animation: "glFeedbackPanel 480ms cubic-bezier(0.22, 1, 0.36, 1) both",
                animationDelay: `${delay}ms`,
            };
        },

        answerRow: {
            display: "flex",
            alignItems: "center",
            gap: 18,
        },

        iconBubble: ({ tone = "success" } = {}) => ({
            width: 38,
            height: 38,
            borderRadius: 999,
            flex: "0 0 auto",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: tone === "danger" ? "rgba(229, 72, 77, 0.12)" : "rgba(47, 159, 95, 0.14)",
            color: tone === "danger" ? DANGER : SUCCESS,
            animation: "glFeedbackPop 360ms cubic-bezier(0.22, 1, 0.36, 1) both",
        }),

        label: ({ tone = "neutral" } = {}) => ({
            margin: "0 0 8px",
            color: tone === "danger" ? DANGER : tone === "success" ? SUCCESS : TEXT,
            fontFamily: "var(--font-family-base)",
            fontSize: "0.88rem",
            lineHeight: 1.2,
            fontWeight: 800,
        }),

        answerText: {
            margin: 0,
            fontFamily: "var(--font-family-base)",
            fontSize: "1.18rem",
            lineHeight: 1.45,
            fontWeight: 650,
            color: TEXT,
            whiteSpace: "pre-wrap",
        },

        explanationRow: {
            display: "grid",
            gridTemplateColumns: "38px 1fr",
            gap: 16,
            alignItems: "start",
        },

        explanationIcon: {
            width: 38,
            height: 38,
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: ACCENT_SOFT,
            color: ACCENT,
        },

        explanationTitle: {
            margin: "0 0 8px",
            color: TEXT,
            fontFamily: "var(--font-family-base)",
            fontSize: "1rem",
            lineHeight: 1.3,
            fontWeight: 800,
        },

        explanationText: {
            margin: 0,
            color: MUTED,
            fontFamily: "var(--font-family-base)",
            fontSize: "1rem",
            lineHeight: 1.6,
            fontWeight: 500,
            whiteSpace: "pre-wrap",
        },

        naturalRow: {
            display: "grid",
            gridTemplateColumns: "38px 1fr",
            gap: 16,
            alignItems: "center",
        },

        naturalIntro: {
            margin: "0 0 10px",
            color: MUTED,
            fontFamily: "var(--font-family-base)",
            fontSize: "1rem",
            lineHeight: 1.5,
            fontWeight: 500,
        },

        naturalText: {
            margin: 0,
            color: TEXT,
            fontFamily: "var(--font-family-base)",
            fontSize: "1.2rem",
            lineHeight: 1.45,
            fontWeight: 700,
            whiteSpace: "pre-wrap",
        },

        loaderWrap: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 22,
            marginLeft: 10,
        },

        bars: {
            display: "inline-flex",
            alignItems: "flex-end",
            gap: 6,
            height: 18,
        },

        bar: {
            width: 5,
            borderRadius: 999,
            background: DARK,
        },

        actionRow: {
            display: "flex",
            justifyContent: "center",
            marginTop: 6,
        },

        actionButton: {
            minWidth: 220,
            minHeight: 52,
            borderRadius: 14,
        },

        notice: {
            width: "100%",
            maxWidth: 620,
            margin: "0 auto",
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            background: SURFACE,
            color: MUTED,
            padding: "14px 18px",
            boxSizing: "border-box",
            fontFamily: "var(--font-family-base)",
            fontSize: "0.98rem",
            fontWeight: 500,
            textAlign: "center",
            animation: "glFeedbackEnter 260ms ease-out both",
        },
    };

    const BarsLoader = () => (
        <span style={styles.loaderWrap} aria-label="Loading detailed feedback" role="status">
            <span style={styles.bars}>
                <span style={{ ...styles.bar, height: 8, animation: "glWave 700ms ease-in-out infinite" }} />
                <span style={{ ...styles.bar, height: 14, animation: "glWave 700ms ease-in-out infinite 120ms" }} />
                <span style={{ ...styles.bar, height: 8, animation: "glWave 700ms ease-in-out infinite 240ms" }} />
            </span>
        </span>
    );

    if (hasNeutralMessage) {
        return (
            <div style={styles.notice}>
                {renderInlineMarkdown(cleanHint)}
                <SharedAnimations />
            </div>
        );
    }

    return (
        <div style={styles.shell} aria-live="polite">
            <div style={styles.headingWrap}>
                <h2 style={styles.title}>{isCorrect ? "Correct!" : "Almost there"}</h2>
                {isCorrect && hasNaturalAnswer ? (
                    <p style={styles.subtitle}>Nice work! You expressed the idea well.</p>
                ) : !isCorrect ? (
                    <p style={styles.subtitle}>
                        You're on the right track. Let's fix a small detail.
                    </p>
                ) : null}
            </div>

            {isIncorrect && userAnswer ? (
                <div style={styles.panel({ tone: "danger", delay: 40 })}>
                    <div style={styles.answerRow}>
                        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                            <p style={styles.label({ tone: "danger" })}>Your answer</p>
                            <p style={styles.answerText}>{userAnswer}</p>
                        </div>
                        <span style={styles.iconBubble({ tone: "danger" })}>
                            <XCircle size={28} weight="fill" />
                        </span>
                    </div>
                </div>
            ) : null}

            {answerToShow ? (
                <div style={styles.panel({ tone: "success", delay: isIncorrect ? 90 : 40 })}>
                    <div style={styles.answerRow}>
                        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                            {isIncorrect ? (
                                <p style={styles.label({ tone: "success" })}>Correct answer</p>
                            ) : null}
                            <p style={styles.answerText}>{answerToShow}</p>
                        </div>
                        <span style={styles.iconBubble({ tone: "success" })}>
                            <CheckCircle size={28} weight="fill" />
                        </span>
                    </div>
                </div>
            ) : null}

            {hasNaturalAnswer ? (
                <div style={styles.panel({ tone: "insight", delay: 90 })}>
                    <div style={styles.naturalRow}>
                        <span style={styles.explanationIcon}>
                            <Sparkle size={22} weight="fill" />
                        </span>
                        <div>
                            <p style={styles.naturalIntro}>
                                Your answer is correct. A native speaker might say:
                            </p>
                            <p style={styles.naturalText}>{naturalAnswerText}</p>
                        </div>
                    </div>
                </div>
            ) : null}

            {isIncorrect ? (
                <div style={styles.panel({ tone: "insight", delay: 140 })}>
                    <div style={styles.explanationRow}>
                        <span style={styles.explanationIcon}>
                            <Lightbulb size={22} weight="regular" />
                        </span>
                        <div>
                            <p style={styles.explanationTitle}>What to adjust</p>
                            <p style={styles.explanationText}>
                                {renderInlineMarkdown(explanationText)}
                                {isDetailedLoading ? <BarsLoader /> : null}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

            <div style={styles.actionRow}>
                <Button
                    variant="primary"
                    theme={theme}
                    disabled={isContinueDisabled}
                    onClick={onContinue}
                    style={styles.actionButton}
                >
                    Continue
                </Button>
            </div>

            <SharedAnimations />
        </div>
    );
}

function SharedAnimations() {
    return (
        <style>{`
            @keyframes glFeedbackEnter {
                0% {
                    opacity: 0;
                    transform: translateY(18px) scale(0.985);
                }

                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes glFeedbackPanel {
                0% {
                    opacity: 0;
                    transform: translateY(12px);
                }

                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes glFeedbackPop {
                0% {
                    opacity: 0;
                    transform: scale(0.72);
                }

                70% {
                    opacity: 1;
                    transform: scale(1.08);
                }

                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes glWave {
                0%, 100% {
                    transform: translateY(3px) scaleY(1);
                    opacity: 0.55;
                }

                35% {
                    transform: translateY(-4px) scaleY(1.45);
                    opacity: 1;
                }
            }
        `}</style>
    );
}

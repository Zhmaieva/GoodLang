import { useEffect, useMemo, useState } from "react";
import TaskModeSwitch from "./TaskModeSwitch.jsx";
import { marathonService } from "../../services/marathonService.js";
import { Button } from "../Buttons.jsx";
import {
    APP_ACCENT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_BORDER_COLOR,
    APP_DARK_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../../theme.js";
import { localizationService } from "../../localization/localizationService.js";
import { Lightbulb } from "@phosphor-icons/react";

const NON_LATIN_LETTER_PATTERN = /[^\W\d_A-Za-z]/u;
const ENGLISH_HINT_FRAGMENT_PATTERN = /['’][A-Za-z]+|[A-Za-z]+(?:[’'][A-Za-z]+)?(?:\s*(?:\/|\+|→|-)\s*[A-Za-z]+(?:[’'][A-Za-z]+)?)*/g;

function renderHintContent(value) {
    const text = String(value ?? "");

    if (!NON_LATIN_LETTER_PATTERN.test(text)) {
        return text;
    }

    const parts = [];
    let lastIndex = 0;

    for (const match of text.matchAll(ENGLISH_HINT_FRAGMENT_PATTERN)) {
        const start = match.index ?? 0;
        const fragment = match[0];

        if (start > lastIndex) {
            parts.push(text.slice(lastIndex, start));
        }

        parts.push(
            <strong key={`hint-english-${start}`} style={{ fontWeight: 800 }}>
                {fragment}
            </strong>
        );

        lastIndex = start + fragment.length;
    }

    if (!parts.length) {
        return text;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}

export default function TaskCard({
                                     theme,
                                     taskText,
                                     answer,
                                     setAnswer,
                                     isInputDisabled,
                                     mainBtnText,
                                     onMainButtonClick,
                                     loading,
                                     textareaRef,
                                     onKeyDown,
                                     hint,
                                     locked = false,
                                     waitTimeSeconds = 0,
                                     account,
                                     actionDisabled = false,

                                     // gap mode
                                     taskType = "translate", // "translate" | "gap"
                                     gapOptions = [],
                                     gapSelected = null,
                                     setGapSelected = (_) => {},

                                     // ✅ mode selector
                                     taskMode = "combined", // "translations" | "gaps" | "combined"
                                     setTaskMode = (_) => {},
                                     taskModeLocked = false,
                                     taskModeLockReason = "",
                                 }) {
    // const loading = true;
    // ✅ card hover is styling-only
    const [cardHovered, setCardHovered] = useState(false);

    // countdown state
    const [secondsLeft, setSecondsLeft] = useState(0);

    // ✅ simple responsive flags (keeps behavior stable during resize)
    const [isCompact, setIsCompact] = useState(() => window.innerWidth < 915);
    const [isInMarathonView, setIsInMarathonView] = useState(false);
    const [isMarathonLoaded, setIsMarathonLoaded] = useState(false);
    const [hintVisible, setHintVisible] = useState(false);
    const [hintButtonHovered, setHintButtonHovered] = useState(false);

    useEffect(() => {
        const onResize = () => setIsCompact(window.innerWidth < 900);
        checkMarathonView().then();

        window.addEventListener("resize", onResize, { passive: true });
        window.addEventListener("onMarathonUpdate", checkMarathonView);

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("onMarathonUpdate", checkMarathonView);
        };
    }, []);

    useEffect(() => {
        checkMarathonView().then();
    }, [loading]);

    const checkMarathonView = async () => {
        const result = await marathonService.isMarathonView(true);
        setIsInMarathonView(result);
        setIsMarathonLoaded(true);
    };

    const isDesktop = !isCompact;

    useEffect(() => {
        if (locked && waitTimeSeconds > 0) {
            setSecondsLeft(waitTimeSeconds);

            const interval = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        window.location.reload();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }

        setSecondsLeft(0);
    }, [locked, waitTimeSeconds]);

    const formatTime = (s) => {
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;

        const hh = String(hours).padStart(2, "0");
        const mm = String(minutes).padStart(2, "0");
        const ss = String(seconds).padStart(2, "0");

        return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
    };

    const isLockedNow = locked && secondsLeft > 0;
    const isActionBusy = loading || actionDisabled;
    const isCheckingAnswer = actionDisabled && !loading && !isLockedNow;
    const buttonText = isLockedNow
        ? `Subscribe or wait ${formatTime(secondsLeft)}`
        : mainBtnText;
    const cleanHint = String(hint ?? "").replace(/^hint:\s*/i, "").trim();
    const showHintLabel = localizationService.localize("showHint");

    useEffect(() => {
        setHintVisible(false);
    }, [cleanHint, taskText]);

    const modeWrapDesktopBehavior = useMemo(() => {
        return {
            flex: "0 0 auto",
            maxWidth: "55%",
        };
    }, []);

    // ----- styling tokens -----
    const CARD_BG = "transparent";
    const ACCENT = theme?.accent ?? APP_ACCENT_COLOR;
    const TEXT_DARK = theme?.text ?? APP_TEXT_COLOR;
    const MUTED = theme?.muted ?? APP_MUTED_TEXT_COLOR;
    const SURFACE = theme?.surface ?? APP_SURFACE_COLOR;
    const BORDER = theme?.border ?? APP_BORDER_COLOR;
    const DARK = theme?.dark ?? APP_DARK_COLOR;

    const styles = {
        card: {
            background: CARD_BG,
            border: "none",
            borderRadius: 0,
            padding: 0,
        },

        headerRow: {
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap-reverse",
        },

        taskBlock: {
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flex: "1 1 100%",
            minWidth: 0,
            alignItems: "stretch",
        },

        taskLine: {
            minHeight: 34,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
        },

        taskText: {
            fontFamily: "var(--font-family-base)",
            fontWeight: 750,
            color: TEXT_DARK,
            minWidth: 0,
            flex: "1 1 auto",
            fontSize: isCompact ? "1.45rem" : "1.65rem",
            lineHeight: 1.32,
            textAlign: "left",
        },

        hintText: {
            fontFamily: "var(--font-family-base)",
            color: TEXT_DARK,
            whiteSpace: "pre-wrap",
            flex: "0 1 auto",
            fontWeight: 400,
            fontSize: "0.92rem",
            lineHeight: 1.35,
        },

        actionRow: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            gap: isCompact ? 10 : 16,
        },

        hintButton: {
            alignSelf: "center",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 34,
            background: "transparent",
            border: "none",
            borderRadius: 999,
            padding: "4px 6px",
            color: hintVisible ? ACCENT : MUTED,
            fontFamily: "var(--font-family-base)",
            fontSize: "0.9rem",
            fontWeight: 700,
            lineHeight: 1,
            cursor: "pointer",
            outline: "none",
            boxShadow: "none",
            transform: hintButtonHovered ? "translateY(-1px)" : "none",
            transition: "background-color 140ms ease, color 140ms ease, transform 120ms ease",
        },

        hintIcon: {
            width: 18,
            height: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background: hintVisible ? ACCENT : "transparent",
            color: hintVisible ? "#fff" : MUTED,
            lineHeight: 1,
        },

        hintPanel: {
            flex: "0 1 auto",
            minWidth: 0,
            maxWidth: "min(620px, 100%)",
            minHeight: 34,
            display: "inline-flex",
            alignItems: "center",
            border: `1px solid ${BORDER}`,
            borderRadius: 999,
            background: SURFACE,
            padding: "8px 14px",
            boxSizing: "border-box",
        },

        // ✅ right column
        modeWrap: {
            marginLeft: "auto",
            minWidth: 0,
            display: "flex",
            justifyContent: isCompact && window.innerWidth < 600 ? "flex-start" : "flex-end",
            ...(isDesktop ? modeWrapDesktopBehavior : window.innerWidth > 460 ? {} : { flex: "1 1 380px" }),
        },

        inputWrap: {
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            gap: 18,
        },

        textarea: {
            fontFamily: "var(--font-family-base)",
            resize: "none",
            flex: 1,
            height: isCompact ? 118 : 136,
            borderRadius: 18,
            border: `1px solid ${BORDER}`,
            outline: "none",
            boxShadow: "none",
            WebkitAppearance: "none",
            appearance: "none",
            background: SURFACE,
            padding: "18px 20px",
            fontWeight: 400,
            fontSize: "1.04rem",
            color: TEXT_DARK,
            transition: "border-color 140ms ease, box-shadow 140ms ease",
        },
        // loader
        loaderWrap: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            paddingBottom: 2,
            position: "relative",
            top: "-6px",
        },

        bars: {
            display: "inline-flex",
            alignItems: "flex-end",
            gap: 8,
            height: 26,
            marginLeft: 0,
        },

        bar: (white) => ({
            width: 7,
            borderRadius: 999,
            background: white ? "#fff" : DARK,
            boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
        }),

        loaderInline: {
            display: "flex",
            alignItems: "center",
            height: 34,
        },

        checkingContent: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
        },

        checkingSpinner: {
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "3px solid rgba(255, 255, 255, 0.22)",
            borderTopColor: ACCENT,
            animation: "glCheckingSpin 780ms linear infinite",
            boxSizing: "border-box",
        },

        optionsWrap: {
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
        },

    };

    const BarsLoader = ({ white = false }) => (
        <div style={styles.loaderWrap} aria-label="Loading" role="status">
            <div style={styles.bars}>
                <span
                    style={{
                        ...styles.bar(white),
                        height: 12,
                        animation: "glWave 700ms ease-in-out infinite",
                    }}
                />
                <span
                    style={{
                        ...styles.bar(white),
                        height: 18,
                        animation: "glWave 700ms ease-in-out infinite 120ms",
                    }}
                />
                <span
                    style={{
                        ...styles.bar(white),
                        height: 12,
                        animation: "glWave 700ms ease-in-out infinite 240ms",
                    }}
                />
            </div>

            <style>{`
                @keyframes glWave {
                    0%, 100% {
                        transform: translateY(4px) scaleY(1);
                        opacity: 0.65;
                    }

                    25% {
                        transform: translateY(0px) scaleY(1.5);
                        opacity: 1;
                    }

                    70% {
                        transform: translateY(-8px) scaleY(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );

    return (
        <div
            style={styles.card}
            aria-live="polite"
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={() => setCardHovered(false)}
        >
            <div style={styles.headerRow}>
                    <div style={styles.taskBlock}>
                    <div style={styles.taskLine}>
                        {loading ? (
                            <div style={styles.loaderInline}>
                                <BarsLoader />
                            </div>
                        ) : (
                            <div
                                style={styles.taskText}
                                dangerouslySetInnerHTML={{ __html: taskText }}
                            />
                        )}
                    </div>
                </div>

                {/*{!isInMarathonView && isMarathonLoaded && (*/}
                {/*    <div style={styles.modeWrap}>*/}
                {/*        <TaskModeSwitch*/}
                {/*            theme={theme}*/}
                {/*            taskMode={taskMode}*/}
                {/*            setTaskMode={setTaskMode}*/}
                {/*            loading={loading}*/}
                {/*            locked={taskModeLocked}*/}
                {/*            taskModeLockReason={taskModeLockReason}*/}
                {/*            compact={isCompact}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            <div style={styles.inputWrap}>
                {taskType === "gap" ? (
                    <div style={styles.optionsWrap}>
                        {gapOptions.map((opt) => (
                            <Button
                                key={opt}
                                variant="choice"
                                theme={theme}
                                active={gapSelected === opt}
                                onClick={() => setGapSelected(opt)}
                                disabled={loading || isInputDisabled}
                            >
                                {opt || "-"}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <textarea
                        className="highlight-input task-answer-input"
                        ref={textareaRef}
                        placeholder="... translate into English"
                        autoComplete="off"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={onKeyDown}
                        readOnly={isInputDisabled}
                        style={styles.textarea}
                    />
                )}

                <div style={styles.actionRow}>
                    <Button
                        variant="primary"
                        theme={theme}
                        shadowOffset={0}
                        aria-label="Check the translation"
                        onClick={onMainButtonClick}
                        disabled={isActionBusy}
                        style={{
                            width: isCompact ? "100%" : 220,
                            minHeight: 50,
                            borderRadius: 14,
                            opacity: isCheckingAnswer ? 1 : undefined,
                        }}
                    >
                        {isCheckingAnswer ? (
                            <span style={styles.checkingContent}>
                                <span style={styles.checkingSpinner} aria-hidden="true" />
                                <span>Checking...</span>
                                <style>{`
                                    @keyframes glCheckingSpin {
                                        to {
                                            transform: rotate(360deg);
                                        }
                                    }
                                `}</style>
                            </span>
                        ) : loading ? (
                            <BarsLoader white />
                        ) : (
                            buttonText
                        )}
                    </Button>

                    {cleanHint && !loading && !hintVisible && (
                        <Button
                            variant="unstyled"
                            style={styles.hintButton}
                            aria-expanded={false}
                            aria-controls="task-hint"
                            onMouseEnter={() => setHintButtonHovered(true)}
                            onMouseLeave={() => setHintButtonHovered(false)}
                            onClick={() => setHintVisible(true)}
                        >
                            <span style={styles.hintIcon}>
                                <Lightbulb size={14} weight="regular" />
                            </span>
                            <span>{showHintLabel}</span>
                        </Button>
                    )}

                    {cleanHint && !loading && hintVisible && (
                        <div id="task-hint" style={styles.hintPanel}>
                            <div style={styles.hintText}>{renderHintContent(cleanHint)}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

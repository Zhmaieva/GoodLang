import { useEffect, useMemo, useState } from "react";
import TaskModeSwitch from "./TaskModeSwitch.jsx";
import { marathonService } from "../../services/marathonService.js";

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
    const [hovered, setHovered] = useState(false);

    // ✅ card hover is styling-only
    const [cardHovered, setCardHovered] = useState(false);

    // countdown state
    const [secondsLeft, setSecondsLeft] = useState(0);

    // ✅ simple responsive flags (keeps behavior stable during resize)
    const [isCompact, setIsCompact] = useState(() => window.innerWidth < 915);
    const [isInMarathonView, setIsInMarathonView] = useState(false);
    const [isMarathonLoaded, setIsMarathonLoaded] = useState(false);

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

    useEffect(() => {
        if (loading) {
            setHovered(false);
        }
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
    const buttonText = isLockedNow
        ? `Subscribe or wait ${formatTime(secondsLeft)}`
        : mainBtnText;

    const modeWrapDesktopBehavior = useMemo(() => {
        return {
            flex: "0 0 auto",
            maxWidth: "55%",
        };
    }, []);

    // ----- styling tokens -----
    const CARD_BG = "#fffbf0";
    const ACCENT_RED = "#40a6ff";
    const TEXT_DARK = theme.text;
    const SOFT_INNER = "#fffbf0";
    const SOFT_STROKE_ACCENT = "rgba(168,19,21,0.45)";

    const BUTTON_OFFSET = 5;

    const styles = {
        card: {
            background: CARD_BG,
            border: "1px solid #6F625B",
            borderRadius: 5,
            padding: isCompact ? 16 : 20,
        },

        // ✅ header row
        headerRow: {
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
            flexWrap: "wrap-reverse",
        },

        // ✅ left block should fill as much as possible
        taskBlock: {
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flex: "1 1 200px",
            minWidth: 0,
        },

        // ✅ task line: keep task + hint on same baseline row
        taskLine: {
            minHeight: 34,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            minWidth: 0,
        },

        taskText: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontWeight: 700,
            color: "#33302E",
            minWidth: 0,
            flex: "1 1 auto",
            fontSize: "1.25rem",
        },

        hintText: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            background: TEXT_DARK,
            padding: "4px 14px",
            borderRadius: 5,
            color: "#fff",
            whiteSpace: "pre-wrap",
            flex: "0 1 auto",
            fontWeight: 600,
            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
            alignContent: "center",
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
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 12,
        },

        textarea: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            resize: "none",
            flex: 1,
            height: 70,
            borderRadius: 5,

            border: "1px solid #6F625B",
            outline: "none",
            boxShadow: "none",

            background: SOFT_INNER,
            padding: "12px 14px",
            fontWeight: 400,
            fontSize: "1.1rem",
            color: "#33302E",
        },
        // ✅ Button 52 wrapper
        btnWrap: {
            position: "relative",
            display: "block",
            width: "100%",
            isolation: "isolate",
        },

        // ✅ Button 52 background layer
        btnBg: {
            position: "absolute",
            width: "100%",
            height: "100%",
            top: hovered ? 0 : BUTTON_OFFSET,
            left: hovered ? 0 : BUTTON_OFFSET,
            backgroundColor: ACCENT_RED,
            transition: "top 0.2s ease, left 0.2s ease",
            zIndex: 0,
            pointerEvents: "none",
            borderRadius: 5
        },

        // ✅ Main button
        btn: {
            position: "relative",
            zIndex: 1,

            width: "100%",
            height: "48px",
            padding: "13px 20px",

            fontWeight: 600,
            fontSize: "1.2rem",
            letterSpacing: "0.5px",
            fontFamily: '"Source Serif 4", Georgia, serif',

            borderRadius: 5,
            border: `1px solid #000`,
            backgroundColor: "transparent",
            color: '#33302E',

            cursor: loading ? "default" : "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "manipulation",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            opacity: loading ? 1 : 1,

            transition: "color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
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
            background: white ? "#fff" : TEXT_DARK,
            boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
        }),

        loaderInline: {
            display: "flex",
            alignItems: "center",
            height: 34,
        },

        optionsWrap: {
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
        },

        optionBtn: (active) => ({
            appearance: "none",
            padding: "0px 14px",
            borderRadius: 999,
            fontWeight: 900,
            fontSize: "1rem",
            fontFamily: '"Source Serif 4", Georgia, serif',
            cursor: "pointer",
            border: `2px solid ${active ? ACCENT_RED : SOFT_STROKE_ACCENT}`,
            background: active ? ACCENT_RED : "rgba(255,255,255,0.78)",
            color: active ? "#fff" : TEXT_DARK,
            boxShadow: active
                ? "0 10px 22px rgba(0,0,0,0.14)"
                : "0 8px 18px rgba(0,0,0,0.10)",
            opacity: loading || isInputDisabled ? 0.7 : 1,
            height: 44,
            minWidth: 60,
            transform: active ? "translateY(-1px)" : "none",
            transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
        }),
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

                        {hint && !loading && (
                            <div style={styles.hintText}>
                                Hint: {hint.toLowerCase()}
                            </div>
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
                            <button
                                key={opt}
                                type="button"
                                style={styles.optionBtn(gapSelected === opt)}
                                onClick={() => setGapSelected(opt)}
                                disabled={loading || isInputDisabled}
                            >
                                {opt || "-"}
                            </button>
                        ))}
                    </div>
                ) : (
                    <textarea
                        className="highlight-input"
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

                <div
                    style={styles.btnWrap}
                    onMouseEnter={() => !loading && setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <div style={styles.btnBg} />

                    <button
                        aria-label="Check the translation"
                        onClick={onMainButtonClick}
                        disabled={loading}
                        style={styles.btn}
                    >
                        {loading ? <BarsLoader /> : buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
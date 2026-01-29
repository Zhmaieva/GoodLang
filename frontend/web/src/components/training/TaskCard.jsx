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
   //const loading = true;
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
        ? `Почни марафон або почекай ${formatTime(secondsLeft)}`
        : mainBtnText;

    const modeWrapDesktopBehavior = useMemo(() => {
        return {
            flex: "0 0 auto",
            maxWidth: "55%",
        };
    }, []);

    // ----- “Accuracy KPI header” styling tokens -----
    const CARD_BG = "rgba(255, 243, 223, 0.92)";
    const CARD_BORDER_IDLE = "rgba(255,97,56,0.70)";
    const CARD_BORDER_HOVER = "rgba(255,97,56,0.95)";
    const CARD_SHADOW_IDLE = "0 10px 26px rgba(0,0,0,0.12)";
    const CARD_SHADOW_HOVER = "0 14px 34px rgba(0,0,0,0.14)";
    const SOFT_INNER = "rgba(255, 250, 243, 0.92)";
    const SOFT_STROKE = "rgba(0,0,0,0.12)";
    const SOFT_STROKE_ACCENT = "rgba(255,97,56,0.55)";
    const SOFT_STROKE_ACCENT_2 = "rgba(255,97,56,0.40)";

    const styles = {
        card: {
            background: CARD_BG,
            border: `2px solid ${cardHovered ? CARD_BORDER_HOVER : CARD_BORDER_IDLE}`,
            borderRadius: 14,
            boxShadow: cardHovered ? CARD_SHADOW_HOVER : CARD_SHADOW_IDLE,
            padding: isCompact ? 16 : 20,
            transform: cardHovered ? "translateY(-1px)" : "none",
            transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
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
            fontFamily: "Nunito, system-ui, sans-serif",
            fontSize: isCompact ? "1.25rem" : "1.5rem",
            fontWeight: 900,
            color: theme.text,
            lineHeight: 1.15,
            minWidth: 0,
            flex: "1 1 auto",
        },

        hintText: {
            fontFamily: "Nunito, system-ui, sans-serif",
            background: theme.text,
            //border: `2px dashed ${SOFT_STROKE_ACCENT_2}`,
            padding: "4px 14px",
            borderRadius: 14,
            color: "#fff",
            whiteSpace: "pre-wrap",
            flex: "0 1 auto",
            opacity: 0.7,
            fontWeight: 700,
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

        inputWrap: { marginTop: 14, display: "flex", flexDirection: "column", gap: 12 },

        textarea: {
            fontFamily: "Nunito, system-ui, sans-serif",
            resize: "none",
            flex: 1,
            height: 70,
            borderRadius: 14,
            border: `2px solid ${SOFT_STROKE_ACCENT}`,
            background: SOFT_INNER,
            padding: "12px 14px",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: theme.text,
            opacity: isInputDisabled ? 0.7 : 1,
            outline: "none",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        },

        btn: {
            appearance: "none",
            padding: "10px 14px",
            fontWeight: 900,
            fontSize: "clamp(0.6rem, 3.5vw, 1.3rem)",
            lineHeight: 1,
            borderRadius: 999,
            cursor: (loading || (taskType === 'translate' && (!textareaRef?.current?.value || false))) ? "not-allowed" : "pointer",
            background: theme.accent ?? "#4ba36e",
            color: "#fff",
            border: `2px solid ${SOFT_STROKE}`,
            boxShadow: "0 10px 22px rgba(0,0,0,0.14)",
            fontFamily: "Nunito, system-ui, sans-serif",
            whiteSpace: "nowrap",
            opacity: (loading || (taskType === 'translate' && (!textareaRef?.current?.value || false))) ? 0.7 : 1,
            transform: hovered && !(loading || (taskType === 'translate' && (!textareaRef?.current?.value || false))) ? "translateY(1px)" : "none",
            filter: hovered && !(loading || (taskType === 'translate' && (!textareaRef?.current?.value || false))) ? "brightness(0.95)" : "none",
            transition: "transform 120ms ease, filter 120ms ease, box-shadow 120ms ease",
            height: "44px",
        },

        // loader
        loaderWrap: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            //paddingTop: 2,
            paddingBottom: 2,
            position: "relative",
            top: "-6px",
        },
        bars: {
            display: "inline-flex",
            alignItems: "flex-end",
            gap: 8,
            height: 26,
            marginLeft: 12,
        },
        bar: (white) => ({
            width: 7,
            borderRadius: 999,
            background: white ? "#fff" : theme.text,
            boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
        }),

        loaderInline: {
            display: "flex",
            alignItems: "center",
            height: 34,
        },

        optionsWrap: { display: "flex", flexWrap: "wrap", gap: 10 },

        optionBtn: (active) => ({
            appearance: "none",
            padding: "0px 14px",
            borderRadius: 999,
            fontWeight: 900,
            fontSize: "1rem",
            fontFamily: "Nunito, system-ui, sans-serif",
            cursor: "pointer",
            border: `2px solid ${active ? CARD_BORDER_HOVER : SOFT_STROKE_ACCENT}`,
            background: active ? theme.accent : "rgba(255,255,255,0.78)",
            color: active ? "#fff" : theme.text,
            boxShadow: active ? "0 10px 22px rgba(0,0,0,0.14)" : "0 8px 18px rgba(0,0,0,0.10)",
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
                <span style={{ ...styles.bar(white), height: 12, animation: "glWave 700ms ease-in-out infinite" }} />
                <span style={{ ...styles.bar(white), height: 18, animation: "glWave 700ms ease-in-out infinite 120ms" }} />
                <span style={{ ...styles.bar(white), height: 12, animation: "glWave 700ms ease-in-out infinite 240ms" }} />
            </div>

            <style>{`
        @keyframes glWave {
          0%, 100% { transform: translateY(4px) scaleY(1); opacity: 0.65; }
          25% { transform: translateY(0px) scaleY(1.5); opacity: 1; }
          70% { transform: translateY(-8px) scaleY(1); opacity: 1; }
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
                            <div style={styles.taskText} dangerouslySetInnerHTML={{ __html: taskText }} />
                        )}

                        {hint && !loading && <div style={styles.hintText}>Уточнення: {hint.toLowerCase()}</div>}
                    </div>
                </div>

                {!isInMarathonView && isMarathonLoaded && (
                    <div style={styles.modeWrap}>
                        <TaskModeSwitch
                            theme={theme}
                            taskMode={taskMode}
                            setTaskMode={setTaskMode}
                            loading={loading}
                            locked={taskModeLocked}
                            taskModeLockReason={taskModeLockReason}
                            compact={isCompact}
                        />
                    </div>
                )}
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
                        className={"highlight-input"}
                        ref={textareaRef}
                        placeholder="Введи переклад англійською…"
                        autoComplete="off"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={onKeyDown}
                        readOnly={isInputDisabled}
                        style={styles.textarea}
                    />
                )}

                <button
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    aria-label="Перевірити переклад"
                    onClick={onMainButtonClick}
                    disabled={loading}
                    style={styles.btn}
                >
                    {loading ? <BarsLoader white /> : buttonText}
                </button>
            </div>
        </div>
    );
}

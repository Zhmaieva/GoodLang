import { useEffect, useRef, useState } from "react";
import { callAccountVerifyApi } from "../../services/api.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import { on, off } from "../../services/events.js";
import { getTrainingLevel } from "../../services/trainingDirector.js";
import { getPendingTrainingTaskKeys } from "../../services/trainingTaskCache.js";
import { Button } from "../Buttons.jsx";

export default function LevelSwitch({
                                        level,
                                        loading,
                                        onLevelChange,
                                        theme,
                                        compact = false,
                                    }) {
    const [expanded, setExpanded] = useState(false);

    // tooltip (for calibration lock)
    const [tipOpen, setTipOpen] = useState(false);
    const [tipVisible, setTipVisible] = useState(false);
    const tipTimerRef = useRef(null);
    const [pendingLevels, setPendingLevels] = useState(new Set());

    const isCalibrationNow = (() => {
        try {
            return !!getTrainingLevel()?.isCalibration;
        } catch {
            return false;
        }
    })();

    const showTipForASecond = () => {
        if (tipTimerRef.current) clearTimeout(tipTimerRef.current);

        setTipOpen(true);
        setTipVisible(true);

        // show for 1s, then fade out (300ms), then unmount
        tipTimerRef.current = setTimeout(() => {
            setTipVisible(false);
            tipTimerRef.current = setTimeout(() => {
                setTipOpen(false);
            }, 300);
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
        };
    }, []);

    useEffect(() => {
        const refreshPendingLevels = () => {
            const next = new Set();
            for (const key of getPendingTrainingTaskKeys()) {
                if (!key.includes("scope:level")) continue;

                const match = key.match(/(?:^|\|)level:([^|]*)/);
                if (match?.[1]) next.add(match[1]);
            }
            setPendingLevels(next);
        };

        refreshPendingLevels();
        on("trainingTaskCacheUpdate", refreshPendingLevels);
        return () => off("trainingTaskCacheUpdate", refreshPendingLevels);
    }, []);

    // react to weekly progress event like you asked
    useEffect(() => {
        const refresh = () => {
            const { isCalibration } = getTrainingLevel() || {};

            if (isCalibration) {
                setExpanded(false);
                // keep tooltip behaviour controlled by hover/click
            } else {
                setTipOpen(false);
                setTipVisible(false);
            }
        };

        refresh();
        on("weeklyProgressUpdate", refresh);
        return () => off("weeklyProgressUpdate", refresh);
    }, []);

    // icons (same technique as TaskModeSwitch)
    const iconBase = {
        width: 12,
        height: 12,
        display: "inline-block",
        flex: "0 0 auto",
        marginRight: ".5rem",
        backgroundColor: "#fff",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
    };

    const gearIcon = {
        ...iconBase,
        maskImage: "url(/gear-icon.svg)",
        WebkitMaskImage: "url(/gear-icon.svg)",
        transform: "rotate(30deg) scale(2)",
        transformOrigin: "center",
    };

    const lockIcon = {
        ...iconBase,
        maskImage: "url(/lock-icon.svg)",
        WebkitMaskImage: "url(/lock-icon.svg)",
        transform: "scale(1.5)",
        transformOrigin: "center",
    };

    const wrap = {
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        width: "100%",
        minWidth: 0,
    };

    const options = [
        { value: "managed", label: "Adaptive", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_ADAPTIVE },
        { value: "beginner", label: "Beginner", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_BEGINNER },
        { value: "intermediate", label: "Intermediate", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_AVERAGE },
        { value: "advanced", label: "Advanced", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_ADVANCED },
    ];

    const selectedOption = options.find((o) => o.value === level) ?? options[0];

    const handleClick = async (value, actionType) => {
        // calibration lock: behave like TaskModeSwitch
        if (isCalibrationNow) {
            if (compact) showTipForASecond(); // mobile: tap -> show -> dissolve
            // desktop: hover handles tooltip
            return;
        }

        if (!expanded) {
            setExpanded(true);
            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY);
            return;
        }

        if (!loading) {
            onLevelChange(value);
            await callAccountVerifyApi(actionType);
        }
        setExpanded(false);
    };

    const visibleOptions = expanded ? options : [selectedOption];

    const getLabel = (label) => {
        if (expanded) return label;

        return `Level: ${label}`;
    };

    const isOptionPending = (value) => expanded && value !== level && pendingLevels.has(value);

    const miniLoaderWrap = {
        display: "inline-flex",
        alignItems: "flex-end",
        gap: 3,
        height: 14,
        marginLeft: 7,
    };

    const miniLoaderBar = (delay = "0ms") => ({
        width: 3,
        borderRadius: 999,
        background: theme.accent,
        animation: `glLevelPending 700ms ease-in-out infinite ${delay}`,
    });

    const LevelPendingLoader = () => (
        <span style={miniLoaderWrap} aria-label="Loading cached sentence" role="status">
            <span style={{ ...miniLoaderBar("0ms"), height: 7 }} />
            <span style={{ ...miniLoaderBar("120ms"), height: 11 }} />
            <span style={{ ...miniLoaderBar("240ms"), height: 7 }} />
        </span>
    );

    const tooltipStyle = {
        position: "absolute",
        top: "calc(100% + 10px)",
        zIndex: 50,

        // ✅ desktop: right-aligned tooltip; mobile: left-aligned tooltip
        right: !compact ? "auto" : 0,
        left: !compact ? 0 : "auto",

        background: theme.muted,
        color: "#fff",
        padding: "10px 12px",
        borderRadius: 12,
        fontSize: '1rem',
        fontWeight: 800,
        lineHeight: 1.25,
        width: 310,
        boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
        whiteSpace: "normal",
        textAlign: "left",

        opacity: tipVisible ? 1 : 0,
        transition: "opacity 300ms ease",
        pointerEvents: "none",
    };

    const tooltipArrow = {
        position: "absolute",
        top: -6,

        // ✅ desktop: arrow near right edge; mobile: arrow near left edge
        right: !compact ? "auto" : 16,
        left: !compact ? 16 : "auto",

        width: 12,
        height: 12,
        background: theme.muted,
        transform: "rotate(45deg)",
    };

    const lockedTooltipText = "Обирай формат завдань після оцінки рівня";

    return (
        <div style={wrap} role="group" aria-label="Вибір рівня">
            {visibleOptions.map(({ value, label, actionType }) => (
                <Button
                    key={value}
                    variant="segmented"
                    theme={{ ...theme, accent: theme.green, accentDark: theme.greenDark }}
                    active={level === value}
                    onMouseEnter={() => {
                        if (isCalibrationNow && !compact) {
                            setTipOpen(true);
                            setTipVisible(true);
                        }
                    }}
                    onMouseLeave={() => {
                        if (isCalibrationNow && !compact) {
                            setTipVisible(false);
                            setTipOpen(false);
                        }
                    }}
                    style={{
                        fontFamily: 'var(--font-family-base)',
                        whiteSpace: "nowrap",
                        position: "relative",
                        filter: isCalibrationNow ? "saturate(0.5)" : undefined,
                        cursor: isCalibrationNow ? "not-allowed" : undefined,
                    }}
                    aria-pressed={level === value}
                    disabled={loading} // keep same semantics; calibration handled in handler + styling
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick(value, actionType);
                    }}
                >
                    {/* ✅ same icons logic: show only when collapsed */}
                    {!expanded && <span style={isCalibrationNow ? lockIcon : gearIcon} aria-hidden />}

                    {getLabel(label)}
                    {isOptionPending(value) && <LevelPendingLoader />}

                    {/* ✅ tooltip only when calibration */}
                    {isCalibrationNow && tipOpen && (
                        <span style={tooltipStyle} role="tooltip">
              <span style={tooltipArrow} aria-hidden />
                            {lockedTooltipText}
            </span>
                    )}
                </Button>
            ))}
            <style>{`
                @keyframes glLevelPending {
                    0%, 100% { transform: translateY(2px) scaleY(1); opacity: 0.55; }
                    25% { transform: translateY(0) scaleY(1.45); opacity: 1; }
                    70% { transform: translateY(-3px) scaleY(1); opacity: 0.9; }
                }
            `}</style>
        </div>
    );
}

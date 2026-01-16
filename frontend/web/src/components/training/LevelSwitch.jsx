import { useEffect, useRef, useState } from "react";
import { callAccountVerifyApi } from "../../services/api.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import { on, off } from "../../services/events.js";
import { getTrainingLevel } from "../../services/trainingDirector.js";

export default function LevelSwitch({
                                        level,
                                        loading,
                                        onLevelChange,
                                        theme,
                                        compact = false,
                                    }) {
    const [hovered, setHovered] = useState(null);
    const [expanded, setExpanded] = useState(false);

    // tooltip (for calibration lock)
    const [tipOpen, setTipOpen] = useState(false);
    const [tipVisible, setTipVisible] = useState(false);
    const tipTimerRef = useRef(null);

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

    const btn = (selected, isHover) => {
        const disabled = loading || isCalibrationNow;

        return {
            appearance: "none",
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: "1rem",
            lineHeight: 1,
            borderRadius: 999,

            cursor: disabled ? "not-allowed" : "pointer",

            background: selected ? theme.green : "#fffdf8",
            color: selected ? "#fff" : theme.text,

            // less saturated when calibration-locked
            filter: disabled ? "saturate(0.5)" : isHover ? "brightness(0.95)" : "none",

            border: "2px solid rgba(0,0,0,0.12)",
            boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
            fontFamily: "Nunito, system-ui, sans-serif",
            whiteSpace: "nowrap",
            opacity: loading ? 0.7 : 1,

            transform: !disabled && isHover ? "translateY(1px)" : "none",
            transition: "transform 120ms ease, filter 120ms ease, opacity 120ms ease",
            position: "relative",
        };
    };

    const options = [
        { value: "managed", label: "адаптивний", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_ADAPTIVE },
        { value: "beginner", label: "початківець", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_BEGINNER },
        { value: "intermediate", label: "середній", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_AVERAGE },
        { value: "advanced", label: "просунутий", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_ADVANCED },
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

        return `Рівень: ${label}`;
    };

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
        fontSize: 13,
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
                <button
                    key={value}
                    type="button"
                    onMouseEnter={() => {
                        setHovered(value);
                        if (isCalibrationNow && !compact) {
                            setTipOpen(true);
                            setTipVisible(true);
                        }
                    }}
                    onMouseLeave={() => {
                        setHovered(null);
                        if (isCalibrationNow && !compact) {
                            setTipVisible(false);
                            setTipOpen(false);
                        }
                    }}
                    style={btn(level === value, hovered === value)}
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

                    {/* ✅ tooltip only when calibration */}
                    {isCalibrationNow && tipOpen && (
                        <span style={tooltipStyle} role="tooltip">
              <span style={tooltipArrow} aria-hidden />
                            {lockedTooltipText}
            </span>
                    )}
                </button>
            ))}
        </div>
    );
}

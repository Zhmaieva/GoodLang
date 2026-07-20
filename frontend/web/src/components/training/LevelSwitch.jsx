import { useEffect, useRef, useState } from "react";
import { callAccountVerifyApi } from "../../services/api.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import { on, off } from "../../services/events.js";
import { getTrainingLevel } from "../../services/trainingDirector.js";
import { getPendingTrainingTaskKeys } from "../../services/trainingTaskCache.js";
import { Button } from "../Buttons.jsx";
import { GearSix, LockKey } from "@phosphor-icons/react";
import ModalShell from "../modals/ModalShell.jsx";

export default function LevelSwitch({
                                        level,
                                        loading,
                                        onLevelChange,
                                        theme,
                                    compact = false,
                                    variant = "offset",
                                    }) {
    const [modalOpen, setModalOpen] = useState(false);

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
                setModalOpen(false);
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

    const iconStyle = (isLocked) => ({
        flex: "0 0 auto",
        marginRight: ".5rem",
        transform: isLocked ? "scale(1.15)" : "rotate(30deg) scale(1.15)",
        transformOrigin: "center",
    });

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

    const openLevelModal = async () => {
        // calibration lock: behave like TaskModeSwitch
        if (isCalibrationNow) {
            if (compact) showTipForASecond(); // mobile: tap -> show -> dissolve
            // desktop: hover handles tooltip
            return;
        }

        if (loading) return;

        setModalOpen(true);
        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY);
    };

    const handleOptionClick = async (value, actionType) => {
        if (!loading) {
            onLevelChange(value);
            await callAccountVerifyApi(actionType);
        }
        setModalOpen(false);
    };

    const getLabel = (label) => `Level: ${label}`;

    const isOptionPending = (value) => modalOpen && value !== level && pendingLevels.has(value);

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
        borderRadius: 5,
        fontSize: '1rem',
        fontWeight: 400,
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
    const SELECTED_BUTTON_COLOR = "#000";
    const BUTTON_OFFSET = 4;

    const optionGridStyle = {
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "repeat(2, minmax(0, 1fr))",
        gap: 14,
    };

    const getOptionButtonStyle = (selected) => ({
        backgroundColor: selected ? SELECTED_BUTTON_COLOR : theme.accent,
        color: selected ? "#fff" : "#000",
        borderColor: SELECTED_BUTTON_COLOR,
        width: "100%",
        minWidth: 0,
        whiteSpace: "nowrap",
    });

    return (
        <div style={wrap} role="group" aria-label="Вибір рівня">
            <Button
                variant={variant}
                theme={theme}
                compact={compact}
                shadowColor={theme.accent}
                shadowOffset={BUTTON_OFFSET}
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
                    fontFamily: variant === "header" ? '"Antonio", sans-serif' : 'var(--font-family-base)',
                    whiteSpace: "nowrap",
                    position: "relative",
                    filter: isCalibrationNow ? "saturate(0.5)" : undefined,
                    cursor: isCalibrationNow ? "not-allowed" : undefined,
                }}
                aria-expanded={modalOpen}
                disabled={loading}
                onClick={(e) => {
                    e.stopPropagation();
                    openLevelModal();
                }}
            >
                {variant !== "header" && (
                    isCalibrationNow
                        ? <LockKey size={18} weight="bold" style={iconStyle(true)} aria-hidden />
                        : <GearSix size={18} weight="bold" style={iconStyle(false)} aria-hidden />
                )}

                {getLabel(selectedOption.label)}

                {isCalibrationNow && tipOpen && (
                    <span style={tooltipStyle} role="tooltip">
                        <span style={tooltipArrow} aria-hidden />
                        {lockedTooltipText}
                    </span>
                )}
            </Button>

            <ModalShell
                open={modalOpen}
                id="level-difficulty-modal"
                theme={theme}
                title="Choose difficulty"
                subtitle="Pick the level for the next training tasks."
                onClose={() => setModalOpen(false)}
                maxWidth={620}
                panelStyle={{
                    border: "1px solid #000",
                    borderRadius: 12,
                    padding: compact ? 28 : 40,
                }}
                titleStyle={{ fontSize: "1.75rem" }}
                contentStyle={optionGridStyle}
            >
                {options.map(({ value, label, actionType }) => {
                    const selected = level === value;

                    return (
                        <Button
                            key={value}
                            variant="offset"
                            compact
                            fullWidth
                            theme={theme}
                            shadowColor={selected ? SELECTED_BUTTON_COLOR : theme.accent}
                            shadowOffset={selected ? 0 : BUTTON_OFFSET}
                            aria-pressed={selected}
                            disabled={loading}
                            onClick={() => handleOptionClick(value, actionType)}
                            style={getOptionButtonStyle(selected)}
                        >
                            {label}
                            {isOptionPending(value) && <LevelPendingLoader />}
                        </Button>
                    );
                })}
            </ModalShell>

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

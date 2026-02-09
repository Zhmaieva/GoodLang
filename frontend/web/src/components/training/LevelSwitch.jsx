import { useEffect, useRef, useState } from "react";
import GLButton from "../../components/GLButton.jsx";
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
    const [expanded, setExpanded] = useState(false);

    // tooltip (for calibration lock) — only used on mobile tap-to-show
    const tipTimerRef = useRef(null);

    const isCalibrationNow = (() => {
        try {
            return !!getTrainingLevel()?.isCalibration;
        } catch {
            return false;
        }
    })();

    const showTipForASecond = () => {
        // GLButton should show tooltip when `locked` is true.
        // We "pulse" lockedTooltip by toggling a local flag if your GLButton needs it.
        // If GLButton shows tooltip automatically on click when locked, you can delete this.
    };

    useEffect(() => {
        return () => {
            if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
        };
    }, []);

    // react to weekly progress event
    useEffect(() => {
        const refresh = () => {
            const { isCalibration } = getTrainingLevel() || {};

            if (isCalibration) {
                setExpanded(false);
            } else {
                // if calibration ended, allow normal behavior
                // (GLButton tooltip will naturally not show when locked=false)
            }
        };

        refresh();
        on("weeklyProgressUpdate", refresh);
        return () => off("weeklyProgressUpdate", refresh);
    }, []);

    const options = [
        { value: "managed", label: "адаптивний", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_ADAPTIVE },
        { value: "beginner", label: "початківець", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_BEGINNER },
        { value: "intermediate", label: "середній", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_AVERAGE },
        { value: "advanced", label: "просунутий", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_ADVANCED },
    ];

    const selectedOption = options.find((o) => o.value === level) ?? options[0];
    const visibleOptions = expanded ? options : [selectedOption];

    const getLabel = (label) => {
        if (expanded) return label;
        return `Рівень: ${label}`;
    };

    const lockedTooltipText = "Обирай формат завдань після оцінки рівня";

    const handleClick = async (value, actionType) => {
        // ✅ calibration lock: do nothing (GLButton shows tooltip because locked=true)
        if (isCalibrationNow) {
            // for mobile: if your GLButton does NOT show tooltip on click automatically,
            // you can implement a "pulse tooltip" API in GLButton and call it here.
            return;
        }

        // first click expands
        if (!expanded) {
            setExpanded(true);
            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY);
            return;
        }

        // second click selects
        if (!loading) {
            onLevelChange(value);
            await callAccountVerifyApi(actionType);
        }
        setExpanded(false);
    };

    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end", width: "100%", minWidth: 0 }}
             role="group"
             aria-label="Вибір рівня"
        >
            {visibleOptions.map(({ value, label, actionType }) => (
                <GLButton
                    key={value}
                    theme={theme}
                    compact={compact}
                    selected={!expanded || level === value}
                    locked={isCalibrationNow}
                    lockedTooltip={lockedTooltipText}
                    leftIcon={!expanded ? (isCalibrationNow ? "lock" : "gear") : null}
                    disabled={false}              // keep semantics: not disabled, but locked blocks action
                    loading={loading}
                    onClick={(e) => {
                        e?.stopPropagation?.();
                        handleClick(value, actionType);
                    }}
                >
                    {getLabel(label)}
                </GLButton>
            ))}
        </div>
    );
}

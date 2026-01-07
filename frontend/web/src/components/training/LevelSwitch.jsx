import { useState } from "react";
import {callAccountVerifyApi} from "../../services/api.js";
import {ACTION_TYPES} from "../../utils/constants.js";

export default function LevelSwitch({
                                        level,
                                        loading,
                                        onLevelChange,
                                        theme,
                                        compact = false
                                    }) {
    const [hovered, setHovered] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const wrap = {
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "flex-end",
    };

    const btn = (selected, isHover) => ({
        appearance: "none",
        padding: compact ? "8px 14px" : "10px 16px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        cursor: loading ? "not-allowed" : "pointer",
        background: selected ? theme.green : "#fffdf8",
        color: selected ? "#fff" : theme.text,
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        opacity: loading ? 0.7 : 1,

        transform: isHover ? "translateY(1px)" : "none",
        filter: isHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    });

    const options = [
        { value: "managed", label: "адаптивний", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_ADAPTIVE },
        { value: "beginner", label: "початківець", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_BEGINNER },
        { value: "intermediate", label: "середній", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_AVERAGE },
        { value: "advanced", label: "просунутий", actionType: ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY_ADVANCED },
    ];

    const selectedOption = options.find(o => o.value === level);

    const handleClick = async (value, actionType) => {
        if (!expanded) {
            // First click → expand
            setExpanded(true);

            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_CHANGE_DIFFICULTY);

            return;
        }

        // If expanded, selecting an option → collapse + apply
        if (!loading) {
            onLevelChange(value);

            await callAccountVerifyApi(actionType);
        }
        setExpanded(false);
    };

    const visibleOptions = expanded ? options : [selectedOption];

    return (
        <div style={wrap} role="group" aria-label="Вибір рівня">
            {visibleOptions.map(({ value, label, actionType }) => (
                <button
                    key={value}
                    onMouseEnter={() => setHovered(value)}
                    onMouseLeave={() => setHovered(null)}
                    style={btn(level === value, hovered === value)}
                    aria-pressed={level === value}
                    disabled={loading}
                    onClick={() => handleClick(value, actionType)}
                >
                    {label !== 'Рівень' && !expanded && `Рівень складності: ${label}`}
                    {label === 'Рівень' && !expanded && `Рівень складності`}
                    {expanded && label}
                </button>
            ))}
        </div>
    );
}

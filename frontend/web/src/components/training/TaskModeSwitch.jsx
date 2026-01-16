import { useState } from "react";

export default function TaskModeSwitch({
                                           theme,
                                           taskMode = "combined", // "translations" | "gaps" | "combined"
                                           setTaskMode = (_) => {},
                                           loading = false,

                                           taskModeLocked = false,
                                           taskModeLockReason = "",
                                           compact = false,
                                       }) {
    const [hovered, setHovered] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const wrap = {
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        marginLeft: "auto",
    };

    const btn = (selected, isHover) => ({
        appearance: "none",
        padding: compact ? "8px 14px" : "10px 16px",
        fontWeight: 900,
        fontSize: "0.95rem",
        lineHeight: 1,
        borderRadius: 999,
        cursor: taskModeLocked || loading ? "not-allowed" : "pointer",
        background: selected ? theme.accent : "#fffdf8",
        color: selected ? "#fff" : theme.text,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        opacity: taskModeLocked || loading ? 0.65 : 1,

        transform: isHover ? "translateY(1px)" : "none",
        filter: isHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    });

    const note = {
        fontWeight: 800,
        fontSize: "0.9rem",
        color: theme.text,
        opacity: 0.8,
        whiteSpace: "pre-wrap",
    };

    const options = [
        { value: "translations", label: "тільки переклади" },
        { value: "gaps", label: "тільки вибери варіант" },
        { value: "combined", label: "змішані" },
    ];

    const selectedOption = options.find((o) => o.value === taskMode) ?? options[2];

    const handleClick = (value) => {
        if (taskModeLocked || loading) return;

        if (!expanded) {
            setExpanded(true); // first click -> expand
            return;
        }

        setTaskMode(value); // second click -> apply
        setExpanded(false);
    };

    const visibleOptions = expanded ? options : [selectedOption];

    return (
        <div style={wrap} role="group" aria-label="Task mode">
            {visibleOptions.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHovered(value)}
                    onMouseLeave={() => setHovered(false)}
                    style={btn(taskMode === value, hovered === value)}
                    aria-pressed={taskMode === value}
                    disabled={taskModeLocked || loading}
                    onClick={() => handleClick(value)}
                >
                    {!expanded ? `Завдання: ${label}` : label}
                </button>
            ))}

            {taskModeLocked && (
                <div style={note}>{taskModeLockReason || "Only translations available for this level."}</div>
            )}
        </div>
    );
}

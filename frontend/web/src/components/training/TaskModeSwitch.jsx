import {useEffect, useState} from "react";

export default function TaskModeSwitch({
                                           theme,
                                           taskMode = "combined", // "translations" | "gaps" | "combined"
                                           setTaskMode = (_) => {},
                                           loading = false,

                                           taskModeLocked = false,
                                           taskModeLockReason = "",
                                           compact = false,

                                           onExpandedChange = (_) => {},
                                       }) {
    const [hovered, setHovered] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        onExpandedChange(expanded);
    }, [expanded, onExpandedChange]);

    const wrap = {
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        flexWrap: "wrap",
        justifyContent: compact ? "flex-start" : "flex-end", // ✅ left on mobile
        width: "100%",
        minWidth: 0,
    };




    const btn = (selected, isHover) => ({
        appearance: "none",
        padding: compact ? "8px 14px" : "10px 16px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        cursor: taskModeLocked || loading ? "not-allowed" : "pointer",
        background: selected ? theme.green : "#fffdf8",
        color: selected ? "#fff" : theme.text,
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        opacity: taskModeLocked || loading ? 0.65 : 1,

        flex: "0 0 auto",

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
        { value: "translations", label: "лише переклад" },
        { value: "gaps", label: "лише «обери варіант»" },
        { value: "combined", label: "всі" },
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

    const getLabel = (label) => {
        // if (!compact)
        //     return !expanded ? `Завдання: ${label}` : label;

        if (expanded)
            return label;

        if (label === 'всі')
            return 'Всі завдання';
        else
            return label;
    }
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
                    {getLabel(label)}
                </button>
            ))}

            {taskModeLocked && (
                <div style={note}>{taskModeLockReason || "Only translations available for this level."}</div>
            )}
        </div>
    );
}

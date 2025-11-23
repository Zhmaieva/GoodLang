import { useState } from "react";

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
        fontSize: 14,
        lineHeight: 1,
        borderRadius: 999,
        cursor: loading ? "not-allowed" : "pointer",
        background: selected ? theme.green : "#fffdf8",
        color: selected ? "#fff" : theme.text,
        border: `2px solid ${selected ? theme.greenDark : theme.accent}`,
        boxShadow: `2px 2px 0 ${selected ? theme.greenDark : theme.accentDark}`,
        transform: isHover ? "translateY(1px)" : "none",
        opacity: loading ? 0.65 : 1,
        transition: "transform 120ms ease",
    });

    const options = [
        { value: "managed", label: "Прокачування" },
        { value: "beginner", label: "Початківець" },
        { value: "intermediate", label: "Середній" },
        { value: "advanced", label: "Просунутий" },
    ];

    const selectedOption = options.find(o => o.value === level);

    const handleClick = (value) => {
        if (!expanded) {
            // First click → expand
            setExpanded(true);
            return;
        }

        // If expanded, selecting an option → collapse + apply
        if (!loading) {
            onLevelChange(value);
        }
        setExpanded(false);
    };

    const visibleOptions = expanded ? options : [selectedOption];

    return (
        <div style={wrap} role="group" aria-label="Вибір рівня">
            {visibleOptions.map(({ value, label }) => (
                <button
                    key={value}
                    onMouseEnter={() => setHovered(value)}
                    onMouseLeave={() => setHovered(null)}
                    style={btn(level === value, hovered === value)}
                    aria-pressed={level === value}
                    disabled={loading}
                    onClick={() => handleClick(value)}
                >
                    {label !== 'Прокачування' && !expanded && `Рівень завдань: ${label}`}
                    {label === 'Прокачування' && !expanded && `Прокачування рівня`}
                    {expanded && label}
                </button>
            ))}
        </div>
    );
}

import { useState } from "react";

export default function LevelSwitch({ level, loading, onLevelChange, theme, compact = false }) {
    const [hovered, setHovered] = useState(null);

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

        // outline + tiny drop shadow like in the image
        background: selected ? theme.green : "#fffdf8",
        color: selected ? "#fff" : theme.text,
        border: `2px solid ${selected ? theme.greenDark : theme.accent}`,
        boxShadow: `2px 2px 0 ${selected ? theme.greenDark : theme.accentDark}`,

        transform: isHover ? "translateY(1px)" : "none",
        opacity: loading ? 0.65 : 1,
        transition: "transform 120ms ease",
    });

    return (
        <div style={wrap} role="group" aria-label="Вибір рівня">
            {["beginner", "intermediate", "advanced"].map((l) => (
                <button
                    key={l}
                    onMouseEnter={() => setHovered(l)}
                    onMouseLeave={() => setHovered(null)}
                    style={btn(level === l, hovered === l)}
                    aria-pressed={level === l}
                    disabled={loading}
                    onClick={() => !loading && onLevelChange(l)}
                >
                    {l === "beginner" ? "Beginner" : l === "intermediate" ? "Intermediate" : "Advanced"}
                </button>
            ))}
        </div>
    );
}

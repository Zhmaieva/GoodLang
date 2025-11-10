import React from "react";

export default function Badge({ theme, tone, children }) {
    const base = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 700,
        padding: "6px 10px",
        borderRadius: 999,
        border: `2px solid ${theme.accent}`,
        background: "transparent",
        color: theme.text,
    };

    const tones = {
        good: { background: theme.good, borderColor: theme.unselected, color: "#fff" },
        warn: { background: theme.warn, borderColor: "#b8921d", color: theme.text },
        bad:  { background: theme.bad,  borderColor: "#ad2e49", color: "#fff" },
    };

    const style = tone ? { ...base, ...tones[tone] } : base;
    return <span style={style}>{children}</span>;
}

import React from "react";

export default function Badge({ theme, tone, borderColor, fontSize = "1rem", children }) {
    const base = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize,
        fontWeight: 400,
        padding: "8px 12px",
        borderRadius: 12,
        border: `1px solid ${borderColor ?? theme.accent}`,
        background: "transparent",
        color: theme.text,
    };

    const tones = {
        good: { background: theme.good, borderColor: theme.good, color: "#fff" },
        warn: { background: theme.warn, borderColor: theme.warn, color: "#fff" },
        bad:  { background: theme.bad,  borderColor: theme.bad, color: "#fff" },
    };

    const style = tone ? { ...base, ...tones[tone] } : base;
    return <span style={style}>{children}</span>;
}

import React from "react";

export default function Badge({ theme, tone, children }) {
    const base = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: "1rem",
        fontWeight: 700,
        padding: "6px 10px",
        borderRadius: 5,
        border: `2px solid ${theme.accent}`,
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

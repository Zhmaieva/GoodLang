import React from "react";

export default function Card({ theme, children }) {
    const card = {
        background: theme.card ?? "#fffdf8",
        border: `3px solid ${theme.accent}`,
        borderRadius: theme.radius,
        boxShadow: `4px 4px 0 ${theme.accentDark}`,
        padding: 16,
    };
    return <div style={card}>{children}</div>;
}

import React from "react";

export default function Examples({ items, theme }) {
    const block = {
        background: "#fff",
        border: `2px solid ${theme.accent}`,
        borderRadius: 14,
        padding: 10,
        margin: "6px 0",
    };
    const en = { fontWeight: 700 };
    const ua = { color: theme.muted };

    return (
        <div>
            {items.map(([enText, uaText], idx) => (
                <div key={idx} style={block}>
                    <div style={en}>{enText}</div>
                    <div style={ua}>{uaText}</div>
                </div>
            ))}
        </div>
    );
}

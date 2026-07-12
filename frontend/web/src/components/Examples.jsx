import React from "react";

export default function Examples({ items, theme, fontSize }) {
    // aligned with RulePage / SurfaceCard (flat, no shadow)
    const block = {
        background: "transparent",
        border: `2px solid ${theme.accent}`,
        borderRadius: 5,
        padding: 10,
        margin: "6px 0",
    };

    const en = {
        fontSize,
        fontWeight: 400,
        color: theme.text,
        fontFamily: 'var(--font-family-base)',
    };

    const ua = {
        fontSize,
        color: theme.muted,
        marginTop: 2,
        fontWeight: 400,
        fontFamily: 'var(--font-family-base)',
    };

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

import React from "react";

export default function Examples({ items, theme }) {
    // aligned with RulePage / SurfaceCard (flat, no shadow)
    const block = {
        background: "rgba(255, 250, 243, 0.92)",          // SOFT_INNER
        border: "2px solid rgba(255,97,56,0.45)",         // softer accent
        borderRadius: 14,
        padding: 10,
        margin: "6px 0",
    };

    const en = {
        fontWeight: 800,
        color: theme.text,
        fontFamily: "Nunito, system-ui, sans-serif",
    };

    const ua = {
        color: theme.muted,
        marginTop: 2,
        fontWeight: 700,
        fontFamily: "Nunito, system-ui, sans-serif",
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

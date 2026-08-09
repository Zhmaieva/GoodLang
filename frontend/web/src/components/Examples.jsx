import React from "react";

export default function Examples({ items, theme, fontSize }) {
    const border = theme?.border ?? "#e6e8f0";
    const surface = theme?.surface ?? "#fff";
    const text = theme?.text ?? "#1f2436";
    const muted = theme?.muted ?? "#70758a";

    const block = {
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "14px 16px",
        margin: "8px 0",
    };

    const en = {
        fontSize,
        fontWeight: 400,
        color: text,
        fontFamily: 'var(--font-family-base)',
    };

    const ua = {
        fontSize,
        color: muted,
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

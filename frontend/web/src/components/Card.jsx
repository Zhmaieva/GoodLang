import React from "react";

export default function Card({ theme, children, style = {} }) {
    const card = {
        ...style,
        background: style?.background ?? theme.backgroundGlass,
        backdropFilter: style?.backdropFilter ?? "blur(3px) brightness(1) grayscale(0)",
        border: theme.borderGlass,
        boxShadow: theme.boxShadowGlass,
        borderRadius: 12,
        padding: style?.padding ?? '8px 8px 18px 8px',
    };
    return <div style={card}>{children}</div>;
}

import React from "react";

export default function Note({ theme, borderColor, fontSize, children }) {
    const style = {
        background: "transparent",
        border: `1px solid ${borderColor ?? theme?.border ?? theme?.accent}`,
        borderRadius: 14,
        padding: "12px 14px",
        marginTop: 8,
        fontSize,
        color: theme?.text,
        fontFamily: "var(--font-family-base)",
    };
    return <div style={style}>{children}</div>;
}

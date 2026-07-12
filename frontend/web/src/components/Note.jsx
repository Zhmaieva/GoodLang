import React from "react";

export default function Note({ theme, borderColor, fontSize, children }) {
    const style = {
        background: "transparent",
        border: `2px solid ${borderColor ?? theme.accent}`,
        borderRadius: 5,
        padding: 10,
        marginTop: 8,
        fontSize,
    };
    return <div style={style}>{children}</div>;
}

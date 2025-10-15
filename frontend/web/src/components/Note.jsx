import React from "react";

export default function Note({ theme, children }) {
    const style = {
        background: "#fff7ea",
        border: `2px solid ${theme.accent}`,
        borderRadius: 14,
        padding: 10,
        marginTop: 8,
    };
    return <div style={style}>{children}</div>;
}

import React from "react";

export function PrimaryButton({ theme, children, ...props }) {
    const base = {
        background: theme.accent,
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: "1rem",
        fontFamily: "Nunito, system-ui, sans-serif",
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        cursor: "pointer",
        transition: "transform .1s, background .15s",
    };
    return (
        <button
            {...props}
            style={base}
            //onMouseOver={(e) => (e.currentTarget.style.background = theme.accentDark)}
            //onMouseOut={(e) => (e.currentTarget.style.background = theme.accent)}
        >
            {children}
        </button>
    );
}

import React from "react";

export function PrimaryButton({ theme, children, ...props }) {
    const base = {
        background: theme.accent,
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: "10px 16px",
        fontWeight: 700,
        boxShadow: `3px 3px 0 ${theme.accentDark}`,
        cursor: "pointer",
        transition: "transform .1s, background .15s",
    };
    return (
        <button
            {...props}
            style={base}
            onMouseOver={(e) => (e.currentTarget.style.background = theme.accentDark)}
            onMouseOut={(e) => (e.currentTarget.style.background = theme.accent)}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({ theme, children, ...props }) {
    const base = {
        background: "#fff",
        color: theme.text,
        border: `2px solid ${theme.accent}`,
        borderRadius: 999,
        padding: "10px 16px",
        fontWeight: 700,
        boxShadow: `3px 3px 0 ${theme.accentDark}`,
        cursor: "pointer",
        transition: "transform .1s, background .15s",
    };
    return (
        <button
            {...props}
            style={base}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
        >
            {children}
        </button>
    );
}

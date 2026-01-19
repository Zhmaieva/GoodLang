import React from "react";

export default function AwesomeButton({
                                          children,
                                          onClick,
                                          disabled,
                                          variant = "accent", // accent | ghost | danger
                                          style,
                                          title,
                                      }) {
    const base = {
        padding: "10px 12px",
        fontWeight: 800,
        border: "2px solid #000",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        background:
            variant === "accent"
                ? "var(--accent, #ff6138)"
                : variant === "danger"
                    ? "#ff3b30"
                    : "transparent",
        color: variant === "ghost" ? "var(--text, #3a2a1d)" : "#fff",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.12)",
        userSelect: "none",
        whiteSpace: "nowrap",
    };

    if (variant === "ghost") {
        base.border = "2px solid rgba(0,0,0,0.2)";
        base.boxShadow = "none";
    }

    return (
        <button title={title} style={{ ...base, ...style }} onClick={disabled ? undefined : onClick}>
            {children}
        </button>
    );
}

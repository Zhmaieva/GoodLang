import React, { useMemo, useState } from "react";

export default function AwesomeButton({
                                          children,
                                          onClick,
                                          disabled,
                                          variant = "accent", // accent | ghost | danger
                                          style,
                                          title,
                                          fullWidth = false,  // optional
                                      }) {
    const [hover, setHover] = useState(false);
    const [down, setDown] = useState(false);

    const base = useMemo(() => {
        const isGhost = variant === "ghost";
        const isDanger = variant === "danger";
        const isAccent = variant === "accent";

        const bg = isAccent
            ? "var(--accent, #ff6138)"
            : isDanger
                ? "#ff3b30"
                : "transparent";

        const color = isGhost ? "var(--text, #3a2a1d)" : "#fff";

        return {
            appearance: "none",
            padding: "10px 14px",
            fontWeight: 800,
            fontSize: "1rem",
            lineHeight: 1,
            borderRadius: 999, // ✅ pill like HomePage
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,

            background: bg,
            color,

            border: isGhost ? "2px solid rgba(0,0,0,0.2)" : "2px solid rgba(0,0,0,0.12)",
            boxShadow: isGhost ? "none" : "2px 2px 0 rgba(0,0,0,0.18)",

            userSelect: "none",
            whiteSpace: "nowrap",
            fontFamily: "Nunito, system-ui, sans-serif",

            width: fullWidth ? "100%" : "auto",

            transition: "transform 120ms ease, filter 120ms ease",
        };
    }, [variant, disabled, fullWidth]);

    const fx =
        disabled
            ? null
            : down
                ? { transform: "translateY(1px)", filter: "brightness(0.95)" }
                : hover
                    ? { transform: "translateY(1px)", filter: "brightness(0.95)" }
                    : null;

    return (
        <button
            title={title}
            style={{ ...base, ...(fx || {}), ...style }}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false);
                setDown(false);
            }}
            onMouseDown={() => setDown(true)}
            onMouseUp={() => setDown(false)}
        >
            {children}
        </button>
    );
}

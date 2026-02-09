import React, { useEffect, useRef, useState } from "react";

export default function GLButton({
                                     theme,

                                     variant = "pill",         // "pill" | "icon" | "ghost"
                                     size = "md",              // "sm" | "md" | "lg"

                                     selected = false,
                                     disabled = false,
                                     loading = false,

                                     locked = false,
                                     lockedTooltip = "",

                                     leftIcon = null,          // "gear" | "lock" | null
                                     iconOnly = false,         // for variant="icon"

                                     compact = false,          // your mobile behavior
                                     onClick = () => {},

                                     children,
                                     title,
                                     style = {},
                                 }) {
    const isBlocked = disabled || loading || locked;

    // tooltip for locked
    const [tipOpen, setTipOpen] = useState(false);
    const [tipVisible, setTipVisible] = useState(false);
    const tipTimerRef = useRef(null);

    const showTipForASecond = () => {
        if (!lockedTooltip) return;

        if (tipTimerRef.current) clearTimeout(tipTimerRef.current);

        setTipOpen(true);
        setTipVisible(true);

        tipTimerRef.current = setTimeout(() => {
            setTipVisible(false);
            tipTimerRef.current = setTimeout(() => {
                setTipOpen(false);
            }, 220);
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
        };
    }, []);

    const pad = size === "sm" ? "8px 14px" : size === "lg" ? "12px 18px" : "10px 16px";
    const fontSize = size === "sm" ? "0.95rem" : size === "lg" ? "1.05rem" : "1rem";

    // --- icon mask technique (your style) ---
    const iconBase = {
        width: 12,
        height: 12,
        display: "inline-block",
        flex: "0 0 auto",
        marginRight: iconOnly ? 0 : ".5rem",
        backgroundColor: "#fff",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
    };

    const gearIcon = {
        ...iconBase,
        maskImage: "url(/gear-icon.svg)",
        WebkitMaskImage: "url(/gear-icon.svg)",
        transform: "rotate(30deg) scale(2)",
        transformOrigin: "center",
    };

    const lockIcon = {
        ...iconBase,
        maskImage: "url(/lock-icon.svg)",
        WebkitMaskImage: "url(/lock-icon.svg)",
        transform: "scale(1.5)",
        transformOrigin: "center",
    };

    const getIconStyle = () => {
        if (leftIcon === "gear") return gearIcon;
        if (leftIcon === "lock") return lockIcon;
        return null;
    };

    // --- base styles ---
    const base = {
        appearance: "none",
        borderRadius: 999,
        fontFamily: "Nunito, system-ui, sans-serif",
        fontWeight: 800,
        fontSize,
        lineHeight: 1,
        userSelect: "none",
        position: "relative",
        whiteSpace: "nowrap",
        cursor: isBlocked ? "not-allowed" : "pointer",
        transition: "transform 120ms ease, filter 120ms ease, opacity 120ms ease",
    };

    const pill = {
        padding: compact ? "8px 14px" : pad,
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,

        background: (selected || variant === "pill") && (selected || !iconOnly) ? (selected ? theme.green : "#fffdf8") : "#fffdf8",
        color: selected ? "#fff" : theme.text,
    };

    const icon = {
        padding: 8,
        width: 44,
        height: 44,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(0,0,0,0.12)",
        background: "#fffdf8",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
    };

    const ghost = {
        padding: compact ? "8px 12px" : "8px 14px",
        border: "2px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.78)",
        boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
        color: theme.text,
    };

    const variantStyle = variant === "icon" ? icon : variant === "ghost" ? ghost : pill;

    // soften when blocked
    const filter = isBlocked ? "saturate(0.5)" : undefined;

    const tooltipStyle = {
        position: "absolute",
        top: "calc(100% + 10px)",
        right: compact ? "auto" : 0,
        left: compact ? 0 : "auto",
        zIndex: 60,

        background: theme.muted,
        color: "#fff",
        padding: "10px 12px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 800,
        lineHeight: 1.25,
        width: 310,
        boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
        whiteSpace: "normal",
        textAlign: "left",

        opacity: tipVisible ? 1 : 0,
        transition: "opacity 220ms ease",
        pointerEvents: "none",
    };

    const tooltipArrow = {
        position: "absolute",
        top: -6,
        right: compact ? "auto" : 16,
        left: compact ? 16 : "auto",
        width: 12,
        height: 12,
        background: theme.muted,
        transform: "rotate(45deg)",
    };

    return (
        <button
            type="button"
            title={title}
            disabled={disabled || loading} // semantic disabled (locked handled in click)
            style={{
                ...base,
                ...variantStyle,
                opacity: disabled || loading ? 0.7 : 1,
                filter,
                ...(isBlocked ? {} : {}),
                ...style,
            }}
            onMouseEnter={() => {
                if (locked && !compact && lockedTooltip) {
                    setTipOpen(true);
                    setTipVisible(true);
                }
            }}
            onMouseLeave={() => {
                if (locked && !compact && lockedTooltip) {
                    setTipVisible(false);
                    setTipOpen(false);
                }
            }}
            onMouseDown={(e) => {
                if (isBlocked) return;
                e.currentTarget.style.transform = "translateY(1px)";
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.transform = "none";
            }}
            onMouseLeaveCapture={(e) => {
                e.currentTarget.style.transform = "none";
            }}
            onClick={(e) => {
                e.stopPropagation();

                if (locked) {
                    // mobile tap => show and fade
                    if (compact) showTipForASecond();
                    else if (lockedTooltip) {
                        setTipOpen(true);
                        setTipVisible(true);
                    }
                    return;
                }

                if (disabled || loading) return;
                onClick?.(e);
            }}
        >
            {/* left icon */}
            {leftIcon && !iconOnly && <span style={getIconStyle()} aria-hidden />}

            {loading ? (
                <span style={{ fontWeight: 900, color: "#fff" }}>…</span>
            ) : (
                children
            )}

            {locked && tipOpen && !!lockedTooltip && (
                <span style={tooltipStyle} role="tooltip">
          <span style={tooltipArrow} aria-hidden />
                    {lockedTooltip}
        </span>
            )}
        </button>
    );
}
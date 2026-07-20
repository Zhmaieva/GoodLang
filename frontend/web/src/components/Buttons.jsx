import React, { useState } from "react";
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR } from "../theme.js";

const FONT_FAMILY = 'var(--font-family-base)';
export const HEADER_BUTTON_FONT_FAMILY = '"Antonio", sans-serif';
export const HEADER_BUTTON_FONT_WEIGHT = 200;
const DEFAULT_ACCENT = APP_ACCENT_COLOR;
const DEFAULT_ACCENT_DARK = "#2d7fca";
const DEFAULT_TEXT = "#000";
const DEFAULT_BG = APP_BACKGROUND_COLOR;
const DEFAULT_BORDER = "#000";

const mergeStyles = (...styles) => Object.assign({}, ...styles.filter(Boolean));

const baseButtonStyle = {
    appearance: "none",
    border: "none",
    fontFamily: FONT_FAMILY,
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "manipulation",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    lineHeight: 1,
    textDecoration: "none",
    transition:
        "transform 120ms ease, filter 120ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
};

function getThemeToken(theme, key, fallback) {
    return theme?.[key] ?? fallback;
}

function getVariantStyle({
    variant,
    theme,
    active,
    hovered,
    disabled,
    fullWidth,
    compact,
    isMobile,
}) {
    const accent = getThemeToken(theme, "accent", DEFAULT_ACCENT);
    const accentDark = getThemeToken(theme, "accentDark", DEFAULT_ACCENT_DARK);
    const text = getThemeToken(theme, "text", DEFAULT_TEXT);

    const disabledStyle = disabled
        ? {
              opacity: 0.62,
              cursor: "default",
              transform: "none",
              filter: "none",
          }
        : null;

    const sharedPill = {
        borderRadius: 999,
        fontWeight: 800,
        fontSize: compact ? "0.9rem" : "1rem",
        padding: compact ? "8px 12px" : "10px 16px",
        width: fullWidth ? "100%" : undefined,
    };

    const styles = {
        primary: {
            ...sharedPill,
            background: accent,
            color: "#fff",
            boxShadow: `2px 2px 0 ${accentDark}`,
            transform: hovered && !disabled ? "translateY(1px)" : "none",
            filter: hovered && !disabled ? "brightness(0.95)" : "none",
        },
        secondary: {
            ...sharedPill,
            background: DEFAULT_BG,
            color: text,
            border: "1px solid rgba(0,0,0,0.22)",
            boxShadow: "2px 2px 0 rgba(0,0,0,0.16)",
            transform: hovered && !disabled ? "translateY(1px)" : "none",
            filter: hovered && !disabled ? "brightness(0.98)" : "none",
        },
        ghost: {
            ...sharedPill,
            background: "transparent",
            color: text,
            border: "1px solid rgba(0,0,0,0.18)",
            transform: hovered && !disabled ? "translateY(1px)" : "none",
            filter: hovered && !disabled ? "brightness(0.96)" : "none",
        },
        nav: {
            borderRadius: 999,
            padding: compact ? "7px 10px" : "8px 12px",
            fontWeight: 800,
            fontSize: compact ? "0.9rem" : "0.95rem",
            background: "rgba(255,255,255,0.78)",
            color: text,
            border: "1px solid rgba(0,0,0,0.16)",
            opacity: hovered && !disabled ? 0.86 : 1,
        },
        offset: {
            position: "relative",
            zIndex: 1,
            width: fullWidth ? "100%" : undefined,
            minWidth: isMobile ? "92px" : "120px",
            height: compact ? "40px" : "48px",
            padding: compact ? "8px 16px" : "13px 20px",
            fontWeight: 600,
            fontSize: compact ? (isMobile ? "0.95rem" : "1rem") : isMobile ? "0.95rem" : "1.2rem",
            letterSpacing: compact ? "0.3px" : "0.5px",
            borderRadius: 5,
            border: `1px solid ${DEFAULT_BORDER}`,
            backgroundColor: "#95b5fe",
            color: DEFAULT_TEXT,
            cursor: disabled ? "default" : "pointer",
            transition: "color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
        },
        choice: {
            borderRadius: 999,
            padding: "0 14px",
            minWidth: 60,
            height: compact ? 38 : 44,
            fontWeight: 900,
            fontSize: compact ? "0.95rem" : "1rem",
            border: `2px solid ${active ? accent : "rgba(168,19,21,0.45)"}`,
            background: active ? accent : "rgba(255,255,255,0.78)",
            color: active ? "#fff" : text,
            boxShadow: active
                ? "0 10px 22px rgba(0,0,0,0.14)"
                : "0 8px 18px rgba(0,0,0,0.10)",
            transform: active ? "translateY(-1px)" : "none",
        },
        segmented: {
            borderRadius: 999,
            padding: compact ? "8px 10px" : "9px 12px",
            fontWeight: 900,
            fontSize: compact ? "0.86rem" : "0.95rem",
            background: active ? accent : "rgba(255,255,255,0.78)",
            color: active ? "#fff" : text,
            border: `2px solid ${active ? accentDark : "rgba(0,0,0,0.12)"}`,
            boxShadow: active ? `2px 2px 0 ${accentDark}` : "none",
            transform: hovered && !disabled ? "translateY(1px)" : "none",
        },
        icon: {
            width: compact ? 34 : 38,
            height: compact ? 34 : 38,
            padding: 0,
            borderRadius: 999,
            fontWeight: 900,
            fontSize: compact ? "0.95rem" : "1rem",
            background: active ? accent : "rgba(255,255,255,0.76)",
            color: active ? "#fff" : text,
            border: "1px solid rgba(0,0,0,0.16)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            transform: hovered && !disabled ? "translateY(1px)" : "none",
        },
        plain: {
            padding: 0,
            background: "transparent",
            color: "inherit",
            border: "none",
            font: "inherit",
        },
        header: {
            padding: compact ? "4px 6px 6px" : "6px 6px 8px",
            minWidth: 0,
            flex: "0 0 auto",
            height: "auto",
            background: "transparent",
            color: "#000",
            border: "none",
            borderRadius: 0,
            boxShadow: "none",
            overflow: "visible",
            fontFamily: HEADER_BUTTON_FONT_FAMILY,
            fontWeight: HEADER_BUTTON_FONT_WEIGHT,
            fontSize: compact ? (isMobile ? "1.1rem" : "1.25rem") : isMobile ? "1.36rem" : "1.62rem",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            textDecoration: "none",
        },
        unstyled: {},
    };

    return mergeStyles(styles[variant] ?? styles.primary, disabledStyle);
}

export function Button({
    children,
    theme,
    variant = "unstyled",
    active = false,
    selected = false,
    fullWidth = false,
    compact = false,
    isMobile = false,
    type = "button",
    disabled = false,
    style,
    wrapperStyle,
    className,
    shadowColor,
    shadowOffset = 5,
    onMouseEnter,
    onMouseLeave,
    ...props
}) {
    const [hovered, setHovered] = useState(false);
    const isActive = active || selected;
    const usesOffsetLayer = variant === "offset";
    const accent = getThemeToken(theme, "accent", DEFAULT_ACCENT);
    const computedShadowColor = shadowColor ?? accent;

    const handleMouseEnter = (event) => {
        if (!disabled) setHovered(true);
        onMouseEnter?.(event);
    };

    const handleMouseLeave = (event) => {
        setHovered(false);
        onMouseLeave?.(event);
    };

    const buttonStyle =
        variant === "unstyled"
            ? style
            : mergeStyles(
                  baseButtonStyle,
                  getVariantStyle({
                      variant,
                      theme,
                      active: isActive,
                      hovered,
                      disabled,
                      fullWidth,
                      compact,
                      isMobile,
                  }),
                  style
              );
    const headerContentStyle =
        variant === "header"
            ? {
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                  gap: 8,
                  whiteSpace: "nowrap",
                  paddingBottom: 4,
                  backgroundImage: "linear-gradient(#000, #000)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "50% 100%",
                  backgroundSize: hovered && !disabled ? "100% 2px" : "0% 2px",
                  transition: "background-size 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              }
            : null;

    if (usesOffsetLayer) {
        const offsetWrapperStyle = mergeStyles(
            {
                position: "relative",
                display: fullWidth ? "block" : "inline-block",
                width: fullWidth ? "100%" : undefined,
                isolation: "isolate",
            },
            wrapperStyle
        );

        const offsetLayerStyle = {
            position: "absolute",
            width: "100%",
            height: "100%",
            top: hovered && !disabled ? 0 : shadowOffset,
            left: hovered && !disabled ? 0 : shadowOffset,
            backgroundColor: computedShadowColor,
            transition: "top 0.2s ease, left 0.2s ease",
            zIndex: 0,
            pointerEvents: "none",
            borderRadius: 5,
        };

        return (
            <div
                style={offsetWrapperStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div style={offsetLayerStyle} />
                <button
                    type={type}
                    disabled={disabled}
                    className={className}
                    style={buttonStyle}
                    {...props}
                >
                    {children}
                </button>
            </div>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled}
            className={className}
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {variant === "header" ? (
                <span style={headerContentStyle}>{children}</span>
            ) : (
                children
            )}
        </button>
    );
}

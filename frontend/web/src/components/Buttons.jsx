import React, { useState } from "react";
import {
    APP_ACCENT_COLOR,
    APP_ACCENT_SOFT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_BORDER_COLOR,
    APP_DARK_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../theme.js";

const FONT_FAMILY = "var(--font-family-base)";
export const HEADER_BUTTON_FONT_FAMILY = "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
export const HEADER_BUTTON_FONT_WEIGHT = 500;

const mergeStyles = (...styles) => Object.assign({}, ...styles.filter(Boolean));

function getThemeToken(theme, key, fallback) {
    return theme?.[key] ?? fallback;
}

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
    whiteSpace: "nowrap",
    transition:
        "transform 140ms ease, color 160ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease",
};

function getVariantStyle({
    variant,
    theme,
    active,
    hovered,
    disabled,
    fullWidth,
    compact,
    isMobile,
    shadowOffset,
}) {
    const accent = getThemeToken(theme, "accent", APP_ACCENT_COLOR);
    const accentSoft = getThemeToken(theme, "accentSoft", APP_ACCENT_SOFT_COLOR);
    const surface = getThemeToken(theme, "surface", APP_SURFACE_COLOR);
    const border = getThemeToken(theme, "border", APP_BORDER_COLOR);
    const text = getThemeToken(theme, "text", APP_TEXT_COLOR);
    const dark = getThemeToken(theme, "dark", APP_DARK_COLOR);
    const bg = getThemeToken(theme, "bg", APP_BACKGROUND_COLOR);
    const hasSoftShadow = Number(shadowOffset) > 0;

    const disabledStyle = disabled
        ? {
              opacity: 0.58,
              cursor: "default",
              transform: "none",
              boxShadow: "none",
          }
        : null;

    const sharedControl = {
        borderRadius: 14,
        fontWeight: 700,
        fontSize: compact ? "0.92rem" : "1rem",
        minHeight: compact ? 40 : 46,
        padding: compact ? "0 14px" : "0 18px",
        width: fullWidth ? "100%" : undefined,
    };

    const styles = {
        primary: {
            ...sharedControl,
            background: dark,
            color: "#fff",
            border: "1px solid transparent",
            boxShadow: "none",
            transform: hovered && !disabled ? "translateY(-1px)" : "none",
        },
        secondary: {
            ...sharedControl,
            background: surface,
            color: text,
            border: `1px solid ${border}`,
            boxShadow: hovered && !disabled ? "0 10px 22px rgba(32, 36, 58, 0.08)" : "none",
            transform: hovered && !disabled ? "translateY(-1px)" : "none",
        },
        ghost: {
            ...sharedControl,
            background: "transparent",
            color: text,
            border: `1px solid ${border}`,
            transform: hovered && !disabled ? "translateY(-1px)" : "none",
        },
        nav: {
            ...sharedControl,
            background: active ? accentSoft : "transparent",
            color: active ? accent : text,
            border: `1px solid ${active ? "transparent" : border}`,
        },
        offset: {
            ...sharedControl,
            minWidth: isMobile ? 92 : 112,
            background: active ? accentSoft : surface,
            color: text,
            border: `1px solid ${active ? accent : border}`,
            boxShadow: hasSoftShadow
                ? hovered && !disabled
                    ? "0 12px 24px rgba(116, 119, 184, 0.16)"
                    : "0 8px 18px rgba(116, 119, 184, 0.10)"
                : "none",
            transform: hovered && !disabled ? "translateY(-1px)" : "none",
        },
        choice: {
            ...sharedControl,
            background: active ? dark : surface,
            color: active ? "#fff" : text,
            border: `1px solid ${active ? dark : border}`,
            boxShadow: active ? "none" : "0 8px 18px rgba(32, 36, 58, 0.06)",
        },
        segmented: {
            ...sharedControl,
            background: active ? accent : surface,
            color: active ? "#fff" : text,
            border: `1px solid ${active ? accent : border}`,
            boxShadow: active ? "0 10px 24px rgba(116, 119, 184, 0.16)" : "none",
        },
        icon: {
            width: compact ? 36 : 40,
            height: compact ? 36 : 40,
            padding: 0,
            borderRadius: 999,
            background: active ? accentSoft : surface,
            color: active ? accent : text,
            border: `1px solid ${border}`,
            boxShadow: hovered && !disabled ? "0 10px 22px rgba(32, 36, 58, 0.08)" : "none",
        },
        plain: {
            padding: 0,
            background: "transparent",
            color: "inherit",
            border: "none",
            font: "inherit",
        },
        header: {
            padding: compact ? "4px 2px 9px" : "6px 2px 11px",
            minWidth: 0,
            height: "auto",
            background: "transparent",
            color: text,
            border: "none",
            borderRadius: 0,
            boxShadow: "none",
            overflow: "visible",
            fontFamily: HEADER_BUTTON_FONT_FAMILY,
            fontWeight: HEADER_BUTTON_FONT_WEIGHT,
            fontSize: compact ? (isMobile ? "0.9rem" : "0.95rem") : isMobile ? "0.98rem" : "1.02rem",
            letterSpacing: 0,
            textTransform: "none",
            textDecoration: "none",
        },
        danger: {
            ...sharedControl,
            background: "#e5484d",
            color: "#fff",
            border: "1px solid transparent",
            boxShadow: "0 12px 26px rgba(229, 72, 77, 0.16)",
        },
        unstyled: {},
    };

    if (variant === "header" && active) {
        styles.header.color = accent;
    }

    if (variant === "plain") {
        styles.plain.color = text;
    }

    if (variant === "offset" && active) {
        styles.offset.background = dark;
        styles.offset.color = bg;
        styles.offset.borderColor = dark;
        styles.offset.boxShadow = "none";
    }

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
    shadowOffset = 0,
    onMouseEnter,
    onMouseLeave,
    ...props
}) {
    const [hovered, setHovered] = useState(false);
    const isActive = active || selected;

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
                      shadowOffset,
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
                  paddingBottom: 7,
                  backgroundImage: `linear-gradient(${getThemeToken(theme, "accent", APP_ACCENT_COLOR)}, ${getThemeToken(theme, "accent", APP_ACCENT_COLOR)})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "0 100%",
                  backgroundSize: (hovered || isActive) && !disabled ? "100% 2px" : "0% 2px",
                  transition: "background-size 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              }
            : null;

    const button = (
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

    if (!wrapperStyle) return button;

    return <span style={wrapperStyle}>{button}</span>;
}

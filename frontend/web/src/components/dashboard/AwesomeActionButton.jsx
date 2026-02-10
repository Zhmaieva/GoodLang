import React, { useCallback, useMemo, useState } from "react";
import { theme } from "../../App.jsx";

export default function AwesomeActionButton({
                                                iconUrl,                 // string (image url)
                                                symbol,                  // string (emoji or glyph) — alternative to iconUrl
                                                children,                // label
                                                onClick,
                                                size = "regular",        // compact | regular | giant
                                                variant = "accent",      // accent | ghost
                                                disabled = false,
                                                title,
                                            }) {
    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);

    const isCompact = size === "compact";
    const isGiant = size === "giant";

    const handleClick = useCallback(
        (e) => {
            if (disabled) return;

            setPressed(true);

            setTimeout(() => {
                setPressed(false);
                onClick?.(e);
            }, parseInt(theme.motion.fast, 10) || 160);
        },
        [onClick, disabled]
    );

    const styles = useMemo(() => {
        const fontSize = isGiant ? theme.breadcrumbs.fontSize : theme.type.title;

        const reduceMotion = !!theme?.accessibility?.reduceMotion;

        const background =
            hovered ? variant === "accent" ? theme.accentSelected : theme.accentDark :
            variant === "accent" ? theme.accentSelected : theme.accent

        const color =
            variant === "accent"
                ? theme.textOnColor
                : theme.textDark;

        const mutedColor =
            variant === "accent"
                ? theme.textMutedOnColor
                : theme.textMutedDark;

        const transform = pressed
            ? "scale(0.94)"
            : hovered && !disabled
                ? "scale(1.02)"
                : "scale(1)";

        return {
            button: {
                appearance: "none",
                border: "none",
                background,
                color: disabled ? mutedColor : color,

                fontFamily: theme.fontFamily,
                fontSize,
                fontWeight: theme.weights.title,
                lineHeight: theme.type.titleLineHeight,

                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: isCompact ? "0" : theme.spacing.gap,

                padding: isCompact
                    ? theme.spacing.cardPadY
                    : `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,

                borderRadius: theme.radius.card,
                cursor: disabled ? "default" : "pointer",

                transform,

                transition: reduceMotion
                    ? "none"
                    : `transform ${theme.motion.fast} ${theme.motion.ease},
                       background ${theme.motion.fast} ${theme.motion.ease}`,

                userSelect: "none",
                outline: "none",
            },

            iconWrap: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
            },

            iconImg: {
                width: theme.sizes.img,
                height: theme.sizes.img,
                objectFit: "contain",
                pointerEvents: "none",
            },

            symbol: {
                fontSize,
                lineHeight: 1,
                pointerEvents: "none",
            },

            text: {
                whiteSpace: "nowrap",
                textDecorationThickness: theme.breadcrumbs.underlineThickness,
                textUnderlineOffset: theme.breadcrumbs.underlineOffset,
            },
        };
    }, [variant, size, pressed, hovered, focused, disabled, isCompact, isGiant]);

    const renderIcon = () => {
        if (iconUrl) {
            return <img src={iconUrl} alt="" aria-hidden="true" style={styles.iconImg} />;
        }
        if (symbol) {
            return (
                <span style={styles.symbol} aria-hidden="true">
                    {symbol}
                </span>
            );
        }
        return null;
    };

    return (
        <button
            type="button"
            style={styles.button}
            onClick={handleClick}
            disabled={disabled}
            aria-disabled={disabled}
            title={title}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(e);
                }
            }}
        >
            {(iconUrl || symbol) ? <span style={styles.iconWrap}>{renderIcon()}</span> : null}
            {!isCompact && children ? <span style={styles.text}>{children}</span> : null}
        </button>
    );
}

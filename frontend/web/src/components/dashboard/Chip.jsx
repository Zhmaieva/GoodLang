// Chip.jsx — merged Chip + InfoChip
import React, { useMemo, useState } from "react";
import { theme } from "../../App.jsx";

/**
 * Props:
 * - info: boolean -> renders InfoChip-like (div, no hover/click)
 * - active: boolean -> selected styling for clickable chip
 * - title: string -> tooltip title (useful for truncated text)
 * - style: object -> style override
 * - onClick: function -> if provided and not info, renders as button
 */
export function Chip({
                         info = false,
                         active = false,
                         title,
                         style,
                         onClick,
                         children,
                     }) {
    const [hover, setHover] = useState(false);

    const styles = useMemo(() => {
        const padY = Math.max(6, Math.floor(theme.spacing.listPad * 0.8));
        const padX = theme.spacing.cardPadX;

        const baseText = {
            fontFamily: theme.fontFamily,
            fontSize: theme.type.subtitle,
            lineHeight: theme.type.subtitleLineHeight,
        };

        const ellipsis = {
            whiteSpace: "nowrap",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
        };

        const infoChip = {
            ...baseText,
            fontWeight: theme.weights.normal,
            color: theme.textDark,
            border: theme.borders.card,
            background: "transparent",
            borderRadius: theme.radius.card,
            padding: `${padY}px ${padX}px`,
            ...ellipsis,
            userSelect: "text",
            cursor: "default",
            outline: "none",
        };

        const clickChip = (isActive, isHover) => ({
            ...baseText,
            border: isActive || isHover ? theme.borders.cardSelected : theme.borders.card,
            background: isActive ? theme.accentDark : "transparent",
            borderRadius: theme.radius.card,
            padding: `${padY}px ${padX}px`,
            fontWeight: isActive ? theme.weights.subtitleSelected : theme.weights.normal,
            color: isActive ? theme.textOnColor : theme.textDark,
            cursor: "pointer",
            outline: "none",
            transition: `transform ${theme.motion.fast} ${theme.motion.ease}, opacity ${theme.motion.fast} ${theme.motion.ease}`,
            ...ellipsis,
            userSelect: "none",
        });

        const hoverFx = {
            transform: "scale(1.02)",
            //opacity: 0.95,
        };

        return { infoChip, clickChip, hoverFx };
    }, []);

    if (!children) return null;

    // INFO MODE (InfoChip)
    if (info || !onClick) {
        return (
            <div title={title} style={{ ...styles.infoChip, ...(style || {}) }}>
                {children}
            </div>
        );
    }

    // CLICKABLE MODE (Chip)
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            style={{
                ...styles.clickChip(active, hover),
                ...(hover ? styles.hoverFx : null),
                ...(style || {}),
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {children}
        </button>
    );
}

/**
 * Optional backwards-compat exports (so you don’t have to update all imports at once)
 * You can remove later.
 */
export function InfoChip(props) {
    return <Chip info {...props} />;
}

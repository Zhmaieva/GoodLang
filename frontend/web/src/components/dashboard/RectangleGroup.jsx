// RectangleGroup.jsx — FULL DROP-IN (theme-driven)
import React, { useMemo } from "react";
import { theme } from "../../App.jsx";

/**
 * Props:
 * - title: string (required)
 * - children: items to render inside the rounded rectangle (wraps automatically)
 * - style: optional wrapper style override
 * - boxStyle: optional rectangle style override
 */
export default function RectangleGroup({ title, children, style, boxStyle }) {
    const styles = useMemo(() => {
        const t = theme.rectangleGroup;

        return {
            wrap: {
                width: "100%",
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
                //gap: t.titleGap,
                ...(style || {}),
            },

            title: {
                fontFamily: theme.fontFamily,
                fontSize: t.titleFontSize,
                fontWeight: t.titleFontWeight,
                lineHeight: theme.type.titleLineHeight,
                color: theme.textDark,
                margin: 0,
                paddingLeft: theme.spacing.cardPadX,
            },

            box: {
                width: "100%",
                display: "flex",
                //flexWrap: "wrap",
                alignItems: "stretch",
                justifyContent: "stretch",
                gap: t.gap,
                height: "100%",
                flex: "1 1 auto",

                padding: `${t.padY}px ${t.padX}px`,
                borderRadius: t.radius,
                //background: t.background,
                //border: t.border,

                // keeps it subtle/monochrome
                color: theme.textDark,

                ...(boxStyle || {}),
            },
        };
    }, [style, boxStyle]);

    return (
        <section style={styles.wrap} aria-label={title}>
            <h2 style={styles.title}>{title}</h2>
            <div style={styles.box}>{children}</div>
        </section>
    );
}

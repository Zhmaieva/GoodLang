import React, {useMemo} from "react";
import {themeStyles} from "../../utils/theme.js";

export const theme = themeStyles;


export default function TextLoadingPreview({}) {
    const t = theme.page;

    const styles = useMemo(
        () => ({
            paper: {
                border: theme.borders.card,
                borderRadius: theme.radius.card,
                padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
                background: "rgba(0,0,0,0.02)",
                width: "100%",
                flex: "1 1 100%"
            },

            miniMeta: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.small,
                lineHeight: theme.type.titleLineHeight,
                color: theme.textDark,
            },

            skeletonLine: (pct) => ({
                height: 16,
                width: `${pct}%`,
                borderRadius: 6,
                border: theme.borders.card,
                background:
                    "linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%)",
                backgroundSize: "200% 100%",
                animation: "gl_skeleton 1.2s ease-in-out infinite",
            }),
        }),
        []
    );

    return (
        <div style={{ width: "100%", minWidth: 0, alignSelf: "stretch" }}>
            <div style={{ ...styles.paper, width: "100%", minWidth: 0, boxSizing: "border-box" }}>
                <div style={styles.miniMeta}>Composing text… please wait.</div>
                <div style={{ height: 10 }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                    <div style={styles.skeletonLine(92)} />
                    <div style={styles.skeletonLine(98)} />
                    <div style={styles.skeletonLine(86)} />
                    <div style={styles.skeletonLine(94)} />
                    <div style={styles.skeletonLine(78)} />
                    <div style={styles.skeletonLine(90)} />
                    <div style={{ height: 6 }} />
                    <div style={styles.skeletonLine(88)} />
                    <div style={styles.skeletonLine(74)} />
                </div>
            </div>
        </div>
    );
}
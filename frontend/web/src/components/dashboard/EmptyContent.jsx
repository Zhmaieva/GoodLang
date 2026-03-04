// EmptyContent.jsx — FULL DROP-IN (theme-driven, centered, optional action button)
import React, { useMemo } from "react";
import { theme } from "../../App.jsx";
import AwesomeActionButton from "./AwesomeActionButton.jsx"; // adjust path if different

/**
 * Props:
 * - sourceText: string (main big text)
 * - subtitle: string (smaller text under title) [optional]
 * - actionText: string (button label) [optional]
 * - onAction: () => void [optional]
 * - actionIconUrl: string [optional]
 * - actionSymbol: string [optional]
 * - variant: "accent" | "ghost" [optional] (defaults to accent if action exists)
 *
 * Behavior:
 * - If actionText exists -> shows button (size chosen automatically)
 * - Layout: centered both vertically and horizontally
 * - Typography: title uses breadcrumbs size + boosted weight; subtitle uses theme.type.subtitle
 * - No hardcoded colors/sizes (uses theme)
 */
export default function EmptyContent({
                                         sourceText,
                                         subtitle,
                                         actionText,
                                         onAction,
                                         actionIconUrl,
                                         actionSymbol,
                                         variant,
                                     }) {
    const hasAction = !!actionText && typeof onAction === "function";

    const buttonSize = useMemo(() => {
        if (!hasAction) return "regular";
        // “Dynamic”: short CTAs feel better as GIANT; longer ones as REGULAR.
        return "regular";
    }, [hasAction, actionText]);

    const resolvedVariant = useMemo(() => {
        if (!hasAction) return "ghost";
        return variant || "accent";
    }, [hasAction, variant]);

    const styles = useMemo(() => {
        const pad = theme.layoutMetrics?.pagePad ?? theme.spacing?.cardPadX;

        return {
            wrap: {
                width: "100%",
                flex: 1,              // ✅ key
                minHeight: 0,         // ✅ allows shrinking inside flex parents
                display: "flex",
                alignItems: theme.layout.rowAlign,
                justifyContent: "center",
                //padding: pad,
                fontFamily: theme.fontFamily,
            },


            stack: {
                display: "flex",
                flexDirection: "column",
                //alignItems: "center",
                //justifyContent: "center",
                gap: theme.emptyContent?.stackGap ?? theme.spacing.gap,
                //textAlign: "center",
                //maxWidth: theme.emptyContent?.maxWidth ?? theme.breadcrumbs.maxLabelWidth,
            },

            title: {
                fontSize: "14px",
                fontWeight: theme.weights.thin,
                lineHeight: theme.type.titleLineHeight,
                color: theme.textDark,
                margin: 0,
            },

            subtitle: {
                fontSize: theme.type.subtitle,
                fontWeight: theme.weights.normal,
                lineHeight: theme.type.subtitleLineHeight,
                color: theme.textMutedDark,
                margin: 0,
            },

            buttonWrap: {
                display: "flex",
                alignItems: theme.layout.rowAlign,
                justifyContent: "center",
                width: "100%",
                marginTop: theme.emptyContent?.buttonTopGap ?? theme.spacing.gap,
            },
        };
    }, []);

    if (!sourceText) return null;

    return (
        <div style={styles.wrap}>
            <div style={styles.stack}>
                <div style={styles.title}>{sourceText}</div>

                {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}

                {hasAction ? (
                    <div style={styles.buttonWrap}>
                        <AwesomeActionButton
                            size={buttonSize}
                            variant={resolvedVariant}
                            iconUrl={actionIconUrl}
                            symbol={actionSymbol}
                            onClick={onAction}
                            title={actionText}
                        >
                            {actionText}
                        </AwesomeActionButton>
                    </div>
                ) : null}
            </div>
            {
                actionText ? (
                    <div style={theme.images.handWrapper}>
                        <img src={'/handPict.PNG'} style={theme.images.handEmptyContent}/>
                    </div>

                ) : null
            }
        </div>
    );
}

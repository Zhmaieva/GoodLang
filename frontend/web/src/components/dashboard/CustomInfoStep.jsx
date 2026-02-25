import React from "react";
import { theme } from "../../App.jsx";
import AwesomeActionButton from "./AwesomeActionButton.jsx";

/**
 * Props:
 * - title: string
 * - subtitle?: string (optional, also centered)
 * - buttonText: string
 * - onAction: async () => boolean | void
 * - canAction?: boolean (default true)
 */
export default function CustomInfoStep({
                                               title = "",
                                               subtitle = "",
                                               buttonText = "Continue",
                                               backButtonText = "Back",
                                               onAction,
                                               onBackAction,
                                               canAction = true,
                                           }) {
    // ✅ drives first-appear fade-in (same as EmailStep)
    const [isShown, setIsShown] = React.useState(false);
    React.useEffect(() => {
        const id = requestAnimationFrame(() => setIsShown(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const wrapStyle = {
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.gap,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        textAlign: "start",
    };

    const titleStyle = {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.title,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textDark,
        margin: 0,
    };

    const subtitleStyle = {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textMutedDark,
        margin: 0,
    };

    const handleClick = async () => {
        const ok = await onAction?.();
        if (ok === false) return;
    };

    const handleBackClick = async () => {
        const ok = await onBackAction?.();
        if (ok === false) return;
    };

    return (
        <div style={wrapStyle}>
            {!!String(title || "").trim() && (
                <h2
                    style={{
                        ...titleStyle,
                    }}
                >
                    {title}
                </h2>
            )}

            {!!String(subtitle || "").trim() && (
                <div
                    style={{
                        ...subtitleStyle,
                    }}
                >
                    {subtitle}
                </div>
            )}

            <div
                style={{
                    marginTop: theme.spacing.gap,
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <AwesomeActionButton
                    variant="ghost"
                    size="regular"
                    onClick={handleBackClick}
                >
                    {backButtonText}
                </AwesomeActionButton>

                <AwesomeActionButton
                    variant="ghost"
                    size="regular"
                    onClick={handleClick}
                >
                    {buttonText}
                </AwesomeActionButton>
            </div>
        </div>
    );
}

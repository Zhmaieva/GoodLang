import { theme } from "../../App.jsx";
import { useMemo } from "react";

export default function PageLeft({ autoStretch = false, children }) {
    const t = theme.page;

    const autoStretchStyles = {
        flex: "1 1 auto",
        gap: theme.spacing.gap,
        alignItems: "stretch",
    };

    const styles = useMemo(
        () => ({
            left: {
                width: t.leftWidth,
                minWidth: t.minH0,
                height: t.full,
                minHeight: t.minH0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",

                ...(autoStretch ? autoStretchStyles : {}),
            },
        }),
        [t, autoStretch]
    );

    return (
        <div style={styles.left}>
            {children}
        </div>
    );
}
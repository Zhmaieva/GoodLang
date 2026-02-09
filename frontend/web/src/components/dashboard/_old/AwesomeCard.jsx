// AwesomeCard.jsx — drop-in (GoodLang style)
import React from "react";

export default function AwesomeCard({ title, right, children, style }) {
    return (
        <div style={{ ...styles.card, ...style }}>
            {(title || right) && (
                <div style={styles.header}>
                    <div style={styles.title} title={typeof title === "string" ? title : undefined}>
                        {title}
                    </div>
                    <div style={styles.right}>{right}</div>
                </div>
            )}

            {/* ✅ Critical: flex child that can shrink so inner scroll works */}
            <div style={styles.content}>{children}</div>
        </div>
    );
}

const TOKENS = {
    bg: "#fff3df",
    card: "rgba(255,255,255,0.72)",
    cardSolid: "#fffdf8",
    text: "#3a2a1d",
    muted: "#a47856",
    border: "rgba(58,42,29,0.18)",
    borderStrong: "rgba(58,42,29,0.22)",
    accent: "#ff6138",
    radius: 20,
    radiusInner: 16,
    shadow: "3px 3px 0 rgba(0,0,0,0.08)",
};

const styles = {
    card: {
        background: TOKENS.card,
        border: `1px solid ${TOKENS.borderStrong}`,
        borderRadius: TOKENS.radius,
        boxShadow: TOKENS.shadow,
        padding: 14,

        /* ✅ layout behavior for “table fills height” */
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",

        fontFamily: "Nunito, ui-sans-serif, system-ui",
        color: TOKENS.text,
        backdropFilter: "blur(6px)",
    },

    header: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between",
        flex: "0 0 auto",
        minWidth: 0,

        paddingBottom: 10,
        marginBottom: 10,
        borderBottom: `1px solid ${TOKENS.border}`,
    },

    title: {
        fontWeight: 1000,
        fontSize: 16,
        lineHeight: 1.15,
        color: TOKENS.text,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    right: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        minWidth: 0,
    },

    content: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden", // inner components manage scroll
        display: "flex",
        flexDirection: "column",
    },
};

import React from "react";

export default function AwesomeCard({ title, right, children, style }) {
    return (
        <div style={{ ...styles.card, ...style }}>
            {(title || right) && (
                <div style={styles.header}>
                    <div style={styles.title}>{title}</div>
                    <div style={styles.right}>{right}</div>
                </div>
            )}

            {/* ✅ Critical: flex child that can shrink so inner scroll works */}
            <div style={styles.content}>
                {children}
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: "var(--card, #fffdf8)",
        border: "3px solid var(--accent, #ff6138)",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.08)",
        padding: 14,

        /* ✅ Critical for “table fills available height” patterns */
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
    },

    header: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between",
        marginBottom: 10,
        flex: "0 0 auto",
        minWidth: 0,
    },

    title: {
        fontWeight: 800,
        fontSize: 16,
        color: "var(--text, #3a2a1d)",
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

    /* ✅ This is the missing piece in your current AwesomeCard */
    content: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden", // inner components (tables) manage scroll
        display: "flex",
        flexDirection: "column",
    },
};

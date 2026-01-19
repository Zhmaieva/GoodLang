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
            <div>{children}</div>
        </div>
    );
}

const styles = {
    card: {
        background: "var(--card, #fffdf8)",
        border: "3px solid var(--accent, #ff6138)",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.08)",
        padding: 14,
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between",
        marginBottom: 10,
    },
    title: {
        fontWeight: 800,
        fontSize: 16,
        color: "var(--text, #3a2a1d)",
    },
    right: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
};

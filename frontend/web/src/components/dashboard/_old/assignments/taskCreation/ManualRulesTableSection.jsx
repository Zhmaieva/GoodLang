import React from "react";

export default function ManualRulesTableSection() {
    return (
        <div style={styles.wrap}>
            <div style={styles.header}>
                <div style={styles.title}>Manual rules</div>
                <div style={styles.badge}>Soon</div>
            </div>

            <div style={styles.body}>
                <div style={styles.empty}>Empty for now.</div>
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        flex: "1 1 auto",
        minHeight: 0,
        border: "2px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        background: "var(--card, #fffdf8)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        padding: "10px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    title: {
        fontWeight: 1000,
        color: "var(--text, #3a2a1d)",
    },
    badge: {
        fontWeight: 900,
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.06)",
    },
    body: {
        padding: 14,
        flex: "1 1 auto",
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    empty: {
        fontWeight: 900,
        color: "rgba(0,0,0,0.35)",
    },
};

import React from "react";

export default function AwesomeModal({ open, title, children, footer, onClose }) {
    if (!open) return null;

    return (
        <div style={styles.backdrop} onMouseDown={onClose}>
            <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <div style={styles.title}>{title}</div>
                    <button style={styles.x} onClick={onClose} aria-label="close">
                        ✕
                    </button>
                </div>
                <div style={styles.body}>{children}</div>
                {footer && <div style={styles.footer}>{footer}</div>}
            </div>
        </div>
    );
}

const styles = {
    backdrop: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        zIndex: 9999,
    },
    modal: {
        width: "100%",
        maxWidth: 560,
        background: "var(--card, #fffdf8)",
        border: "3px solid var(--accent, #ff6138)",
        boxShadow: "6px 6px 0 rgba(0,0,0,0.12)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        padding: "12px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
    },
    title: { fontWeight: 900, color: "var(--text, #3a2a1d)" },
    x: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: 18,
    },
    body: { padding: 12 },
    footer: {
        padding: 12,
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        borderTop: "1px solid rgba(0,0,0,0.08)",
    },
};

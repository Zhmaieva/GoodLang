import React from "react";
import TaskNumberSelector from "./TaskNumberSelector.jsx";
import TaskModeSelector from "./TaskModeSelector.jsx";
import RecommendedRulesToggle from "./RecommendedRulesToggle.jsx";

export default function RecommendedPreviewTopToolbar({ isNarrow = false }) {
    return (
        <div style={{ ...styles.wrap, ...(isNarrow ? styles.wrapNarrow : null) }}>
            <div style={styles.left}>
                <div style={styles.title}>Загальні налаштування</div>
                <div style={styles.subTitle}>застосовуються до всіх обраних учнів</div>
            </div>

            <div style={{ ...styles.controls, ...(isNarrow ? styles.controlsNarrow : null) }}>
                <TaskNumberSelector />
                <TaskModeSelector />
                <RecommendedRulesToggle />
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 12px",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 14,
        background: "var(--card, #fffdf8)",
        boxShadow: "1px 1px 0 rgba(0,0,0,0.05)",
    },
    wrapNarrow: {
        alignItems: "stretch",
        flexDirection: "column",
    },

    left: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 280,
    },
    title: {
        fontWeight: 1000,
        color: "var(--text, #3a2a1d)",
        lineHeight: 1.1,
    },
    subTitle: {
        fontWeight: 800,
        fontSize: 12,
        color: "rgba(0,0,0,0.45)",
        lineHeight: 1.1,
    },

    controls: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "flex-start",
        width: "100%",
    },
    controlsNarrow: {
        justifyContent: "flex-start",
    },
};

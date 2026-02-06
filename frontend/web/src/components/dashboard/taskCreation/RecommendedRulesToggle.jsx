import React from "react";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function RecommendedRulesToggle() {
    const { useRecommendedRules, setUseRecommendedRules, restartRecommendedPreview } =
        useTeacherDashboard();

    const onChange = (e) => {
        const next = !!e.target.checked;
        setUseRecommendedRules(next);
        // optional: makes sense because UI expectation is "recommendations reflect controls"
        restartRecommendedPreview();
    };

    return (
        <label style={styles.row}>
            <input
                type="checkbox"
                checked={!!useRecommendedRules}
                onChange={onChange}
                style={styles.checkbox}
            />
            <span style={styles.text}>Recommended rules</span>
        </label>
    );
}

const styles = {
    row: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 14,
        background: "rgba(0,0,0,0.02)",
        fontWeight: 900,
        color: "var(--text, #3a2a1d)",
        userSelect: "none",
        cursor: "pointer",
    },
    checkbox: {
        width: 16,
        height: 16,
        cursor: "pointer",
    },
    text: {
        fontSize: 13,
    },
};

import React from "react";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function TaskModeSelector() {
    const { taskMode, setTaskMode } = useTeacherDashboard();

    // ✅ enabled modes (taskMode is saved for later task-set creation, not for preview)
    const modes = [
        { id: "translations", label: "Translations" },
        { id: "gapfill", label: "Gap-fill" },
        { id: "mixed", label: "Mixed" },
    ];

    const onChange = (e) => {
        const next = String(e.target.value || "translations");
        if (next === taskMode) return;
        setTaskMode(next);
    };

    return (
        <div style={styles.wrap}>
            <div style={styles.label}>Mode</div>
            <select value={taskMode || "translations"} onChange={onChange} style={styles.select}>
                {modes.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

const styles = {
    wrap: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 12,
        background: "rgba(0,0,0,0.02)",
        height: 38,
    },
    label: {
        fontWeight: 900,
        color: "var(--text, #3a2a1d)",
        fontSize: 12,
        whiteSpace: "nowrap",
        opacity: 0.9,
    },
    select: {
        padding: "7px 10px",
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "var(--card, #fffdf8)",
        fontWeight: 900,
        outline: "none",
        height: 30,
        minWidth: 150,
    },
};

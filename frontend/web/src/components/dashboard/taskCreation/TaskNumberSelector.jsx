import React, { useEffect, useRef, useState } from "react";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function TaskNumberSelector({ min = 1, max = 50 }) {
    const { numberOfTasksPerStudent, setNumberOfTasksPerStudent, restartRecommendedPreview } =
        useTeacherDashboard();

    const [local, setLocal] = useState(numberOfTasksPerStudent ?? 10);
    const lastCommittedRef = useRef(numberOfTasksPerStudent ?? 10);

    useEffect(() => {
        setLocal(numberOfTasksPerStudent ?? 10);
        lastCommittedRef.current = numberOfTasksPerStudent ?? 10;
    }, [numberOfTasksPerStudent]);

    const commit = () => {
        const next = clamp(local, min, max);
        if (next === lastCommittedRef.current) return;

        lastCommittedRef.current = next;
        setNumberOfTasksPerStudent(next);
        restartRecommendedPreview();
    };

    return (
        <div style={styles.wrap}>
            <div style={styles.label}>Tasks/student</div>

            <input
                type="range"
                min={min}
                max={max}
                step={1}
                value={local}
                onChange={(e) => setLocal(Number(e.target.value))}
                onMouseUp={commit}
                onTouchEnd={commit}
                onKeyUp={(e) => {
                    if (e.key === "Enter") commit();
                }}
                style={styles.range}
            />

            <div style={styles.value}>{clamp(local, min, max)}</div>
        </div>
    );
}

function clamp(x, a, b) {
    const n = Number(x);
    if (!Number.isFinite(n)) return 10;
    return Math.max(a, Math.min(b, n));
}

const styles = {
    wrap: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 10px",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 12,
        background: "rgba(0,0,0,0.02)",
        height: 38,
        minWidth: 200, // ✅ longer
        maxWidth: 520,
        width: "100%",
        flex: "1 1 360px",
    },
    label: {
        fontWeight: 900,
        color: "var(--text, #3a2a1d)",
        fontSize: 12,
        whiteSpace: "nowrap",
        opacity: 0.9,
    },
    range: {
        flex: "1 1 auto",
        width: "100%",
        cursor: "pointer",
    },
    value: {
        fontWeight: 1000,
        fontSize: 14,
        color: "var(--text, #3a2a1d)",
        minWidth: 26,
        textAlign: "right",
    },
};

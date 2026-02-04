import React, {useEffect, useState} from "react";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function RecommendedToolbar() {
    const { activePreviewStudentId, students } = useTeacherDashboard();
    const [studentName, setStudentName] = useState('');
    useEffect(() => {
        const student = students.find(x => x.student_account_id === activePreviewStudentId);
        const userName = `${student?.first_name} ${student?.last_name}`;
        setStudentName(userName.trim());
    }, [activePreviewStudentId]);

    return (
        <div style={styles.toolbarRow}>
            <div style={styles.toolbarLeft}>
                {activePreviewStudentId ? (
                    <div style={styles.toolbarLabel}>
                        Рекомендації для учня:{" "}
                        <span style={{ fontWeight: 1000 }}>{studentName}</span>
                    </div>
                ) : (
                    <div style={styles.toolbarLabelMuted}>Обери учня зліва</div>
                )}
            </div>

            <div style={styles.toolbarRight}>
                {/* тут будуть контролли пізніше */}
            </div>
        </div>
    );
}

const styles = {
    toolbarRow: {
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "6px 6px 0 6px",
        minWidth: 0,
        height: 44,
    },
    toolbarLeft: {
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    toolbarLabel: {
        fontWeight: 900,
        color: "var(--text, #3a2a1d)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    toolbarLabelMuted: {
        fontWeight: 900,
        color: "var(--muted, #a47856)",
    },
    toolbarRight: {
        flex: "0 0 220px",
        height: 34,
    },
};

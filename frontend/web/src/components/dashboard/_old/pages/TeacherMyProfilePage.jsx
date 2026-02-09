import React from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function TeacherMyProfilePage() {
    const { teacher, loading, err, reloadAll } = useTeacherDashboard();

    if (loading) {
        return <div style={styles.muted}>Завантаження…</div>;
    }

    if (err) {
        return <div style={styles.error}>{err}</div>;
    }

    if (!teacher) return null;

    const quotaText = !teacher.isTeacherPlus
        ? "План: Free"
        : teacher.quota <= 0
            ? "План: Teacher+ (квота = 0)"
            : `План: Teacher+ • Студенти: ${teacher.activeStudentsCount} / ${teacher.quota}`;

    return (
        <AwesomeCard
            title="Мій профіль"
            right={
                <AwesomeButton variant="ghost" onClick={reloadAll}>
                    Оновити
                </AwesomeButton>
            }
        >
            <div style={styles.block}>
                <div style={styles.label}>Імʼя</div>
                <div style={styles.value}>{teacher.last_name} {teacher.first_name}</div>
            </div>

            <div style={styles.block}>
                <div style={styles.label}>Email</div>
                <div style={styles.value}>{teacher.email}</div>
            </div>

            <div style={styles.block}>
                <div style={styles.label}>Статус</div>
                <div style={styles.value}>{quotaText}</div>
            </div>
        </AwesomeCard>
    );
}

const styles = {
    block: {
        marginBottom: 12,
        padding: 10,
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.6)",
    },
    label: { fontWeight: 900, marginBottom: 4 },
    value: { fontWeight: 800 },
    muted: { color: "var(--muted, #a47856)", fontWeight: 800 },
    error: {
        padding: 10,
        border: "2px solid rgba(255,0,0,0.25)",
        background: "rgba(255,0,0,0.06)",
        fontWeight: 800,
    },
};

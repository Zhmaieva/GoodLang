// TeacherMyProfilePage.jsx — FULL DROP-IN
import React, { useMemo } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function TeacherMyProfilePage() {
    const { loading, err, teacher, reloadAll } = useTeacherDashboard();

    const quotaText = useMemo(() => {
        if (!teacher) return "—";
        const active = Number(teacher?.active_students ?? 0);
        const quota = Number(teacher?.students_quota ?? 0);
        const isPlus = teacher?.status === "Teacher+";

        if (!isPlus) return "План: Free (додавання студентів недоступне)";
        if (quota <= 0) return "План: Teacher+ (квота студентів: 0 — зверніться в підтримку)";
        return `План: Teacher+ • Активні студенти: ${active} / ${quota}`;
    }, [teacher]);

    return (
        <div>
            <AwesomeCard
                title="Мій профіль"
                right={
                    <AwesomeButton variant="ghost" onClick={reloadAll} disabled={loading}>
                        Оновити
                    </AwesomeButton>
                }
                style={{ marginBottom: 14 }}
            >
                {err ? <div style={styles.error}>{err}</div> : null}
                {loading ? <div style={styles.muted}>Завантаження…</div> : null}

                <div style={styles.box}>
                    <div style={styles.label}>Статус</div>
                    <div style={styles.value}>{quotaText}</div>
                </div>

                <div style={styles.box}>
                    <div style={styles.label}>Викладач</div>
                    <div style={styles.value}>
                        ID: {teacher?.account_id ? String(teacher.account_id).slice(0, 8) + "…" : "—"}
                    </div>
                </div>
            </AwesomeCard>
        </div>
    );
}

const styles = {
    box: {
        border: "2px solid rgba(0,0,0,0.12)",
        padding: 12,
        background: "rgba(255,255,255,0.6)",
        marginTop: 10,
    },
    label: { fontWeight: 900, marginBottom: 4 },
    value: { lineHeight: 1.35 },
    error: {
        marginTop: 10,
        padding: 10,
        border: "2px solid rgba(255,0,0,0.25)",
        background: "rgba(255,0,0,0.06)",
        fontWeight: 800,
    },
    muted: { marginTop: 10, color: "var(--muted, #a47856)", fontWeight: 800 },
};

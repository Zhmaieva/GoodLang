import React, { useEffect, useMemo } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

export default function ClassesSection({
                                           classes,
                                           expandedClassId,
                                           onToggleExpand,
                                           loadClassStudents, // ✅ IMPORTANT: must NOT toggle, only fetch
                                           classStudentsMap,
                                           classStudentsLoading,
                                           onAddClass,
                                           onAddStudent,
                                           onRegenerateInviteCode,
                                           onDeactivate,
                                           canAddStudents,
                                           // support both to avoid breaking old/new props
                                           isPro,
                                           isTeacherPlus,
                                           quota,
                                           activeStudentsCount,
                                       }) {
    const isPaid = typeof isTeacherPlus === "boolean" ? isTeacherPlus : !!isPro;

    const hint = !isPaid
        ? "Ваш план FREE — додавання студентів вимкнено."
        : quota <= 0
            ? "Квота студентів = 0. Змініть план або квоту."
            : activeStudentsCount >= quota
                ? "Квота вичерпана — додавання студентів вимкнено."
                : "";

    // ✅ Expand all by default (when expandedClassId is null)
    const isExpanded = (classId) => expandedClassId === null || expandedClassId === classId;

    // ✅ Auto-load students for any expanded classes that don't have data yet
    useEffect(() => {
        if (!loadClassStudents) return;
        if (!Array.isArray(classes) || classes.length === 0) return;

        // If expandedClassId is a UUID -> only that class should be loaded
        // If expandedClassId is null -> load all (expanded by default)
        const targetIds =
            expandedClassId === null
                ? classes.map((c) => c.id)
                : [expandedClassId];

        targetIds.forEach((classId) => {
            if (!classId) return;

            const expanded = expandedClassId === null || expandedClassId === classId;
            if (!expanded) return;

            const hasData = Array.isArray(classStudentsMap?.[classId]);
            const loading = !!classStudentsLoading?.[classId];

            // Important: only fetch if not already fetched and not already loading
            if (!hasData && !loading) {
                loadClassStudents(classId);
            }
        });
    }, [classes, expandedClassId, classStudentsMap, classStudentsLoading, loadClassStudents]);

    const safeClasses = useMemo(() => (Array.isArray(classes) ? classes : []), [classes]);

    return (
        <AwesomeCard
            title="Класи"
            right={
                <AwesomeButton onClick={onAddClass}>
                    + Створити клас
                </AwesomeButton>
            }
        >
            {hint ? <div style={styles.hint}>{hint}</div> : null}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {safeClasses.length === 0 ? (
                    <div style={styles.empty}>Ще немає класів. Створіть перший.</div>
                ) : (
                    safeClasses.map((c) => {
                        const expanded = isExpanded(c.id);
                        const students = Array.isArray(classStudentsMap?.[c.id]) ? classStudentsMap[c.id] : [];
                        const loading = !!classStudentsLoading?.[c.id];

                        return (
                            <div key={c.id} style={styles.classBox}>
                                <div style={styles.classRow}>
                                    <button style={styles.expandBtn} onClick={() => onToggleExpand(c.id)}>
                                        {expanded ? "▾" : "▸"}
                                    </button>

                                    <div
                                        style={styles.classMain}
                                        onClick={() => onToggleExpand(c.id)}
                                        title="Розгорнути"
                                    >
                                        <div style={styles.className}>{c.name}</div>
                                        <div style={styles.classCode}>
                                            Код: <b>{c.invite_code}</b>
                                        </div>
                                    </div>

                                    <div style={styles.classActions}>
                                        <AwesomeButton
                                            variant="ghost"
                                            onClick={() => onRegenerateInviteCode?.(c.id)}
                                            title="Згенерувати новий код"
                                        >
                                            Новий код
                                        </AwesomeButton>

                                        <AwesomeButton
                                            onClick={() => onAddStudent?.(c.id)}
                                            disabled={!canAddStudents}
                                            title={!canAddStudents ? "Неможливо додати (план/квота)" : "Додати студента"}
                                        >
                                            + Студент
                                        </AwesomeButton>
                                    </div>
                                </div>

                                {expanded ? (
                                    <div style={styles.expandArea}>
                                        {loading ? (
                                            <div style={styles.loading}>Завантаження студентів…</div>
                                        ) : students.length === 0 ? (
                                            <div style={styles.empty}>У цьому класі ще немає студентів.</div>
                                        ) : (
                                            <div style={styles.studentList}>
                                                {students.map((s) => (
                                                    <div key={`${c.id}-${s.student_account_id}`} style={styles.studentRow}>
                                                        <div style={styles.studentLeft}>
                                                            <div style={styles.studentName}>
                                                                {(s.first_name || s.last_name)
                                                                    ? `${s.first_name || ""} ${s.last_name || ""}`.trim()
                                                                    : "Без імені"}
                                                                {!s.is_active ? (
                                                                    <span style={styles.badgeInactive}>неактивний</span>
                                                                ) : null}
                                                            </div>
                                                            <div style={styles.studentEmail}>{s.email}</div>
                                                        </div>

                                                        <div style={styles.studentRight}>
                                                            <AwesomeButton
                                                                variant="danger"
                                                                onClick={() => onDeactivate?.(c.id, s.student_account_id)}
                                                            >
                                                                Видалити
                                                            </AwesomeButton>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })
                )}
            </div>
        </AwesomeCard>
    );
}

const styles = {
    hint: {
        marginBottom: 10,
        padding: 10,
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(0,0,0,0.03)",
        fontWeight: 800,
    },
    empty: {
        color: "var(--muted, #a47856)",
        fontWeight: 800,
        padding: 10,
    },
    classBox: {
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.5)",
    },
    classRow: {
        display: "grid",
        gridTemplateColumns: "36px 1fr auto",
        gap: 10,
        padding: 10,
        alignItems: "center",
    },
    expandBtn: {
        width: 32,
        height: 32,
        border: "2px solid rgba(0,0,0,0.2)",
        background: "transparent",
        cursor: "pointer",
        fontWeight: 900,
    },
    classMain: {
        cursor: "pointer",
        minWidth: 0,
    },
    className: {
        fontWeight: 900,
        fontSize: 15,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    classCode: {
        color: "var(--muted, #a47856)",
        fontWeight: 800,
        marginTop: 2,
    },
    classActions: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
    expandArea: {
        borderTop: "1px solid rgba(0,0,0,0.1)",
        padding: 10,
    },
    loading: {
        color: "var(--muted, #a47856)",
        fontWeight: 800,
    },
    studentList: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    studentRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        padding: 10,
        border: "1px solid rgba(0,0,0,0.1)",
        background: "rgba(255,255,255,0.55)",
        alignItems: "center",
    },
    studentLeft: { minWidth: 0 },
    studentName: { fontWeight: 900, display: "flex", alignItems: "center", gap: 8 },
    badgeInactive: {
        fontSize: 12,
        fontWeight: 900,
        padding: "2px 6px",
        border: "2px solid rgba(0,0,0,0.15)",
        background: "rgba(0,0,0,0.04)",
    },
    studentEmail: {
        color: "var(--muted, #a47856)",
        fontWeight: 800,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: 360,
    },
    studentRight: { display: "flex", gap: 8, alignItems: "center" },
};

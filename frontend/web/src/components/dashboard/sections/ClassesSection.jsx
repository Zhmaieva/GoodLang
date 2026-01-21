import React, { useEffect, useMemo, useState } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

/** helpers */
function norm(v) {
    return String(v || "").trim().toLowerCase();
}

function filterStudents(list, query) {
    const students = Array.isArray(list) ? list : [];
    const q = norm(query);
    if (!q) return students;

    const tokens = q.split(/\s+/).filter(Boolean);

    return students.filter((s) => {
        const email = norm(s.email);
        const first = norm(s.first_name);
        const last = norm(s.last_name);

        const hay = `${email} ${first} ${last}`.trim();
        return tokens.every((t) => hay.includes(t));
    });
}

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
    const isExpanded = (classId) => expandedClassId === classId;

    // ✅ per-class search queries stored in ONE state (hook-safe)
    const [searchByClassId, setSearchByClassId] = useState({});

    const setSearch = (classId, value) => {
        setSearchByClassId((prev) => ({
            ...(prev || {}),
            [classId]: value,
        }));
    };

    const clearSearch = (classId) => {
        setSearchByClassId((prev) => {
            const next = { ...(prev || {}) };
            delete next[classId];
            return next;
        });
    };

    // ✅ Auto-load students for any expanded classes that don't have data yet
    useEffect(() => {
        if (!loadClassStudents) return;
        if (!Array.isArray(classes) || classes.length === 0) return;

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
                        const studentsRaw = Array.isArray(classStudentsMap?.[c.id]) ? classStudentsMap[c.id] : [];
                        const loading = !!classStudentsLoading?.[c.id];

                        const q = searchByClassId?.[c.id] || "";
                        const students = filterStudents(studentsRaw, q);

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
                                        ) : (
                                            <>
                                                {/* ✅ Search row for this class */}
                                                <div style={styles.searchRow}>
                                                    <input
                                                        value={q}
                                                        onChange={(e) => setSearch(c.id, e.target.value)}
                                                        placeholder="Пошук студента: email / ім’я / прізвище"
                                                        style={styles.searchInput}
                                                    />
                                                    {q ? (
                                                        <AwesomeButton
                                                            variant="ghost"
                                                            onClick={() => clearSearch(c.id)}
                                                            title="Очистити"
                                                        >
                                                            Очистити
                                                        </AwesomeButton>
                                                    ) : null}

                                                    <div style={styles.count}>
                                                        {students.length}/{studentsRaw.length}
                                                    </div>
                                                </div>

                                                {studentsRaw.length === 0 ? (
                                                    <div style={styles.empty}>У цьому класі ще немає студентів.</div>
                                                ) : students.length === 0 ? (
                                                    <div style={styles.empty}>Нічого не знайдено за запитом.</div>
                                                ) : (
                                                    <div style={styles.tableWrap}>
                                                        {/* header */}
                                                        <div style={styles.thead}>
                                                            <div style={styles.th}>Студент</div>
                                                            <div style={styles.th}>Email</div>
                                                            <div style={styles.thActions}>Дії</div>
                                                        </div>

                                                        {/* rows */}
                                                        {students.map((s) => {
                                                            const fullName =
                                                                (s.first_name || s.last_name)
                                                                    ? `${s.last_name || ""} ${s.first_name || ""}`.trim()
                                                                    : "Без імені";

                                                            return (
                                                                <div
                                                                    key={`${c.id}-${s.student_account_id}`}
                                                                    style={styles.trow}
                                                                >
                                                                    <div style={styles.tdName}>
                                                                        <div style={styles.studentName}>
                                                                            {fullName}
                                                                            {!s.is_active ? (
                                                                                <span style={styles.badgeInactive}>неактивний</span>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div style={styles.tdEmail} title={s.email}>
                                                                        {s.email}
                                                                    </div>

                                                                    <div style={styles.tdActions}>
                                                                        <AwesomeButton
                                                                            variant="danger"
                                                                            onClick={() => onDeactivate?.(c.id, s.student_account_id)}
                                                                        >
                                                                            Видалити
                                                                        </AwesomeButton>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </>
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

    // ✅ per-class search UI
    searchRow: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 10,
    },
    searchInput: {
        flex: "1 1 320px",
        minWidth: 220,
        padding: "10px 12px",
        fontWeight: 800,
        border: "2px solid rgba(0,0,0,0.18)",
        outline: "none",
        background: "rgba(255,255,255,0.9)",
        color: "var(--text, #3a2a1d)",
    },
    count: {
        marginLeft: "auto",
        color: "var(--muted, #a47856)",
        fontWeight: 900,
    },

    // ✅ embedded table
    tableWrap: {
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.6)",
    },
    thead: {
        display: "grid",
        gridTemplateColumns: "2fr 2fr 1fr",
        gap: 10,
        padding: "10px 10px",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        background: "rgba(0,0,0,0.03)",
        fontWeight: 900,
        alignItems: "center",
    },
    th: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    thActions: {
        textAlign: "left",
    },
    trow: {
        display: "grid",
        gridTemplateColumns: "2fr 2fr 1fr",
        gap: 10,
        padding: "10px 10px",
        borderTop: "1px solid rgba(0,0,0,0.1)",
        alignItems: "center",
        userSelect: "none",
    },
    tdName: { minWidth: 0 },
    tdEmail: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontWeight: 800,
        color: "var(--muted, #a47856)",
    },
    tdActions: { display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start" },

    studentName: { fontWeight: 900, display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
    badgeInactive: {
        fontSize: 12,
        fontWeight: 900,
        padding: "2px 6px",
        border: "2px solid rgba(0,0,0,0.15)",
        background: "rgba(0,0,0,0.04)",
        whiteSpace: "nowrap",
    },
};

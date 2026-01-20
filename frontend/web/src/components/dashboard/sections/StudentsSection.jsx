import React, { useMemo, useState } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeTable from "../AwesomeTable.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import AwesomeToggle from "../AwesomeToggle.jsx";

export default function StudentsSection({
                                            students,
                                            onDeactivate,          // (classId, studentAccountId) => void
                                            onRemoveFromTeacher,   // (studentAccountId) => void  ✅ NEW
                                        }) {
    const [showInactive, setShowInactive] = useState(false);

    const filtered = useMemo(() => {
        const list = Array.isArray(students) ? students : [];
        if (showInactive) return list;
        return list.filter((s) => s.is_active === true);
    }, [students, showInactive]);

    return (
        <AwesomeCard
            title="Студенти"
            right={
                <AwesomeToggle
                    checked={showInactive}
                    onChange={setShowInactive}
                    label="Показати неактивних"
                />
            }
        >
            <div style={styles.note}>
                <div style={{ fontWeight: 900 }}>Що означають дії:</div>
                <div style={styles.noteLine}>
                    • <b>Видалити з класу</b> — деактивує студента тільки в конкретному класі (якщо клас є в рядку).
                </div>
                <div style={styles.noteLine}>
                    • <b>Видалити від викладача</b> — видаляє студента повністю: з усіх ваших класів і з вашого списку учнів.
                </div>
                <div style={styles.noteLine}>
                    • Рядки <b>Без класу</b> — це студенти, додані напряму до вас (teacher_students), ще не прив’язані до класу.
                </div>
            </div>

            <AwesomeTable
                columns={[
                    {
                        key: "student",
                        title: "Студент",
                        render: (r) => (
                            <div style={{ minWidth: 0 }}>
                                <div style={styles.nameLine}>
                                    <span style={styles.name}>
                                        {(r.first_name || r.last_name)
                                            ? `${r.first_name || ""} ${r.last_name || ""}`.trim()
                                            : "Без імені"}
                                    </span>
                                    {!r.is_active ? <span style={styles.badge}>неактивний</span> : null}
                                </div>
                                <div style={styles.sub}>{r.email}</div>
                            </div>
                        ),
                        style: { gridColumn: "span 1" },
                    },
                    {
                        key: "class_name",
                        title: "Клас",
                        render: (r) => {
                            const hasClass = !!r.class_id;
                            if (!hasClass) {
                                return (
                                    <div style={{ minWidth: 0 }}>
                                        <div style={styles.class}>— (без класу)</div>
                                        <div style={styles.sub}>Додано напряму до викладача</div>
                                    </div>
                                );
                            }

                            return (
                                <div style={{ minWidth: 0 }}>
                                    <div style={styles.class}>{r.class_name || "—"}</div>
                                    <div style={styles.sub}>
                                        ID: {String(r.class_id).slice(0, 8)}…
                                    </div>
                                </div>
                            );
                        },
                    },
                    {
                        key: "actions",
                        title: "Дії",
                        render: (r) => {
                            const hasClass = !!r.class_id;

                            return (
                                <div style={styles.actions}>
                                    {/* Remove from class only when class exists */}
                                    {hasClass ? (
                                        <AwesomeButton
                                            variant="danger"
                                            onClick={() => onDeactivate?.(r.class_id, r.student_account_id)}
                                        >
                                            Видалити з класу
                                        </AwesomeButton>
                                    ) : null}

                                    {/* Remove from teacher everywhere (always available if handler provided) */}
                                    {onRemoveFromTeacher ? (
                                        <AwesomeButton
                                            variant="danger"
                                            onClick={() => onRemoveFromTeacher?.(r.student_account_id)}
                                        >
                                            Видалити від викладача
                                        </AwesomeButton>
                                    ) : null}
                                </div>
                            );
                        },
                        style: { textAlign: "left" },
                    },
                ]}
                rows={filtered.map((s, idx) => ({
                    ...s,
                    id: `${s.class_id || "none"}-${s.student_account_id}-${idx}`,
                }))}
                emptyText="Немає студентів"
            />
        </AwesomeCard>
    );
}

const styles = {
    note: {
        padding: 10,
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(0,0,0,0.03)",
        fontWeight: 800,
        marginBottom: 10,
        lineHeight: 1.35,
    },
    noteLine: { marginTop: 4 },
    nameLine: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
    name: { fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    class: { fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    sub: { color: "var(--muted, #a47856)", fontWeight: 800, marginTop: 2 },
    badge: {
        fontSize: 12,
        fontWeight: 900,
        padding: "2px 6px",
        border: "2px solid rgba(0,0,0,0.15)",
        background: "rgba(0,0,0,0.04)",
        whiteSpace: "nowrap",
    },
    actions: {
        flexDirection: "row",
        display: "flex",
        justifyContent: "flex-start",
        gap: 8,
        flexWrap: "wrap",
    },
};

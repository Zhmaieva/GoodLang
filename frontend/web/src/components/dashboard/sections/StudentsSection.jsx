import React, { useMemo, useState } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeTable from "../AwesomeTable.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import AwesomeToggle from "../AwesomeToggle.jsx";

export default function StudentsSection({ students, onDeactivate }) {
    const [showInactive, setShowInactive] = useState(false);

    const filtered = useMemo(() => {
        if (showInactive) return students;
        return students.filter((s) => s.is_active === true);
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
                Тут видно студентів з усіх ваших класів. Видалення деактивує студента саме в тому класі, який показано в рядку.
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
                    {(r.first_name || r.last_name) ? `${r.first_name || ""} ${r.last_name || ""}`.trim() : "Без імені"}
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
                        render: (r) => (
                            <div style={{ minWidth: 0 }}>
                                <div style={styles.class}>{r.class_name}</div>
                                <div style={styles.sub}>ID: {String(r.class_id).slice(0, 8)}…</div>
                            </div>
                        ),
                    },
                    {
                        key: "actions",
                        title: "Дії",
                        render: (r) => (
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <AwesomeButton
                                    variant="danger"
                                    onClick={() => onDeactivate?.(r.class_id, r.student_account_id)}
                                >
                                    Видалити
                                </AwesomeButton>
                            </div>
                        ),
                        style: { textAlign: "right" },
                    },
                ]}
                rows={filtered.map((s, idx) => ({ ...s, id: `${s.class_id}-${s.student_account_id}-${idx}` }))}
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
};

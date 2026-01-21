import React, { useMemo, useState } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeTable from "../AwesomeTable.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import AwesomeToggle from "../AwesomeToggle.jsx";

function norm(v) {
    return String(v || "").trim().toLowerCase();
}

export default function StudentsSection({
                                            students,
                                            onDeactivate,          // (classId, studentAccountId) => void
                                            onRemoveFromTeacher,   // (studentAccountId) => void
                                        }) {
    const [showInactive, setShowInactive] = useState(false);

    // ✅ one input for everything (email/name/class)
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const list = Array.isArray(students) ? students : [];

        // 1) inactive filter
        const base = showInactive ? list : list.filter((s) => s.is_active === true);

        // 2) text search across multiple fields
        const q = norm(query);
        if (!q) return base;

        const tokens = q.split(/\s+/).filter(Boolean);

        return base.filter((s) => {
            const email = norm(s.email);
            const first = norm(s.first_name);
            const last = norm(s.last_name);
            const className = norm(s.class_name);

            // special: "no class" searching
            const hasClass = !!s.class_id;
            const noClassHay = hasClass ? "" : "без класу no class none teacher direct";

            const hay = `${email} ${first} ${last} ${className} ${noClassHay}`.trim();

            // AND-match tokens (more useful than OR)
            return tokens.every((t) => hay.includes(t));
        });
    }, [students, showInactive, query]);

    const total = Array.isArray(students) ? students.length : 0;
    const shown = filtered.length;

    return (
        <AwesomeCard
            title="Студенти"
            right={
                <div style={styles.rightControls}>
                    <AwesomeToggle
                        checked={showInactive}
                        onChange={setShowInactive}
                        label="Показати неактивних"
                    />
                </div>
            }
        >
            {/* ✅ Search input */}
            <div style={styles.searchRow}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Пошук: email / ім’я / прізвище / клас (напр. ‘gmail’, ‘ivan’, ‘A1’, ‘без класу’)"
                    style={styles.searchInput}
                />
                {query ? (
                    <AwesomeButton variant="ghost" onClick={() => setQuery("")} title="Очистити">
                        Очистити
                    </AwesomeButton>
                ) : null}
            </div>

            <div style={styles.metaLine}>
                Показано: <b>{shown}</b> з <b>{total}</b>
            </div>

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
                storageKey="teacher_students_table_sort_v1"
                columns={[
                    {
                        key: "last_name",
                        title: "Прізвище",
                        sortable: true,
                        sortType: "string",
                        size: 1,
                        render: (r) => (
                            <div style={{ minWidth: 0 }}>
                                <div style={styles.nameLine}>
                                    <span style={styles.name}>
                                        {r.last_name ? String(r.last_name).trim() : "—"}
                                    </span>
                                    {!r.is_active ? <span style={styles.badge}>неактивний</span> : null}
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: "first_name",
                        title: "Ім'я",
                        sortable: true,
                        sortType: "string",
                        size: 1,
                        render: (r) => (
                            <div style={{ minWidth: 0 }}>
                                <div style={styles.nameLine}>
                                    <span style={styles.name}>
                                        {r.first_name ? String(r.first_name).trim() : "—"}
                                    </span>
                                    {!r.is_active ? <span style={styles.badge}>неактивний</span> : null}
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: "email",
                        title: "Ел. адреса",
                        size: 2,
                        sortable: true,
                        sortType: "string",
                        render: (r) => (
                            <div style={{ minWidth: 0 }}>
                                <div style={styles.nameLine}>
                                    <span style={styles.name}>{r.email}</span>
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: "class_name",
                        title: "Клас",
                        size: 2,
                        sortable: true,
                        sortType: "string",
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
                                </div>
                            );
                        },
                    },
                    {
                        key: "actions",
                        title: "Дії",
                        size: 1,
                        sortable: false,
                        render: (r) => {
                            const hasClass = !!r.class_id;

                            return (
                                <div style={styles.actions}>
                                    {onRemoveFromTeacher ? (
                                        <AwesomeButton
                                            variant="danger"
                                            onClick={() => onRemoveFromTeacher?.(r.student_account_id)}
                                        >
                                            Видалити з усіх класів
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
    rightControls: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },

    searchRow: {
        display: "flex",
        gap: 10,
        alignItems: "center",
        marginBottom: 10,
        flexWrap: "wrap",
    },

    searchInput: {
        flex: "1 1 420px",
        minWidth: 240,
        padding: "10px 12px",
        fontWeight: 800,
        border: "2px solid rgba(0,0,0,0.18)",
        outline: "none",
        background: "rgba(255,255,255,0.9)",
        color: "var(--text, #3a2a1d)",
    },

    metaLine: {
        marginBottom: 10,
        color: "var(--muted, #a47856)",
        fontWeight: 800,
    },

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

// TeacherHomeworkPage.jsx — FULL DROP-IN
import React, { useEffect, useMemo, useState } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import AwesomeTable from "../AwesomeTable.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

import {
    apiTeacherTaskSets,
    apiTeacherTaskSetTasks,
    apiTeacherTaskSetAnswers,
} from "../../../services/api.js";

import CreateHomeworkModal from "../modals/CreateHomeworkModal.jsx";

function norm(v) {
    return String(v || "").trim().toLowerCase();
}

export default function TeacherHomeworkPage() {
    const { classes, students, loadClassStudents } = useTeacherDashboard(); // keep existing context logic :contentReference[oaicite:5]{index=5}

    // ---- task sets (teacher)
    const [setsLoading, setSetsLoading] = useState(true);
    const [setsErr, setSetsErr] = useState("");
    const [taskSets, setTaskSets] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);

    const [selectedSetId, setSelectedSetId] = useState(null);
    const selectedSet = useMemo(
        () => (taskSets || []).find((s) => String(s.taskSetId || s._id) === String(selectedSetId)) || null,
        [taskSets, selectedSetId]
    );

    // ---- selected student within a set (teacher view)
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    // bottom panel data (tasks + answers)
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsErr, setDetailsErr] = useState("");
    const [setTasks, setSetTasks] = useState([]);
    const [studentAnswers, setStudentAnswers] = useState([]);

    // modal
    const [createOpen, setCreateOpen] = useState(false);

    // optional confirm modal for future destructive actions
    const [confirm, setConfirm] = useState({ open: false });

    async function loadSets({ cursor } = {}) {
        setSetsLoading(true);
        setSetsErr("");
        try {
            const data = await apiTeacherTaskSets({
                limit: 10,
                cursor: cursor || undefined,
            });

            const items = Array.isArray(data?.items) ? data.items : [];
            setTaskSets(items);
            setNextCursor(data?.nextCursor || null);

            // keep selection stable
            if (!selectedSetId && items.length) {
                const firstId = items[0]?.taskSetId || items[0]?._id || null;
                if (firstId) setSelectedSetId(String(firstId));
            } else if (selectedSetId && !items.some((x) => String(x.taskSetId || x._id) === String(selectedSetId))) {
                // if current selected disappeared, reset
                const firstId = items[0]?.taskSetId || items[0]?._id || null;
                setSelectedSetId(firstId ? String(firstId) : null);
                setSelectedStudentId(null);
            }
        } catch (e) {
            setSetsErr(e?.message || "Не вдалося завантажити домашні завдання");
        } finally {
            setSetsLoading(false);
        }
    }

    useEffect(() => {
        loadSets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // when teacher selects a student row → load tasks + answers
    async function loadStudentSetDetails({ taskSetId, studentId }) {
        if (!taskSetId || !studentId) return;
        setDetailsLoading(true);
        setDetailsErr("");
        try {
            const [tasksRes, ansRes] = await Promise.all([
                apiTeacherTaskSetTasks(taskSetId),
                apiTeacherTaskSetAnswers(taskSetId, { studentId }),
            ]);

            setSetTasks(Array.isArray(tasksRes?.tasks) ? tasksRes.tasks : []);
            setStudentAnswers(Array.isArray(ansRes?.answers) ? ansRes.answers : []);

            // best-effort: ensure class students are loaded for selected student's class,
            // so class labels remain consistent (does not break any logic) :contentReference[oaicite:6]{index=6}
            const row = (students || []).find((s) => String(s.student_account_id) === String(studentId));
            if (row?.class_id) {
                await loadClassStudents?.(row.class_id);
            }
        } catch (e) {
            setDetailsErr(e?.message || "Не вдалося завантажити деталі студента");
            setSetTasks([]);
            setStudentAnswers([]);
        } finally {
            setDetailsLoading(false);
        }
    }

    const mergedTasks = useMemo(() => {
        const ansByTaskId = new Map();
        for (const a of studentAnswers || []) {
            const key = String(a.taskId || a.task_id || "");
            if (key) ansByTaskId.set(key, a);
        }

        return (setTasks || []).map((t, idx) => {
            const taskId = String(t.taskId || t._id || "");
            const a = ansByTaskId.get(taskId) || null;

            return {
                id: taskId || `row-${idx}`,
                taskOrderNumber: t.taskOrderNumber ?? idx + 1,
                taskType: t.taskType || "translation",
                ruleIds: Array.isArray(t.ruleIds) ? t.ruleIds : [],
                textToTranslate: t.textToTranslate,
                options: t.options,
                // answer fields (may be missing until you implement saving)
                userTranslation: a?.userTranslation ?? null,
                isAnswerCorrect: a?.isAnswerCorrect ?? null,
                correctAnswer: a?.correctAnswer ?? null,
                tipIfWrong: a?.tipIfWrong ?? null,
            };
        });
    }, [setTasks, studentAnswers]);

    const selectedSetStudents = useMemo(() => {
        const list = Array.isArray(selectedSet?.students) ? selectedSet.students : [];
        // ensure stable shape
        return list.map((x, idx) => ({
            id: `${x.studentId || x.userId || "student"}-${idx}`,
            studentId: x.studentId || x.userId,
            studentName: x.studentName || x.name || null,
            answeredCount: Number(x.answeredCount ?? 0),
            totalTasks: Number(x.totalTasks ?? selectedSet?.totalTasks ?? 0),
            completionRatio: Number(x.completionRatio ?? 0),
        }));
    }, [selectedSet]);

    const selectedStudentRow = useMemo(() => {
        if (!selectedStudentId) return null;
        const fromContext = (students || []).find((s) => String(s.student_account_id) === String(selectedStudentId)) || null;
        return fromContext;
    }, [students, selectedStudentId]);

    const bottomTitle = useMemo(() => {
        if (!selectedStudentRow) return "Відповіді студента";
        const nm = [selectedStudentRow.first_name, selectedStudentRow.last_name].filter(Boolean).join(" ").trim();
        const label = nm || selectedStudentRow.email || "Студент";
        return `Відповіді: ${label}`;
    }, [selectedStudentRow]);

    return (
        <div style={styles.page}>
            <div style={styles.grid}>
                {/* LEFT: sets list */}
                <div style={styles.left}>
                    <AwesomeCard
                        title="Домашні завдання"
                        right={
                            <AwesomeButton onClick={() => setCreateOpen(true)}>
                                Додати домашнє завдання
                            </AwesomeButton>
                        }
                    >
                        {setsErr ? <div style={styles.err}>{setsErr}</div> : null}
                        {setsLoading ? <div style={styles.muted}>Завантаження…</div> : null}

                        <div style={{ marginTop: 8 }}>
                            {(taskSets || []).length ? (
                                <div style={styles.setList}>
                                    {taskSets.map((s) => {
                                        const id = String(s.taskSetId || s._id || "");
                                        const active = String(selectedSetId) === id;

                                        const title = s.title || "—";
                                        const setType = s.setType || "homework";
                                        const createdAt = s.createdAt ? new Date(s.createdAt).toLocaleString() : "";
                                        const deadline = s.deadline ? new Date(s.deadline).toLocaleDateString() : null;

                                        const totalTasks = Number(s.totalTasks ?? 0);

                                        return (
                                            <div
                                                key={id}
                                                onClick={() => {
                                                    setSelectedSetId(id);
                                                    setSelectedStudentId(null);
                                                    setSetTasks([]);
                                                    setStudentAnswers([]);
                                                    setDetailsErr("");
                                                }}
                                                style={{
                                                    ...styles.setItem,
                                                    ...(active ? styles.setItemActive : null),
                                                }}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <div style={styles.setTop}>
                                                    <div style={styles.setTitle}>{title}</div>
                                                    <div style={styles.badgesRow}>
                                                        <span style={styles.badge}>{setType}</span>
                                                        <span style={styles.badge}>{totalTasks} задач</span>
                                                        {deadline ? <span style={styles.badgeAccent}>до {deadline}</span> : null}
                                                    </div>
                                                </div>
                                                <div style={styles.setMeta}>{createdAt}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={styles.muted}>Поки що немає жодного домашнього завдання.</div>
                            )}
                        </div>

                        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <AwesomeButton
                                variant="ghost"
                                onClick={() => loadSets()}
                                disabled={setsLoading}
                            >
                                Оновити
                            </AwesomeButton>

                            {nextCursor ? (
                                <AwesomeButton
                                    variant="ghost"
                                    onClick={() => loadSets({ cursor: nextCursor })}
                                    disabled={setsLoading}
                                    title="Показати наступні 10"
                                >
                                    Далі →
                                </AwesomeButton>
                            ) : null}
                        </div>
                    </AwesomeCard>
                </div>

                {/* RIGHT: selected set details */}
                <div style={styles.right}>
                    <AwesomeCard
                        title={selectedSet ? selectedSet.title || "Деталі домашнього завдання" : "Деталі"}
                        right={
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                <AwesomeButton
                                    variant="ghost"
                                    onClick={() => setCreateOpen(true)}
                                >
                                    Додати домашнє завдання
                                </AwesomeButton>
                            </div>
                        }
                    >
                        {!selectedSet ? (
                            <div style={styles.muted}>Оберіть домашнє завдання зліва.</div>
                        ) : (
                            <>
                                <div style={styles.setDetailsTop}>
                                    <div style={styles.metaBlock}>
                                        <div style={styles.metaLabel}>Дедлайн</div>
                                        <div style={styles.metaValue}>
                                            {selectedSet.deadline ? new Date(selectedSet.deadline).toLocaleString() : "—"}
                                        </div>
                                    </div>

                                    <div style={styles.metaBlock}>
                                        <div style={styles.metaLabel}>Тип</div>
                                        <div style={styles.metaValue}>{selectedSet.setType || "homework"}</div>
                                    </div>

                                    <div style={styles.metaBlock}>
                                        <div style={styles.metaLabel}>Задач</div>
                                        <div style={styles.metaValue}>{Number(selectedSet.totalTasks ?? 0)}</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 10 }}>
                                    <div style={styles.hint}>
                                        Натисніть на студента, щоб внизу побачити конкретні задачі та (пізніше) відповіді.
                                    </div>

                                    <AwesomeTable
                                        storageKey="teacher_homework_students_sort_v1"
                                        columns={[
                                            {
                                                key: "studentName",
                                                title: "Студент",
                                                size: 2,
                                                sortable: true,
                                                sortType: "string",
                                                render: (r) => {
                                                    const sid = r.studentId;
                                                    const active = String(selectedStudentId) === String(sid);
                                                    return (
                                                        <div style={{ minWidth: 0 }}>
                                                            <div style={{ ...styles.studentNameLine, ...(active ? styles.studentNameLineActive : null) }}>
                                <span style={styles.studentNameText}>
                                  {r.studentName || studentNameFromContext(students, sid) || sid || "—"}
                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            },
                                            {
                                                key: "completion",
                                                title: "Виконано",
                                                size: 1,
                                                sortable: true,
                                                sortType: "number",
                                                render: (r) => {
                                                    const a = Number(r.answeredCount ?? 0);
                                                    const t = Number(r.totalTasks ?? 0);
                                                    return (
                                                        <div style={{ fontWeight: 900 }}>
                                                            {a} / {t}
                                                        </div>
                                                    );
                                                },
                                            },
                                            {
                                                key: "ratio",
                                                title: "%",
                                                size: 1,
                                                sortable: true,
                                                sortType: "number",
                                                render: (r) => {
                                                    const ratio = Number.isFinite(r.completionRatio) ? r.completionRatio : safeRatio(r.answeredCount, r.totalTasks);
                                                    return (
                                                        <div style={styles.ratioCell}>
                                                            <div style={styles.ratioNum}>{Math.round(ratio * 100)}%</div>
                                                            <div style={styles.ratioBarWrap}>
                                                                <div style={{ ...styles.ratioBar, width: `${Math.max(0, Math.min(100, Math.round(ratio * 100)))}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            },
                                            {
                                                key: "open",
                                                title: "Дії",
                                                size: 1,
                                                sortable: false,
                                                render: (r) => (
                                                    <AwesomeButton
                                                        variant="ghost"
                                                        onClick={async () => {
                                                            const sid = r.studentId;
                                                            setSelectedStudentId(String(sid));
                                                            await loadStudentSetDetails({ taskSetId: selectedSet.taskSetId || selectedSet._id, studentId: sid });
                                                        }}
                                                    >
                                                        Відкрити
                                                    </AwesomeButton>
                                                ),
                                            },
                                        ]}
                                        rows={selectedSetStudents.map((x, idx) => ({
                                            ...x,
                                            id: x.id || `${x.studentId}-${idx}`,
                                        }))}
                                        emptyText="Немає призначених студентів"
                                        onRowClick={async (row) => {
                                            const sid = row?.studentId;
                                            if (!sid) return;
                                            setSelectedStudentId(String(sid));
                                            await loadStudentSetDetails({ taskSetId: selectedSet.taskSetId || selectedSet._id, studentId: sid });
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </AwesomeCard>
                </div>
            </div>

            {/* BOTTOM: student task list + answers */}
            <div style={{ marginTop: 14 }}>
                <AwesomeCard title={bottomTitle}>
                    {!selectedSet || !selectedStudentId ? (
                        <div style={styles.muted}>Оберіть домашнє завдання та студента.</div>
                    ) : (
                        <>
                            {detailsErr ? <div style={styles.err}>{detailsErr}</div> : null}
                            {detailsLoading ? <div style={styles.muted}>Завантаження…</div> : null}

                            {!detailsLoading ? (
                                <AwesomeTable
                                    storageKey="teacher_homework_student_tasks_sort_v1"
                                    columns={[
                                        { key: "taskOrderNumber", title: "#", size: 0.6, sortable: true, sortType: "number" },
                                        {
                                            key: "taskType",
                                            title: "Тип",
                                            size: 1,
                                            sortable: true,
                                            sortType: "string",
                                            render: (r) => <span style={styles.badge}>{r.taskType}</span>,
                                        },
                                        {
                                            key: "textToTranslate",
                                            title: "Завдання",
                                            size: 3,
                                            sortable: false,
                                            render: (r) => (
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={styles.taskText}>{r.textToTranslate || "—"}</div>
                                                    {Array.isArray(r.options) && r.options.length ? (
                                                        <div style={styles.taskSub}>
                                                            Вибір: <b>{r.options.join(" / ")}</b>
                                                        </div>
                                                    ) : null}
                                                    {Array.isArray(r.ruleIds) && r.ruleIds.length ? (
                                                        <div style={styles.taskSub}>
                                                            Правила: <b>{r.ruleIds.join(", ")}</b>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ),
                                        },
                                        {
                                            key: "userTranslation",
                                            title: "Відповідь",
                                            size: 2,
                                            sortable: false,
                                            render: (r) => (
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={styles.answerText}>{r.userTranslation || "—"}</div>
                                                    {r.isAnswerCorrect === true ? (
                                                        <div style={styles.ok}>✅ правильно</div>
                                                    ) : r.isAnswerCorrect === false ? (
                                                        <div style={styles.bad}>❌ помилка</div>
                                                    ) : (
                                                        <div style={styles.muted}>ще не виконано</div>
                                                    )}
                                                    {r.correctAnswer ? (
                                                        <div style={styles.taskSub}>Правильно: <b>{r.correctAnswer}</b></div>
                                                    ) : null}
                                                    {r.tipIfWrong ? (
                                                        <div style={styles.tip}>Підказка: {String(r.tipIfWrong)}</div>
                                                    ) : null}
                                                </div>
                                            ),
                                        },
                                    ]}
                                    rows={mergedTasks}
                                    emptyText="Немає задач у цьому наборі"
                                />
                            ) : null}
                        </>
                    )}
                </AwesomeCard>
            </div>

            {/* Create modal */}
            <CreateHomeworkModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={async () => {
                    setCreateOpen(false);
                    await loadSets();
                }}
            />

            <ConfirmModal
                open={!!confirm?.open}
                title={confirm?.title}
                text={confirm?.text}
                confirmText={confirm?.confirmText}
                onCancel={() => setConfirm({ open: false })}
                onConfirm={confirm?.onConfirm}
            />
        </div>
    );
}

function safeRatio(a, t) {
    const A = Number(a ?? 0);
    const T = Number(t ?? 0);
    if (!T) return 0;
    return Math.max(0, Math.min(1, A / T));
}

function studentNameFromContext(students, studentId) {
    const s = (students || []).find((x) => String(x.student_account_id) === String(studentId));
    if (!s) return null;
    const nm = [s.first_name, s.last_name].filter(Boolean).join(" ").trim();
    return nm || s.email || null;
}

const styles = {
    page: { display: "block" },

    grid: {
        display: "grid",
        gridTemplateColumns: "420px 1fr",
        gap: 14,
        alignItems: "start",
    },

    left: { minWidth: 0 },
    right: { minWidth: 0 },

    muted: { color: "var(--muted, #a47856)", fontWeight: 800, lineHeight: 1.35 },

    err: {
        marginTop: 8,
        padding: 10,
        border: "2px solid rgba(255,0,0,0.25)",
        background: "rgba(255,0,0,0.06)",
        fontWeight: 900,
    },

    setList: { display: "flex", flexDirection: "column", gap: 8 },

    setItem: {
        padding: 10,
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.65)",
        cursor: "pointer",
        userSelect: "none",
    },
    setItemActive: {
        border: "3px solid var(--accent, #ff6138)",
        background: "rgba(255,255,255,0.92)",
    },

    setTop: { display: "flex", flexDirection: "column", gap: 6 },
    setTitle: { fontWeight: 900, lineHeight: 1.2 },
    setMeta: { marginTop: 6, fontWeight: 800, color: "var(--muted, #a47856)", fontSize: 12 },

    badgesRow: { display: "flex", gap: 8, flexWrap: "wrap" },
    badge: {
        fontSize: 12,
        fontWeight: 900,
        padding: "2px 6px",
        border: "2px solid rgba(0,0,0,0.15)",
        background: "rgba(0,0,0,0.04)",
        whiteSpace: "nowrap",
    },
    badgeAccent: {
        fontSize: 12,
        fontWeight: 900,
        padding: "2px 6px",
        border: "2px solid rgba(0,0,0,0.18)",
        background: "rgba(255,97,56,0.10)",
        whiteSpace: "nowrap",
    },

    setDetailsTop: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        marginTop: 6,
    },
    metaBlock: {
        padding: 10,
        border: "2px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.6)",
    },
    metaLabel: { fontWeight: 900, color: "var(--muted, #a47856)", marginBottom: 4 },
    metaValue: { fontWeight: 900 },

    hint: {
        marginBottom: 10,
        padding: 10,
        border: "2px solid rgba(0,0,0,0.10)",
        background: "rgba(0,0,0,0.03)",
        fontWeight: 800,
        lineHeight: 1.35,
        color: "var(--muted, #a47856)",
    },

    studentNameLine: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
    studentNameLineActive: { color: "var(--accent, #ff6138)" },
    studentNameText: { fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

    ratioCell: { display: "flex", flexDirection: "column", gap: 6 },
    ratioNum: { fontWeight: 900 },
    ratioBarWrap: { height: 10, border: "2px solid rgba(0,0,0,0.15)", background: "rgba(0,0,0,0.03)" },
    ratioBar: { height: "100%", background: "var(--accent, #ff6138)" },

    taskText: { fontWeight: 900, lineHeight: 1.25 },
    taskSub: { marginTop: 4, fontWeight: 800, color: "var(--muted, #a47856)" },

    answerText: { fontWeight: 900, lineHeight: 1.25 },
    ok: { marginTop: 4, fontWeight: 900 },
    bad: { marginTop: 4, fontWeight: 900 },
    tip: {
        marginTop: 6,
        padding: 8,
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(0,0,0,0.03)",
        fontWeight: 800,
        lineHeight: 1.35,
    },
};

import React, { useEffect, useMemo, useState } from "react";
import AwesomeGrid from "../dashboard/AwesomeGrid.jsx";
import AwesomeCard from "../dashboard/AwesomeCard.jsx";
import AwesomeButton from "../dashboard/AwesomeButton.jsx";
import { callManageSubscriptionApi } from "../../services/api.js"; // existing :contentReference[oaicite:1]{index=1}
import {
    apiTeacherMetadata,
    apiTeacherClasses,
    apiTeacherStudents,
    apiCreateClass,
    apiClassStudents,
    apiAddStudentToClass,
    apiDeactivateStudentInClass,
    apiRegenerateInviteCode,
} from "../../services/api.js";
import ClassesSection from "../dashboard/sections/ClassesSection.jsx";
import StudentsSection from "../dashboard/sections/StudentsSection.jsx";
import AddClassModal from "../dashboard/modals/AddClassModal.jsx";
import AddStudentModal from "../dashboard/modals/AddStudentModal.jsx";
import ConfirmModal from "../dashboard/modals/ConfirmModal.jsx";

export default function TeacherDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [teacher, setTeacher] = useState(null);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);

    const [expandedClassId, setExpandedClassId] = useState(null);
    const [classStudentsMap, setClassStudentsMap] = useState({}); // classId -> rows
    const [classStudentsLoading, setClassStudentsLoading] = useState({}); // classId -> bool

    const [addClassOpen, setAddClassOpen] = useState(false);
    const [addStudentOpen, setAddStudentOpen] = useState(false);
    const [addStudentClassId, setAddStudentClassId] = useState(null);

    const [confirm, setConfirm] = useState({ open: false });

    const activeStudentsCount = Number(teacher?.active_students ?? 0);
    const quota = Number(teacher?.students_quota ?? 0);
    const isPro = teacher?.status === "pro";
    const canAddStudents = isPro && quota > 0 && activeStudentsCount < quota;

    const quotaText = useMemo(() => {
        if (!teacher) return "";
        if (!isPro) return "План: FREE (додавання студентів недоступне)";
        if (quota <= 0) return "План: PRO (квота студентів: 0 — зверніться в підтримку)";
        return `План: PRO • Активні студенти: ${activeStudentsCount} / ${quota}`;
    }, [teacher, isPro, quota, activeStudentsCount]);

    async function reloadAll() {
        setLoading(true);
        setErr("");
        try {
            const [t, c, s] = await Promise.all([
                apiTeacherMetadata(),
                apiTeacherClasses(),
                apiTeacherStudents(),
            ]);
            setTeacher(t);
            setClasses(c?.classes || []);
            setStudents(s?.students || []);
        } catch (e) {
            setErr(e?.message || "Щось пішло не так");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reloadAll();
    }, []);

    async function loadClassStudents(classId) {
        setClassStudentsLoading((m) => ({ ...m, [classId]: true }));
        try {
            const data = await apiClassStudents(classId, "all");
            setClassStudentsMap((m) => ({ ...m, [classId]: data?.students || [] }));
        } catch (e) {
            setErr(e?.message || "Не вдалося завантажити студентів класу");
        } finally {
            setClassStudentsLoading((m) => ({ ...m, [classId]: false }));
        }
    }

    async function onToggleExpandClass(classId) {
        setExpandedClassId((prev) => (prev === classId ? null : classId));
        const already = classStudentsMap[classId];
        if (!already) await loadClassStudents(classId);
    }

    async function onCreateClass(name) {
        try {
            const created = await apiCreateClass(name);
            setAddClassOpen(false);
            // refresh classes
            const c = await apiTeacherClasses();
            setClasses(c?.classes || []);
            // keep teacher meta in sync
            const t = await apiTeacherMetadata();
            setTeacher(t);
            return created;
        } catch (e) {
            throw e;
        }
    }

    async function onRegenerateInviteCode(classId) {
        try {
            await apiRegenerateInviteCode(classId);
            const c = await apiTeacherClasses();
            setClasses(c?.classes || []);
        } catch (e) {
            setErr(e?.message || "Не вдалося оновити код запрошення");
        }
    }

    async function onAddStudent(classId, payload) {
        try {
            const result = await apiAddStudentToClass(classId, payload);
            setAddStudentOpen(false);

            // refresh teacher meta, students lists, and class students
            const [t, s] = await Promise.all([apiTeacherMetadata(), apiTeacherStudents()]);
            setTeacher(t);
            setStudents(s?.students || []);

            // update expanded class list if needed
            await loadClassStudents(classId);

            return result;
        } catch (e) {
            // friendly message for quota / plan errors
            if (e?.status === 403) {
                throw new Error(e?.message || "Дія заборонена");
            }
            throw e;
        }
    }

    async function onDeactivateStudent(classId, studentAccountId) {
        try {
            await apiDeactivateStudentInClass(classId, studentAccountId);

            // refresh both global list + class list + meta
            const [t, s] = await Promise.all([apiTeacherMetadata(), apiTeacherStudents()]);
            setTeacher(t);
            setStudents(s?.students || []);
            await loadClassStudents(classId);
        } catch (e) {
            setErr(e?.message || "Не вдалося видалити студента");
        }
    }

    async function onManageSubscription() {
        try {
            const { url } = await callManageSubscriptionApi(); // :contentReference[oaicite:2]{index=2}
            if (url) window.location.href = url;
            else setErr("Немає посилання для керування підпискою");
        } catch (e) {
            setErr(e?.message || "Не вдалося відкрити керування підпискою");
        }
    }

    const headerRight = (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <AwesomeButton variant="ghost" onClick={reloadAll} disabled={loading}>
                Оновити
            </AwesomeButton>
            <AwesomeButton onClick={onManageSubscription} title="Поки що заглушка">
                Керувати підпискою
            </AwesomeButton>
        </div>
    );

    return (
        <div style={styles.page}>
            <AwesomeCard
                title="Панель викладача"
                right={headerRight}
                style={{ marginBottom: 14 }}
            >
                <div style={styles.metaRow}>
                    <div style={styles.metaItem}>
                        <div style={styles.metaLabel}>Статус</div>
                        <div style={styles.metaValue}>{quotaText || "—"}</div>
                    </div>

                    <div style={styles.metaItem}>
                        <div style={styles.metaLabel}>Підказка</div>
                        <div style={styles.metaValue}>
                            Класи можна розгортати, щоб бачити студентів. Додавайте/видаляйте студентів з підтвердженням.
                        </div>
                    </div>
                </div>

                {err ? <div style={styles.error}>{err}</div> : null}
                {loading ? <div style={styles.muted}>Завантаження…</div> : null}
            </AwesomeCard>

            <AwesomeGrid
                left={
                    <ClassesSection
                        classes={classes}
                        expandedClassId={expandedClassId}
                        onToggleExpand={onToggleExpandClass}
                        classStudentsMap={classStudentsMap}
                        classStudentsLoading={classStudentsLoading}
                        canAddStudents={canAddStudents}
                        isPro={isPro}
                        quota={quota}
                        activeStudentsCount={activeStudentsCount}
                        onAddClass={() => setAddClassOpen(true)}
                        onAddStudent={(classId) => {
                            setAddStudentClassId(classId);
                            setAddStudentOpen(true);
                        }}
                        onRegenerateInviteCode={onRegenerateInviteCode}
                        onDeactivate={(classId, studentId) => {
                            setConfirm({
                                open: true,
                                title: "Видалити студента?",
                                text: "Студент стане неактивним у цьому класі. Якщо він не активний в інших класах — статус акаунта буде відновлено.",
                                confirmText: "Видалити",
                                onConfirm: async () => {
                                    setConfirm({ open: false });
                                    await onDeactivateStudent(classId, studentId);
                                },
                            });
                        }}
                    />
                }
                right={
                    <StudentsSection
                        students={students}
                        canAddStudents={canAddStudents}
                        onDeactivate={(classId, studentId) => {
                            setConfirm({
                                open: true,
                                title: "Видалити студента з класу?",
                                text: "Це деактивує студента в конкретному класі (див. назву класу у рядку).",
                                confirmText: "Видалити",
                                onConfirm: async () => {
                                    setConfirm({ open: false });
                                    await onDeactivateStudent(classId, studentId);
                                },
                            });
                        }}
                    />
                }
            />

            <AddClassModal
                open={addClassOpen}
                onClose={() => setAddClassOpen(false)}
                onCreate={onCreateClass}
            />

            <AddStudentModal
                open={addStudentOpen}
                onClose={() => setAddStudentOpen(false)}
                classId={addStudentClassId}
                canAddStudents={canAddStudents}
                isPro={isPro}
                quota={quota}
                activeStudentsCount={activeStudentsCount}
                onAdd={onAddStudent}
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

const styles = {
    page: {
        padding: 14,
        background: "var(--bg, #fff3df)",
        color: "var(--text, #3a2a1d)",
        minHeight: "100vh",
    },
    metaRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
    },
    metaItem: {
        border: "2px solid rgba(0,0,0,0.12)",
        padding: 12,
        background: "rgba(255,255,255,0.6)",
    },
    metaLabel: {
        fontWeight: 900,
        marginBottom: 4,
    },
    metaValue: {
        color: "var(--text, #3a2a1d)",
        lineHeight: 1.35,
    },
    error: {
        marginTop: 10,
        padding: 10,
        border: "2px solid rgba(255,0,0,0.25)",
        background: "rgba(255,0,0,0.06)",
        fontWeight: 800,
    },
    muted: {
        marginTop: 10,
        color: "var(--muted, #a47856)",
        fontWeight: 800,
    },
};

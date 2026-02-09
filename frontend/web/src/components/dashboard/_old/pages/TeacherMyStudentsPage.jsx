// TeacherMyStudentsPage.jsx — FULL DROP-IN
import React, { useState } from "react";
import StudentsSection from "../sections/StudentsSection.jsx";
import AddStudentModal from "../modals/AddStudentModal.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import AwesomeCard from "../AwesomeCard.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function TeacherMyStudentsPage() {
    const {
        students,
        onAddStudent,
        onDeactivateStudent,
        canAddStudents,
        isTeacherPlus,
        quota,
        activeStudentsCount,
    } = useTeacherDashboard();

    const [addOpen, setAddOpen] = useState(false);
    const [confirm, setConfirm] = useState({ open: false });

    return (
        <div>
            <AwesomeCard
                title="Мої учні"
                right={
                    <AwesomeButton
                        onClick={() => setAddOpen(true)}
                        disabled={!canAddStudents}
                    >
                        Додати (без класу)
                    </AwesomeButton>
                }
                style={{ marginBottom: 14 }}
            >
                <div style={styles.hint}>
                    Тут можна додати учня під себе (без класу), а потім додавати в будь-які ваші класи.
                </div>
            </AwesomeCard>

            <StudentsSection
                students={students}
                onDeactivate={(classId, studentId) => {
                    setConfirm({
                        open: true,
                        title: "Видалити учня з класу?",
                        text: "Це деактивує учня тільки в конкретному класі (див. назву класу у рядку).",
                        confirmText: "Видалити",
                        onConfirm: async () => {
                            setConfirm({ open: false });
                            await onDeactivateStudent(classId, studentId);
                        },
                    });
                }}
                onRemoveFromTeacher={(studentId) => {
                    setConfirm({
                        open: true,
                        title: "Видалити учня від викладача?",
                        text: "Учень буде видалений від вас повністю: з усіх ваших класів і з вашого списку учнів.",
                        confirmText: "Видалити повністю",
                        onConfirm: async () => {
                            setConfirm({ open: false });
                            await onDeactivateStudent("teacher", studentId);
                        },
                    });
                }}
            />

            <AddStudentModal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                classId="none"
                canAddStudents={canAddStudents}
                isTeacherPlus={isTeacherPlus}
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
    hint: {
        fontWeight: 800,
        lineHeight: 1.35,
        color: "var(--muted, #a47856)",
    },
};

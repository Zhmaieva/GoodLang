// TeacherMyStudentsPage.jsx
import React, { useState } from "react";
import StudentsSection from "../sections/StudentsSection.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function TeacherMyStudentsPage() {
    const { students, onDeactivateStudent } = useTeacherDashboard();
    const [confirm, setConfirm] = useState({ open: false });

    return (
        <div>
            <StudentsSection
                students={students}
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

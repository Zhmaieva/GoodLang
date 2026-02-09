// TeacherMyClassesPage.jsx — FULL DROP-IN
import React, { useState } from "react";
import ClassesSection from "../sections/ClassesSection.jsx";
import AddClassModal from "../modals/AddClassModal.jsx";
import AddStudentModal from "../modals/AddStudentModal.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

export default function TeacherMyClassesPage() {
    const {
        classes,
        expandedClassId,
        onToggleExpandClass,
        loadClassStudents, // ✅ MUST exist in context now
        classStudentsMap,
        classStudentsLoading,
        onCreateClass,
        onAddStudent,
        onRegenerateInviteCode,
        onDeactivateStudent,
        canAddStudents,
        // support both versions to avoid breaking
        isPro,
        isTeacherPlus,
        quota,
        activeStudentsCount,
    } = useTeacherDashboard();

    const [addClassOpen, setAddClassOpen] = useState(false);
    const [addStudentOpen, setAddStudentOpen] = useState(false);
    const [addStudentClassId, setAddStudentClassId] = useState(null);
    const [confirm, setConfirm] = useState({ open: false });

    return (
        <div>
            <ClassesSection
                classes={classes}
                expandedClassId={expandedClassId}
                onToggleExpand={onToggleExpandClass}
                loadClassStudents={loadClassStudents}
                classStudentsMap={classStudentsMap}
                classStudentsLoading={classStudentsLoading}
                canAddStudents={canAddStudents}
                isPro={isPro}
                isTeacherPlus={isTeacherPlus}
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
                        text: "Студент стане неактивним у цьому класі.",
                        confirmText: "Видалити",
                        onConfirm: async () => {
                            setConfirm({ open: false });
                            await onDeactivateStudent(classId, studentId);
                        },
                    });
                }}
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

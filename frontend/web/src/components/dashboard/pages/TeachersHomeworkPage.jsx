// TeacherHomeworkPage.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import CreateHomeworkModal from "../modals/CreateHomeworkModal.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

import { apiTeacherTaskSets, apiTeacherTaskSetTasks } from "../../../services/api.js";

// sections
import AssignmentsListSection from "../assignments/AssignmentsListSection.jsx";
import AssignmentTasksSection from "../assignments/AssignmentTasksSection.jsx";
import StudentsSection from "../assignments/StudentsSection.jsx";
import TaskAnswersSection from "../assignments/TaskAnswersSection.jsx";

export default function TeacherHomeworkPage() {
    const ctx = useTeacherDashboard();

    // assignments
    const [assignments, setAssignments] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [loadingSets, setLoadingSets] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    // tasks
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(false);

    // student
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    // modal
    const [createOpen, setCreateOpen] = useState(false);

    // ✅ StrictMode guard
    const didInitialLoadRef = useRef(false);

    /* -----------------------------
       Load assignments (endless)
    ----------------------------- */
    const loadMoreAssignments = useCallback(async () => {
        if (loadingSets) return;

        setLoadingSets(true);
        try {
            const res = await apiTeacherTaskSets({
                limit: 10,
                cursor: cursor || undefined,
            });

            setAssignments((prev) => [...prev, ...(res?.items || [])]);
            setCursor(res?.nextCursor || null);
        } finally {
            setLoadingSets(false);
        }
    }, [cursor, loadingSets]);

    useEffect(() => {
        if (didInitialLoadRef.current) return;
        didInitialLoadRef.current = true;
        loadMoreAssignments();
    }, [loadMoreAssignments]);

    /* -----------------------------
       Load tasks for assignment
    ----------------------------- */
    useEffect(() => {
        let alive = true;
        if (!selectedAssignment?.id) return;

        setLoadingTasks(true);
        setSelectedStudentId(null);

        apiTeacherTaskSetTasks(selectedAssignment.id)
            .then((res) => {
                if (!alive) return;
                setTasks(res?.tasks || []);
            })
            .finally(() => {
                if (!alive) return;
                setLoadingTasks(false);
            });

        return () => {
            alive = false;
        };
    }, [selectedAssignment?.id]);

    return (
        <>
            <div style={{ display: "flex", gap: 16, height: "50vh", minHeight: 0 }}>
                {/* LEFT 50% */}
                <AssignmentsListSection
                    assignments={assignments}
                    loading={loadingSets}
                    onLoadMore={cursor ? loadMoreAssignments : null}
                    onAdd={() => setCreateOpen(true)}
                    selectedId={selectedAssignment?.id}
                    onSelect={setSelectedAssignment}
                />

                {/* RIGHT 50% */}
                <AssignmentTasksSection assignment={selectedAssignment} tasks={tasks} loading={loadingTasks} />
            </div>

            {/* BOTTOM 50% */}
            <div style={{ display: "flex", gap: 16, marginTop: 16, height: "50vh", minHeight: 0 }}>
                <StudentsSection
                    assignment={selectedAssignment}
                    students={ctx.students}
                    classes={ctx.classes}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={setSelectedStudentId}
                />

                <TaskAnswersSection assignment={selectedAssignment} studentId={selectedStudentId} tasks={tasks} />
            </div>

            <CreateHomeworkModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => {
                    // reset + reload from scratch
                    setAssignments([]);
                    setCursor(null);
                    setSelectedAssignment(null);
                    didInitialLoadRef.current = false; // ✅ allow initial load again
                    setCreateOpen(false);
                }}
            />
        </>
    );
}

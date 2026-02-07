// sections/StudentsSection.jsx
import React, { useMemo } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import StudentsSummaryTable from "./taskCreation/StudentsSummaryTable.jsx"; // <-- adjust path if needed

function seededScore(key) {
    // deterministic random-ish score; null => N/A
    let h = 0;
    const s = String(key || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;

    // ~35% not done
    if (h % 20 < 7) return null;

    // 40..100
    return 40 + (h % 61);
}

function classNameById(classes) {
    const m = new Map();
    for (const c of classes || []) {
        const id = String(c?.id ?? c?._id ?? c?.class_id ?? "").trim();
        if (!id) continue;
        const name = String(c?.name ?? c?.title ?? c?.class_name ?? c?.label ?? "").trim();
        m.set(id, name || "—");
    }
    return m;
}

export default function StudentsSection({
                                            assignment,
                                            students,
                                            classes,
                                            selectedStudentId,
                                            onSelectStudent,
                                        }) {
    const blocked = !assignment;

    const rows = useMemo(() => {
        if (!assignment) return [];

        const classMap = classNameById(classes);

        // Show “assigned” amount if present, otherwise just show first 12
        const takeN = Math.max(1, Number(assignment?.assigned ?? 12));

        return (students || [])
            .slice(0, takeN)
            .map((s) => {
                const sid = String(s?.student_account_id ?? s?.id ?? "").trim();
                const cid = String(s?.class_id ?? s?.classId ?? "").trim();

                return {
                    ...s,
                    id: sid || `${Math.random()}`,
                    student_account_id: sid,
                    className: classMap.get(cid) || s?.class_name || s?.className || "—",
                    score: seededScore(`${assignment.id}-${sid}`),
                };
            });
    }, [assignment, students, classes]);

    return (
        <AwesomeCard title="Students" style={{ flex: 1, position: "relative", minWidth: 0 }}>
            <div style={{ filter: blocked ? "blur(3px)" : "none" }}>
                <StudentsSummaryTable
                    students={rows}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={onSelectStudent}
                    showScore
                    height="100%"
                />
            </div>

            {blocked && <div style={overlayStyle}>Select an assignment to see students</div>}
        </AwesomeCard>
    );
}

const overlayStyle = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    background: "rgba(255,255,255,0.6)",
};

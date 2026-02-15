import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../Page.jsx";
import { AssignmentList } from "./AssignmentList.jsx";
import { theme } from "../../../App.jsx";

export function AssignmentsPage() {
    const navigate = useNavigate();

    // TEMP: mock data so you can visually confirm it renders
    const [assignments, setAssignments] = useState([
        {
            id: "1",
            title: "First conditional (B1)",
            type: "grammar",
            taskMode: "choose_option",
            tasksCount: 12,
            ruleIds: ["FIRST_CONDITIONAL"],
            createdAt: Date.now(),
            studentsCount: 18,
            submittedCount: 9,
            className: "B1 Evening",
        },
    ]);

    const styles = useMemo(() => ({
        // ✅ this is the key: make the list area a flex child with minHeight:0
        fill: {
            flex: "1 1 auto",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            paddingLeft: theme.spacing.cardPadX,
            paddingRight: theme.spacing.cardPadX,
        },
    }), []);

    return (
        <Page
            title="Assignments"
            subtitle="List of all assignment and submissions"
            headerRight={
                <div style={{ display: "flex", gap: theme.spacing.rowGap }}>
                    {/* optional header CTA later */}
                </div>
            }
        >
            <div style={styles.fill}>
                <AssignmentList
                    assignments={assignments}
                    onCreate={() => navigate("/school/assignments/create")}
                    onOpen={(a) => navigate(`/school/assignments/${a.id}`)}
                    onEdit={(a) => navigate(`/school/assignments/${a.id}/edit`)}
                    onDelete={async (a) => {
                        const ok = window.confirm(`Delete "${a.title}"?`);
                        if (!ok) return;
                        setAssignments((prev) => prev.filter((x) => String(x.id) !== String(a.id)));
                    }}
                />
            </div>
        </Page>
    );
}

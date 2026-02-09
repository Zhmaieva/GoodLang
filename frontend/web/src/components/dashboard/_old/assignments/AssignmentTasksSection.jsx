// AssignmentTasksSection.jsx
import React from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import BuiltTasksPreview from "./taskCreation/BuiltTasksPreview.jsx"; // ✅ adjust to your real path

export default function AssignmentTasksSection({ assignment, tasks, loading }) {
    const blocked = !assignment;

    return (
        <AwesomeCard title="Tasks preview" style={{ flex: 1, position: "relative", minHeight: 0 }}>
            <div style={{ filter: blocked ? "blur(3px)" : "none", minHeight: 0 }}>
                <BuiltTasksPreview tasks={tasks} loading={loading} height="100%" title="Tasks preview" />
            </div>

            {blocked && (
                <div style={overlayStyle}>
                    Select an assignment to see tasks
                </div>
            )}
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

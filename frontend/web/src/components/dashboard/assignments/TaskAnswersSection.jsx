// sections/TaskAnswersSection.jsx
import React from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeTable from "../AwesomeTable.jsx";

function randomAnswer(task, seed) {
    if (task.options?.length) {
        return task.options[seed % task.options.length];
    }
    return seed % 2 ? "test answer" : task.correctAnswer || "test answer";
}

export default function TaskAnswersSection({ assignment, studentId, tasks }) {
    const blocked = !assignment || !studentId;

    const rows = tasks.map((t, i) => ({
        id: i,
        text: t.textToTranslate,
        accuracy: Math.round(((i + 3) * 17) % 100),
        answer: randomAnswer(t, i),
    }));

    return (
        <AwesomeCard title="Task answers" style={{ flex: 1, position: "relative" }}>
            <div style={{ filter: blocked ? "blur(3px)" : "none" }}>
                <AwesomeTable
                    columns={[
                        { key: "text", title: "Task", size: 3 },
                        { key: "answer", title: "Student answer", size: 2 },
                        { key: "accuracy", title: "Accuracy %", size: 1 },
                    ]}
                    rows={rows}
                />
            </div>

            {blocked && (
                <div style={overlayStyle}>
                    Select a student to see answers
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

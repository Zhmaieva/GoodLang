import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Page from "../../../Page.jsx";
import Flow from "../../../Flow.jsx";
import { apiJoinTaskSet, apiStudentTaskSetTasksStudent } from "../../../../../services/api.js";
import { logError } from "../../../../../services/logger.js";
import ChooseOptionGapTaskWorkView from "./ChooseOptionGapTaskWorkView.jsx";
import TasksProgressList from "./TasksProgressList.jsx"; // adjust path
import {theme} from "../../../../../App.jsx";

function extractTaskSetId(pathname) {
    const parts = String(pathname || "")
        .split("?")[0]
        .split("#")[0]
        .split("/")
        .filter(Boolean);

    const idx = parts.findIndex((p) => p === "assignments");
    if (idx === -1) return "";

    return String(parts[idx + 1] || "").trim();
}

export function WorkOnAssignmentPage() {
    const location = useLocation();

    const taskSetId = useMemo(() => extractTaskSetId(location?.pathname), [location?.pathname]);

    const [activeTaskId, setActiveTaskId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [tasks, setTasks] = useState([]);

    // simple per-task local submission state (until backend scoring sync)
    const [answersByTaskId, setAnswersByTaskId] = useState({});

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError("");
            setTasks([]);

            try {
                const id = String(taskSetId ?? "").trim();
                if (!id) throw new Error("Missing taskSetId in URL path");

                await apiJoinTaskSet({ taskSetId: id });
                if (cancelled) return;

                const res = await apiStudentTaskSetTasksStudent({ taskSetId: id });
                if (cancelled) return;

                const arr = Array.isArray(res?.tasks) ? res.tasks : Array.isArray(res) ? res : [];
                setTasks(arr);
            } catch (e) {
                logError?.(e);
                if (!cancelled) setError(e?.message || "Failed to load assignment");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [taskSetId]);

    const steps = useMemo(() => {
        const total = tasks.length || 0;

        return tasks.map((task, idx) => {
            const key = String(task?.id || `${idx}`);

            return {
                key,
                title: `Task ${idx + 1}/${total}`,
                render: ({ goNext, goPrev }) => {
                    const taskId = String(task?.id || idx);
                    const saved = answersByTaskId[taskId] || {};

                    return (
                        <ChooseOptionGapTaskWorkView
                            key={taskId} // ✅ keep remount per task
                            task={task}
                            initialSelected={saved.selected ?? null}
                            initialSubmitted={Boolean(saved.submitted)}
                            onSelect={(value) => {
                                setAnswersByTaskId((prev) => ({
                                    ...prev,
                                    [taskId]: {
                                        ...(prev[taskId] || {}),
                                        selected: value,
                                        // if user changes after submission, we can auto-unsubmit OR keep submitted
                                        // recommended: auto-unsubmit:
                                        submitted: false,
                                    },
                                }));
                            }}
                            onSubmit={async (selected) => {
                                setAnswersByTaskId((prev) => ({
                                    ...prev,
                                    [taskId]: {
                                        ...(prev[taskId] || {}),
                                        selected: String(selected ?? ""),
                                        submitted: true,
                                        submittedAt: Date.now(),
                                    },
                                }));
                                return true;
                            }}
                            onBack={goPrev}
                            onNext={goNext}
                            canBack={idx > 0}
                            canNext={idx < total - 1}
                        />
                    );
                },
            };
        });
    }, [tasks, answersByTaskId]);

    return (
        <Page title="Work on Assignment">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100vh - 140px)",
                    minHeight: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flex: "1 1 auto",
                        minHeight: 0,
                        gap: theme.spacing.gap,
                        alignItems: "stretch",
                    }}
                >
                    <div style={{ flex: "1 1 auto", minWidth: 0, minHeight: 0 }}>
                        <Flow
                            style={{height:'100%'}}
                            steps={steps}
                            activeKey={activeTaskId || steps?.[0]?.key || ""}
                            onActiveKeyChange={setActiveTaskId}
                            onDone={() => {}}
                        />
                    </div>

                    <div style={{ width: 420, minWidth: 320, minHeight: 0 }}>
                        <TasksProgressList
                            tasks={tasks}
                            answersByTaskId={answersByTaskId}
                            activeTaskId={activeTaskId || steps?.[0]?.key || ""}
                            onSelectTaskId={setActiveTaskId}
                        />
                    </div>
                </div>
            </div>
        </Page>
    );


}

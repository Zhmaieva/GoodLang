import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Page from "../../../Page.jsx";
import Flow from "../../../Flow.jsx";
import { apiJoinTaskSet, apiStudentTaskSetTasksStudent } from "../../../../../services/api.js";
import { logError } from "../../../../../services/logger.js";
import ChooseOptionGapTaskWorkView from "./ChooseOptionGapTaskWorkView.jsx"; // adjust path

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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [tasks, setTasks] = useState([]);

    // simple per-task local submission state (until backend scoring sync)
    const [submittedByTaskId, setSubmittedByTaskId] = useState({}); // { [taskId]: { selected: string, submittedAt: number } }

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
                render: ({ goNext, goPrev }) => (
                    <ChooseOptionGapTaskWorkView
                        task={task}
                        onSubmit={async (selected) => {
                            setSubmittedByTaskId((prev) => ({
                                ...prev,
                                [key]: { selected: String(selected ?? ""), submittedAt: Date.now() },
                            }));
                            return true;
                        }}
                        onPrev={goPrev}
                        onNext={goNext}
                        canPrev={idx > 0}
                        canNext={idx < total - 1}
                    />
                ),
            };
        });
    }, [tasks]);

    return (
        <Page title="Work on Assignment">
            {loading ? (
                <div style={{ opacity: 0.7 }}>Loading…</div>
            ) : error ? (
                <div style={{ color: "rgba(0,0,0,0.6)" }}>{error}</div>
            ) : !steps.length ? (
                <div style={{ opacity: 0.7 }}>No tasks found.</div>
            ) : (
                <Flow steps={steps} onDone={() => {}} />
            )}
        </Page>
    );
}

import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Page from "../../../Page.jsx";
import { apiJoinTaskSet, apiStudentTaskSetTasksStudent } from "../../../../../services/api.js";
import { theme } from "../../../../../App.jsx";
import { logError } from "../../../../../services/logger.js";

function extractTaskSetId(pathname) {
    const parts = String(pathname || "")
        .split("?")[0]
        .split("#")[0]
        .split("/")
        .filter(Boolean);

    // expects: ["student","assignments","<id>"]
    const idx = parts.findIndex((p) => p === "assignments");
    if (idx === -1) return "";

    const id = parts[idx + 1] || "";
    return String(id).trim();
}

export function WorkOnAssignmentPage() {
    const location = useLocation();

    const taskSetId = useMemo(() => {
        return extractTaskSetId(location?.pathname);
    }, [location?.pathname]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [joinResult, setJoinResult] = useState(null);
    const [tasksResult, setTasksResult] = useState(null);

    const pretty = useMemo(() => {
        return JSON.stringify(
            {
                pathname: location?.pathname || null,
                taskSetId: taskSetId || null,
                join: joinResult,
                tasks: tasksResult,
            },
            null,
            2
        );
    }, [location?.pathname, taskSetId, joinResult, tasksResult]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError("");
            setJoinResult(null);
            setTasksResult(null);

            try {
                const id = String(taskSetId ?? "").trim();
                if (!id) throw new Error("Missing taskSetId in URL path");

                const joined = await apiJoinTaskSet({ taskSetId: id });
                if (cancelled) return;
                setJoinResult(joined);

                const tasks = await apiStudentTaskSetTasksStudent({ taskSetId: id });
                if (cancelled) return;
                setTasksResult(tasks);
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

    return (
        <Page title="Work on Assignment page stub">
            <div
                style={{
                    marginTop: theme.spacing.gap,
                    padding: theme.spacing.gap,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radius.card,
                    background: theme.surface,
                    color: theme.textDark,
                }}
            >
                {loading ? (
                    <div style={{ opacity: 0.7 }}>Loading…</div>
                ) : error ? (
                    <div style={{ color: theme.accentDark }}>{error}</div>
                ) : (
                    <pre
                        style={{
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontSize: 13,
                            lineHeight: 1.45,
                        }}
                    >
                        {pretty}
                    </pre>
                )}
            </div>
        </Page>
    );
}

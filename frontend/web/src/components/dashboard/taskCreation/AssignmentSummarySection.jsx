// taskCreation/AssignmentSummarySection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Loader from "../Loader.jsx"; // ✅ adjust if your Loader path differs

import AssignmentNameInput from "./components/AssignmentNameInput.jsx";
import StudentsSummaryTable from "./components/StudentsSummaryTable.jsx";
import {apiAssignBuiltTaskSet} from "../../../services/api.js";
import {logError} from "../../../services/logger.js";

// ✅ use your preview *style* without rebuilding via API
// (we render from builtTasksPreview.tasks that you already generated in Step 1)
function normalizeText(x) {
    return String(x ?? "").replaceAll("{GAP}", "___");
}

function formatAnswer(ans) {
    if (Array.isArray(ans)) return ans.map((x) => String(x ?? "")).filter(Boolean).join(" / ");
    if (ans == null) return "";
    return String(ans);
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function TasksPreviewReadOnly({ tasks = [], height = "100%" }) {
    const TOKENS = {
        card: "rgba(255,255,255,0.1)",
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        radius: 20,
    };

    return (
        <div
            style={{
                height,
                overflow: "hidden",
                borderRadius: TOKENS.radius,
                border: `1px solid ${TOKENS.border}`,
                background: TOKENS.card,
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                fontFamily: "Nunito, ui-sans-serif, system-ui",
            }}
        >
            <div style={{ padding: 12, borderBottom: `1px solid ${TOKENS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 1000, color: TOKENS.text }}>Tasks preview</div>
                <div style={{ marginLeft: "auto", fontSize: 12, fontWeight: 900, color: TOKENS.muted }}>
                    {Array.isArray(tasks) ? tasks.length : 0}
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 14 }}>
                {!tasks?.length ? (
                    <div style={{ color: TOKENS.muted, fontWeight: 900 }}>
                        No tasks generated.
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {tasks.map((t, idx) => {
                            const n = idx + 1;
                            const typeRaw = String(t?.taskType ?? t?.type ?? "translation");
                            const isGap = typeRaw === "gap" || typeRaw === "gaps";
                            const typeLabel = isGap ? "Gaps" : "Translation";

                            const text = normalizeText(t?.textToTranslate ?? t?.prompt ?? t?.text ?? "");
                            const options = Array.isArray(t?.options) ? t.options : null;
                            const answer = formatAnswer(t?.correctAnswer);

                            return (
                                <div
                                    key={`${t?.taskOrderNumber ?? ""}-${idx}`}
                                    style={{
                                        border: `1px solid ${TOKENS.border}`,
                                        borderRadius: 16,
                                        background: "rgba(255,255,255,0.65)",
                                        padding: 12,
                                        minWidth: 0,
                                    }}
                                >
                                    <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                                        <div style={{ fontWeight: 1000, color: TOKENS.text }}>{n}.</div>
                                        <div style={{ fontWeight: 1000, color: TOKENS.text }}>{typeLabel}</div>
                                    </div>

                                    <div style={{ marginTop: 10, color: TOKENS.text, fontWeight: 900, lineHeight: 1.35 }}>
                                        {text || "—"}
                                    </div>

                                    {options?.length ? (
                                        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                                            {options.map((o, i) => (
                                                <div
                                                    key={`${idx}-opt-${i}`}
                                                    style={{
                                                        color: TOKENS.text,
                                                        fontWeight: 900,
                                                        border: `1px dashed ${TOKENS.border}`,
                                                        borderRadius: 12,
                                                        padding: "8px 10px",
                                                        background: "rgba(255,255,255,0.6)",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                    title={String(o)}
                                                >
                                                    {String.fromCharCode(65 + i)}) {String(o)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}

                                    <div style={{ marginTop: 12, borderTop: `1px dashed ${TOKENS.border}`, paddingTop: 10 }}>
                                        <div style={{ color: TOKENS.muted, fontSize: 12, fontWeight: 900 }}>
                                            Correct answer:
                                        </div>
                                        <div
                                            style={{
                                                marginTop: 6,
                                                borderRadius: 12,
                                                border: `1px solid ${TOKENS.border}`,
                                                background: "rgba(255,255,255,0.55)",
                                                padding: "10px 10px",
                                                color: TOKENS.text,
                                                fontWeight: 900,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                            title={answer || ""}
                                        >
                                            {answer || "—"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AssignmentSummarySection({
                                                     selectedStudentIds = [],
                                                     students = [],
                                                     builtTasksPreview,
                                                     confirmNonce,
                                                     onDone,
                                                 }) {
    const TOKENS = useMemo(
        () => ({
            gap: 14,
            font: "Nunito, ui-sans-serif, system-ui",
        }),
        []
    );

    const [assignmentName, setAssignmentName] = useState("");
    const [mode, setMode] = useState("idle"); // idle | sending | sent

    const aliveRef = useRef(true);
    useEffect(() => {
        aliveRef.current = true;
        return () => {
            aliveRef.current = false;
        };
    }, []);

    const tasks = Array.isArray(builtTasksPreview?.tasks) ? builtTasksPreview.tasks : [];
    const taskSetId = String(builtTasksPreview?.taskSetId ?? "").trim();

    // ✅ "sending emails" flow starts when confirmNonce increments
    useEffect(() => {
        if (!confirmNonce) return;
        if (mode !== "idle") return;

        (async () => {
            setMode("sending");
        })();
    }, [confirmNonce]);

    if (mode === "sending" || mode === "sent") {
        return (
            <div style={{ height: "100%", minHeight: 0, minWidth: 0, display: "flex" }}>
                <Loader
                    estimateMs={1000}
                    minVisibleMs={400}
                    description={mode === "sent" ? "Emails sent" : "Sending emails..."}
                    doneText="Emails sent"
                    load={async () => {
                        try {
                            await apiAssignBuiltTaskSet(taskSetId, { title: assignmentName, studentIds: selectedStudentIds, tasks })
                        } catch (e) {
                            logError(e)
                        }
                        await sleep(1000);
                        setMode('sent')
                        setTimeout(() => {
                            onDone();
                        }, 500)

                    }}
                    style={{ width: "100%" }}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                height: "100%",
                minHeight: 0,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: TOKENS.gap,
                fontFamily: TOKENS.font,
            }}
        >
            {/* top ~25% */}
            <div style={{ flex: "0 0 25%", minHeight: 140, minWidth: 0 }}>
                <AssignmentNameInput value={assignmentName} onChange={setAssignmentName} />
            </div>

            {/* bottom split */}
            <div style={{ flex: "1 1 auto", minHeight: 0, minWidth: 0, display: "flex", gap: TOKENS.gap }}>
                <div style={{ flex: "1 1 50%", minHeight: 0, minWidth: 0 }}>
                    <StudentsSummaryTable students={students} selectedStudentIds={selectedStudentIds} height="100%" />
                </div>

                <div style={{ flex: "1 1 50%", minHeight: 0, minWidth: 0 }}>
                    <TasksPreviewReadOnly tasks={tasks} height="100%" />
                </div>
            </div>

            {/* tiny helper (optional, but english UI requirement) */}
            {!taskSetId ? null : null}
        </div>
    );
}

// BuiltTasksPreview.jsx
import React, { useMemo, useRef, useState } from "react";
import Loader from "../../Loader.jsx"; // <-- adjust path
import {apiBuildTaskSet, sleep} from "../../../../services/api.js"; // <-- adjust path

function normalizeText(x) {
    return String(x ?? "").replaceAll("{GAP}", "___");
}

function formatAnswer(ans) {
    if (Array.isArray(ans)) return ans.map((x) => String(x ?? "")).filter(Boolean).join(" / ");
    if (ans == null) return "";
    return String(ans);
}

export default function BuiltTasksPreview({
                                              // ✅ STATIC MODE (preferred for teacher view)
                                              tasks: tasksProp = null,
                                              loading: loadingProp = false,

                                              // ✅ API MODE (manual build preview)
                                              selectedRuleIds = [],
                                              manualBuild,
                                              onBuilt,

                                              height = "100%",
                                              emptyText = "Select something to see tasks preview.",
                                          }) {
    const TOKENS = {
        card: "rgba(255,255,255,0.1)",
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        accent: "#ff6138",
        radius: 20,
    };

    const ids = useMemo(() => (selectedRuleIds || []).map(String).filter(Boolean), [selectedRuleIds]);

    // If parent passes tasks -> STATIC MODE.
    const isStaticMode = Array.isArray(tasksProp);

    // API mode is only allowed when we actually have selections.
    const canApiBuild = !isStaticMode && ids.length > 0;

    const [apiState, setApiState] = useState({
        tasks: [],
        error: null,
    });

    const lastReqRef = useRef(0);

    const taskMode = manualBuild?.taskMode || "translations";
    const numberOfTasks = Number.isFinite(Number(manualBuild?.numberOfTasks)) ? Number(manualBuild.numberOfTasks) : 10;
    const seed = Number.isFinite(Number(manualBuild?.seed)) ? Number(manualBuild.seed) : 1;

    const buildKey = useMemo(() => {
        if (!canApiBuild) return "no-build";
        const idsKey = ids.slice().sort().join(",");
        const bump = manualBuild?._bump ? String(manualBuild._bump) : "";
        return `${taskMode}::${numberOfTasks}::${seed}::${idsKey}::${bump}`;
    }, [canApiBuild, ids, taskMode, numberOfTasks, seed, manualBuild?._bump]);

    const loaderKey = useMemo(() => `loader::${buildKey}`, [buildKey]);

    const load = async () => {
        // ✅ IMPORTANT: do nothing if there is nothing selected
        if (!canApiBuild) {
            setApiState({ tasks: [], error: null });
            return;
        }

        const reqId = Date.now();
        lastReqRef.current = reqId;
        setApiState((s) => ({ ...s, error: null }));

        const data = await apiBuildTaskSet({
            taskMode,
            ruleIds: ids,
            numberOfTasks,
            seed,
        });

        if (lastReqRef.current !== reqId) return;

        const built = Array.isArray(data?.tasks) ? data.tasks : [];
        setApiState({ tasks: built, error: null });
        onBuilt?.(data);
    };

    // Pick tasks source
    const tasks = useMemo(() => {
        if (isStaticMode) return tasksProp || [];
        return apiState.tasks || [];
    }, [isStaticMode, tasksProp, apiState.tasks]);

    const error = !isStaticMode ? apiState.error : null;

    return (
        <div
            style={{
                height,
                overflow: "hidden",
                borderRadius: TOKENS.radius,
                border: `1px solid ${TOKENS.border}`,
                background: TOKENS.card,
                boxShadow: "none",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                fontFamily: "Nunito, ui-sans-serif, system-ui",
            }}
        >
            {/* header */}
            <div
                style={{
                    padding: 12,
                    borderBottom: `1px solid ${TOKENS.border}`,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    minWidth: 0,
                }}
            >
                <div style={{ fontWeight: 1000, color: TOKENS.text }}>Tasks preview</div>

                <div style={{ marginLeft: "auto", color: TOKENS.muted, fontSize: 12, fontWeight: 900, whiteSpace: "nowrap" }}>
                    {!!tasks.length ? (
                        <>
                            Tasks: <b>{tasks.length}</b>
                        </>
                    ) : null}
                </div>
            </div>

            {/* body */}
            <div style={{ flex: 1, overflow: "auto", padding: 14, minWidth: 0 }}>
                {/* ✅ STATIC MODE: no loader, just show tasks / loading */}
                {isStaticMode ? (
                    loadingProp ? (
                        <Loader
                            key={loaderKey}
                            estimateMs={100} // expected
                            minVisibleMs={0} // minimum visible
                            description="Generating tasks…"
                            load={async () => {
                                while(loadingProp) {
                                    await sleep(10);
                                }
                            }}
                            style={{ padding: 0 }}
                        >
                        </Loader>
                    ) : !tasks.length ? (
                        <div style={{ color: TOKENS.muted, fontWeight: 900 }}>{emptyText}</div>
                    ) : (
                        <TasksList TOKENS={TOKENS} tasks={tasks} />
                    )
                ) : (
                    // ✅ API MODE
                    <>
                        {!ids.length ? (
                            // ✅ IMPORTANT: no loader here
                            <div style={{ color: TOKENS.muted, fontWeight: 900 }}>
                                Select at least one rule — then tasks preview will appear here.
                            </div>
                        ) : error ? (
                            <div style={{ color: "#b00020", fontWeight: 900 }}>{error}</div>
                        ) : (
                            <Loader
                                key={loaderKey}
                                estimateMs={1000} // expected
                                minVisibleMs={400} // minimum visible
                                description="Generating tasks…"
                                load={load}
                                style={{ padding: 0 }}
                            >
                                {!tasks.length ? (
                                    <div style={{ color: TOKENS.muted, fontWeight: 900 }}>Empty.</div>
                                ) : (
                                    <TasksList TOKENS={TOKENS} tasks={tasks} />
                                )}
                            </Loader>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function TasksList({ TOKENS, tasks }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
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
                        <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", minWidth: 0 }}>
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
                            <div style={{ color: TOKENS.muted, fontSize: 12, fontWeight: 900 }}>Correct answer:</div>

                            <div
                                style={{
                                    marginTop: 6,
                                    borderRadius: 12,
                                    border: `1px solid ${TOKENS.border}`,
                                    background: "rgba(255,255,255,0.55)",
                                    padding: "10px 10px",
                                    color: TOKENS.text,
                                    fontWeight: 900,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
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
    );
}

// BuiltTasksPreview.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiBuildTaskSet } from "../../../../services/api.js";

function normalizeText(x) {
    return String(x ?? "").replaceAll("{GAP}", "___");
}

function formatAnswer(ans) {
    if (Array.isArray(ans)) return ans.map((x) => String(x ?? "")).filter(Boolean).join(" / ");
    if (ans == null) return "";
    return String(ans);
}

export default function BuiltTasksPreview({
                                              selectedRuleIds = [],
                                              manualBuild,
                                              onBuilt,
                                              height = "72vh",
                                          }) {
    const TOKENS = {
        card: "rgba(255,255,255,0.1)",   // ✅ common
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        accent: "#ff6138",
        radius: 20,                     // ✅ rounded like others
    };

    const [state, setState] = useState({
        isLoading: false,
        tasks: [],
        error: null,
    });

    const buildKey = useMemo(() => {
        const ids = (selectedRuleIds || []).map(String).filter(Boolean).sort().join(",");
        const mode = manualBuild?.taskMode || "translations";
        const n = Number.isFinite(Number(manualBuild?.numberOfTasks)) ? Number(manualBuild.numberOfTasks) : 10;
        const seed = Number.isFinite(Number(manualBuild?.seed)) ? Number(manualBuild.seed) : 1;
        const bump = manualBuild?._bump ? String(manualBuild._bump) : "";
        return `${mode}::${n}::${seed}::${ids}::${bump}`;
    }, [selectedRuleIds, manualBuild]);

    const lastReqRef = useRef(0);

    useEffect(() => {
        const ids = (selectedRuleIds || []).map(String).filter(Boolean);
        if (!ids.length) {
            setState({ isLoading: false, tasks: [], error: null });
            return;
        }

        const taskMode = manualBuild?.taskMode || "translations";
        const numberOfTasks = Number.isFinite(Number(manualBuild?.numberOfTasks))
            ? Number(manualBuild.numberOfTasks)
            : 10;
        const seed = Number.isFinite(Number(manualBuild?.seed)) ? Number(manualBuild.seed) : 1;

        const reqId = Date.now();
        lastReqRef.current = reqId;

        setState((s) => ({ ...s, isLoading: true, error: null }));

        (async () => {
            try {
                const data = await apiBuildTaskSet({
                    taskMode,
                    ruleIds: ids,
                    numberOfTasks,
                    seed,
                });

                if (lastReqRef.current !== reqId) return;

                setState({
                    isLoading: false,
                    tasks: Array.isArray(data?.tasks) ? data.tasks : [],
                    error: null,
                });

                onBuilt?.(data);
            } catch (e) {
                if (lastReqRef.current !== reqId) return;
                setState({
                    isLoading: false,
                    tasks: [],
                    error: e?.message || "Не вдалося згенерувати завдання",
                });
            }
        })();
    }, [buildKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const tasks = Array.isArray(state.tasks) ? state.tasks : [];

    return (
        <div
            style={{
                height,
                overflow: "hidden",
                borderRadius: TOKENS.radius,
                border: `1px solid ${TOKENS.border}`,
                background: TOKENS.card,
                boxShadow: "none", // ✅ no heavy shadow
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
                <div style={{ fontWeight: 1000, color: TOKENS.text }}>Прев’ю завдань</div>

                <div style={{ marginLeft: "auto", color: TOKENS.muted, fontSize: 12, fontWeight: 900, whiteSpace: "nowrap" }}>
                    {tasks.length ? <>Завдань: <b>{tasks.length}</b></> : null}
                </div>
            </div>

            {/* body */}
            <div style={{ flex: 1, overflow: "auto", padding: 14, minWidth: 0 }}>
                {!selectedRuleIds?.length ? (
                    <div style={{ color: TOKENS.muted, fontWeight: 900 }}>
                        Оберіть хоча б одне правило — і тут з’явиться прев’ю завдань.
                    </div>
                ) : state.error ? (
                    <div style={{ color: "#b00020", fontWeight: 900 }}>
                        {state.error}
                    </div>
                ) : !tasks.length && !state.isLoading ? (
                    <div style={{ color: TOKENS.muted, fontWeight: 900 }}>
                        Порожньо.
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
                        {tasks.map((t, idx) => {
                            const n = idx + 1;

                            const typeRaw = String(t?.taskType ?? t?.type ?? "translation");
                            const isGap = typeRaw === "gap" || typeRaw === "gaps";
                            const typeLabel = isGap ? "Пропуски" : "Переклад";

                            const text = normalizeText(t?.textToTranslate ?? t?.prompt ?? t?.text ?? "");
                            const options = Array.isArray(t?.options) ? t.options : null;
                            const answer = formatAnswer(t?.correctAnswer);

                            return (
                                <div
                                    key={`${t?.taskOrderNumber ?? ""}-${idx}`}
                                    style={{
                                        border: `1px solid ${TOKENS.border}`,
                                        borderRadius: 16, // ✅ nicer corners
                                        background: "rgba(255,255,255,0.65)", // ✅ softer, common
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

                                    {/* answer line */}
                                    <div style={{ marginTop: 12, borderTop: `1px dashed ${TOKENS.border}`, paddingTop: 10 }}>
                                        <div style={{ color: TOKENS.muted, fontSize: 12, fontWeight: 900 }}>
                                            Правильна відповідь:
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

            {/* loader overlay */}
            {state.isLoading && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(255,243,223,0.72)",
                        backdropFilter: "blur(3px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: 18,
                    }}
                >
                    <div style={{ width: 12, height: 12, borderRadius: 999, background: TOKENS.accent }} />
                    <div style={{ fontWeight: 1000, color: TOKENS.text }}>
                        Генеруємо завдання…
                    </div>
                </div>
            )}
        </div>
    );
}

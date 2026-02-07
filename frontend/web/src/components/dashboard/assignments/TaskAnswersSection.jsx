// sections/TaskAnswersSection.jsx
import React, { useMemo } from "react";
import AwesomeCard from "../AwesomeCard.jsx";

/** ---- helpers (deterministic “random”) ---- */
function hashString(str) {
    const s = String(str ?? "");
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function seededPct(key) {
    const h = hashString(key);
    // 0..100
    return h % 101;
}

function normalizeText(x) {
    return String(x ?? "").replaceAll("{GAP}", "___");
}

function formatAnswer(ans) {
    if (Array.isArray(ans)) return ans.map((x) => String(x ?? "")).filter(Boolean).join(" / ");
    if (ans == null) return "";
    return String(ans);
}

function pickStudentAnswer({ task, pct, seed }) {
    const options = Array.isArray(task?.options) ? task.options : null;
    const correct = formatAnswer(task?.correctAnswer);

    // ✅ high accuracy → correct answer (or a plausible option)
    if (pct >= 80) {
        if (correct) return correct;
        if (options?.length) return String(options[seed % options.length]);
        return "Test answer";
    }

    // ✅ mid accuracy → sometimes correct, sometimes option
    if (pct >= 50) {
        if (seed % 3 === 0 && correct) return correct; // occasional correct
        if (options?.length) return String(options[(seed + 1) % options.length]);
        return "Test answer";
    }

    // ✅ low accuracy → wrong-ish answer
    if (options?.length) {
        // pick a different option if possible
        const idx = seed % options.length;
        const wrongIdx = options.length > 1 ? (idx + 1) % options.length : idx;
        return String(options[wrongIdx]);
    }
    return "Test answer";
}

function accuracyTone(pct) {
    if (pct >= 80) return { label: "Good", bg: "rgba(75,163,110,0.18)", fg: "var(--green, #4ba36e)", border: "rgba(75,163,110,0.35)" };
    if (pct >= 50) return { label: "OK", bg: "rgba(255,200,0,0.18)", fg: "#8a6a00", border: "rgba(255,200,0,0.38)" };
    return { label: "Low", bg: "rgba(255,97,56,0.16)", fg: "var(--accent, #ff6138)", border: "rgba(255,97,56,0.35)" };
}

export default function TaskAnswersSection({ assignment, studentId, tasks = [] }) {
    const blocked = !assignment || !studentId;

    const TOKENS = {
        card: "rgba(255,255,255,0.1)",
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        accent: "#ff6138",
        radius: 20,
    };

    const rows = useMemo(() => {
        const aId = String(assignment?.id ?? "");
        const sId = String(studentId ?? "");
        return (tasks || []).map((t, i) => {
            const key = `${aId}::${sId}::${i}::${t?.taskOrderNumber ?? ""}::${t?.textToTranslate ?? ""}`;
            const pct = seededPct(key);
            const seed = hashString(key + "::seed");
            const answer = pickStudentAnswer({ task: t, pct, seed });
            const correct = formatAnswer(t?.correctAnswer);
            const typeRaw = String(t?.taskType ?? t?.type ?? "translation");
            const isGap = typeRaw === "gap" || typeRaw === "gaps";
            return {
                id: `${i}`,
                n: i + 1,
                typeLabel: isGap ? "Gaps" : "Translation",
                text: normalizeText(t?.textToTranslate ?? t?.prompt ?? t?.text ?? ""),
                options: Array.isArray(t?.options) ? t.options : null,
                answer,
                correct,
                pct,
            };
        });
    }, [assignment?.id, studentId, tasks]);

    return (
        <AwesomeCard title="Task answers" style={{ flex: 1, position: "relative" }}>
            <div style={{ filter: blocked ? "blur(3px)" : "none", minHeight: 0, display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        height: "100%",
                        minHeight: 0,
                        overflow: "hidden",
                        borderRadius: TOKENS.radius,
                        border: `1px solid ${TOKENS.border}`,
                        background: TOKENS.card,
                        boxShadow: "none",
                        display: "flex",
                        flexDirection: "column",
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
                        <div style={{ fontWeight: 1000, color: TOKENS.text }}>Answers preview</div>
                        <div style={{ marginLeft: "auto", color: TOKENS.muted, fontSize: 12, fontWeight: 900, whiteSpace: "nowrap" }}>
                            {rows.length ? (
                                <>
                                    Tasks: <b>{rows.length}</b>
                                </>
                            ) : null}
                        </div>
                    </div>

                    {/* body */}
                    <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 14 }}>
                        {!rows.length ? (
                            <div style={{ color: TOKENS.muted, fontWeight: 900 }}>No tasks yet.</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
                                {rows.map((r) => {
                                    const tone = accuracyTone(r.pct);

                                    return (
                                        <div
                                            key={r.id}
                                            style={{
                                                border: `1px solid ${TOKENS.border}`,
                                                borderRadius: 16,
                                                background: "rgba(255,255,255,0.65)",
                                                padding: 12,
                                                minWidth: 0,
                                            }}
                                        >
                                            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
                                                <div style={{ fontWeight: 1000, color: TOKENS.text }}>{r.n}.</div>
                                                <div style={{ fontWeight: 1000, color: TOKENS.text }}>{r.typeLabel}</div>

                                                <div
                                                    style={{
                                                        marginLeft: "auto",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        borderRadius: 999,
                                                        padding: "6px 10px",
                                                        border: `1px solid ${tone.border}`,
                                                        background: tone.bg,
                                                        color: tone.fg,
                                                        fontWeight: 1000,
                                                        fontSize: 12,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    title="Deterministic mock accuracy"
                                                >
                                                    <span>{tone.label}</span>
                                                    <span style={{ opacity: 0.9 }}>{r.pct}%</span>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: 10, color: TOKENS.text, fontWeight: 900, lineHeight: 1.35 }}>
                                                {r.text || "—"}
                                            </div>

                                            {r.options?.length ? (
                                                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                                                    {r.options.map((o, i) => (
                                                        <div
                                                            key={`${r.id}-opt-${i}`}
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

                                            {/* Student answer */}
                                            <div style={{ marginTop: 12, borderTop: `1px dashed ${TOKENS.border}`, paddingTop: 10 }}>
                                                <div style={{ color: TOKENS.muted, fontSize: 12, fontWeight: 900 }}>Student answer:</div>
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
                                                    title={r.answer || ""}
                                                >
                                                    {r.answer || "—"}
                                                </div>

                                                {/* Correct answer (optional, only show if we have it) */}
                                                {r.correct ? (
                                                    <div style={{ marginTop: 10 }}>
                                                        <div style={{ color: TOKENS.muted, fontSize: 12, fontWeight: 900 }}>Correct answer:</div>
                                                        <div
                                                            style={{
                                                                marginTop: 6,
                                                                borderRadius: 12,
                                                                border: `1px solid ${TOKENS.border}`,
                                                                background: "rgba(255,255,255,0.45)",
                                                                padding: "10px 10px",
                                                                color: TOKENS.text,
                                                                fontWeight: 900,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                            title={r.correct}
                                                        >
                                                            {r.correct}
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {blocked && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        color: "var(--text, #3a2a1d)",
                        background: "rgba(255,255,255,0.6)",
                    }}
                >
                    Select a student to see answers
                </div>
            )}
        </AwesomeCard>
    );
}

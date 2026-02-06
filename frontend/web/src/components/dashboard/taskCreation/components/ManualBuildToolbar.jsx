// ManualBuildToolbar.jsx
import React from "react";

export default function ManualBuildToolbar({
                                               manualBuild,
                                               setManualBuild,
                                               selectedRuleIdsCount = 0,
                                           }) {
    const TOKENS = {
        card: "rgba(255,255,255,0.72)",
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        accent: "#ff6138",
        radius: 20,
        shadow: "0 14px 40px rgba(58,42,29,0.12)",
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    };

    function patch(next) {
        setManualBuild((prev) => ({ ...(prev || {}), ...(next || {}) }));
    }

    const taskMode = manualBuild?.taskMode || "translations";
    const numberOfTasks = Number.isFinite(Number(manualBuild?.numberOfTasks)) ? Number(manualBuild.numberOfTasks) : 10;
    const seed = Number.isFinite(Number(manualBuild?.seed)) ? Number(manualBuild.seed) : 1;

    const Field = ({ label, children, hint }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 12, fontWeight: 900, color: TOKENS.muted }}>
                {label}
            </div>
            {children}
            {hint ? (
                <div style={{ fontFamily: TOKENS.mono, fontSize: 12, color: TOKENS.muted, opacity: 0.9 }}>
                    {hint}
                </div>
            ) : null}
        </div>
    );

    const inputStyle = {
        fontFamily: TOKENS.mono,
        fontWeight: 900,
        borderRadius: 14,
        padding: "10px 10px",
        border: `1px solid ${TOKENS.border}`,
        outline: "none",
        background: "#fff",
        color: TOKENS.text,
    };

    const btnStyle = {
        fontFamily: TOKENS.mono,
        fontWeight: 900,
        borderRadius: 14,
        padding: "10px 10px",
        border: `1px solid ${TOKENS.border}`,
        background: "#fff",
        cursor: "pointer",
    };

    return (
        <div
            style={{
                borderRadius: TOKENS.radius,
                border: `1px solid ${TOKENS.border}`,
                background: TOKENS.card,
                boxShadow: TOKENS.shadow,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontFamily: TOKENS.mono, fontWeight: 1000, color: TOKENS.text, fontSize: 14 }}>
                    Налаштування
                </div>
                <div style={{ fontFamily: TOKENS.mono, color: TOKENS.muted, fontSize: 12 }}>
                    Обрано правил: <b>{selectedRuleIdsCount}</b>
                </div>
            </div>

            <Field label="Режим завдань">
                <select
                    value={taskMode}
                    onChange={(e) => patch({ taskMode: e.target.value })}
                    style={inputStyle}
                >
                    <option value="translations">Переклад</option>
                    <option value="gaps">Пропуски</option>
                    <option value="mixed">Змішаний</option>
                </select>
            </Field>

            <Field label="Кількість завдань" hint="1–50">
                <input
                    type="number"
                    min={1}
                    max={50}
                    value={numberOfTasks}
                    onChange={(e) => patch({ numberOfTasks: Number(e.target.value) })}
                    style={inputStyle}
                />
            </Field>

            <Field label="Seed" hint="Однаковий seed → однакові завдання">
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        type="number"
                        value={seed}
                        onChange={(e) => patch({ seed: Number(e.target.value) })}
                        style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                        type="button"
                        onClick={() => patch({ seed: Math.floor(Math.random() * 1e9) })}
                        style={btnStyle}
                        title="Згенерувати новий seed"
                    >
                        🎲
                    </button>
                </div>
            </Field>

            <div style={{ height: 1, background: TOKENS.border, opacity: 0.7 }} />

            <div style={{ fontFamily: TOKENS.mono, fontSize: 12, color: TOKENS.muted }}>
                Прев’ю праворуч оновлюється автоматично при зміні правил або налаштувань.
            </div>

            <button
                type="button"
                onClick={() => patch({ _bump: Date.now() })} // optional “rebuild now” signal
                style={{
                    ...btnStyle,
                    background: TOKENS.accent,
                    borderColor: "rgba(0,0,0,0.45)",
                    color: "#fff",
                }}
            >
                Оновити прев’ю
            </button>
        </div>
    );
}

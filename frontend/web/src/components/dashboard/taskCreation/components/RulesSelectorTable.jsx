// RulesSelectorTable.jsx
import React, { useMemo, useState } from "react";

/**
 * EXPECTS from context:
 * - selectedRuleIds: string[]
 * - setSelectedRuleIds: (ids: string[]) => void
 *
 * RULES input shape (flexible):
 * [{ id: 'PAST_SIMPLE', labelUa: 'Past Simple', level: 'A2' }, ...]
 */
export default function RulesSelectorTable({
                                               rules = [],
                                               selectedRuleIds = [],
                                               setSelectedRuleIds,
                                               height = "72vh",
                                           }) {
    const TOKENS = {
        bg0: "#fff3df",
        card: "rgba(255,255,255,0.72)",
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        accent: "#ff6138",
        radius: 20,
        shadow: "0 14px 40px rgba(58,42,29,0.12)",
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    };

    // deterministic-ish random per rule id (stable per render)
    const lastPracticeById = useMemo(() => {
        const map = new Map();
        const now = Date.now();
        for (const r of rules) {
            const id = String(r?.id ?? "").trim();
            if (!id) continue;

            // pseudo-random from id
            let h = 0;
            for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;

            const never = (h % 7) === 0; // ~14% never
            if (never) {
                map.set(id, null);
            } else {
                const daysAgo = 1 + (h % 30);
                const d = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
                map.set(id, d);
            }
        }
        return map;
    }, [rules]);

    const [sort, setSort] = useState({ key: "label", dir: "asc" }); // label|level|last
    const rows = useMemo(() => {
        const norm = (x) => String(x ?? "").trim();

        const arr = (rules || [])
            .map((r) => {
                const id = norm(r?.id);
                const label = norm(r?.labelUa ?? r?.label ?? r?.title ?? id);
                const level = norm(r?.level ?? r?.cefr ?? "");
                const last = lastPracticeById.get(id) ?? null;
                return { id, label, level, last };
            })
            .filter((x) => x.id);

        const dirMul = sort.dir === "asc" ? 1 : -1;
        arr.sort((a, b) => {
            if (sort.key === "level") return dirMul * a.level.localeCompare(b.level);
            if (sort.key === "last") {
                const av = a.last ? a.last.getTime() : -1;
                const bv = b.last ? b.last.getTime() : -1;
                return dirMul * (av - bv);
            }
            return dirMul * a.label.localeCompare(b.label);
        });

        return arr;
    }, [rules, lastPracticeById, sort]);

    const selectedSet = useMemo(() => new Set((selectedRuleIds || []).map(String)), [selectedRuleIds]);

    function toggle(id) {
        const next = new Set(selectedSet);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedRuleIds(Array.from(next));
    }

    function toggleAll() {
        if (rows.length === 0) return;
        const allIds = rows.map((r) => r.id);
        const allSelected = allIds.every((id) => selectedSet.has(id));
        setSelectedRuleIds(allSelected ? [] : allIds);
    }

    function fmt(d) {
        if (!d) return "ніколи";
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yy = d.getFullYear();
        return `${dd}.${mm}.${yy}`;
    }

    const TH = ({ k, children, style }) => (
        <button
            type="button"
            onClick={() =>
                setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }))
            }
            style={{
                all: "unset",
                cursor: "pointer",
                fontFamily: TOKENS.mono,
                fontSize: 12,
                letterSpacing: 0.3,
                color: TOKENS.muted,
                padding: "10px 10px",
                userSelect: "none",
                ...style,
            }}
            title="Натисніть, щоб відсортувати"
        >
            {children}
            <span style={{ marginLeft: 6, opacity: sort.key === k ? 1 : 0.35 }}>
        {sort.key === k ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
      </span>
        </button>
    );

    return (
        <div
            style={{
                height,
                overflow: "hidden",
                borderRadius: TOKENS.radius,
                border: `1px solid ${TOKENS.border}`,
                background: TOKENS.card,
                boxShadow: TOKENS.shadow,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* header */}
            <div style={{ padding: 12, borderBottom: `1px solid ${TOKENS.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontFamily: TOKENS.mono, fontWeight: 800, color: TOKENS.text }}>
                    Правила
                </div>
                <div style={{ fontFamily: TOKENS.mono, color: TOKENS.muted, fontSize: 12 }}>
                    Обрано: {selectedSet.size}
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <button
                        type="button"
                        onClick={toggleAll}
                        style={{
                            fontFamily: TOKENS.mono,
                            fontWeight: 800,
                            fontSize: 12,
                            borderRadius: 999,
                            padding: "8px 10px",
                            border: `1px solid ${TOKENS.border}`,
                            background: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        {rows.length && rows.every((r) => selectedSet.has(r.id)) ? "Зняти все" : "Обрати все"}
                    </button>
                </div>
            </div>

            {/* table */}
            <div style={{ flex: 1, overflow: "auto" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "44px 1.4fr 110px 140px",
                        alignItems: "center",
                        borderBottom: `1px solid ${TOKENS.border}`,
                        background: "rgba(255,255,255,0.65)",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                    }}
                >
                    <div style={{ padding: "10px 10px" }} />
                    <TH k="label">Правило</TH>
                    <TH k="level" style={{ textAlign: "right" }}>Рівень</TH>
                    <TH k="last" style={{ textAlign: "right" }}>Остання практика</TH>
                </div>

                {rows.map((r) => {
                    const isOn = selectedSet.has(r.id);
                    return (
                        <div
                            key={r.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "44px 1.4fr 110px 140px",
                                alignItems: "center",
                                borderBottom: `1px solid ${TOKENS.border}`,
                                background: isOn ? "rgba(255,97,56,0.10)" : "transparent",
                            }}
                        >
                            <div style={{ padding: "10px 10px" }}>
                                <input
                                    type="checkbox"
                                    checked={isOn}
                                    onChange={() => toggle(r.id)}
                                    style={{ width: 16, height: 16, cursor: "pointer" }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => toggle(r.id)}
                                style={{
                                    all: "unset",
                                    cursor: "pointer",
                                    padding: "10px 10px",
                                    fontFamily: TOKENS.mono,
                                    color: TOKENS.text,
                                    fontWeight: 800,
                                }}
                                title={r.id}
                            >
                                {r.label}
                                <span style={{ marginLeft: 10, fontWeight: 700, fontSize: 12, color: TOKENS.muted }}>
                  {r.id}
                </span>
                            </button>
                            <div style={{ padding: "10px 10px", textAlign: "right", fontFamily: TOKENS.mono, color: TOKENS.text, fontWeight: 900 }}>
                                {r.level || "—"}
                            </div>
                            <div style={{ padding: "10px 10px", textAlign: "right", fontFamily: TOKENS.mono, color: TOKENS.muted, fontWeight: 900 }}>
                                {fmt(r.last)}
                            </div>
                        </div>
                    );
                })}

                {!rows.length && (
                    <div style={{ padding: 14, fontFamily: TOKENS.mono, color: TOKENS.muted }}>
                        Немає правил для відображення.
                    </div>
                )}
            </div>
        </div>
    );
}

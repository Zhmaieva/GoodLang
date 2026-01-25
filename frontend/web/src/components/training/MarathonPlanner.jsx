// MarathonPlanner.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {getAllStatistics, getOverallAccuracy, inferUserLevel} from "../../services/dataService.js";
import { LEVEL_RULES, RULE_LABELS } from "../../utils/rules.js";

const LEVEL_ORDER = ["A1", "A2", "B1", "B2"];

const LEVEL_MAP = {
    A1: { label: "Початківець", percent: 33 },
    A2: { label: "Середній", percent: 66 },
    B1: { label: "Середній", percent: 66 },
    B2: { label: "Просунутий", percent: 100 },
};

const nextLevel = (lvl) => {
    const i = LEVEL_ORDER.indexOf(lvl);
    if (i === -1) return null;
    return LEVEL_ORDER[i + 1] ?? null;
};

export function normalizeLevel(raw) {
    if (!raw) return "A1";
    const v = String(raw).trim().toUpperCase();
    if (LEVEL_ORDER.includes(v)) return v;
    return "початківець";
}

function levelIndex(lvl) {
    return Math.max(0, LEVEL_ORDER.indexOf(lvl));
}

function uniq(arr) {
    return [...new Set(arr.filter(Boolean))];
}

// --- small helper: resize observer that works in most browsers ---
function useResizeObserver(targetRef, onResize) {
    useEffect(() => {
        const el = targetRef.current;
        if (!el) return;

        let ro = null;
        try {
            ro = new ResizeObserver(() => onResize?.());
            ro.observe(el);
        } catch {
            // ignore
        }

        const onWin = () => onResize?.();
        window.addEventListener("resize", onWin);

        return () => {
            window.removeEventListener("resize", onWin);
            if (ro) ro.disconnect();
        };
    }, [targetRef, onResize]);
}

export default function MarathonPlanner({
                                            theme,
                                            onChange = (_ruleIds) => {},
                                            onLevelChange = (_level) => {},
                                            max = 7,
                                        }) {
    const [userLevel, setUserLevel] = useState("A1");
    const [selected, setSelected] = useState([]); // ruleIds

    // --- layout refs for svg computing ---
    const stageRef = useRef(null); // relative container for nodes + svg
    const nodeRefs = useRef([]); // 0..6
    const [pathD, setPathD] = useState("");

    // ---------- stats map ----------
    const stats = useMemo(() => {
        try {
            return getAllStatistics() || [];
        } catch {
            return [];
        }
    }, []);

    const statByRule = useMemo(() => {
        const m = new Map();
        for (const s of stats) {
            if (s?.rule) {
                m.set(String(s.rule), {
                    accuracy: Number.isFinite(s.accuracy) ? s.accuracy : 0,
                    level: normalizeLevel(s.level),
                    label: s.ruleName || RULE_LABELS?.[s.rule] || s.rule,
                });
            }
        }
        return m;
    }, [stats]);

    const allRulesFlat = useMemo(() => {
        const all = [];
        for (const lvl of LEVEL_ORDER) {
            const arr = LEVEL_RULES?.[lvl] || [];
            for (const r of arr) all.push(String(r));
        }
        return uniq(all);
    }, []);

    // ---------- infer level + build initial 7 ----------
    useEffect(() => {
        const lvl = inferUserLevel();
        const overall = getOverallAccuracy();
        const acc = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

        let inferred = lvl?.level || "A1";
        if (inferred === 'A1' && acc > 40) {
            inferred = 'A2';
        }

        if (inferred !== 'B2' && acc > 85) {
            inferred = 'B2';
        }

        setUserLevel(LEVEL_MAP[inferred] || LEVEL_MAP.A1);

        const levelsForRuleFallback = (ruleId) => {
            const r = String(ruleId);
            for (const L of LEVEL_ORDER) {
                if ((LEVEL_RULES?.[L] || []).includes(r)) return L;
            }
            return "A1";
        };

        const buildInitial = () => {
            const myLevelRules = (LEVEL_RULES?.[lvl] || []).map(String);

            const above = nextLevel(lvl);
            const aboveRules = above ? (LEVEL_RULES?.[above] || []).map(String) : [];

            const getAcc = (ruleId) => statByRule.get(String(ruleId))?.accuracy ?? 0;

            const pickWeakest = (ruleIds, takeN) => {
                const sorted = [...ruleIds].sort((a, b) => getAcc(a) - getAcc(b));
                return sorted.slice(0, Math.max(0, takeN));
            };

            const fromAbove = above ? pickWeakest(aboveRules, 3) : [];
            const remaining = max - fromAbove.length;

            const myCandidates = myLevelRules.filter((r) => !fromAbove.includes(r));
            const fromMy = pickWeakest(myCandidates, remaining);

            const merged = uniq([...fromMy, ...fromAbove]);

            if (merged.length < max) {
                const rest = allRulesFlat.filter((r) => !merged.includes(r));
                merged.push(...rest.slice(0, max - merged.length));
            }

            const levelOf = (r) =>
                statByRule.get(String(r))?.level || normalizeLevel(levelsForRuleFallback(r));
            const accOf = (r) => statByRule.get(String(r))?.accuracy ?? 0;

            return [...merged]
                .slice(0, max)
                .sort((a, b) => {
                    const la = levelIndex(levelOf(a));
                    const lb = levelIndex(levelOf(b));
                    if (la !== lb) return la - lb;
                    return accOf(a) - accOf(b);
                });
        };

        setSelected((prev) => {
            if (prev?.length) return prev;
            const init = buildInitial();
            onChange?.(init);
            return init;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // update parent
    useEffect(() => {
        onChange?.(selected);
    }, [selected, onChange]);

    // ---------- derived list ----------
    const selectedItems = useMemo(() => {
        const getLabel = (r) => statByRule.get(String(r))?.label ?? (RULE_LABELS?.[r] || r);
        return selected.map((id) => ({ id: String(id), label: getLabel(id) }));
    }, [selected, statByRule]);

    // ---------- actions ----------
    const openRule = (ruleId) => {
        const url = `/rule/${ruleId}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    // ---------- styles ----------
    const cardStyle = {
        borderRadius: theme.radius,
        border: `3px solid rgba(0,0,0,0.10)`,
        background: "rgba(255,255,255,0.55)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        padding: 8,
        paddingTop: 0,
        paddingBottom: 10,
        marginBottom: 20,
        fontFamily: "Nunito, system-ui, sans-serif",
    };

    const stageStyle = {
        position: "relative",
        width: "100%",
        padding: "6px 2px 10px 2px",
    };

    const nodeRowStyle = (side) => ({
        display: "flex",
        justifyContent: side === "right" ? "flex-end" : "flex-start",
        padding: "4px 0",
    });

    const nodeStyle = {
        maxWidth: "88%",
        width: "fit-content",
        padding: "10px 12px",
        borderRadius: 999,
        border: "2px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.85)",
        userSelect: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
    };

    const dotStyle = {
        width: 10,
        height: 10,
        borderRadius: 999,
        background: theme.accent,
        flex: "0 0 10px",
    };

    const labelStyle = {
        fontWeight: 900,
        color: theme.text,
        fontSize: 14,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: 260, // keeps it compact inside modal
    };

    // ---------- runtime svg path computation ----------
// ---------- runtime svg path computation ----------
    const computePath = () => {
        const stage = stageRef.current;
        if (!stage) return setPathD("");

        const stageRect = stage.getBoundingClientRect();
        const pts = [];

        for (let i = 0; i < selectedItems.length; i++) {
            const nodeEl = nodeRefs.current[i];
            if (!nodeEl) continue;

            // dot is the first child in your node: <div style={dotStyle} />
            const dotEl = nodeEl.firstElementChild;
            if (!dotEl) continue;

            const r = dotEl.getBoundingClientRect();

            // center of the orange dot, in stage coordinates
            const x = r.left + r.width / 2 - stageRect.left;
            const y = r.top + r.height / 2 - stageRect.top;

            pts.push({ x, y });
        }

        if (pts.length < 2) return setPathD("");

        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

        let d = `M ${pts[0].x} ${pts[0].y}`;

        for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1];
            const b = pts[i];

            const dx = b.x - a.x;

            // mostly-horizontal bezier handles, keeps it smooth but still "snake-like"
            const h = clamp(Math.abs(dx) * 0.55, 30, 140);

            const c1x = a.x + (dx >= 0 ? h : -h);
            const c1y = a.y;

            const c2x = b.x - (dx >= 0 ? h : -h);
            const c2y = b.y;

            d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
        }

        setPathD(d);
    };


    // recompute after layout paints
    useEffect(() => {
        const raf = requestAnimationFrame(() => computePath());
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItems.length, theme.accent]);

    useResizeObserver(stageRef, computePath);

    // also recompute after fonts/images settle a bit
    useEffect(() => {
        const t = setTimeout(() => computePath(), 120);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItems.map((x) => x.id).join("|")]);

    return (
        <div style={cardStyle}>
            <div
                ref={stageRef}
                style={{
                    marginTop: 10,
                    position: "relative",   // ✅ THIS is the important part
                    width: "100%",
                }}
            >

                {/* SVG “wire” behind */}
                <svg
                    width="100%"
                    height="100%"
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: 0,
                        pointerEvents: "none",
                        overflow: "visible",
                    }}
                >

                    {/* soft thick stroke underneath */}
                    {pathD && (
                        <>
                            <path
                                d={pathD}
                                fill="none"
                                stroke="rgba(0,0,0,0.10)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d={pathD}
                                fill="none"
                                stroke={theme.accent}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </>
                    )}
                </svg>

                {/* Nodes */}
                <div style={{position: "relative", zIndex: 1}}>
                    {selectedItems.map((r, idx) => {
                        const side = idx % 2 === 1 ? "right" : "left";
                        return (
                            <div key={r.id} style={nodeRowStyle(side)}>
                                <div
                                    ref={(el) => (nodeRefs.current[idx] = el)}
                                    style={nodeStyle}
                                    title={r.label}
                                >
                                    <div style={dotStyle}/>
                                    <div style={labelStyle}>{r.label}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* tiny helper */}
            <div style={{marginTop: 6, fontSize: 12.5, fontWeight: 800, opacity: 0.55, color: theme.text}}>
                Твій поточний рівень: {userLevel?.label?.toLowerCase()}
            </div>
        </div>
    );
}

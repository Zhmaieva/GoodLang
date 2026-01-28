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
                const _acc = Number.isFinite(s.accuracy) ? s.accuracy : 0;

                // attempts field name can vary; keep it resilient
                const _attemptsRaw =
                    s.attempts ??
                    s.tries ??
                    s.count ??
                    s.total ??
                    s.totalAttempts ??
                    s.n ??
                    0;
                const _attempts = Number.isFinite(Number(_attemptsRaw)) ? Number(_attemptsRaw) : 0;

                m.set(String(s.rule), {
                    accuracy: _acc,
                    attempts: _attempts,
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
            const inferredObj = inferUserLevel();
            const overall = getOverallAccuracy();
            const accOverall = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

            let inferred = inferredObj?.level || "A1";
            if (inferred === "A1" && accOverall > 40) inferred = "A2";
            if (inferred !== "B2" && accOverall > 85) inferred = "B2";

            const currentLevel = normalizeLevel(inferred);

            const primaryLevelForRule = (ruleId) => {
                const r = String(ruleId);
                for (const L of LEVEL_ORDER) {
                    if ((LEVEL_RULES?.[L] || []).includes(r)) return L;
                }
                return "A1";
            };

            const levelOf = (r) => statByRule.get(String(r))?.level || primaryLevelForRule(r);
            const attemptsOf = (r) => Number(statByRule.get(String(r))?.attempts ?? 0) || 0;
            const accuracyOf = (r) => Number(statByRule.get(String(r))?.accuracy ?? 0) || 0;

            const hasData = (r) => attemptsOf(r) > 0;

            // "adjusted like in AccuracyKpi": use accuracy but nudge low-attempt rules to be less decisive
            const adjustedAccuracyOf = (r) => {
                const a = accuracyOf(r);
                const n = attemptsOf(r);
                if (!n) return null; // means "no data"
                // shrink towards 70% for very low attempts (smooth + predictable)
                const w = Math.min(1, n / 5);
                return a * w + 70 * (1 - w);
            };

            const sortWeak = (a, b) => {
                const aa = adjustedAccuracyOf(a);
                const bb = adjustedAccuracyOf(b);

                // rules with data first
                if (aa === null && bb !== null) return 1;
                if (aa !== null && bb === null) return -1;

                // lowest adjusted accuracy first
                if (aa !== bb) return (aa ?? 0) - (bb ?? 0);

                // then fewer attempts first
                const na = attemptsOf(a);
                const nb = attemptsOf(b);
                if (na !== nb) return na - nb;

                return String(a).localeCompare(String(b));
            };

            const pickWeakestWithData = (ruleIds, takeN, extraFilter = null) => {
                const arr = (ruleIds || []).map(String).filter((r) => hasData(r));
                const filtered = extraFilter ? arr.filter(extraFilter) : arr;
                return [...filtered].sort(sortWeak).slice(0, Math.max(0, takeN));
            };

            const pickRandom = (ruleIds, takeN) => {
                const arr = [...(ruleIds || [])].map(String);
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr.slice(0, Math.max(0, takeN));
            };

            const currentRules = (LEVEL_RULES?.[currentLevel] || []).map(String);
            const currentWithData = currentRules.filter(hasData);

            // last fallback: no data at all in this level → random rules of the level
            if (!currentWithData.length) {
                const rnd = pickRandom(currentRules, max);
                return [...rnd].slice(0, max).sort((a, b) => {
                    const la = levelIndex(levelOf(a));
                    const lb = levelIndex(levelOf(b));
                    if (la !== lb) return la - lb;
                    const na = attemptsOf(a);
                    const nb = attemptsOf(b);
                    if (na !== nb) return na - nb;
                    return String(a).localeCompare(String(b));
                });
            }

            const selectedSet = new Set();

            const addMany = (arr) => {
                for (const r of arr || []) {
                    const id = String(r);
                    if (!selectedSet.has(id)) selectedSet.add(id);
                    if (selectedSet.size >= max) break;
                }
            };

            const lowerLevels = LEVEL_ORDER.slice(0, Math.max(0, levelIndex(currentLevel)));
            const aboveLevel = nextLevel(currentLevel);

            // 1) base: take 4 weakest rules of the current level (with data)
            const baseWeak = pickWeakestWithData(currentRules, 4);
            addMany(baseWeak);

            // 1b) If not enough (base 4), take some starting from lower level first (with data)
            if (selectedSet.size < 4) {
                for (let i = lowerLevels.length - 1; i >= 0 && selectedSet.size < 4; i--) {
                    const L = lowerLevels[i];
                    const rulesL = (LEVEL_RULES?.[L] || []).map(String);
                    const picked = pickWeakestWithData(rulesL, 4 - selectedSet.size);
                    addMany(picked);
                }
            }

            // 2) prepend 1 weakest rule of lower levels (attempts >= 5), if any (not for A1)
            if (lowerLevels.length) {
                let lowerCandidates = [];
                for (let i = lowerLevels.length - 1; i >= 0; i--) {
                    const L = lowerLevels[i];
                    const rulesL = (LEVEL_RULES?.[L] || []).map(String);
                    lowerCandidates = lowerCandidates.concat(rulesL);
                }
                const lowerOne = pickWeakestWithData(lowerCandidates, 1, (r) => attemptsOf(r) >= 5);
                addMany(lowerOne);
            }

            // 3) append 2 rules of level above:
            //    - only for "A2 adjusted level", OR
            //    - if we can’t fill 7 with current-level rules that have attempts
            const shouldAddAbove = currentLevel === "A2" || currentWithData.length < max;
            if (shouldAddAbove && aboveLevel) {
                const aboveRules = (LEVEL_RULES?.[aboveLevel] || []).map(String);
                const abovePicked = pickWeakestWithData(aboveRules, 2);
                addMany(abovePicked);
            }

            // 4) fill the rest with weakest rules of the current level (with data), then lower levels, then random current-level
            if (selectedSet.size < max) {
                const remainingCurrent = currentRules.filter((r) => !selectedSet.has(String(r)));
                addMany(pickWeakestWithData(remainingCurrent, max - selectedSet.size));
            }

            if (selectedSet.size < max) {
                for (let i = lowerLevels.length - 1; i >= 0 && selectedSet.size < max; i--) {
                    const L = lowerLevels[i];
                    const rulesL = (LEVEL_RULES?.[L] || []).map(String).filter((r) => !selectedSet.has(String(r)));
                    addMany(pickWeakestWithData(rulesL, max - selectedSet.size));
                }
            }

            if (selectedSet.size < max) {
                const remainingNoData = currentRules.filter((r) => !selectedSet.has(String(r)));
                addMany(pickRandom(remainingNoData, max - selectedSet.size));
            }

            const merged = [...selectedSet].slice(0, max);

            // final ordering requirement: by level (low → high), then attempts (low → high)
            return merged.sort((a, b) => {
                const la = levelIndex(levelOf(a));
                const lb = levelIndex(levelOf(b));
                if (la !== lb) return la - lb;

                const na = attemptsOf(a);
                const nb = attemptsOf(b);
                if (na !== nb) return na - nb;

                return String(a).localeCompare(String(b));
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

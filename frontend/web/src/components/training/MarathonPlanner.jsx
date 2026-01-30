// MarathonPlanner.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getAllStatistics, getOverallAccuracy, inferUserLevel } from "../../services/dataService.js";
import { LEVEL_RULES, RULE_LABELS } from "../../utils/rules.js";

const LEVEL_ORDER = ["A1", "A2", "B1", "B2"];


const ALL_RULE_LABELS = (() => {
    // Prefer RULE_LABELS if present
    if (RULE_LABELS && Object.keys(RULE_LABELS).length) {
        return Object.values(RULE_LABELS);
    }

    // Fallback: build from LEVEL_RULES
    if (LEVEL_RULES) {
        const ids = new Set();
        Object.values(LEVEL_RULES).forEach(arr => {
            arr.forEach(id => ids.add(id));
        });
        return [...ids].map(id => id.replace(/_/g, " ").toLowerCase());
    }

    return [];
})();


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

function loadRules() {
    if (!ALL_RULE_LABELS.length) return "";

    const label =
        ALL_RULE_LABELS[Math.floor(Math.random() * ALL_RULE_LABELS.length)];

    return label;
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
                                            onLoadingComplete = () => {},
                                            max = 7,
                                        }) {
    const [userLevel, setUserLevel] = useState("A1");
    const [selected, setSelected] = useState([]); // ruleIds

    // ---------- probing loading overlay ----------
    const [isProbingLoading, setIsProbingLoading] = useState(true);
    const [probingStatusIndex, setProbingStatusIndex] = useState(0);
    const [probingProgress, setProbingProgress] = useState(0);
    const [probingVisibleCount, setProbingVisibleCount] = useState(0);
    const [probingLabels, setProbingLabels] = useState(() => Array.from({ length: max }, () => ""));
    const probingTextTimerRef = useRef(null);

    // --- layout refs for svg computing ---
    const stageRef = useRef(null); // relative container for nodes + svg
    const nodeRefs = useRef([]); // 0..6
    const [pathD, setPathD] = useState("");

    const PROBING_SEQUENCE = useMemo(
        () => [
            { text: "Збираю статистику…", percent: 10, wait: 820, reveal: 0 },
            { text: "Аналізую правила…", percent: 25, wait: 1020, reveal: 1 },
            { text: "Додаю речення…", percent: 40, wait: 820, reveal: 2 },
            { text: "Балансую складність…", percent: 55, wait: 680, reveal: 3 },
            { text: "Будую плани на 7 днів…", percent: 70, wait: 960, reveal: 5 },
            { text: "Обираю оптимальний…", percent: 85, wait: 1000, reveal: 6 },
            { text: "Фіналізую…", percent: 100, wait: 600, reveal: 7 },
        ],
        []
    );

    const currentProbingStatus = PROBING_SEQUENCE[probingStatusIndex] || PROBING_SEQUENCE[0];

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
        if (inferred === "A1" && acc > 40) inferred = "A2";
        if (inferred !== "B2" && acc > 85) inferred = "B2";

        setUserLevel(LEVEL_MAP[inferred] || LEVEL_MAP.A1);

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

            // like AccuracyKpi-ish: low attempts shrink towards 70
            const adjustedAccuracyOf = (r) => {
                const a = accuracyOf(r);
                const n = attemptsOf(r);
                if (!n) return null;
                const w = Math.min(1, n / 5);
                return a * w + 70 * (1 - w);
            };

            const sortWeak = (a, b) => {
                const aa = adjustedAccuracyOf(a);
                const bb = adjustedAccuracyOf(b);

                if (aa === null && bb !== null) return 1;
                if (aa !== null && bb === null) return -1;

                if (aa !== bb) return (aa ?? 0) - (bb ?? 0);

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

            // 1) 4 weakest current level
            addMany(pickWeakestWithData(currentRules, 4));

            // 1b) fill 4 with lower levels if needed
            if (selectedSet.size < 4) {
                for (let i = lowerLevels.length - 1; i >= 0 && selectedSet.size < 4; i--) {
                    const L = lowerLevels[i];
                    const rulesL = (LEVEL_RULES?.[L] || []).map(String);
                    addMany(pickWeakestWithData(rulesL, 4 - selectedSet.size));
                }
            }

            // 2) +1 weakest lower level with attempts >= 5
            if (lowerLevels.length) {
                let lowerCandidates = [];
                for (let i = lowerLevels.length - 1; i >= 0; i--) {
                    const L = lowerLevels[i];
                    lowerCandidates = lowerCandidates.concat((LEVEL_RULES?.[L] || []).map(String));
                }
                addMany(pickWeakestWithData(lowerCandidates, 1, (r) => attemptsOf(r) >= 5));
            }

            // 3) +2 above level if A2 or not enough data
            const shouldAddAbove = currentLevel === "A2" || currentWithData.length < max;
            if (shouldAddAbove && aboveLevel) {
                addMany(pickWeakestWithData((LEVEL_RULES?.[aboveLevel] || []).map(String), 2));
            }

            // 4) fill remaining
            if (selectedSet.size < max) {
                const remainingCurrent = currentRules.filter((r) => !selectedSet.has(String(r)));
                addMany(pickWeakestWithData(remainingCurrent, max - selectedSet.size));
            }

            if (selectedSet.size < max) {
                for (let i = lowerLevels.length - 1; i >= 0 && selectedSet.size < max; i--) {
                    const L = lowerLevels[i];
                    const rulesL = (LEVEL_RULES?.[L] || [])
                        .map(String)
                        .filter((r) => !selectedSet.has(String(r)));
                    addMany(pickWeakestWithData(rulesL, max - selectedSet.size));
                }
            }

            if (selectedSet.size < max) {
                const remainingNoData = currentRules.filter((r) => !selectedSet.has(String(r)));
                addMany(pickRandom(remainingNoData, max - selectedSet.size));
            }

            const merged = [...selectedSet].slice(0, max);

            // order by level then attempts
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

    // ---------- probing loading overlay logic (always runs on mount) ----------
    useEffect(() => {
        // start clean
        setIsProbingLoading(true);
        setProbingStatusIndex(0);
        setProbingProgress(0);
        setProbingVisibleCount(0);

        // fast-changing gibberish per card
        if (probingTextTimerRef.current) window.clearInterval(probingTextTimerRef.current);
        probingTextTimerRef.current = window.setInterval(() => {
            setProbingLabels(() => Array.from({ length: max }, () => loadRules()));
        }, 200);

        // sequence runner (uses timeouts so it can be cancelled on unmount)
        let cancelled = false;
        const timeouts = [];
        const wait = (ms) =>
            new Promise((resolve) => {
                const t = window.setTimeout(resolve, Math.max(0, ms | 0));
                timeouts.push(t);
            });

        const run = async () => {
            for (let i = 0; i < PROBING_SEQUENCE.length; i++) {
                if (cancelled) return;
                const step = PROBING_SEQUENCE[i];
                setProbingStatusIndex(i);
                setProbingProgress(Math.max(0, Math.min(100, step.percent)));
                if (typeof step.reveal === "number") {
                    setProbingVisibleCount((prev) => Math.max(prev, Math.min(max, step.reveal)));
                }
                await wait(step.wait);
            }
            if (cancelled) return;
            // keep the last "Готово" visible for a beat, then show real list
            await wait(350);
            if (cancelled) return;
            setIsProbingLoading(false);
            onLoadingComplete();
            if (probingTextTimerRef.current) {
                window.clearInterval(probingTextTimerRef.current);
                probingTextTimerRef.current = null;
            }
        };

        run();

        return () => {
            cancelled = true;
            for (const t of timeouts) window.clearTimeout(t);
            if (probingTextTimerRef.current) window.clearInterval(probingTextTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const probingItems = useMemo(() => {
        const arr = Array.from({ length: max }, (_, i) => ({
            id: `probing_${i}`,
            label: probingLabels[i] || "",
        }));
        return arr.slice(0, Math.max(0, Math.min(max, probingVisibleCount)));
    }, [probingLabels, probingVisibleCount, max]);

    // ---------- derived list ----------
    const selectedItems = useMemo(() => {
        const getLabel = (r) => statByRule.get(String(r))?.label ?? (RULE_LABELS?.[r] || r);
        return selected.map((id) => ({ id: String(id), label: getLabel(id) }));
    }, [selected, statByRule]);

    const itemsToRender = useMemo(() => {
        if (isProbingLoading) {
            // Always render 7 nodes; "not loaded yet" are invisible but take space.
            return Array.from({ length: max }, (_, i) => ({
                id: `probing_${i}`,
                label: probingLabels[i] || "",
                _hidden: i >= probingVisibleCount,
            }));
        }

        return selectedItems.map((x) => ({ ...x, _hidden: false }));
    }, [isProbingLoading, max, probingLabels, probingVisibleCount, selectedItems]);


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

    const nodeRowStyle = (side) => ({
        display: "flex",
        justifyContent: side === "right" ? "flex-end" : "flex-start",
        padding: window.innerWidth < 400 ? "2px 0" : "4px 0",
    });

    const nodeStyle = {
        maxWidth: "88%",
        width: "fit-content",
        padding: window.innerWidth < 400 ? "6px 8px" : "10px 12px",
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
        maxWidth: 260,
    };

    // ---------- runtime svg path computation ----------
    const computePath = () => {
        const stage = stageRef.current;
        if (!stage) return setPathD("");

        const stageRect = stage.getBoundingClientRect();
        const pts = [];

        for (let i = 0; i < itemsToRender.length; i++) {
            // ✅ connect only visible nodes while probing loading
            if (isProbingLoading && i >= probingVisibleCount) continue;

            const nodeEl = nodeRefs.current[i];
            if (!nodeEl) continue;

            const dotEl = nodeEl.firstElementChild;
            if (!dotEl) continue;

            const r = dotEl.getBoundingClientRect();
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
    }, [itemsToRender.length, theme.accent, isProbingLoading, probingVisibleCount]);


    useResizeObserver(stageRef, computePath);

    useEffect(() => {
        const t = setTimeout(() => computePath(), 120);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsToRender.map((x) => x.id).join("|")]);

    return (
        <div style={{ ...cardStyle, position: "relative", overflow: "hidden" }}>
            {/* local keyframes for probing loading */}
            <style>{`
        @keyframes glStatus {
          0% { opacity: 0; transform: translateX(18px); }
          18% { opacity: 1; transform: translateX(0px); }
          78% { opacity: 1; transform: translateX(0px); }
          100% { opacity: 0; transform: translateX(-18px); }
        }
        @keyframes glPop {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0px) scale(1); }
        }
      `}</style>

            {/* overlay loader */}
            {isProbingLoading && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 5,
                        pointerEvents: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <div style={{width: "min(520px, 100%)", display: "flex", flexDirection: "column", gap: 10}}>
                        {/* progress bar (AccuracyKpi-ish) */}
                            <div
                                style={{
                                    position: "relative",
                                    height: 32,
                                    borderRadius: 999,
                                    background: "rgba(0,0,0,0.10)",
                                    border: "2px solid rgba(0,0,0,0.12)",
                                    overflow: "hidden",
                                    boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: `${Math.max(2, Math.min(100, probingProgress))}%`,
                                        background: theme.accent,
                                        borderRadius: 999,
                                        transition: "width 650ms cubic-bezier(0.22, 1, 0.36, 1)",
                                        willChange: "width",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        left: 10,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontWeight: 900,
                                        fontSize: 12,
                                        color: "#fff",
                                        letterSpacing: ".02em",
                                    }}
                                >
                                    {Math.round(probingProgress)}%
                                </div>
                            </div>

                            {/* status text */}
                            <div
                                key={`status_${probingStatusIndex}`}
                                style={{
                                    fontWeight: 900,
                                    fontSize: 13.5,
                                    color: theme.text,
                                    opacity: 0,
                                    animationName: "glStatus",
                                    animationDuration: `${Math.max(320, currentProbingStatus?.wait ?? 600)}ms`,
                                    animationTimingFunction: "ease",
                                    animationFillMode: "forwards",
                                    textShadow: "0 1px 0 rgba(255,255,255,0.75)",
                                    paddingLeft: 6,
                                }}
                            >
                                {currentProbingStatus?.text || ""}
                            </div>
                        </div>
                    </div>
                    )}

                    <div
                        ref={stageRef}
                        style={{
                            marginTop: 10,
                            position: "relative",
                            width: "100%",
                            filter: isProbingLoading ? "blur(2px)" : "none",
                            transform: isProbingLoading ? "scale(0.99)" : "none",
                            opacity: isProbingLoading ? 0.55 : 1,
                            transition: "filter 240ms ease, opacity 240ms ease, transform 240ms ease",
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
                            {itemsToRender.map((r, idx) => {
                                const side = idx % 2 === 1 ? "right" : "left";
                                return (
                                    <div key={r.id} style={nodeRowStyle(side)}>
                                        <div
                                            ref={(el) => (nodeRefs.current[idx] = el)}
                                            style={{
                                                ...nodeStyle,
                                                cursor: isProbingLoading ? "default" : "pointer",
                                                visibility: r._hidden ? "hidden" : "visible",   // ✅ takes space, but invisible
                                            }}
                                            title={r.label}
                                            onClick={isProbingLoading || r._hidden ? undefined : () => openRule(r.id)}
                                        >

                                            <div style={dotStyle}/>
                                            <div
                                                style={{
                                                    ...labelStyle,
                                                    opacity: isProbingLoading ? 0.75 : 1,
                                                    animation: isProbingLoading ? "glPop 240ms ease both" : "none",
                                                }}
                                            >
                                                {r.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* tiny helper */}
                    <div
                        style={{
                            marginTop: 6,
                            fontSize: 12.5,
                            fontWeight: 800,
                            opacity: 0.55,
                            color: theme.text,
                            filter: isProbingLoading ? "blur(10px)" : "none",
                            transform: isProbingLoading ? "scale(0.99)" : "none",
                            transition: "filter 240ms ease, transform 240ms ease",
                            userSelect: "none",
                        }}
                    >
                        Твій поточний рівень: {userLevel?.label?.toLowerCase()}
                    </div>
                </div>
            );
            }

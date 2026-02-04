import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import AwesomeTable from "../AwesomeTable.jsx";
import Loader from "../Loader.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";
import { RULE_LABELS } from "../../../utils/rules.js";

function safeId(x) {
    return String(x ?? "").trim();
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function humanSource(src) {
    return String(src || "").replaceAll("_", " ").trim();
}

function makeRandomSeed() {
    return Math.floor(Math.random() * 1_000_000_000);
}

export default function RulesRecommendationsSection({
                                                        selectedStudentIds = [],
                                                        previewKey = "no-students",
                                                        onReady = () => {},
                                                        isNarrow = false,
                                                    }) {
    const {
        recommendedPreview,
        activePreviewStudentId,
        setActivePreviewStudentId,
        loadRecommendedPreview,
        clearRecommendedPreview,
    } = useTeacherDashboard();

    // ✅ seed hidden, random; regenerate on previewKey change
    const seedRef = useRef(makeRandomSeed());

    useEffect(() => {
        seedRef.current = makeRandomSeed();
        // коли змінили вибір — очищаємо старий результат (щоб UI не мигав старим)
        clearRecommendedPreview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewKey]);

    const rootRef = useRef(null);
    const [box, setBox] = useState({ h: 0 });

    useLayoutEffect(() => {
        if (!rootRef.current) return;
        const el = rootRef.current;
        const update = () => {
            const r = el.getBoundingClientRect();
            setBox({ h: Math.floor(r.height || 0) });
        };
        update();
        const ro = new ResizeObserver(() => update());
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const narrowPanelHeight = useMemo(() => {
        const h = box.h || 700;
        return clamp(Math.floor(h * 0.52), 280, 520);
    }, [box.h]);

    const items = Array.isArray(recommendedPreview?.data?.items) ? recommendedPreview.data.items : [];

    const activeItem = useMemo(() => {
        const sid = safeId(activePreviewStudentId);
        return items.find((it) => safeId(it?.studentId) === sid) || null;
    }, [items, activePreviewStudentId]);

    // якщо активний студент не валідний — ставимо перший
    useEffect(() => {
        if (!items.length) return;
        const exists = items.some((it) => safeId(it?.studentId) === safeId(activePreviewStudentId));
        if (!exists) setActivePreviewStudentId(safeId(items[0]?.studentId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length]);

    const quotas = Array.isArray(activeItem?.quotas) ? activeItem.quotas : [];

    const ruleCols = useMemo(
        () => [
            {
                key: "__ruleLabel",
                title: "Правило",
                size: 2,
                sortType: "string",
                render: (r) => <div style={styles.boldEllipsis}>{r.__ruleLabel}</div>,
            },
        ],
        []
    );

    const renderQuotaCard = (q, idx) => {
        const source = String(q?.source || "");
        const count = Number(q?.count ?? 0) || 0;

        const allRules = Array.isArray(q?.rules) ? q.rules.map(String) : [];
        const sliced = allRules.slice(0, Math.max(0, count)); // ✅ slice by count

        const rows = sliced.map((ruleId, i) => ({
            id: `${source}-${idx}-${i}-${ruleId}`,
            __ruleId: ruleId,
            __ruleLabel: RULE_LABELS?.[ruleId] || ruleId,
        }));

        return (
            <div key={`${source}-${idx}`} style={styles.quotaCard}>
                <div style={styles.quotaHeader}>
                    <div style={styles.quotaTitle}>
                        <span style={styles.quotaSource}>{humanSource(source) || "Джерело"}</span>
                        <span style={styles.quotaCount}>{count} завдань</span>
                    </div>
                </div>

                <div style={styles.quotaTableWrap}>
                    <AwesomeTable
                        columns={ruleCols}
                        rows={rows}
                        emptyText={count ? "Немає правил" : "0 завдань"}
                        storageKey={null}
                        defaultSortKey="__ruleLabel"
                        defaultSortDir="asc"
                        onRowClick={(r) => {
                            const rule = safeId(r?.__ruleId);
                            if (!rule) return;

                            const url = `/rule/${rule}`;
                            window.open(url, "_blank", "noopener,noreferrer");
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div
            ref={rootRef}
            style={{
                ...styles.right,
                ...(isNarrow ? { width: "100%", height: narrowPanelHeight } : null),
            }}
        >
            {/* ✅ Loader EXACTLY as requested — inside this section */}
            <Loader
                key={previewKey || "no-students"}
                estimateMs={200}
                minVisibleMs={400}
                description="Готуємо рекомендації для учнів..."
                load={async () => {
                    // If no students selected (should be blocked by step 0 anyway)
                    if (!selectedStudentIds?.length) return;

                    // ✅ seed hidden, random
                    const seed = seedRef.current;

                    // ✅ call endpoint AND store in context
                    await loadRecommendedPreview({
                        studentIds: selectedStudentIds,
                        seed,
                        key: previewKey,
                    });
                }}
                onDone={() => {
                    // ✅ Step 2 validation becomes OK when done
                    onReady?.();
                }}
            >
                <div style={styles.contentWrap}>
                    {recommendedPreview?.err ? <div style={styles.error}>{recommendedPreview.err}</div> : null}

                    {!activeItem ? (
                        <div style={styles.placeholder}>
                            <div style={styles.placeholderTitle}>Немає даних для показу</div>
                            <div style={styles.placeholderSub}>
                                Обери учня зліва або зачекай поки завершиться завантаження.
                            </div>
                        </div>
                    ) : (
                        <div style={styles.grid}>{quotas.map(renderQuotaCard)}</div>
                    )}
                </div>
            </Loader>
        </div>
    );
}

const styles = {
    right: {
        flex: "1 1 auto",
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        border: "2px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        background: "var(--card, #fffdf8)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.06)",
        overflow: "scroll",
        padding: 10,
    },

    contentWrap: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
    },

    error: {
        padding: "10px 12px",
        color: "#8b1d1d",
        fontWeight: 900,
        border: "2px solid rgba(255, 97, 56, 0.25)",
        borderRadius: 14,
        background: "rgba(255, 97, 56, 0.06)",
        marginBottom: 10,
    },

    placeholder: {
        border: "2px dashed rgba(0,0,0,0.12)",
        borderRadius: 14,
        padding: 14,
        background: "rgba(0,0,0,0.02)",
    },
    placeholderTitle: {
        fontWeight: 1000,
        color: "var(--text, #3a2a1d)",
    },
    placeholderSub: {
        marginTop: 6,
        fontWeight: 800,
        color: "var(--muted, #a47856)",
        fontSize: 13,
    },

    grid: {
        flex: "1 1 auto",
        minHeight: 0,
        overflow: "auto",
        padding: 6,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 10,
        alignContent: "start",
    },

    quotaCard: {
        minWidth: 0,
        border: "2px solid rgba(0,0,0,0.08)",
        borderRadius: 14,
        background: "#fff",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 260,
    },
    quotaHeader: {
        flex: "0 0 auto",
        padding: "10px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(0,0,0,0.02)",
    },
    quotaTitle: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 10,
        minWidth: 0,
    },
    quotaSource: {
        fontWeight: 1000,
        color: "var(--text, #3a2a1d)",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    quotaCount: {
        flex: "0 0 auto",
        fontWeight: 900,
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 999,
        background: "rgba(75,163,110,0.12)",
        color: "var(--text, #3a2a1d)",
    },

    quotaTableWrap: {
        flex: "1 1 auto",
        minHeight: 0,
        padding: 10,
    },

    boldEllipsis: {
        fontWeight: 900,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
};

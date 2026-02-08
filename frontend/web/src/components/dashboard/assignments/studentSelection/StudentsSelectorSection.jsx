import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTeacherDashboard } from "../../TeacherDashboardContext.jsx";
import SelectableTableSection from "../../SelectableTableSection.jsx";
import CombinedTables from "../../CombinedTables.jsx";

function uniqStrings(arr) {
    const s = new Set((arr || []).map((x) => String(x)).filter(Boolean));
    return Array.from(s);
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

/**
 * StudentsSelectorSection
 *
 * Preserves existing behavior unless the container is narrow:
 * - wide: fixed-height section, inner tables scroll, no outer scroll
 * - narrow: wraps, the whole section scrolls vertically (so you can reach stacked columns)
 *
 * Parent controls height via style={{ height: ... }} or enclosing flex area.
 */
export default function StudentsSelectorSection({
                                                    style,
                                                    className,

                                                    initialSelectedClassIds = [],
                                                    initialSelectedStudentIds = [],

                                                    onChangeSelectedStudentIds,

                                                    titleClasses = "Classes",
                                                    titleAvailable = "Available students",
                                                    titleSelected = "Selected students",

                                                    // breakpoint for "narrow" behavior (container width)
                                                    narrowBreakpoint = 980,
                                                }) {
    const { classes, students } = useTeacherDashboard();

    const [selectedClassIds, setSelectedClassIds] = useState(() => uniqStrings(initialSelectedClassIds));
    const [selectedStudentIds, setSelectedStudentIds] = useState(() => uniqStrings(initialSelectedStudentIds));

    // report final selection to parent
    useEffect(() => {
        onChangeSelectedStudentIds?.(selectedStudentIds, { source: "students_selector_section" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStudentIds]);

    // ---- measure container width/height to switch behavior ONLY when narrow
    const rootRef = useRef(null);
    const [isNarrow, setIsNarrow] = useState(false);
    const [box, setBox] = useState({ w: 0, h: 0 });

    useLayoutEffect(() => {
        if (!rootRef.current) return;

        const el = rootRef.current;

        const update = () => {
            const r = el.getBoundingClientRect();
            const w = Math.floor(r.width || 0);
            const h = Math.floor(r.height || 0);
            setBox({ w, h });
            setIsNarrow(w > 0 && w < narrowBreakpoint);
        };

        update();

        // ResizeObserver catches width changes inside modals/containers (better than window resize)
        const ro = new ResizeObserver(() => update());
        ro.observe(el);

        return () => ro.disconnect();
    }, [narrowBreakpoint]);

    // in narrow mode, we want each “block” (left / right) to have a fixed internal height
    // so the tables can still scroll internally, and the overall section can scroll if stacked.
    const narrowPanelHeight = useMemo(() => {
        const h = box.h || 600;
        // roughly half-ish of available selector height, but within sane bounds
        return clamp(Math.floor(h * 0.58), 280, 520);
    }, [box.h]);

    // ---- helpers
    const classIdOf = (c) => String(c?.id ?? c?.class_id ?? "");
    const studentIdOf = (s) => String(s?.student_account_id ?? s?.studentId ?? s?.id ?? "");
    const studentClassIdOf = (s) => String(s?.class_id ?? s?.classId ?? "");

    // Map classId => [studentIds]
    const classToStudentIds = useMemo(() => {
        const map = new Map();
        for (const s of students || []) {
            const cid = studentClassIdOf(s);
            const sid = studentIdOf(s);
            if (!cid || !sid) continue;
            if (!map.has(cid)) map.set(cid, new Set());
            map.get(cid).add(sid);
        }
        const out = new Map();
        for (const [cid, set] of map.entries()) out.set(cid, Array.from(set));
        return out;
    }, [students]);

    const classRows = useMemo(() => {
        const list = Array.isArray(classes) ? classes : [];
        return list.map((c, idx) => {
            const cid = classIdOf(c);
            const name = c?.name || c?.class_name || "—";
            const count =
                Number(c?.students_count ?? c?.studentsCount ?? 0) ||
                (classToStudentIds.get(cid)?.length ?? 0);

            return {
                ...c,
                id: cid || `class-${idx}`,
                __classId: cid,
                __className: name,
                __studentsCount: count,
            };
        });
    }, [classes, classToStudentIds]);

    const studentRows = useMemo(() => {
        const list = Array.isArray(students) ? students : [];
        return list.map((s, idx) => {
            const sid = studentIdOf(s);
            const cid = studentClassIdOf(s);
            const nm = [s?.first_name, s?.last_name].filter(Boolean).join(" ").trim();

            return {
                ...s,
                id: sid || `student-${idx}`,
                __studentId: sid,
                __classId: cid,
                __name: nm || s?.email || "—",
                __email: s?.email || "",
            };
        });
    }, [students]);

    const classColumns = useMemo(
        () => [
            {
                key: "__className",
                title: "Class",
                size: 2,
                sortable: true,
                sortType: "string",
                render: (r) => (
                    <div style={{ minWidth: 0 }}>
                        <div style={styles.boldEllipsis}>{r.__className}</div>
                    </div>
                ),
            },
            {
                key: "__studentsCount",
                title: "Students",
                size: 1,
                sortable: true,
                sortType: "number",
                render: (r) => <div style={{ fontWeight: 900 }}>{Number(r.__studentsCount ?? 0)}</div>,
            },
        ],
        []
    );

    const studentColumns = useMemo(
        () => [
            {
                key: "__name",
                title: "Student",
                size: 2,
                sortable: true,
                sortType: "string",
                render: (r) => (
                    <div style={{ minWidth: 0 }}>
                        <div style={styles.boldEllipsis}>{r.__name}</div>
                        {r.__email ? <div style={styles.sub}>{r.__email}</div> : null}
                    </div>
                ),
            },
            {
                key: "class_name",
                title: "Class",
                size: 1,
                sortable: true,
                sortType: "string",
                render: (r) => <div style={styles.sub}>{r?.class_name || "—"}</div>,
            },
        ],
        []
    );

    // Search text helpers
    const classSearchText = (c) => `${c?.__className || ""} ${c?.__studentsCount ?? ""}`;
    const studentSearchText = (s) =>
        `${s?.__name || ""} ${s?.__email || ""} ${s?.class_name || ""} ${s?.class_id || ""}`;

    // ---- Class selection change => bulk student add/remove
    const onClassesChange = (nextClassIds) => {
        const next = uniqStrings(nextClassIds);

        const prevSet = new Set(selectedClassIds);
        const nextSet = new Set(next);

        const added = next.filter((id) => !prevSet.has(id));
        const removed = selectedClassIds.filter((id) => !nextSet.has(id));

        setSelectedClassIds(next);

        // add students for newly selected classes
        if (added.length) {
            const idsToAdd = [];
            for (const cid of added) {
                const list = classToStudentIds.get(String(cid)) || [];
                idsToAdd.push(...list);
            }
            if (idsToAdd.length) {
                setSelectedStudentIds((prev) => uniqStrings([...(prev || []), ...idsToAdd]));
            }
        }

        // remove students for unselected classes
        if (removed.length) {
            const idsToRemove = new Set();
            for (const cid of removed) {
                const list = classToStudentIds.get(String(cid)) || [];
                for (const sid of list) idsToRemove.add(String(sid));
            }
            if (idsToRemove.size) {
                setSelectedStudentIds((prev) =>
                    (prev || []).map(String).filter((sid) => !idsToRemove.has(sid))
                );
            }
        }
    };

    const onStudentsCombinedChange = (nextStudentIds) => {
        setSelectedStudentIds(uniqStrings(nextStudentIds));
    };

    // --- heights for children
    const leftBlockHeight = isNarrow ? narrowPanelHeight : "100%";
    const rightBlockHeight = isNarrow ? narrowPanelHeight : "100%";
    const selectorScrollOverflow = isNarrow ? "auto" : "hidden";

    return (
        <div
            ref={rootRef}
            className={className}
            style={{
                ...styles.wrap,
                overflow: "hidden",
                ...style,
            }}
        >
            {/* scrollable only in narrow mode */}
            <div
                style={{
                    ...styles.scrollWrap,
                    overflowY: selectorScrollOverflow,
                }}
            >
                <div
                    style={{
                        ...styles.row,
                        height: isNarrow ? "auto" : "100%",
                    }}
                >
                    {/* LEFT */}
                    <div
                        style={{
                            ...styles.leftCol,
                            height: leftBlockHeight,
                        }}
                    >
                        <SelectableTableSection
                            title={titleClasses}
                            items={classRows}
                            columns={classColumns}
                            mode="multi"
                            selectedIds={selectedClassIds}
                            onChangeSelectedIds={onClassesChange}
                            getId={(r) => r?.__classId}
                            getSearchText={classSearchText}
                            storageKey="students_selector_classes_sort_v1"
                            emptyText="No classes"
                            style={{ height: "100%" }}
                        />
                    </div>

                    {/* RIGHT */}
                    <div
                        style={{
                            ...styles.rightCol,
                            height: rightBlockHeight,
                        }}
                    >
                        <CombinedTables
                            items={studentRows}
                            selectedIds={selectedStudentIds}
                            onChangeSelectedIds={onStudentsCombinedChange}
                            getId={(r) => r?.__studentId}
                            getSearchText={studentSearchText}
                            columns={studentColumns}
                            availableTitle={titleAvailable}
                            selectedTitle={titleSelected}
                            storageKeyAvailable="students_selector_available_sort_v1"
                            storageKeySelected="students_selector_selected_sort_v1"
                            style={{ height: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
    },

    scrollWrap: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        overflowX: "hidden",
        paddingRight: 2,
    },

    row: {
        display: "flex",
        gap: 14,
        alignItems: "stretch",
        flexWrap: "wrap",
        minWidth: 0,
        minHeight: 0,
    },

    leftCol: {
        flex: "1 1 360px",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },

    rightCol: {
        flex: "3 1 640px",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },

    boldEllipsis: {
        fontWeight: 900,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    sub: {
        marginTop: 4,
        fontWeight: 800,
        color: "var(--muted, #a47856)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
};

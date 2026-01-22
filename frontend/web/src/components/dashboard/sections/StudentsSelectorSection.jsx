import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx"; // :contentReference[oaicite:1]{index=1}
import SelectableTableSection from "./SelectableTableSection.jsx";
import CombinedTables from "../CombinedTables.jsx";

function norm(v) {
    return String(v || "").trim().toLowerCase();
}

function uniqStrings(arr) {
    const s = new Set((arr || []).map((x) => String(x)).filter(Boolean));
    return Array.from(s);
}

/**
 * StudentsSelectorSection
 *
 * - Left column: 2 SelectableTableSection (Classes + Students quick select)
 * - Right column: CombinedTables (Available ↔ Selected students)
 *
 * Behavior:
 * - Selecting a class => bulk select its students
 * - Unselecting a class => bulk unselect its students
 *
 * Output:
 * - onChangeSelectedStudentIds(nextIds, meta)
 *
 * Height:
 * - parent controls height via style (e.g. style={{height: 520}})
 * - children fill that height; tables scroll internally
 */
export default function StudentsSelectorSection({
                                                    // parent can control height via style
                                                    style,
                                                    className,

                                                    // initial values (optional)
                                                    initialSelectedClassIds = [],
                                                    initialSelectedStudentIds = [],

                                                    // notify parent with final student selection
                                                    onChangeSelectedStudentIds,

                                                    // optional labels
                                                    titleClasses = "Класи",
                                                    titleStudentsQuick = "Студенти (швидкий вибір)",
                                                    titleAvailable = "Доступні студенти",
                                                    titleSelected = "Вибрані студенти",
                                                }) {
    const { classes, students } = useTeacherDashboard();

    // internal controlled selection
    const [selectedClassIds, setSelectedClassIds] = useState(() => uniqStrings(initialSelectedClassIds));
    const [selectedStudentIds, setSelectedStudentIds] = useState(() => uniqStrings(initialSelectedStudentIds));

    const combinedRef = useRef(null);

    // keep parent informed
    useEffect(() => {
        onChangeSelectedStudentIds?.(selectedStudentIds, { source: "students_selector_section" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStudentIds]);

    // ---- helpers
    const classIdOf = (c) => String(c?.id ?? c?.class_id ?? "");
    const studentIdOf = (s) => String(s?.student_account_id ?? s?.studentId ?? s?.id ?? "");
    const studentClassIdOf = (s) => String(s?.class_id ?? s?.classId ?? "");

    // Map classId => [studentIds] based on context "students" list
    // (Students list in your dashboard context is already class-aware.)
    const classToStudentIds = useMemo(() => {
        const map = new Map(); // classId -> Set(studentId)
        for (const s of students || []) {
            const cid = studentClassIdOf(s);
            const sid = studentIdOf(s);
            if (!cid || !sid) continue;
            if (!map.has(cid)) map.set(cid, new Set());
            map.get(cid).add(sid);
        }
        // convert to arrays
        const out = new Map();
        for (const [cid, set] of map.entries()) out.set(cid, Array.from(set));
        return out;
    }, [students]);

    // ---- columns (AwesomeTable format)
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
                title: "Клас",
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
                title: "Студентів",
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
                title: "Студент",
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
                title: "Клас",
                size: 1,
                sortable: true,
                sortType: "string",
                render: (r) => <div style={styles.sub}>{r?.class_name || "—"}</div>,
            },
        ],
        []
    );

    // ---- Class selection change -> bulk student selection changes
    const onClassesChange = (nextClassIds, meta) => {
        const next = uniqStrings(nextClassIds);

        const prevSet = new Set(selectedClassIds);
        const nextSet = new Set(next);

        const added = next.filter((id) => !prevSet.has(id));
        const removed = selectedClassIds.filter((id) => !nextSet.has(id));

        setSelectedClassIds(next);

        // bulk add students for newly selected classes
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

        // bulk remove students for unselected classes (literal requirement)
        if (removed.length) {
            const idsToRemove = new Set();
            for (const cid of removed) {
                const list = classToStudentIds.get(String(cid)) || [];
                for (const sid of list) idsToRemove.add(String(sid));
            }
            if (idsToRemove.size) {
                setSelectedStudentIds((prev) => (prev || []).map(String).filter((sid) => !idsToRemove.has(sid)));
            }
        }

        // optional meta hook for debugging / analytics
        // (parent can listen via onChangeSelectedStudentIds)
    };

    // ---- Students quick selection change (left bottom)
    const onStudentsQuickChange = (nextStudentIds, meta) => {
        const next = uniqStrings(nextStudentIds);
        setSelectedStudentIds(next);
    };

    // ---- CombinedTables change (right)
    const onStudentsCombinedChange = (nextStudentIds, meta) => {
        const next = uniqStrings(nextStudentIds);
        setSelectedStudentIds(next);
    };

    // keep CombinedTables in sync even if selection changes via class picker/quick picker
    // (CombinedTables is controlled; no imperative call needed here, but the ref is kept for future messaging)
    useEffect(() => {
        // no-op for now (kept intentionally)
        // combinedRef.current?.setSelectedIds?.(selectedStudentIds);
    }, [selectedStudentIds]);

    // ---- Search text helpers
    const classSearchText = (c) => `${c?.__className || ""} ${c?.__studentsCount ?? ""}`;
    const studentSearchText = (s) =>
        `${s?.__name || ""} ${s?.__email || ""} ${s?.class_name || ""} ${s?.class_id || ""}`;

    return (
        <div
            className={className}
            style={{
                ...styles.wrap,
                ...style,
            }}
        >
            <div style={styles.row}>
                {/* LEFT: two stacked sections */}
                <div style={styles.leftCol}>
                    <div style={styles.leftTop}>
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
                            emptyText="Немає класів"
                            style={{ height: "100%" }}
                        />
                    </div>

                    {/*<div style={styles.leftBottom}>*/}
                    {/*    <SelectableTableSection*/}
                    {/*        title={titleStudentsQuick}*/}
                    {/*        items={studentRows}*/}
                    {/*        columns={studentColumns}*/}
                    {/*        mode="multi"*/}
                    {/*        selectedIds={selectedStudentIds}*/}
                    {/*        onChangeSelectedIds={onStudentsQuickChange}*/}
                    {/*        getId={(r) => r?.__studentId}*/}
                    {/*        getSearchText={studentSearchText}*/}
                    {/*        storageKey="students_selector_students_quick_sort_v1"*/}
                    {/*        emptyText="Немає студентів"*/}
                    {/*        style={{ height: "100%" }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>

                {/* RIGHT: combined available/selected */}
                <div style={styles.rightCol}>
                    <CombinedTables
                        ref={combinedRef}
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
    );
}

const styles = {
    wrap: {
        display: "block",
        minWidth: 0,
        height: "100%", // parent sets explicit height (or it can fill container)
    },

    // 1:3 proportion, wrap on shrink
    row: {
        display: "flex",
        gap: 14,
        alignItems: "stretch",
        height: "100%",
        flexWrap: "wrap",
    },

    leftCol: {
        flex: "1 1 360px", // 1 part, can shrink/wrap
        minWidth: 280,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        height: "100%",
        minHeight: 0, // important for internal scroll regions
    },

    leftTop: {
        flex: "1 1 0",
        minHeight: 0,
    },

    leftBottom: {
        flex: "1 1 0",
        minHeight: 0,
    },

    rightCol: {
        flex: "3 1 640px", // 3 parts
        minWidth: 320,
        height: "100%",
        minHeight: 0,
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

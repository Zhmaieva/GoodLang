// ShareAssignmentPage.jsx — keep current functionality + add left selector + right selected list + action buttons (stub)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../../Page.jsx";
import Input from "../../Input.jsx";
import DynamicList from "../../DynamicList.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import ItemCard from "../../ItemCard.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import { theme } from "../../../../App.jsx";

import { apiBuildTaskSet, apiTeacherTaskSetTasks } from "../../../../services/api.js";
import { groups as ASSIGNMENT_GROUPS } from "../create/CreateAssignmentPage.jsx";

// ✅ teacher dashboard data
import { useTeacherDashboard } from "../../TeacherDashboardContext.jsx";

function parseRules(str) {
    if (!str) return [];
    return String(str)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function parseIntSafe(v, fallback) {
    const n = Number.parseInt(String(v ?? ""), 10);
    return Number.isFinite(n) ? n : fallback;
}

function makeSeed() {
    return Math.floor(Math.random() * 1_000_000);
}

function pad2(n) {
    return String(n).padStart(2, "0");
}

function formatRuleReadable(ruleId) {
    if (!ruleId) return "";
    const result = String(ruleId)
        .toLowerCase()
        .split("_")
        .join(" ")
        .replace(/^\w/, (c) => c.toUpperCase());
    return `"${result}"`;
}

function formatTitleReadable(readableTypeTitle, ruleIds) {
    const d = new Date();
    const dd = pad2(d.getDate());
    const mm = pad2(d.getMonth() + 1);
    const yyyy = d.getFullYear();

    const rules = Array.isArray(ruleIds) ? ruleIds : [];
    let rulePart = "";

    if (rules.length > 0) {
        const formatted = rules.map(formatRuleReadable);
        if (formatted.length > 3) rulePart = formatted.slice(0, 3).join(", ") + " and more";
        else rulePart = formatted.join(", ");
    }

    return `${readableTypeTitle} (${rulePart}) ${dd}.${mm}.${yyyy}`.trim();
}

function resolveGroups(groupsExport) {
    if (typeof groupsExport === "function") {
        const v = groupsExport();
        return Array.isArray(v) ? v : [];
    }
    return Array.isArray(groupsExport) ? groupsExport : [];
}

function formatTypeKeyReadable(key) {
    if (!key) return null;
    return String(key)
        .trim()
        .toLowerCase()
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function getReadableTitleStrictByTypeParam(typeParam) {
    const type = String(typeParam || "").trim();
    if (!type) return null;

    const groupsArr = resolveGroups(ASSIGNMENT_GROUPS);
    for (const g of groupsArr) {
        for (const it of g?.items || []) {
            if (String(it?.url || "").trim() === type) {
                return formatTypeKeyReadable(it.url);
            }
        }
    }
    return null;
}

function safeStr(x) {
    return String(x ?? "").trim();
}

function normalizeHay(x) {
    return safeStr(x).toLowerCase();
}

function studentIdOf(s) {
    return safeStr(s?.student_account_id);
}

function classIdOf(c) {
    return safeStr(c?.id);
}

function studentLabel(s) {
    const first = safeStr(s?.first_name);
    const last = safeStr(s?.last_name);
    const email = safeStr(s?.email);
    const name = `${first} ${last}`.trim();
    return name || email || studentIdOf(s);
}

function classLabel(c) {
    const name = safeStr(c?.name);
    const code = safeStr(c?.invite_code);
    return name || code || classIdOf(c);
}

export function ShareAssignmentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const qp = useMemo(() => new URLSearchParams(location.search), [location.search]);

    // ✅ incoming params (from create page)
    const typeParam = qp.get("type") || "";
    const taskMode = String(qp.get("taskMode") || "").trim();
    const numberOfTasks = parseIntSafe(qp.get("tasks"), 10);
    const ruleIds = parseRules(qp.get("rules"));
    const seedFromUrl = qp.get("seed");

    // ✅ id param (after build)
    const taskSetIdFromUrl = qp.get("taskSetId") || "";

    // ✅ strict readable title from groups (NO fallback)
    const readableTypeTitle = useMemo(() => {
        return getReadableTitleStrictByTypeParam(typeParam);
    }, [typeParam]);

    // local state
    const [taskName, setTaskName] = useState("");

    const [taskSetId, setTaskSetId] = useState(taskSetIdFromUrl || "");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ recipients UI state
    const { classes, students } = useTeacherDashboard();
    const [peopleQuery, setPeopleQuery] = useState("");
    const [selectedStudentIds, setSelectedStudentIds] = useState(() => new Set());

    // initial snapshot (for “no changes since opening”)
    const initialRef = useRef({
        ready: false,
        taskName: "",
        selectedIdsKey: "",
    });

    function selectedIdsKeyFromSet(set) {
        const arr = Array.from(set || []);
        arr.sort();
        return arr.join(",");
    }

    function ensureInitialSnapshot() {
        if (initialRef.current.ready) return;
        initialRef.current = {
            ready: true,
            taskName: taskName || "",
            selectedIdsKey: selectedIdsKeyFromSet(selectedStudentIds),
        };
    }

    // keep taskSetId state in sync if user opens URL with taskSetId
    useEffect(() => {
        if (taskSetIdFromUrl && taskSetIdFromUrl !== taskSetId) {
            setTaskSetId(taskSetIdFromUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskSetIdFromUrl]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            // -------------------------
            // CASE A: have id -> fetch tasks
            // -------------------------
            if (taskSetIdFromUrl) {
                setLoading(true);
                try {
                    const resp = await apiTeacherTaskSetTasks({ taskSetId: taskSetIdFromUrl });
                    if (cancelled) return;
                    setTasks(resp?.tasks || []);
                    setTaskSetId(taskSetIdFromUrl);
                    setTaskName(resp?.title || "");
                } finally {
                    if (!cancelled) setLoading(false);
                }
                return;
            }

            // -------------------------
            // CASE B: no id -> build
            // -------------------------
            if (!readableTypeTitle) return;
            if (!taskMode || !ruleIds.length || !numberOfTasks) return;

            setLoading(true);
            try {
                const seed = Number.isFinite(Number(seedFromUrl)) ? Number(seedFromUrl) : makeSeed();
                const title = taskName || formatTitleReadable(readableTypeTitle, ruleIds);

                const created = await apiBuildTaskSet({
                    taskMode,
                    ruleIds,
                    numberOfTasks,
                    seed,
                    title,
                });

                if (cancelled) return;

                const newId = created?.taskSetId;
                setTaskSetId(newId || "");
                setTasks(created?.tasks || []);

                // ✅ clear ALL other params, keep only taskSetId
                if (newId) {
                    navigate(`${location.pathname}?taskSetId=${encodeURIComponent(newId)}`, { replace: true });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };

        // IMPORTANT: do NOT include taskName (typing must not rebuild)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        taskSetIdFromUrl,
        readableTypeTitle,
        taskMode,
        numberOfTasks,
        ruleIds.join(","),
        seedFromUrl,
        navigate,
        location.pathname,
    ]);

    // once taskName is set from API/build, capture “opening snapshot”
    useEffect(() => {
        if (!loading && !initialRef.current.ready) {
            // if taskName is still empty, we still snapshot (so later “empty -> non-empty” is a change)
            ensureInitialSnapshot();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    // ---------- grouping + filtering ----------
    const normalizedPeopleQuery = useMemo(() => normalizeHay(peopleQuery), [peopleQuery]);

    const activeStudents = useMemo(() => {
        // keep same behavior: we consider only is_active=true as “in class”
        const arr = Array.isArray(students) ? students : [];
        return arr.filter((s) => Boolean(s?.is_active));
    }, [students]);

    const studentsByClassId = useMemo(() => {
        const map = new Map(); // classId -> students[]
        for (const s of activeStudents) {
            const cid = safeStr(s?.class_id);
            if (!cid) continue;
            if (!map.has(cid)) map.set(cid, []);
            map.get(cid).push(s);
        }
        // stable sort inside each class
        for (const [cid, arr] of map.entries()) {
            arr.sort((a, b) => studentLabel(a).localeCompare(studentLabel(b)));
            map.set(cid, arr);
        }
        return map;
    }, [activeStudents]);

    const unassignedStudents = useMemo(() => {
        const arr = activeStudents.filter((s) => !safeStr(s?.class_id));
        return arr.sort((a, b) => studentLabel(a).localeCompare(studentLabel(b)));
    }, [activeStudents]);

    const nonEmptyClasses = useMemo(() => {
        const arr = Array.isArray(classes) ? classes : [];
        const res = arr
            .map((c) => ({ c, id: classIdOf(c) }))
            .filter(({ id }) => id && studentsByClassId.has(id))
            .map(({ c, id }) => ({
                ...c,
                __id: id,
                __students: studentsByClassId.get(id) || [],
            }));

        res.sort((a, b) => classLabel(a).localeCompare(classLabel(b)));
        return res;
    }, [classes, studentsByClassId]);

    function matchesPeopleQueryClass(cls, clsStudents) {
        if (!normalizedPeopleQuery) return true;
        const cName = normalizeHay(classLabel(cls));
        if (cName.includes(normalizedPeopleQuery)) return true;

        // if any student in class matches, keep the class group visible
        for (const s of clsStudents || []) {
            const hay = normalizeHay(`${studentLabel(s)} ${safeStr(s?.email)} ${safeStr(s?.class_name)}`);
            if (hay.includes(normalizedPeopleQuery)) return true;
        }
        return false;
    }

    function matchesPeopleQueryStudent(s) {
        if (!normalizedPeopleQuery) return true;
        const hay = normalizeHay(`${studentLabel(s)} ${safeStr(s?.email)} ${safeStr(s?.class_name)}`);
        return hay.includes(normalizedPeopleQuery);
    }

    const groupedItems = useMemo(() => {
        const groups = [];

        // classes (non-empty)
        for (const cls of nonEmptyClasses) {
            const clsStudents = cls.__students || [];
            if (!matchesPeopleQueryClass(cls, clsStudents)) continue;

            const visibleStudents = clsStudents.filter(matchesPeopleQueryStudent);

            // group shows: class card + (filtered students)
            groups.push({
                kind: "class",
                classId: cls.__id,
                title: classLabel(cls),
                classObj: cls,
                studentsAll: clsStudents,
                studentsVisible: visibleStudents,
            });
        }

        // unassigned group (only if there are such)
        if (unassignedStudents.length > 0) {
            const visible = unassignedStudents.filter(matchesPeopleQueryStudent);
            if (!normalizedPeopleQuery || visible.length > 0) {
                groups.push({
                    kind: "unassigned",
                    title: "Students without class",
                    studentsAll: unassignedStudents,
                    studentsVisible: visible,
                });
            }
        }

        return groups;
    }, [nonEmptyClasses, unassignedStudents, normalizedPeopleQuery]);

    // ---------- selection logic ----------
    function isStudentSelected(studentId) {
        return selectedStudentIds.has(String(studentId));
    }

    function setStudentSelected(studentId, next) {
        setSelectedStudentIds((prev) => {
            const s = new Set(prev);
            const id = String(studentId);
            if (next) s.add(id);
            else s.delete(id);
            return s;
        });
    }

    function toggleStudent(student) {
        const id = studentIdOf(student);
        if (!id) return;
        setStudentSelected(id, !isStudentSelected(id));
    }

    function classSelectionState(classStudentsAll) {
        const ids = (classStudentsAll || []).map(studentIdOf).filter(Boolean);
        if (ids.length === 0) return { all: false, some: false, count: 0, total: 0 };

        let selectedCount = 0;
        for (const id of ids) if (selectedStudentIds.has(String(id))) selectedCount++;

        return {
            all: selectedCount === ids.length,
            some: selectedCount > 0 && selectedCount < ids.length,
            count: selectedCount,
            total: ids.length,
        };
    }

    function toggleWholeClass(classStudentsAll) {
        const ids = (classStudentsAll || []).map(studentIdOf).filter(Boolean);
        if (ids.length === 0) return;

        const { all } = classSelectionState(classStudentsAll);

        setSelectedStudentIds((prev) => {
            const s = new Set(prev);
            if (all) {
                // deselect all
                for (const id of ids) s.delete(String(id));
            } else {
                // select all
                for (const id of ids) s.add(String(id));
            }
            return s;
        });
    }

    // ---------- right side (selected recipients) ----------
    const selectedSummary = useMemo(() => {
        const selected = new Set(Array.from(selectedStudentIds).map(String));
        const selectedClassBlocks = [];
        const selectedIndividuals = [];

        // classes that are fully selected => show as class block
        for (const cls of nonEmptyClasses) {
            const clsStudents = cls.__students || [];
            const ids = clsStudents.map(studentIdOf).filter(Boolean);
            if (ids.length === 0) continue;

            let all = true;
            for (const id of ids) {
                if (!selected.has(String(id))) {
                    all = false;
                    break;
                }
            }

            if (all) {
                selectedClassBlocks.push({
                    kind: "class",
                    classId: cls.__id,
                    title: classLabel(cls),
                    count: ids.length,
                    studentsAll: clsStudents,
                });
                // remove these from individual list consideration
                for (const id of ids) selected.delete(String(id));
            }
        }

        // leftover selected => show as students
        const allStudentsMap = new Map();
        for (const s of activeStudents) {
            const id = studentIdOf(s);
            if (id) allStudentsMap.set(String(id), s);
        }

        for (const id of Array.from(selected)) {
            const s = allStudentsMap.get(String(id));
            if (s) selectedIndividuals.push(s);
        }
        selectedIndividuals.sort((a, b) => studentLabel(a).localeCompare(studentLabel(b)));

        return {
            selectedClassBlocks,
            selectedIndividuals,
            totalSelectedStudents: selectedStudentIds.size,
        };
    }, [selectedStudentIds, nonEmptyClasses, activeStudents]);

    // ---------- button visibility rules ----------
    const hasAnySelected = selectedStudentIds.size > 0;

    const hasChanges = useMemo(() => {
        if (!initialRef.current.ready) return false;

        const initialName = safeStr(initialRef.current.taskName);
        const currName = safeStr(taskName);

        const initialKey = safeStr(initialRef.current.selectedIdsKey);
        const currKey = selectedIdsKeyFromSet(selectedStudentIds);

        return initialName !== currName || initialKey !== currKey;
    }, [taskName, selectedStudentIds]);

    const showPrimaryButton = safeStr(taskName).length > 0 && hasChanges;

    const primaryButtonText = hasAnySelected ? "Save and send" : "Save changes";

    function onPrimaryAction() {
        // ✅ stub: no API call yet
        // (later: update title + assign to selected recipients)
        // If you want “no changes” after click even with stub, uncomment next line:
        // initialRef.current = { ready: true, taskName: safeStr(taskName), selectedIdsKey: selectedIdsKeyFromSet(selectedStudentIds) };
    }

    // Layout
    const t = theme.createGrammarChooseOption;

    const styles = useMemo(
        () => ({
            row: {
                display: "flex",
                gap: t.rowGap,
                width: t.full,
                height: t.full,
                minHeight: t.minH0,
                overflow: "hidden",
                marginTop: theme.bottomDynamicList.padBottom,
            },
            left: {
                width: t.leftWidth,
                minWidth: t.minH0,
                height: t.full,
                minHeight: t.minH0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },
            right: {
                flex: "1 1 auto",
                minWidth: t.minH0,
                height: t.rightHeight,
                maxWidth: t.rightMaxWidth,
                minHeight: t.minH0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            },
            leftTop: {
                paddingLeft: theme.bottomDynamicList.padX * 2,
                paddingBottom: theme.bottomDynamicList.padTop,
                width: "80%",
                opacity: taskName ? 1 : 0,
                transition: "opacity 0.3s",
            },
            leftSearchWrap: {
                paddingTop: theme.bottomDynamicList.padTop,
                paddingLeft: theme.bottomDynamicList.padX * 2,
                paddingBottom: theme.bottomDynamicList.padTop,
                width: "80%",
            },
            leftListWrap: {
                flex: "1 1 auto",
                minHeight: 0,
                paddingLeft: theme.bottomDynamicList.padX * 2,
                paddingRight: theme.bottomDynamicList.padX,
                paddingBottom: theme.bottomDynamicList.padBottom,
            },
            rightTopBar: {
                display: "flex",
                justifyContent: "flex-end",
                gap: theme.spacing?.gap ?? 12,
                paddingRight: theme.bottomDynamicList.padX * 2,
                paddingTop: theme.bottomDynamicList.padTop,
                paddingLeft: theme.bottomDynamicList.padX * 2,
            },
            rightListWrap: {
                flex: "1 1 auto",
                minHeight: 0,
                paddingLeft: theme.bottomDynamicList.padX * 2,
                paddingRight: theme.bottomDynamicList.padX * 2,
                paddingTop: theme.bottomDynamicList.padTop,
                paddingBottom: theme.bottomDynamicList.padBottom,
            },
            tinyHint: { opacity: 0.7, fontSize: 12, marginTop: 6 },
        }),
        [taskName, t]
    );

    return (
        <Page
            title={"Share assignment"}
            subtitle={
                "Instantly share with anyone using the code or the link. " +
                "Or, simply send it to any existent students or classes"
            }
        >
            <div style={styles.row}>
                {/* LEFT */}
                <div style={styles.left}>
                    {/* assignment title */}
                    <div style={styles.leftTop}>
                        <Input
                            title={"Assignment name (visible to students)"}
                            placeholder={`e.g. "Homework for Sally"`}
                            mode="raw"
                            charLimit={120}
                            value={taskName}
                            onChange={setTaskName}
                        />
                    </div>

                    {/* people search */}
                    <div style={styles.leftSearchWrap}>
                        <Input
                            title={"Send to"}
                            placeholder={"Email address of the recipient. Or, search by student name or class name."}
                            mode="raw"
                            charLimit={120}
                            value={peopleQuery}
                            onChange={setPeopleQuery}
                        />
                        <div style={styles.tinyHint}>
                            Select a class to include everyone in it, or pick students individually.
                        </div>
                    </div>

                    {/* grouped list */}
                    <div style={styles.leftListWrap}>
                        <DynamicList
                            ariaLabel="Students and classes"
                            items={groupedItems}
                            renderItem={(group, gi) => {
                                const isClass = group?.kind === "class";
                                const title = safeStr(group?.title);

                                const classState = isClass ? classSelectionState(group.studentsAll) : null;

                                // hide empty visible groups during search
                                const visibleStudents = Array.isArray(group?.studentsVisible) ? group.studentsVisible : [];
                                if (normalizedPeopleQuery && isClass && visibleStudents.length === 0 && !normalizeHay(title).includes(normalizedPeopleQuery)) {
                                    return null;
                                }
                                if (normalizedPeopleQuery && !isClass && visibleStudents.length === 0) {
                                    return null;
                                }

                                return (
                                    <RectangleGroup
                                        key={`${group.kind}-${group.classId || "none"}-${gi}`}
                                        title={
                                            isClass
                                                ? `${title} (${classState.count}/${classState.total})`
                                                : `${title} (${visibleStudents.length})`
                                        }
                                    >
                                        {/* class card (first) */}
                                        {isClass && (
                                            <ItemCard
                                                key={`class-${group.classId}`}
                                                title={title}
                                                selectedShift={false}
                                                subtitle={
                                                    classState.all
                                                        ? "Whole class selected"
                                                        : classState.some
                                                            ? "Partially selected"
                                                            : "Select whole class"
                                                }
                                                selected={classState.all }
                                                onClick={() => toggleWholeClass(group.studentsAll)}
                                                active={classState.all || classState.some}
                                            />
                                        )}

                                        {/* students in group */}
                                        {visibleStudents.map((s) => {
                                            const sid = studentIdOf(s);
                                            const active = sid ? isStudentSelected(sid) : false;
                                            return (
                                                <ItemCard
                                                    key={`student-${sid}`}
                                                    title={studentLabel(s)}
                                                    selectedShift={false}
                                                    subtitle={safeStr(s?.email) || safeStr(s?.class_name)}
                                                    selected={active}
                                                    onClick={() => toggleStudent(s)}
                                                    active={active}
                                                />
                                            );
                                        })}
                                    </RectangleGroup>
                                );
                            }}
                        />
                    </div>
                </div>

                {/* RIGHT */}
                <div style={styles.right}>
                    {/* top-right buttons */}
                    <div style={styles.rightTopBar}>
                        <AwesomeActionButton
                            text={"Return to assignments"}
                            onClick={() => {
                                // stub — do nothing for now
                            }}
                            variant="secondary"
                        />

                        {showPrimaryButton && (
                            <AwesomeActionButton
                                text={primaryButtonText}
                                onClick={onPrimaryAction}
                                variant="primary"
                            />
                        )}
                    </div>

                    {/* selected recipients list */}
                    <div style={styles.rightListWrap}>
                        <DynamicList
                            ariaLabel="Selected recipients"
                            items={[{ key: "selected" }]}
                            renderItem={() => {
                                const hasAnything =
                                    selectedSummary.selectedClassBlocks.length > 0 || selectedSummary.selectedIndividuals.length > 0;

                                return (
                                    <>
                                        <RectangleGroup
                                            title={
                                                hasAnything
                                                    ? `Send to ${selectedSummary.totalSelectedStudents} student${selectedSummary.totalSelectedStudents > 1 ? 's' : ''}`
                                                    : "Send to"
                                            }
                                        >
                                            {!hasAnything && (
                                                <div style={{ padding: 12, opacity: 0.65 }}>
                                                    No recipients selected yet.
                                                </div>
                                            )}

                                            {/* fully-selected classes */}
                                            {selectedSummary.selectedClassBlocks.map((c) => (
                                                <ItemCard
                                                    selectedShift={false}
                                                    key={`sel-class-${c.classId}`}
                                                    title={c.title}
                                                    selected
                                                    subtitle={`Whole class • ${c.count} students`}
                                                    rightText={"Selected"}
                                                    onClick={() => toggleWholeClass(c.studentsAll)}
                                                    active
                                                />
                                            ))}

                                            {/* individual students */}
                                            {selectedSummary.selectedIndividuals.map((s) => {
                                                const sid = studentIdOf(s);
                                                return (
                                                    <ItemCard
                                                        selected
                                                        selectedShift={false}
                                                        key={`sel-student-${sid}`}
                                                        title={studentLabel(s)}
                                                        subtitle={safeStr(s?.class_name) ? `Class: ${safeStr(s?.class_name)}` : safeStr(s?.email)}
                                                        rightText={"Selected"}
                                                        onClick={() => toggleStudent(s)}
                                                        active
                                                    />
                                                );
                                            })}
                                        </RectangleGroup>
                                    </>
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
        </Page>
    );
}

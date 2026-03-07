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

import { useTeacherDashboard } from "../../TeacherDashboardContext.jsx";
import Link from "../../Link.jsx";
import TabSwitcher from "../../TabSwitcher.jsx";
import SharePreviewList from "./SharePreviewList.jsx";
import QrPng from "../../QrPng.jsx";
import PageLeft from "../../PageLeft.jsx";
import PageRight from "../../PageRight.jsx";
import FooterNextButtons from "../../FooterNextButtons.jsx";

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
        if (formatted.length > 1) rulePart = formatted.slice(0, 1).join(", ") + ` and ${formatted.length - 1} more`;
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
    if (s?.__kind === "new_email") {
        const e = safeStr(s?.email);
        return "New student";
    }

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

function normalizeEmail(x) {
    return safeStr(x).toLowerCase();
}

// very light validation per your spec: has @, then a dot, then a symbol after dot
function isEmailLike(x) {
    const s = safeStr(x);
    if (!s) return false;
    // example: a@b.c
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isEmailId(id) {
    return safeStr(id).startsWith("email:");
}

function makeEmailId(email) {
    return `email:${normalizeEmail(email)}`;
}

function makeNewStudentByEmail(email) {
    const e = normalizeEmail(email);
    return {
        __kind: "new_email",
        student_account_id: makeEmailId(e),
        email: e,
        is_active: true,
        first_name: "",
        last_name: "",
        class_id: "",
        class_name: "",
    };
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
    const [taskName, setTaskName] = useState(null);

    const [taskSetId, setTaskSetId] = useState(taskSetIdFromUrl || "");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rightTab, setRightTab] = useState("send");

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
                    const tasks = resp?.tasks || [];
                    const title = resp?.title || "";

                    if (!tasks || !title) {
                        navigate('/school/assignments');
                        return;
                    }

                    setTasks(tasks);
                    setTaskName(title);
                    setTaskSetId(taskSetIdFromUrl);

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


    useEffect(() => {
        const hasId = Boolean(taskSetIdFromUrl || taskSetId);
        if (!hasId) return;

        if (!loading && !initialRef.current.ready && taskName) {
            ensureInitialSnapshot();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, taskName, taskSetIdFromUrl, taskSetId]);


    // ---------- grouping + filtering ----------
    const normalizedPeopleQuery = useMemo(() => normalizeHay(peopleQuery), [peopleQuery]);

    const activeStudents = useMemo(() => {
        // keep same behavior: we consider only is_active=true as “in class”
        const arr = Array.isArray(students) ? students : [];
        return arr.filter((s) => Boolean(s?.is_active));
    }, [students]);

    const activeEmailsSet = useMemo(() => {
        const set = new Set();
        for (const s of activeStudents) {
            const e = normalizeEmail(s?.email);
            if (e) set.add(e);
        }
        return set;
    }, [activeStudents]);

    const emailCandidate = useMemo(() => {
        const raw = safeStr(peopleQuery);
        if (!isEmailLike(raw)) return "";
        return normalizeEmail(raw);
    }, [peopleQuery]);

    const shouldOfferNewEmail = useMemo(() => {
        if (!emailCandidate) return false;
        return !activeEmailsSet.has(emailCandidate);
    }, [emailCandidate, activeEmailsSet]);

    // new-email items that are currently selected (they must persist even if input changes)
    const selectedNewEmailItems = useMemo(() => {
        const arr = [];
        for (const id of Array.from(selectedStudentIds)) {
            const sid = safeStr(id);
            if (isEmailId(sid)) {
                const email = sid.replace(/^email:/, "");
                if (email) arr.push(makeNewStudentByEmail(email));
            }
        }
        // stable
        arr.sort((a, b) => safeStr(a.email).localeCompare(safeStr(b.email)));
        return arr;
    }, [selectedStudentIds]);


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

        // ✅ NEW GROUP: New students (selected ones + current typed candidate if valid)
        const newEmailCards = [...selectedNewEmailItems];

        if (shouldOfferNewEmail) {
            const candidateObj = makeNewStudentByEmail(emailCandidate);
            const candidateId = studentIdOf(candidateObj);
            const alreadySelected = selectedStudentIds.has(String(candidateId));
            if (!alreadySelected) {
                newEmailCards.unshift(candidateObj); // candidate appears on top
            }
        }

        if (newEmailCards.length > 0) {
            // filter by query like everything else
            const visible = newEmailCards.filter(matchesPeopleQueryStudent);
            if (!normalizedPeopleQuery || visible.length > 0) {
                groups.push({
                    kind: "new_emails",
                    title: "New students",
                    studentsAll: newEmailCards,
                    studentsVisible: visible,
                });
            }
        }

        // classes (non-empty)
        for (const cls of nonEmptyClasses) {
            const clsStudents = cls.__students || [];
            if (!matchesPeopleQueryClass(cls, clsStudents)) continue;

            const visibleStudents = clsStudents.filter(matchesPeopleQueryStudent);

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
    }, [
        nonEmptyClasses,
        unassignedStudents,
        normalizedPeopleQuery,
        selectedNewEmailItems,
        shouldOfferNewEmail,
        emailCandidate,
        selectedStudentIds,
    ]);

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
            const sid = String(id);

            // ✅ new-email selected
            if (isEmailId(sid)) {
                const email = sid.replace(/^email:/, "");
                if (email) selectedIndividuals.push(makeNewStudentByEmail(email));
                continue;
            }

            // ✅ normal student selected
            const s = allStudentsMap.get(String(sid));
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

    const primaryButtonText = showPrimaryButton ?
        (hasAnySelected ? "Save and send" : "Save changes")
        : (taskName ? "Changes are saved" : "")


    function onPrimaryAction() {
        // ✅ stub: no API call yet
        // (later: update title + assign to selected recipients)
        // If you want “no changes” after click even with stub, uncomment next line:
        // initialRef.current = { ready: true, taskName: safeStr(taskName), selectedIdsKey: selectedIdsKeyFromSet(selectedStudentIds) };
    }

    // Layout
    const t = theme.createGrammarChooseOption;

    const showByCondition = (condition) => {
        return {
            opacity: condition ? 1 : 0, // (optional) hide until we have an id
            transition: "opacity 0.3s",
        }
    };

    const shareId = safeStr(taskSetIdFromUrl || taskSetId);
    const shareUrl = useMemo(() => {
        if (!shareId) return "";
        return `${window.location.origin}/student/assignments/${encodeURIComponent(shareId)}`;
    }, [shareId]);


    const styles = useMemo(
        () => ({
            leftTop: {
                paddingLeft: theme.bottomDynamicList.padX * 2,
                paddingBottom: theme.bottomDynamicList.padTop,
                width: "80%",
                opacity: taskName !== null ? 1 : 0,
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
                ...showByCondition(taskName)
            },
            rightTopBar: {
                display: "flex",
                justifyContent: "flex-end",
                gap: theme.spacing?.gap ?? 12,
                paddingRight: theme.bottomDynamicList.padX * 2,
                paddingTop: theme.bottomDynamicList.padTop,
                paddingLeft: theme.bottomDynamicList.padX * 2,
            },
            rightTabsWrap: {
                paddingLeft: theme.bottomDynamicList.padX * 2,
                paddingRight: theme.bottomDynamicList.padX * 2,
                paddingTop: theme.bottomDynamicList.padTop,
                ...showByCondition(Boolean(taskName)), // hide until built/fetched title exists (matches your pattern)
            },

            rightListWrap: {
                flex: "1 1 auto",
                minHeight: 0,
                paddingLeft: theme.bottomDynamicList.padX * 2,
                paddingRight: theme.bottomDynamicList.padX * 2,
                paddingBottom: theme.bottomDynamicList.padBottom,
            },
            tinyHint: { opacity: 0.7, fontSize: 12, marginTop: 6 },
            shareLinkWrap: {
                paddingTop: theme.bottomDynamicList.padTop,
                paddingBottom: theme.bottomDynamicList.padTop,
                ...showByCondition(Boolean(shareId)), // ✅ opacity 0 if no id
            },
        }),
        [taskName, t]
    );

    return (
        <Page
            title={"Share assignment"}
            subtitle={
                "With anyone using the link. " +
                "Or, send it to any existent students or classes"
            }
            subSubtitleChild={
                <>
                    {/* share link (from URL id) */}
                    <div style={styles.shareLinkWrap}>
                        <Link href={shareUrl}>
                            {shareUrl}
                        </Link>
                    </div>
                </>
            }
            headerRight={
                <QrPng
                    value={shareUrl}
                    size={120}
                />
            }
        >
            <PageLeft>
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
                        placeholder={"Type an email address of the recipient. Or, search by student name or class name."}
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
            </PageLeft>
            <PageRight>
                {/* selected recipients list */}
                {/* RIGHT: tabs */}
                <div style={styles.rightListWrap}>
                    <TabSwitcher
                        style={{height: "100%", minHeight: 0}}
                        value={rightTab}
                        onChange={setRightTab}
                        tabs={[
                            {key: "send", label: "Assignees"},
                            {key: "preview", label: "Preview"},
                        ]}
                        renderContent={(key) => {
                            if (key === "preview") {
                                return (
                                    <div style={{ flex: "1 1 auto", minHeight: 0, height: "100%", display: "flex" }}>
                                        <SharePreviewList tasks={tasks} style={{ flex: "1 1 auto", minHeight: 0, height: "100%" }} />
                                    </div>
                                );
                            }

                            return (
                                <DynamicList
                                    ariaLabel="Selected recipients"
                                    items={[{key: "selected"}]}
                                    renderItem={() => {
                                        const hasAnything =
                                            selectedSummary.selectedClassBlocks.length > 0 ||
                                            selectedSummary.selectedIndividuals.length > 0;

                                        return (
                                            <RectangleGroup
                                                title={
                                                    hasAnything
                                                        ? `Assign to ${selectedSummary.totalSelectedStudents} student${
                                                            selectedSummary.totalSelectedStudents > 1 ? "s" : ""
                                                        }`
                                                        : "Assign to"
                                                }
                                            >
                                                {!hasAnything && (
                                                    <div style={{padding: 12, opacity: 0.65}}>
                                                        No assignees selected yet.
                                                    </div>
                                                )}

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

                                                {selectedSummary.selectedIndividuals.map((s) => {
                                                    const sid = studentIdOf(s);
                                                    return (
                                                        <ItemCard
                                                            selected
                                                            selectedShift={false}
                                                            key={`sel-student-${sid}`}
                                                            title={studentLabel(s)}
                                                            subtitle={
                                                                safeStr(s?.class_name)
                                                                    ? `Class: ${safeStr(s?.class_name)}`
                                                                    : safeStr(s?.email)
                                                            }
                                                            rightText={"Selected"}
                                                            onClick={() => toggleStudent(s)}
                                                            active
                                                        />
                                                    );
                                                })}
                                            </RectangleGroup>
                                        );
                                    }}
                                />
                            );
                        }}
                    />
                </div>

                <FooterNextButtons>
                    <AwesomeActionButton
                        size="regular"
                        variant={"ghost"}
                        title={"Copy share link"}
                        onClick={() => {
                            // stub (no clipboard yet)
                            // later: navigator.clipboard.writeText(`${window.location.origin}/.../${taskSetId}`)
                        }}
                    >
                        Go to assignment list
                    </AwesomeActionButton>

                    <AwesomeActionButton
                        style={{
                            ...showByCondition(primaryButtonText), // ✅ visible if anything changed (and title not empty)
                        }}
                        size="regular"
                        variant={"ghost"}
                        disabled={!showPrimaryButton}
                        title={primaryButtonText}
                        onClick={() => {
                            // stub
                            // later: if hasAnySelected -> assign/send; else -> save title only
                        }}
                    >
                        {primaryButtonText}
                    </AwesomeActionButton>
                </FooterNextButtons>
            </PageRight>
        </Page>
    );
}

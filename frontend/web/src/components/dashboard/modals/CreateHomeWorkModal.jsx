// HomeworkTaskSetModal.jsx — FULL DROP-IN (UPDATED)
//
// Changes requested:
// ✅ remove visible class id + students count from class list
// ✅ add Recommended toggle into Rules section + put Level select there
// ✅ layout: Classes + Students pair on SAME ROW, students area ~3/4 width
// ✅ students tables use CHECKBOXES (no add/remove buttons)
// ✅ general settings (title/type/tasks/deadline) on SAME ROW with Rules/Level
// ✅ no seed at all (removed from state + payload)
//
// Behavior kept:
// ✅ Available = ALL students not selected (not dependent on class selection)
// ✅ Selecting a class auto-adds its students; unselect removes them (unless kept manually)
// ✅ Manual students persist even if class unselected
// ✅ Exclude (via unchecking a class-selected student) prevents re-adding while the class remains selected
// ✅ Recommended mode: rules disabled, level required, ruleIds forced []

import React, { useEffect, useMemo, useState } from "react";
import { RULE_LABELS } from "../../../utils/rules.js"; // adjust if needed

const TASK_TYPES = [
    { id: "translations", label: "Translations" },
    { id: "gaps", label: "Gaps" },
    { id: "mixed", label: "Mixed" },
];

const LEVELS = ["A1", "A2", "B1", "B2"];

function norm(s) {
    return String(s ?? "").trim().toLowerCase();
}

function clampInt(n, min, max, fallback) {
    const x = Number.parseInt(n, 10);
    if (!Number.isFinite(x)) return fallback;
    return Math.min(max, Math.max(min, x));
}

function fullName(s) {
    const fn = String(s?.firstName ?? s?.first_name ?? "").trim();
    const ln = String(s?.lastName ?? s?.last_name ?? "").trim();
    const name = `${fn} ${ln}`.trim();
    return name || (s?.email ?? "") || String(s?.id ?? "");
}

function cmpStudents(a, b) {
    const A = norm(fullName(a));
    const B = norm(fullName(b));
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
}

function buildAllRuleOptions() {
    const entries = Object.entries(RULE_LABELS || {});
    const opts = entries.map(([id, label]) => ({ id, label: String(label || id) }));
    opts.sort((a, b) => (norm(a.label) < norm(b.label) ? -1 : 1));
    return opts;
}

function getStudentId(s) {
    return String(s?.id ?? s?.student_account_id ?? "");
}

function getStudentClassIds(s) {
    // supports classIds[] OR class_id
    if (Array.isArray(s?.classIds)) return s.classIds.map(String);
    if (s?.class_id) return [String(s.class_id)];
    return [];
}

export default function HomeworkTaskSetModal({
                                                 // supports both props
                                                 isOpen,
                                                 open,
                                                 onClose,
                                                 onCreate,

                                                 classes = [],
                                                 students = [],

                                                 defaultTitle = "",
                                                 defaultTaskType = "translations",
                                                 defaultLevel = "A1",
                                                 defaultTasksCount = 10,
                                                 defaultDeadline = "",

                                                 defaultSelectedClassIds = [],
                                                 defaultSelectedStudentIds = [],
                                                 defaultRuleIds = [],
                                                 defaultRecommended = false,
                                             }) {
    const modalOpen = !!(typeof isOpen === "boolean" ? isOpen : open);

    // searches
    const [classSearch, setClassSearch] = useState("");
    const [rulesSearch, setRulesSearch] = useState("");
    const [availableSearch, setAvailableSearch] = useState("");
    const [selectedSearch, setSelectedSearch] = useState("");

    // selectors
    const [selectedClassIds, setSelectedClassIds] = useState(() => new Set(defaultSelectedClassIds.map(String)));

    // manual selections keep order (newly checked from available goes to top)
    const [manualSelectedIds, setManualSelectedIds] = useState(() =>
        (Array.isArray(defaultSelectedStudentIds) ? defaultSelectedStudentIds : []).map(String)
    );

    // exclude class-derived students (so they stay unchecked even if class remains selected)
    const [excludedIds, setExcludedIds] = useState(() => new Set());

    // rules
    const allRuleOptions = useMemo(() => buildAllRuleOptions(), []);
    const [selectedRuleIds, setSelectedRuleIds] = useState(() => new Set((defaultRuleIds || []).map(String)));

    // config
    const [title, setTitle] = useState(defaultTitle);
    const [taskType, setTaskType] = useState(defaultTaskType);
    const [recommended, setRecommended] = useState(!!defaultRecommended);
    const [level, setLevel] = useState(defaultLevel);
    const [tasksCount, setTasksCount] = useState(defaultTasksCount);
    const [deadline, setDeadline] = useState(defaultDeadline);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!modalOpen) return;

        setClassSearch("");
        setRulesSearch("");
        setAvailableSearch("");
        setSelectedSearch("");

        setSelectedClassIds(new Set((defaultSelectedClassIds || []).map(String)));
        setManualSelectedIds((Array.isArray(defaultSelectedStudentIds) ? defaultSelectedStudentIds : []).map(String));
        setExcludedIds(new Set());

        setSelectedRuleIds(new Set((defaultRuleIds || []).map(String)));

        setTitle(defaultTitle);
        setTaskType(defaultTaskType);
        setRecommended(!!defaultRecommended);
        setLevel(defaultLevel);
        setTasksCount(defaultTasksCount);
        setDeadline(defaultDeadline);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalOpen]);

    // --- derived sets
    const classDerivedSelectedSet = useMemo(() => {
        const out = new Set();
        if (!selectedClassIds.size) return out;

        for (const s of students || []) {
            const id = getStudentId(s);
            if (!id) continue;

            const classIds = getStudentClassIds(s);
            if (classIds.some((cid) => selectedClassIds.has(cid))) {
                out.add(id);
            }
        }
        return out;
    }, [students, selectedClassIds]);

    const manualSet = useMemo(() => new Set(manualSelectedIds), [manualSelectedIds]);

    const effectiveSelectedSet = useMemo(() => {
        const out = new Set();
        for (const id of classDerivedSelectedSet) {
            if (!excludedIds.has(id)) out.add(id);
        }
        for (const id of manualSet) out.add(id);
        return out;
    }, [classDerivedSelectedSet, excludedIds, manualSet]);

    const selectedOrderedIds = useMemo(() => {
        const map = new Map((students || []).map((s) => [getStudentId(s), s]));

        const classOnly = [];
        for (const id of classDerivedSelectedSet) {
            if (excludedIds.has(id)) continue;
            if (manualSet.has(id)) continue;
            classOnly.push(id);
        }
        classOnly.sort((a, b) => cmpStudents(map.get(a), map.get(b)));

        return [...manualSelectedIds, ...classOnly];
    }, [students, manualSelectedIds, classDerivedSelectedSet, excludedIds, manualSet]);

    // --- filtering
    const classesFiltered = useMemo(() => {
        const q = norm(classSearch);
        const list = Array.isArray(classes) ? classes : [];
        if (!q) return list;
        return list.filter((c) => norm(c?.name).includes(q));
    }, [classes, classSearch]);

    const rulesFiltered = useMemo(() => {
        if (recommended) return [];
        const q = norm(rulesSearch);
        const list = allRuleOptions;
        if (!q) return list;
        return list.filter((r) => norm(r.label).includes(q) || norm(r.id).includes(q));
    }, [allRuleOptions, rulesSearch, recommended]);

    // available = all - selected
    const availableStudents = useMemo(() => {
        const q = norm(availableSearch);
        const list = (students || [])
            .map((s) => ({ ...s, __id: getStudentId(s) }))
            .filter((s) => s.__id && !effectiveSelectedSet.has(s.__id))
            .sort((a, b) => cmpStudents(a, b));

        if (!q) return list;
        return list.filter((s) => {
            const hay = `${fullName(s)} ${s?.email ?? ""} ${s.__id}`.toLowerCase();
            return hay.includes(q);
        });
    }, [students, effectiveSelectedSet, availableSearch]);

    const selectedStudents = useMemo(() => {
        const q = norm(selectedSearch);
        const map = new Map((students || []).map((s) => [getStudentId(s), s]));
        const list = selectedOrderedIds.map((id) => map.get(id)).filter(Boolean);

        if (!q) return list;
        return list.filter((s) => {
            const id = getStudentId(s);
            const hay = `${fullName(s)} ${s?.email ?? ""} ${id}`.toLowerCase();
            return hay.includes(q);
        });
    }, [students, selectedOrderedIds, selectedSearch]);

    // --- handlers
    const toggleClass = (classId) => {
        const id = String(classId);
        setSelectedClassIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleRule = (ruleId) => {
        const id = String(ruleId);
        setSelectedRuleIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // checkbox selection from AVAILABLE table:
    // checking means "add manually" (to top), unchecking means nothing (it wouldn’t be in available if selected)
    const checkAvailableStudent = (studentId, checked) => {
        const id = String(studentId);
        if (!checked) return;

        setManualSelectedIds((prev) => [id, ...prev.filter((x) => x !== id)]);
        setExcludedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });

        // optional: clear selected search so newly added appears clearly
        setSelectedSearch("");
    };

    // checkbox selection from SELECTED table:
    // unchecking removes (manual remove OR class-derived exclude)
    const checkSelectedStudent = (studentId, checked) => {
        const id = String(studentId);
        if (checked) return; // already selected

        // remove from manual if present
        setManualSelectedIds((prev) => prev.filter((x) => x !== id));

        // if it came from class-derived, exclude it so it doesn’t re-appear while class stays selected
        setExcludedIds((prev) => {
            const next = new Set(prev);
            if (classDerivedSelectedSet.has(id)) next.add(id);
            return next;
        });
    };

    const setRecommendedMode = (next) => {
        const on = !!next;
        setRecommended(on);
        if (on) {
            setSelectedRuleIds(new Set());
            setRulesSearch("");
        }
    };

    const canSubmit = useMemo(() => {
        const n = clampInt(tasksCount, 1, 50, 0);
        if (!title.trim()) return false;
        if (!["translations", "gaps", "mixed"].includes(taskType)) return false;
        if (n < 1 || n > 50) return false;
        if (effectiveSelectedSet.size < 1) return false;

        if (recommended) {
            if (!LEVELS.includes(String(level).toUpperCase())) return false;
            return true;
        }
        // manual rules required
        if (!selectedRuleIds.size) return false;
        return true;
    }, [title, taskType, tasksCount, effectiveSelectedSet.size, recommended, level, selectedRuleIds]);

    const submit = async () => {
        if (!canSubmit || isSubmitting) return;

        const payload = {
            title: title.trim(),
            taskType,
            numberOfTasks: clampInt(tasksCount, 1, 50, 10),
            deadline: String(deadline || "").trim() || null,

            recommended: !!recommended,
            level: recommended ? String(level).toUpperCase() : null,
            ruleIds: recommended ? [] : Array.from(selectedRuleIds),

            classIds: Array.from(selectedClassIds),
            studentIds: Array.from(effectiveSelectedSet),
        };

        setIsSubmitting(true);
        try {
            await onCreate?.(payload);
            onClose?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!modalOpen) return null;

    return (
        <div style={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <div style={styles.title}>Додати домашнє завдання</div>
                    <button style={styles.x} onClick={onClose} aria-label="Close">×</button>
                </div>

                {/* ROW 1: Classes (1/4) + Students (3/4) */}
                <div style={styles.topRow}>
                    {/* Classes */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={styles.cardTitle}>Класи</div>
                            <input
                                value={classSearch}
                                onChange={(e) => setClassSearch(e.target.value)}
                                placeholder="Пошук..."
                                style={styles.search}
                            />
                        </div>

                        <div style={styles.tableWrapTall}>
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    <th style={{ ...styles.th, width: 44 }}></th>
                                    <th style={styles.th}>Назва</th>
                                </tr>
                                </thead>
                                <tbody>
                                {classesFiltered.map((c) => {
                                    const id = String(c.id);
                                    const checked = selectedClassIds.has(id);
                                    return (
                                        <tr key={id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <input type="checkbox" checked={checked} onChange={() => toggleClass(id)} />
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.rowMain}>{c.name}</div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {!classesFiltered.length && (
                                    <tr>
                                        <td style={styles.empty} colSpan={2}>Немає класів</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div style={styles.smallHint}>
                            Вибрані класи автоматично додають своїх учнів до “Обрані”.
                        </div>
                    </div>

                    {/* Students (3/4) */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={styles.cardTitle}>Учні</div>
                            <div style={styles.counter}>
                                Обрані: <b>{effectiveSelectedSet.size}</b>
                            </div>
                        </div>

                        <div style={styles.studentsSplit}>
                            {/* Available */}
                            <div style={styles.studentPane}>
                                <div style={styles.paneHeader}>
                                    <div style={styles.paneTitle}>Доступні</div>
                                    <input
                                        value={availableSearch}
                                        onChange={(e) => setAvailableSearch(e.target.value)}
                                        placeholder="Пошук..."
                                        style={styles.searchSmall}
                                    />
                                </div>

                                <div style={styles.tableWrapTall}>
                                    <table style={styles.table}>
                                        <thead>
                                        <tr>
                                            <th style={{ ...styles.th, width: 44 }}></th>
                                            <th style={styles.th}>Учень</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {availableStudents.map((s) => {
                                            const id = String(s.__id || s.id || s.student_account_id);
                                            return (
                                                <tr key={id} style={styles.tr}>
                                                    <td style={styles.td}>
                                                        <input
                                                            type="checkbox"
                                                            checked={false}
                                                            onChange={(e) => checkAvailableStudent(id, e.target.checked)}
                                                        />
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.rowMain}>{fullName(s)}</div>
                                                        <div style={styles.rowSub}>{s.email || id}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {!availableStudents.length && (
                                            <tr>
                                                <td style={styles.empty} colSpan={2}>Немає доступних учнів</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Selected */}
                            <div style={styles.studentPane}>
                                <div style={styles.paneHeader}>
                                    <div style={styles.paneTitle}>Обрані</div>
                                    <input
                                        value={selectedSearch}
                                        onChange={(e) => setSelectedSearch(e.target.value)}
                                        placeholder="Пошук..."
                                        style={styles.searchSmall}
                                    />
                                </div>

                                <div style={styles.tableWrapTall}>
                                    <table style={styles.table}>
                                        <thead>
                                        <tr>
                                            <th style={{ ...styles.th, width: 44 }}></th>
                                            <th style={styles.th}>Учень</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedStudents.map((s) => {
                                            const id = getStudentId(s);
                                            return (
                                                <tr key={id} style={styles.tr}>
                                                    <td style={styles.td}>
                                                        <input
                                                            type="checkbox"
                                                            checked={true}
                                                            onChange={(e) => checkSelectedStudent(id, e.target.checked)}
                                                        />
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.rowMain}>{fullName(s)}</div>
                                                        <div style={styles.rowSub}>{s?.email || id}</div>
                                                        {excludedIds.has(id) ? (
                                                            <div style={styles.excludedNote}>(excluded from class auto-add)</div>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {!selectedStudents.length && (
                                            <tr>
                                                <td style={styles.empty} colSpan={2}>Додайте хоча б одного учня</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={styles.smallHint}>
                                    Зніміть чекбокс, щоб прибрати учня (manual) або виключити (class-selected).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 2: Rules/Level/Recommended + General settings on the SAME ROW */}
                <div style={styles.bottomRow}>
                    {/* Rules / Recommended / Level */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={styles.cardTitle}>Правила</div>
                            <div style={styles.ruleControls}>
                                <label style={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={recommended}
                                        onChange={(e) => setRecommendedMode(e.target.checked)}
                                    />
                                    Recommended
                                </label>

                                {recommended ? (
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <span style={styles.smallLabel}>Level:</span>
                                        <select value={level} onChange={(e) => setLevel(e.target.value)} style={styles.inputSmall}>
                                            {LEVELS.map((l) => (
                                                <option key={l} value={l}>{l}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {!recommended ? (
                            <>
                                <input
                                    value={rulesSearch}
                                    onChange={(e) => setRulesSearch(e.target.value)}
                                    placeholder="Пошук правила..."
                                    style={styles.search}
                                />

                                <div style={{ height: 10 }} />

                                <div style={styles.rulesWrap}>
                                    {rulesFiltered.map((r) => {
                                        const id = String(r.id);
                                        const checked = selectedRuleIds.has(id);
                                        return (
                                            <label key={id} style={styles.ruleRow}>
                                                <input type="checkbox" checked={checked} onChange={() => toggleRule(id)} />
                                                <span style={styles.ruleLabel}>{r.label}</span>
                                            </label>
                                        );
                                    })}
                                    {!rulesFiltered.length && <div style={styles.emptyBlock}>Немає правил</div>}
                                </div>

                                <div style={styles.smallHint}>
                                    Friendly names shown; payload sends internal rule ids (underscore names).
                                </div>
                            </>
                        ) : (
                            <div style={styles.smallHint}>
                                Recommended mode: rules disabled. Backend will select tasks for the chosen level.
                            </div>
                        )}
                    </div>

                    {/* General settings */}
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>Налаштування</div>

                        <div style={styles.formGrid}>
                            <div style={styles.field}>
                                <div style={styles.label}>Назва</div>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
                            </div>

                            <div style={styles.field}>
                                <div style={styles.label}>Тип</div>
                                <select value={taskType} onChange={(e) => setTaskType(e.target.value)} style={styles.input}>
                                    {TASK_TYPES.map((t) => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.field}>
                                <div style={styles.label}>К-сть завдань (1–50)</div>
                                <input
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={tasksCount}
                                    onChange={(e) => setTasksCount(e.target.value)}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <div style={styles.label}>Дедлайн (опційно)</div>
                                <input
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.actions}>
                            <button style={styles.secondaryBtn} onClick={onClose} disabled={isSubmitting}>
                                Скасувати
                            </button>
                            <button
                                style={{ ...styles.primaryBtn, opacity: canSubmit ? 1 : 0.55 }}
                                onClick={submit}
                                disabled={!canSubmit || isSubmitting}
                            >
                                {isSubmitting ? "Створюємо..." : "Створити"}
                            </button>
                        </div>

                        {!canSubmit ? (
                            <div style={styles.smallHint}>
                                {effectiveSelectedSet.size < 1 ? "Оберіть хоча б одного учня." : null}
                                {!recommended && !selectedRuleIds.size ? " Оберіть хоча б одне правило (або увімкніть Recommended)." : null}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    backdrop: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 18,
        zIndex: 9999,
    },
    modal: {
        width: "min(1280px, 96vw)",
        maxHeight: "92vh",
        overflow: "hidden",
        background: "#fff",
        borderRadius: 14,
        border: "2px solid #111",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        padding: "14px 16px",
        borderBottom: "2px solid #111",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
    },
    title: { fontSize: 18, fontWeight: 800 },
    x: {
        border: "2px solid #111",
        background: "#fff",
        borderRadius: 10,
        width: 36,
        height: 36,
        cursor: "pointer",
        fontSize: 22,
        lineHeight: "30px",
    },

    // layout rows inside modal
    topRow: {
        display: "grid",
        gridTemplateColumns: "1fr 3fr", // ✅ classes ~1/4, students ~3/4
        gap: 14,
        padding: 14,
        overflow: "auto",
    },
    bottomRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr", // rules + settings on same row
        gap: 14,
        padding: "0 14px 14px 14px",
        overflow: "auto",
    },

    card: {
        border: "2px solid #111",
        borderRadius: 14,
        padding: 12,
        background: "#fff",
        minWidth: 0,
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
        flexWrap: "wrap",
    },
    cardTitle: { fontWeight: 800, fontSize: 14 },

    search: {
        padding: "9px 10px",
        border: "2px solid #111",
        borderRadius: 12,
        fontSize: 13,
        outline: "none",
        width: "min(360px, 100%)",
    },
    searchSmall: {
        padding: "8px 10px",
        border: "2px solid #111",
        borderRadius: 12,
        fontSize: 13,
        outline: "none",
        width: "100%",
    },

    tableWrapTall: {
        maxHeight: 380,
        overflow: "auto",
        border: "2px solid #111",
        borderRadius: 12,
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: {
        textAlign: "left",
        padding: "10px 10px",
        borderBottom: "2px solid #111",
        background: "#fff7ec",
        position: "sticky",
        top: 0,
        zIndex: 1,
    },
    tr: { borderBottom: "1px solid rgba(0,0,0,0.12)" },
    td: { padding: "10px 10px", verticalAlign: "top" },
    rowMain: { fontWeight: 800 },
    rowSub: { opacity: 0.7, fontSize: 12, marginTop: 2 },
    empty: { padding: 14, opacity: 0.7, textAlign: "center" },

    studentsSplit: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        alignItems: "start",
    },
    studentPane: { minWidth: 0, display: "flex", flexDirection: "column", gap: 8 },
    paneHeader: { display: "flex", gap: 8, alignItems: "center" },
    paneTitle: { fontWeight: 900, minWidth: 92 },

    counter: { fontWeight: 900, fontSize: 13, opacity: 0.85 },

    rulesWrap: {
        border: "2px solid #111",
        borderRadius: 12,
        padding: 10,
        maxHeight: 320,
        overflow: "auto",
    },
    ruleRow: {
        display: "grid",
        gridTemplateColumns: "20px 1fr",
        gap: 10,
        alignItems: "center",
        padding: "8px 6px",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
    },
    ruleLabel: { fontWeight: 800, fontSize: 13 },
    emptyBlock: { padding: 12, opacity: 0.7 },

    ruleControls: { display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" },
    toggle: { display: "flex", gap: 10, alignItems: "center", fontWeight: 900 },
    smallLabel: { fontWeight: 900, fontSize: 12, opacity: 0.85 },
    inputSmall: {
        padding: "8px 10px",
        border: "2px solid #111",
        borderRadius: 12,
        fontSize: 13,
        outline: "none",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginTop: 10,
    },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontSize: 12, fontWeight: 800, opacity: 0.85 },
    input: {
        padding: "10px 10px",
        border: "2px solid #111",
        borderRadius: 12,
        fontSize: 13,
        outline: "none",
        width: "100%",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 14,
    },
    primaryBtn: {
        border: "2px solid #111",
        background: "#ff6138",
        color: "#111",
        borderRadius: 12,
        padding: "10px 14px",
        fontWeight: 900,
        cursor: "pointer",
    },
    secondaryBtn: {
        border: "2px solid #111",
        background: "#fff",
        borderRadius: 12,
        padding: "10px 14px",
        fontWeight: 900,
        cursor: "pointer",
    },

    excludedNote: { marginTop: 4, fontSize: 11, opacity: 0.7, fontWeight: 800 },
    smallHint: { marginTop: 10, fontSize: 12, opacity: 0.75, lineHeight: 1.35, fontWeight: 800 },
};

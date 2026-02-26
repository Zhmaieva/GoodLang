// database/repositories/schoolTaskRepository.js
//
// Teacher/Student/Homework repository layer (MongoDB)
//
// Collections used:
// - good_lang_task_sets
// - good_lang_tasks
// - good_lang_task_set_assignments
// - good_lang_scores (READ ONLY for homework progress + teacher view; NO filtering by taskId for analytics unless requested)
//
// NOTE:
// - userId / teacherId / studentId are UUID strings
// - taskSetId / taskId are Mongo ObjectId
//
// Exports include the ones your controllers used to import from scoresRepository.

import { connectDB } from "../mongo.js";
import { ObjectId } from "mongodb";
import { LEVEL_RULES } from "../../core/rules.js"; // adjust if your path differs

// -----------------------------
// helpers
// -----------------------------
function isObjectIdLike(id) {
    return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}
export function toObjectIdStrict(id, name = "id") {
    if (id instanceof ObjectId) return id;
    const s = String(id || "").trim();
    if (!isObjectIdLike(s)) throw new Error(`${name} must be a 24-hex ObjectId string`);
    return new ObjectId(s);
}
function toObjectIdMaybe(id) {
    if (!id) return null;
    if (id instanceof ObjectId) return id;
    const s = String(id).trim();
    if (!isObjectIdLike(s)) return null;
    return new ObjectId(s);
}
function toIso(d) {
    return d instanceof Date ? d.toISOString() : d;
}
function clampInt(n, min, max, fallback) {
    const x = Number.parseInt(String(n ?? ""), 10);
    if (!Number.isFinite(x)) return fallback;
    return Math.max(min, Math.min(max, x));
}
function uniqStrings(arr) {
    return [...new Set((arr || []).map((x) => String(x).trim()).filter(Boolean))];
}
function safeDate(v) {
    if (!v) return null;
    const d = v instanceof Date ? v : new Date(v);
    return Number.isFinite(d.getTime()) ? d : null;
}

// -----------------------------
// rule universe (exclude banned tags)
// -----------------------------
const EXCLUDED_RULES = new Set(["PERSONAL_PRONOUNS", "YES_NO_Q"]);

function uniq(arr) {
    return [...new Set((arr || []).filter(Boolean).map((x) => String(x)))];
}

function getAllKnownRules() {
    const all = [];
    for (const lvl of ["A1", "A2", "B1", "B2"]) {
        const rules = Array.isArray(LEVEL_RULES?.[lvl]) ? LEVEL_RULES[lvl] : [];
        for (const r of rules) {
            const s = String(r);
            if (!EXCLUDED_RULES.has(s)) all.push(s);
        }
    }
    return uniq(all);
}

// -----------------------------
// weighted accuracy (copy of client dataService idea)
// -----------------------------
function averageAccuracyPercent(items) {
    if (!items?.length) return 0;

    const now = Date.now();
    const MS2W = 14 * 24 * 60 * 60 * 1000;
    const MS1M = 30 * 24 * 60 * 60 * 1000;
    const MS3M = 90 * 24 * 60 * 60 * 1000;

    let weightedSum = 0;
    let weightTotal = 0;

    for (const x of items) {
        if (!x?.date) continue;

        const age = now - new Date(x.date).getTime();
        const score = typeof x.score === "number" ? x.score : 0;

        let w = 1;
        if (age > MS3M) w = 0.1;
        else if (age > MS1M) w = 0.25;
        else if (age > MS2W) w = 0.5;

        weightedSum += score * w;
        weightTotal += w;
    }

    if (!weightTotal) return 0;
    return Math.round((weightedSum / weightTotal) * 100) / 100;
}

function statusFor(accuracy, attempts) {
    if (attempts === 0) return "not defined";
    if (accuracy < 50) return "needs practice";
    if (accuracy > 75) return "learned";
    return "in progress";
}

// =====================================================================
// Teacher: create a task set + tasks
// =====================================================================
export async function createTaskSetWithTasks({ teacherId, setType, title, deadline, tasks }) {
    const db = await connectDB();

    const teacherKey = String(teacherId || "").trim();
    if (!teacherKey) throw new Error("teacherId required");

    const now = new Date();
    const due = safeDate(deadline);

    const setDoc = {
        teacherId: teacherKey,
        setType: String(setType || "homework"),
        title: String(title || "").trim(),
        deadline: due ?? null,
        createdAt: now,
        updatedAt: now,
        tasksCount: Array.isArray(tasks) ? tasks.length : 0,
    };

    const res = await db.collection("good_lang_task_sets").insertOne(setDoc);
    const taskSetId = res.insertedId;

    const taskDocs = (Array.isArray(tasks) ? tasks : []).map((t, idx) => ({
        taskSetId,
        teacherId: teacherKey,
        setType: setDoc.setType,
        createdAt: now,

        taskOrderNumber: Number.isFinite(Number(t.taskOrderNumber)) ? Number(t.taskOrderNumber) : idx + 1,
        taskType: String(t.taskType || "translation"),
        ruleIds: Array.isArray(t.ruleIds) ? t.ruleIds : [],
        textToTranslate: t.textToTranslate ?? null,
        options: Array.isArray(t.options) ? t.options : null,
        correctAnswer: t.correctAnswer ?? null,
        tipIfWrong: t.tipIfWrong ?? null,
    }));

    if (taskDocs.length) await db.collection("good_lang_tasks").insertMany(taskDocs);

    return { taskSetId: String(taskSetId) };
}

function safeId(x) {
    return String(x ?? "").trim();
}

// --------------------------------------------------
// Update task set title (teacher scoped)
// --------------------------------------------------
export async function updateTaskSetTitleById({ teacherId, taskSetId, title }) {
    const db = await connectDB();

    const teacherKey = safeId(teacherId);
    const setId = toObjectIdStrict(taskSetId, "taskSetId");
    const t = String(title ?? "").trim();

    if (!teacherKey) throw new Error("teacherId required");
    if (!setId) throw new Error("taskSetId required");
    if (!t) throw new Error("title required");

    const now = new Date();

    const res = await db.collection("good_lang_task_sets").updateOne(
        { _id: setId, teacherId: teacherKey },
        { $set: { title: t, updatedAt: now } }
    );

    return { updated: res?.modifiedCount ?? 0 };
}

// =====================================================================
// Teacher: assign task set(s) to students
// =====================================================================
export async function assignTaskSetsToStudents({ teacherId, taskSetIds, studentIds, setType, deadline }) {
    const db = await connectDB();

    const teacherKey = String(teacherId || "").trim();
    if (!teacherKey) throw new Error("teacherId required");

    const sets = uniqStrings(taskSetIds);
    const students = uniqStrings(studentIds);
    if (!sets.length || !students.length) return { inserted: 0 };

    const due = safeDate(deadline);
    const now = new Date();

    const col = db.collection("good_lang_task_set_assignments");
//    await col.createIndex({ taskSetId: 1, studentId: 1 }, { unique: true });

    const bulk = col.initializeUnorderedBulkOp();
    let planned = 0;

    for (const setIdStr of sets) {
        const setId = toObjectIdStrict(setIdStr, "taskSetId");
        for (const studentId of students) {
            planned++;
            bulk.find({ taskSetId: setId, studentId }).upsert().updateOne({
                $set: {
                    teacherId: teacherKey,
                    setType: String(setType || "homework"),
                    deadline: due ?? null,
                    state: "assigned",
                    updatedAt: now,
                },
                $setOnInsert: {
                    taskSetId: setId,
                    studentId,
                    assignedAt: now,
                },
            });
        }
    }

    if (bulk.length) await bulk.execute();
    return { inserted: planned };
}

// =====================================================================
// Teacher: list task sets (paged)
// =====================================================================
function teacherCursorFilter(cursor) {
    if (!cursor?.createdAt || !cursor?.id) return null;
    const createdAt = safeDate(cursor.createdAt);
    const id = toObjectIdMaybe(cursor.id);
    if (!createdAt || !id) return null;
    return { $or: [{ createdAt: { $lt: createdAt } }, { createdAt, _id: { $lt: id } }] };
}

export async function getTaskSetsListTeacherPaged({ teacherId, limit = 10, cursor }) {
    const db = await connectDB();

    const teacherKey = String(teacherId || "").trim();
    if (!teacherKey) throw new Error("teacherId required");

    const lim = clampInt(limit, 1, 50, 10);
    const base = {
        teacherId: teacherKey,
        title: { $exists: true, $type: "string", $nin: ["", null] },
    };
    const cur = teacherCursorFilter(cursor);
    const query = cur ? { ...base, ...cur } : base;

    const sets = await db
        .collection("good_lang_task_sets")
        .find(query, { projection: { teacherId: 1, setType: 1, title: 1, deadline: 1, createdAt: 1, tasksCount: 1 } })
        .sort({ createdAt: -1, _id: -1 })
        .limit(lim)
        .toArray();

    const ids = sets.map((s) => s._id);

    const assignments = ids.length
        ? await db
            .collection("good_lang_task_set_assignments")
            .aggregate([
                { $match: { taskSetId: { $in: ids }, state: "assigned" } },
                { $group: { _id: "$taskSetId", assigned: { $sum: 1 } } },
            ])
            .toArray()
        : [];

    const mapAssigned = new Map(assignments.map((a) => [String(a._id), a.assigned]));

    const items = sets.map((s) => ({
        id: String(s._id),
        setType: s.setType,
        title: s.title,
        deadline: s.deadline ? toIso(s.deadline) : null,
        createdAt: toIso(s.createdAt),
        tasksCount: s.tasksCount ?? 0,
        assigned: mapAssigned.get(String(s._id)) ?? 0,
    }));

    const last = sets[sets.length - 1];
    const nextCursor = last ? { createdAt: toIso(last.createdAt), id: String(last._id) } : null;

    return { items, nextCursor };
}

// =====================================================================
// Student: list assigned task sets (paged)
// =====================================================================
function studentCursorFilter(cursor) {
    if (!cursor?.assignedAt || !cursor?.id) return null;
    const assignedAt = safeDate(cursor.assignedAt);
    const id = toObjectIdMaybe(cursor.id);
    if (!assignedAt || !id) return null;
    return { $or: [{ assignedAt: { $lt: assignedAt } }, { assignedAt, _id: { $lt: id } }] };
}

export async function getTaskSetsListStudentPaged({ studentId, limit = 10, cursor }) {
    const db = await connectDB();

    const studentKey = String(studentId || "").trim();
    if (!studentKey) throw new Error("studentId required");

    const lim = clampInt(limit, 1, 50, 10);
    const base = { studentId: studentKey, state: "assigned" };
    const cur = studentCursorFilter(cursor);
    const query = cur ? { ...base, ...cur } : base;

    const assigns = await db
        .collection("good_lang_task_set_assignments")
        .find(query, { projection: { taskSetId: 1, assignedAt: 1, deadline: 1, setType: 1 } })
        .sort({ assignedAt: -1, _id: -1 })
        .limit(lim)
        .toArray();

    const setIds = assigns.map((a) => a.taskSetId);

    const sets = setIds.length
        ? await db.collection("good_lang_task_sets").find({ _id: { $in: setIds } }, { projection: { title: 1, tasksCount: 1 } }).toArray()
        : [];

    const mapSet = new Map(sets.map((s) => [String(s._id), s]));

    const tasks = setIds.length
        ? await db.collection("good_lang_tasks").find({ taskSetId: { $in: setIds } }, { projection: { _id: 1, taskSetId: 1 } }).toArray()
        : [];

    const bySet = new Map();
    for (const t of tasks) {
        const k = String(t.taskSetId);
        if (!bySet.has(k)) bySet.set(k, []);
        bySet.get(k).push(t._id);
    }

    // progress = answered tasks count based on good_lang_scores.taskId
    const allTaskIds = tasks.map((t) => t._id);
    const answeredDocs = allTaskIds.length
        ? await db.collection("good_lang_scores").find({ userId: studentKey, taskId: { $in: allTaskIds } }, { projection: { taskId: 1 } }).toArray()
        : [];

    const answeredSet = new Set(answeredDocs.map((d) => String(d.taskId)));

    const items = assigns.map((a) => {
        const set = mapSet.get(String(a.taskSetId));
        const setIdStr = String(a.taskSetId);
        const taskIds = bySet.get(setIdStr) || [];
        const done = taskIds.reduce((acc, id) => acc + (answeredSet.has(String(id)) ? 1 : 0), 0);
        const total = set?.tasksCount ?? taskIds.length ?? 0;

        return {
            id: String(a._id),
            taskSetId: setIdStr,
            title: set?.title ?? "",
            setType: a.setType,
            assignedAt: toIso(a.assignedAt),
            progress: total ? { done, total } : { done: 0, total: 0 },
        };
    });

    const last = assigns[assigns.length - 1];
    const nextCursor = last ? { assignedAt: toIso(last.assignedAt), id: String(last._id) } : null;

    return { items, nextCursor };
}

// =====================================================================
// Student: get next task from task set (first unanswered)
// =====================================================================
export async function getNextTaskFromTaskSet({ studentId, taskSetId }) {
    const db = await connectDB();

    const studentKey = String(studentId || "").trim();
    if (!studentKey) throw new Error("studentId required");

    const setObjId = toObjectIdStrict(taskSetId, "taskSetId");

    const asg = await db.collection("good_lang_task_set_assignments").findOne({
        taskSetId: setObjId,
        studentId: studentKey,
        state: "assigned",
    });
    if (!asg) return null;

    const tasks = await db
        .collection("good_lang_tasks")
        .find({ taskSetId: setObjId }, { projection: { taskOrderNumber: 1, taskType: 1, ruleIds: 1, textToTranslate: 1, options: 1, correctAnswer: 1, tipIfWrong: 1 } })
        .sort({ taskOrderNumber: 1, _id: 1 })
        .toArray();

    if (!tasks.length) return null;

    const taskIds = tasks.map((t) => t._id);

    const answered = await db
        .collection("good_lang_scores")
        .find({ userId: studentKey, taskId: { $in: taskIds } }, { projection: { taskId: 1 } })
        .toArray();

    const answeredSet = new Set(answered.map((a) => String(a.taskId)));

    const next = tasks.find((t) => !answeredSet.has(String(t._id)));
    if (!next) return null;

    return {
        id: String(next._id),
        taskSetId: String(setObjId),
        taskOrderNumber: next.taskOrderNumber,
        taskType: next.taskType,
        ruleIds: next.ruleIds,
        textToTranslate: next.textToTranslate,
        options: next.options,
        correctAnswer: next.correctAnswer,
        tipIfWrong: next.tipIfWrong,
        deadline: asg.deadline ? toIso(asg.deadline) : null,
    };
}

// =====================================================================
// Teacher: tasks + answers view
// =====================================================================
export async function getAllTasksFromTaskSetByTeacher({ teacherId, taskSetId }) {
    const db = await connectDB();

    const teacherKey = String(teacherId || "").trim();
    if (!teacherKey) throw new Error("teacherId required");

    const setObjId = toObjectIdStrict(taskSetId, "taskSetId");

    const set = await db.collection("good_lang_task_sets").findOne({ _id: setObjId, teacherId: teacherKey }, { projection: { title: 1}});
    if (!set) return [];

    const tasks = await db
        .collection("good_lang_tasks")
        .find({ taskSetId: setObjId }, { projection: { title: 1, taskOrderNumber: 1, taskType: 1, ruleIds: 1, textToTranslate: 1, options: 1, correctAnswer: 1, tipIfWrong: 1 } })
        .sort({ taskOrderNumber: 1, _id: 1 })
        .toArray();

    return {
        title: set.title,
        tasks: tasks.map((t) => ({
            id: String(t._id),
            title: String(t.title),
            taskSetId: String(setObjId),
            taskOrderNumber: t.taskOrderNumber,
            taskType: t.taskType,
            ruleIds: t.ruleIds,
            textToTranslate: t.textToTranslate,
            options: t.options,
            correctAnswer: t.correctAnswer,
            tipIfWrong: t.tipIfWrong,
        }))
    };
}

export async function getAllStudentAnswersFromTaskSetByTeacher({ teacherId, taskSetId, studentId }) {
    const db = await connectDB();

    const teacherKey = String(teacherId || "").trim();
    if (!teacherKey) throw new Error("teacherId required");

    const setObjId = toObjectIdStrict(taskSetId, "taskSetId");

    const set = await db.collection("good_lang_task_sets").findOne({ _id: setObjId, teacherId: teacherKey });
    if (!set) return [];

    const tasks = await db.collection("good_lang_tasks").find({ taskSetId: setObjId }, { projection: { _id: 1 } }).toArray();
    const taskIds = tasks.map((t) => t._id);
    if (!taskIds.length) return [];

    const q = {
        taskId: { $in: taskIds },
        ...(studentId ? { userId: String(studentId).trim() } : {}),
    };

    const docs = await db
        .collection("good_lang_scores")
        .find(q, {
            projection: {
                userId: 1,
                taskId: 1,
                score: 1,
                date: 1,
                rule: 1,
                level: 1,
                taskType: 1,
                textToTranslate: 1,
                userAnswer: 1,
                correctAnswer: 1,
                isAnswerCorrect: 1,
            },
        })
        .sort({ date: -1 })
        .toArray();

    return docs.map((d) => ({
        userId: d.userId,
        taskId: d.taskId ? String(d.taskId) : null,
        rule: d.rule,
        level: d.level,
        score: d.score,
        date: d.date ? toIso(d.date) : null,
        taskType: d.taskType ?? null,
        textToTranslate: d.textToTranslate ?? null,
        userAnswer: d.userAnswer ?? null,
        correctAnswer: d.correctAnswer ?? null,
        isAnswerCorrect: typeof d.isAnswerCorrect === "boolean" ? d.isAnswerCorrect : null,
    }));
}

// =====================================================================
// ✅ Rule stats per student (for recommended preview)
// (reads from good_lang_scores; no taskId filtering)
// =====================================================================
export async function getRuleStatsForStudent(userId) {
    const db = await connectDB();
    const userKey = String(userId || "").trim();
    if (!userKey) {
        return {
            weakTop4: [],
            neverPracticed: [],
            notPracticed30d: [],
            lowAccuracy: [],
            highAccuracy: [],
            lowestAccuracyTop10: [],
        };
    }

    const ALL_RULES = getAllKnownRules();

    const docs = await db
        .collection("good_lang_scores")
        .find({ userId: userKey, rule: { $in: ALL_RULES } }, { projection: { rule: 1, score: 1, date: 1 } })
        .toArray();

    const map = new Map(); // rule -> { attempts: [], lastTs }
    for (const d of docs) {
        const rule = String(d.rule || "");
        if (!rule || EXCLUDED_RULES.has(rule)) continue;

        const score = typeof d.score === "number" ? d.score : 0;
        const dt = d.date ? new Date(d.date) : null;
        const ts = dt && Number.isFinite(dt.getTime()) ? dt.getTime() : null;

        if (!map.has(rule)) map.set(rule, { attempts: [], lastTs: null });
        const entry = map.get(rule);

        entry.attempts.push({ score, date: dt ? dt.toISOString() : null });
        if (ts != null) entry.lastTs = entry.lastTs == null ? ts : Math.max(entry.lastTs, ts);
    }

    const now = Date.now();
    const MS30D = 30 * 24 * 60 * 60 * 1000;

    const attemptedStats = [];
    for (const [rule, v] of map.entries()) {
        const attemptsNumber = v.attempts.length;
        if (!attemptsNumber) continue;

        const accuracy = averageAccuracyPercent(v.attempts);
        attemptedStats.push({
            rule,
            attemptsNumber,
            accuracy,
            lastAttemptTs: v.lastTs,
            status: statusFor(accuracy, attemptsNumber),
        });
    }

    const attemptedSet = new Set(attemptedStats.map((x) => x.rule));
    const neverPracticed = ALL_RULES.filter((r) => !attemptedSet.has(r));

    const notPracticed30d = attemptedStats
        .filter((x) => x.lastAttemptTs != null && now - x.lastAttemptTs > MS30D)
        .sort((a, b) => (a.lastAttemptTs ?? 0) - (b.lastAttemptTs ?? 0))
        .map((x) => x.rule);

    const lowAccuracy = attemptedStats
        .filter((x) => x.accuracy < 70)
        .sort((a, b) => a.accuracy - b.accuracy)
        .map((x) => x.rule);

    const highAccuracy = attemptedStats
        .filter((x) => x.accuracy >= 70)
        .sort((a, b) => a.accuracy - b.accuracy)
        .map((x) => x.rule);

    const lowestAccuracyTop10 = attemptedStats
        .slice()
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 10)
        .map((x) => x.rule);

    const weakSorted = attemptedStats
        .slice()
        .sort((a, b) => {
            const aNeeds = a.status === "needs practice" ? 0 : 1;
            const bNeeds = b.status === "needs practice" ? 0 : 1;
            if (aNeeds !== bNeeds) return aNeeds - bNeeds;
            if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
            return (a.attemptsNumber ?? 0) - (b.attemptsNumber ?? 0);
        });

    const weakTop4 = weakSorted.slice(0, 4).map((x) => x.rule);

    return {
        weakTop4,
        neverPracticed,
        notPracticed30d,
        lowAccuracy,
        highAccuracy,
        lowestAccuracyTop10,
    };
}

const ERR = {
    STUDENT_ID_REQUIRED: "STUDENT_ID_REQUIRED",
    TASK_SET_ID_REQUIRED: "TASK_SET_ID_REQUIRED",
    TASK_SET_NOT_FOUND: "TASK_SET_NOT_FOUND",
};

// Student flow: get task set and its teacherId
export async function getTaskSetByIdForJoin({ taskSetId }) {
    const db = await connectDB();

    const idStr = String(taskSetId || "").trim();
    if (!idStr) throw new Error(ERR.TASK_SET_ID_REQUIRED);

    const setObjId = toObjectIdStrict(idStr, "taskSetId");

    const set = await db.collection("good_lang_task_sets").findOne(
        { _id: setObjId },
        { projection: { _id: 1, teacherId: 1, setType: 1, title: 1, deadline: 1, createdAt: 1 } }
    );

    if (!set) throw new Error(ERR.TASK_SET_NOT_FOUND);

    return {
        taskSetId: String(set._id),
        teacherId: String(set.teacherId || "").trim(),
        setType: set.setType ?? "homework",
        title: set.title ?? "",
        deadline: set.deadline ? toIso(set.deadline) : null,
        createdAt: set.createdAt ? toIso(set.createdAt) : null,
    };
}

export async function assignTaskSetToStudentIdempotent({
                                                           teacherId,   // from task set
                                                           taskSetId,
                                                           studentId,   // from auth
                                                           setType = "homework",
                                                           deadline = null,
                                                       }) {
    const db = await connectDB();

    const teacherKey = String(teacherId || "").trim();
    if (!teacherKey) throw new Error("TEACHER_ID_REQUIRED"); // domain code

    const studentKey = String(studentId || "").trim();
    if (!studentKey) throw new Error(ERR.STUDENT_ID_REQUIRED);

    const idStr = String(taskSetId || "").trim();
    if (!idStr) throw new Error(ERR.TASK_SET_ID_REQUIRED);

    const setObjId = toObjectIdStrict(idStr, "taskSetId");

    const due = safeDate(deadline);
    const now = new Date();

    const col = db.collection("good_lang_task_set_assignments");

    const res = await col.updateOne(
        { taskSetId: setObjId, studentId: studentKey },
        {
            $set: {
                teacherId: teacherKey,
                setType: String(setType || "homework"),
                deadline: due ?? null,
                state: "assigned",
                updatedAt: now,
            },
            $setOnInsert: {
                taskSetId: setObjId,
                studentId: studentKey,
                assignedAt: now,
            },
        },
        { upsert: true }
    );

    return { created: Boolean(res?.upsertedCount) };
}

// =====================================================================
// Student: tasks view (no answers, no tips, no correct, no ruleIds)
// - requires assignment exists for this student
// =====================================================================
export async function getAllTasksFromTaskSetByStudent({ studentId, taskSetId }) {
    const db = await connectDB();

    const studentKey = String(studentId || "").trim();
    if (!studentKey) throw new Error("studentId required");

    const setObjId = toObjectIdStrict(taskSetId, "taskSetId");

    // 1) must be assigned to this student
    const asg = await db.collection("good_lang_task_set_assignments").findOne(
        { taskSetId: setObjId, studentId: studentKey, state: "assigned" },
        { projection: { _id: 1 } }
    );

    if (!asg) return []; // consistent with teacher method style

    // 2) load set title (no teacher scope here)
    const set = await db.collection("good_lang_task_sets").findOne(
        { _id: setObjId },
        { projection: { title: 1 } }
    );

    if (!set) return [];

    // 3) load tasks without sensitive fields
    const tasks = await db
        .collection("good_lang_tasks")
        .find(
            { taskSetId: setObjId },
            {
                projection: {
                    title: 1,
                    taskOrderNumber: 1,
                    taskType: 1,
                    textToTranslate: 1,
                    options: 1,
                },
            }
        )
        .sort({ taskOrderNumber: 1, _id: 1 })
        .toArray();

    return {
        title: set.title ?? "",
        tasks: tasks.map((t) => ({
            id: String(t._id),
            title: String(t.title ?? ""),
            taskSetId: String(setObjId),
            taskOrderNumber: t.taskOrderNumber,
            taskType: t.taskType,
            textToTranslate: t.textToTranslate ?? null,
            options: t.options ?? null,
        })),
    };
}



// =====================================================================
// Indexes (safe)
// =====================================================================
export async function ensureSchoolTaskIndexes() {
    const db = await connectDB();

    await db.collection("good_lang_task_sets").createIndex({ teacherId: 1, createdAt: -1 });
    await db.collection("good_lang_tasks").createIndex({ taskSetId: 1, taskOrderNumber: 1 });
    await db.collection("good_lang_task_set_assignments").createIndex({ studentId: 1, assignedAt: -1 });
    await db.collection("good_lang_task_set_assignments").createIndex(
        { taskSetId: 1, studentId: 1 },
        { unique: true, name: "uniq_taskSet_student" }
    );

    // for student progress queries:
    await db.collection("good_lang_scores").createIndex({ userId: 1, updatedAt: -1 });

    // // optional uniqueness only when taskId is real ObjectId (avoid $ne null partial-index crash)
    // await db.collection("good_lang_scores").createIndex(
    //     { userId: 1, taskId: 1 },
    //     {
    //         unique: true,
    //         name: "userId_1_taskId_1_objOnly",
    //         partialFilterExpression: { taskId: { $type: "objectId" } },
    //     }
    // );

    return { ok: true };
}


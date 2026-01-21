// scoresRepository.js — FULL DROP-IN (MongoDB)
//
// IMPORTANT CHANGE (UUID-safe):
// - account/user/teacher/student IDs are UUID strings (36 chars) => store & query them as STRINGs.
// - Only Mongo-native document ids (_id), taskSetId, taskId use ObjectId.
// - NEVER attempt new ObjectId(uuid).
//
// Existing collections (kept):
// - good_lang_scores (per-rule/per-question score sync from client)
// - good_lang_state  (seed/skip)
//
// New collections (teacher features):
// - good_lang_task_sets
// - good_lang_tasks
// - good_lang_task_set_assignments
// - good_lang_student_answers
//
// Notes:
// - teacherId is supported on score upserts (defaults to null).
// - student answers are stored separately for teacher analytics.
// - Uses the same connectDB() pattern as your current file.

import { connectDB } from "../mongo.js";
import { ObjectId } from "mongodb";
import { LEVEL_RULES } from "../../core/rules.js"; // adjust relative path if needed

// -----------------------------
// Helpers
// -----------------------------
function toIso(d) {
    return d instanceof Date ? d.toISOString() : d;
}

function isObjectIdLike(id) {
    return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

/**
 * ONLY for Mongo-generated ids (taskSetId, taskId, cursor ids, etc).
 * Never call this on UUIDs.
 */
function toObjectIdMaybe(id) {
    if (!id) return null;
    if (id instanceof ObjectId) return id;
    const s = String(id).trim();
    if (!isObjectIdLike(s)) return null;
    return new ObjectId(s);
}

function normalizeUuidOrNull(v) {
    const s = String(v ?? "").trim();
    return s ? s : null;
}

function normalizeTeacherId(teacherId) {
    // IMPORTANT: for "regular GL user" we want explicit null
    return normalizeUuidOrNull(teacherId);
}

// =====================================================================
// EXISTING: Upsert synced answers (scores)
// UPDATED: includes teacherId flag (nullable, STRING UUID)
// =====================================================================
export async function upsertAnswers(userId, deviceId, answers, updatedOn, teacherId = null) {
    if (!answers?.length) return;

    const db = await connectDB();
    const bulk = db.collection("good_lang_scores").initializeUnorderedBulkOp();

    const teacherKey = normalizeTeacherId(teacherId); // string UUID or null
    const userKey = String(userId); // UUID string

    for (const a of answers) {
        if (!a.id) continue;

        const createdDate = a.date ? new Date(a.date) : updatedOn;

        bulk
            .find({ userId: userKey, id: a.id, teacherId: teacherKey })
            .upsert()
            .updateOne({
                $set: {
                    userId: userKey,
                    teacherId: teacherKey, // ✅ NEW (null for regular GL user)
                    id: a.id,
                    rule: a.rule,
                    level: a.level ?? null,
                    score: a.score,
                    date: createdDate,
                    deviceId: a.deviceId ?? deviceId,
                    updatedAt: updatedOn,
                },
                $setOnInsert: {
                    createdAt: updatedOn,
                },
            });
    }

    if (bulk.length) {
        await bulk.execute();
    }
}

export async function getAnswersSince(userId, since, teacherId = null) {
    const db = await connectDB();
    const sinceDate = new Date(since || 0);

    const teacherKey = normalizeTeacherId(teacherId);
    const userKey = String(userId);

    const docs = await db
        .collection("good_lang_scores")
        .find({
            userId: userKey,
            teacherId: teacherKey,
            updatedAt: { $gt: sinceDate },
        })
        .toArray();

    return docs.map((d) => ({
        id: d.id,
        rule: d.rule,
        level: d.level,
        score: d.score,
        teacherId: d.teacherId ?? null,
        date: toIso(d.date),
        deviceId: d.deviceId,
        updatedAt: toIso(d.updatedAt),
    }));
}

// =====================================================================
// EXISTING: seed state
// =====================================================================
export async function saveSeedState(userId, seedState) {
    const db = await connectDB();
    const userKey = String(userId);

    await db.collection("good_lang_state").updateOne(
        { userId: userKey },
        {
            $set: {
                seed: seedState.seed,
                skip: seedState.skip,
                updatedAt: new Date(seedState.updatedAt),
            },
        },
        { upsert: true }
    );
}

export async function getSeedState(userId) {
    const db = await connectDB();
    const userKey = String(userId);

    const doc = await db.collection("good_lang_state").findOne({ userId: userKey });
    if (!doc) return null;

    return {
        seed: doc.seed,
        skip: doc.skip,
        updatedAt: toIso(doc.updatedAt),
    };
}

// =====================================================================
// NEW: Teacher task sets + tasks + assignments + student answers
// =====================================================================
const COL_TASK_SETS = "good_lang_task_sets";
const COL_TASKS = "good_lang_tasks";
const COL_ASSIGNMENTS = "good_lang_task_set_assignments";
const COL_STUDENT_ANSWERS = "good_lang_student_answers";

/**
 * Insert (upsert) a student answer record for teachers to use.
 *
 * UUID fields are STRINGS:
 * - userId, teacherId are UUID strings
 *
 * ObjectId fields:
 * - taskSetId, taskId (Mongo ids)
 */
export async function insertStudentAnswer(payload) {
    const db = await connectDB();

    const userKey = String(payload.userId || "").trim();
    const teacherKey = String(payload.teacherId || "").trim();

    const taskSetObjId = toObjectIdMaybe(payload.taskSetId);
    const taskObjId = toObjectIdMaybe(payload.taskId);

    const doc = {
        userId: userKey,
        teacherId: teacherKey,
        taskSetId: taskSetObjId,
        taskId: taskObjId,

        taskType: payload.taskType, // "translation" | "gap"
        ruleIds: Array.isArray(payload.ruleIds) ? payload.ruleIds : [],

        textToTranslate: String(payload.textToTranslate ?? ""),
        userTranslation: String(payload.userTranslation ?? ""),

        isAnswerCorrect: !!payload.isAnswerCorrect,
        correctAnswer: payload.correctAnswer ?? null,
        tipIfWrong: payload.tipIfWrong ?? null,

        createdAt: payload.createdAt ? new Date(payload.createdAt) : new Date(),
    };

    if (!doc.userId || !doc.teacherId || !doc.taskSetId || !doc.taskId) {
        throw new Error("insertStudentAnswer: missing userId/teacherId/taskSetId/taskId");
    }

    // Upsert: one answer per student per task
    await db.collection(COL_STUDENT_ANSWERS).updateOne(
        { userId: doc.userId, taskId: doc.taskId },
        {
            $set: doc,
            $setOnInsert: { _id: new ObjectId() },
        },
        { upsert: true }
    );

    return { ok: true };
}

/**
 * Create a task set + insert its tasks.
 *
 * teacherId is UUID STRING.
 * taskSetId/taskId are ObjectId.
 */
export async function createTaskSetWithTasks(input) {
    const db = await connectDB();

    const teacherKey = String(input.teacherId || "").trim();
    if (!teacherKey) throw new Error("createTaskSetWithTasks: missing teacherId");

    const now = new Date();
    const setDoc = {
        teacherId: teacherKey, // ✅ string UUID
        setType: String(input.setType ?? "homework"),
        title: input.title ?? null,
        deadline: input.deadline ? new Date(input.deadline) : null,
        createdAt: now,
    };

    const { insertedId: taskSetId } = await db.collection(COL_TASK_SETS).insertOne(setDoc);

    const tasks = Array.isArray(input.tasks) ? input.tasks : [];
    if (tasks.length) {
        const taskDocs = tasks.map((t, idx) => ({
            teacherId: teacherKey, // ✅ string UUID
            taskSetId, // ✅ ObjectId

            taskType: t.taskType, // "translation" | "gap"
            ruleIds: Array.isArray(t.ruleIds) ? t.ruleIds : [],
            textToTranslate: String(t.textToTranslate ?? ""),

            options: t.options ?? null,
            correctAnswer: t.correctAnswer ?? null,
            tipIfWrong: t.tipIfWrong ?? null,

            taskOrderNumber: Number.isFinite(Number(t.taskOrderNumber)) ? Number(t.taskOrderNumber) : idx + 1,

            deadline: t.deadline ? new Date(t.deadline) : null,
            createdAt: now,
        }));

        await db.collection(COL_TASKS).insertMany(taskDocs);
    }

    return { taskSetId: String(taskSetId) };
}

/**
 * Assign one or many task sets to one or many students.
 *
 * teacherId/studentId are UUID STRINGS.
 * taskSetId is ObjectId.
 */
export async function assignTaskSetsToStudents(input) {
    const db = await connectDB();

    const teacherKey = String(input.teacherId || "").trim();
    if (!teacherKey) throw new Error("assignTaskSetsToStudents: missing teacherId");

    const setIdsRaw = Array.isArray(input.taskSetIds) ? input.taskSetIds : [input.taskSetIds];
    const setIds = setIdsRaw
        .filter(Boolean)
        .map(toObjectIdMaybe)
        .filter(Boolean);

    const studentIdsRaw = Array.isArray(input.studentIds) ? input.studentIds : [input.studentIds];
    const studentIds = studentIdsRaw
        .filter(Boolean)
        .map((x) => String(x).trim())
        .filter(Boolean);

    if (!setIds.length || !studentIds.length) return { inserted: 0 };

    const now = new Date();
    const deadline = input.deadline ? new Date(input.deadline) : null;

    const docs = [];
    for (const taskSetId of setIds) {
        for (const studentId of studentIds) {
            docs.push({
                teacherId: teacherKey,
                taskSetId,
                studentId, // ✅ UUID string
                setType: String(input.setType ?? "homework"),
                deadline,
                assignedAt: now,
            });
        }
    }

    try {
        const res = await db.collection(COL_ASSIGNMENTS).insertMany(docs, { ordered: false });
        return { inserted: res.insertedCount };
    } catch (e) {
        if (e?.code === 11000) return { inserted: 0 };
        throw e;
    }
}

/**
 * Teacher: get last task sets with paging + per-student completion per set
 *
 * teacherId UUID string.
 * cursor.id is task set _id (ObjectId string).
 */
export async function getTaskSetsListTeacherPaged(input) {
    const db = await connectDB();

    const teacherKey = String(input.teacherId || "").trim();
    if (!teacherKey) throw new Error("getTaskSetsListTeacherPaged: missing teacherId");

    const limit = Math.min(Math.max(Number(input.limit) || 10, 1), 50);

    const cursorCreatedAt = input.cursor?.createdAt ? new Date(input.cursor.createdAt) : null;
    const cursorId = input.cursor?.id ? toObjectIdMaybe(input.cursor.id) : null;

    const cursorMatch =
        cursorCreatedAt && cursorId
            ? {
                $or: [{ createdAt: { $lt: cursorCreatedAt } }, { createdAt: cursorCreatedAt, _id: { $lt: cursorId } }],
            }
            : {};

    const pipeline = [
        { $match: { teacherId: teacherKey, ...cursorMatch } },
        { $sort: { createdAt: -1, _id: -1 } },
        { $limit: limit },

        {
            $lookup: {
                from: COL_TASKS,
                localField: "_id",
                foreignField: "taskSetId",
                as: "tasks",
            },
        },
        {
            $lookup: {
                from: COL_ASSIGNMENTS,
                localField: "_id",
                foreignField: "taskSetId",
                as: "assignments",
            },
        },

        {
            $lookup: {
                from: COL_STUDENT_ANSWERS,
                let: { setId: "$_id", tId: "$teacherId" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $and: [{ $eq: ["$taskSetId", "$$setId"] }, { $eq: ["$teacherId", "$$tId"] }] },
                        },
                    },
                    { $group: { _id: "$userId", answeredCount: { $sum: 1 } } },
                    { $project: { _id: 0, studentId: "$_id", answeredCount: 1 } },
                ],
                as: "answersByStudent",
            },
        },

        {
            $addFields: {
                totalTasks: { $size: "$tasks" },
                includedTaskTypes: {
                    $setUnion: [
                        [],
                        {
                            $map: {
                                input: "$tasks",
                                as: "t",
                                in: "$$t.taskType",
                            },
                        },
                    ],
                },
                students: {
                    $map: {
                        input: "$assignments",
                        as: "a",
                        in: {
                            studentId: "$$a.studentId",
                            answeredCount: {
                                $let: {
                                    vars: {
                                        match: {
                                            $first: {
                                                $filter: {
                                                    input: "$answersByStudent",
                                                    as: "x",
                                                    cond: { $eq: ["$$x.studentId", "$$a.studentId"] },
                                                },
                                            },
                                        },
                                    },
                                    in: { $ifNull: ["$$match.answeredCount", 0] },
                                },
                            },
                        },
                    },
                },
            },
        },

        {
            $project: {
                _id: 1,
                teacherId: 1,
                setType: 1,
                title: 1,
                deadline: 1,
                createdAt: 1,

                numberOfTasks: "$totalTasks",
                includedTaskTypes: 1,
                students: 1,
            },
        },
    ];

    const docs = await db.collection(COL_TASK_SETS).aggregate(pipeline).toArray();

    const items = docs.map((d) => {
        const total = Number(d.numberOfTasks) || 0;
        const students = (d.students || []).map((s) => ({
            studentId: String(s.studentId),
            answeredCount: Number(s.answeredCount) || 0,
            totalTasks: total,
            completionRatio: total > 0 ? (Number(s.answeredCount) || 0) / total : 0,
        }));

        return {
            id: String(d._id),
            teacherId: String(d.teacherId),
            setType: d.setType,
            title: d.title ?? null,
            deadline: d.deadline ? toIso(d.deadline) : null,
            createdAt: toIso(d.createdAt),

            numberOfTasks: total,
            includedTaskTypes: d.includedTaskTypes ?? [],
            students,
        };
    });

    const last = items[items.length - 1];
    const nextCursor = items.length === limit ? { createdAt: last.createdAt, id: last.id } : null;

    return { items, nextCursor };
}

/**
 * Student: get last assigned task sets with paging (by assignedAt) + completion for that student
 *
 * studentId UUID string.
 * cursor.id is assignment _id (ObjectId string).
 */
export async function getTaskSetsListStudentPaged(input) {
    const db = await connectDB();

    const studentKey = String(input.studentId || "").trim();
    if (!studentKey) throw new Error("getTaskSetsListStudentPaged: missing studentId");

    const limit = Math.min(Math.max(Number(input.limit) || 10, 1), 50);

    const cursorAssignedAt = input.cursor?.assignedAt ? new Date(input.cursor.assignedAt) : null;
    const cursorId = input.cursor?.id ? toObjectIdMaybe(input.cursor.id) : null;

    const cursorMatch =
        cursorAssignedAt && cursorId
            ? {
                $or: [{ assignedAt: { $lt: cursorAssignedAt } }, { assignedAt: cursorAssignedAt, _id: { $lt: cursorId } }],
            }
            : {};

    const pipeline = [
        { $match: { studentId: studentKey, ...cursorMatch } },
        { $sort: { assignedAt: -1, _id: -1 } },
        { $limit: limit },

        {
            $lookup: {
                from: COL_TASK_SETS,
                localField: "taskSetId",
                foreignField: "_id",
                as: "set",
            },
        },
        { $unwind: "$set" },

        {
            $lookup: {
                from: COL_TASKS,
                localField: "taskSetId",
                foreignField: "taskSetId",
                as: "tasks",
            },
        },

        {
            $lookup: {
                from: COL_STUDENT_ANSWERS,
                let: { setId: "$taskSetId", sId: "$studentId" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $and: [{ $eq: ["$taskSetId", "$$setId"] }, { $eq: ["$userId", "$$sId"] }] },
                        },
                    },
                    { $project: { _id: 1 } },
                ],
                as: "answers",
            },
        },

        {
            $addFields: {
                numberOfTasks: { $size: "$tasks" },
                includedTaskTypes: {
                    $setUnion: [
                        [],
                        {
                            $map: {
                                input: "$tasks",
                                as: "t",
                                in: "$$t.taskType",
                            },
                        },
                    ],
                },
                answeredCount: { $size: "$answers" },
            },
        },

        {
            $project: {
                _id: 1, // assignment id (cursor)
                assignedAt: 1,
                deadline: 1,
                teacherId: 1,
                taskSetId: 1,
                setType: "$set.setType",
                title: "$set.title",
                setDeadline: "$set.deadline",
                createdAt: "$set.createdAt",

                numberOfTasks: 1,
                includedTaskTypes: 1,
                answeredCount: 1,
            },
        },
    ];

    const docs = await db.collection(COL_ASSIGNMENTS).aggregate(pipeline).toArray();

    const items = docs.map((d) => {
        const total = Number(d.numberOfTasks) || 0;
        const answered = Number(d.answeredCount) || 0;
        return {
            id: String(d.taskSetId),
            assignmentId: String(d._id),
            teacherId: String(d.teacherId),

            setType: d.setType,
            title: d.title ?? null,
            deadline: toIso(d.deadline ?? d.setDeadline) ?? null,
            createdAt: toIso(d.createdAt),
            assignedAt: toIso(d.assignedAt),

            numberOfTasks: total,
            includedTaskTypes: d.includedTaskTypes ?? [],
            answeredCount: answered,
            completionRatio: total > 0 ? answered / total : 0,
        };
    });

    const last = items[items.length - 1];
    const nextCursor = items.length === limit ? { assignedAt: last.assignedAt, id: last.assignmentId } : null;

    return { items, nextCursor };
}

/**
 * Get next task from a task set (by student).
 * Returns the first task (by order) that the student has not answered yet.
 *
 * studentId UUID string, taskSetId ObjectId string.
 */
export async function getNextTaskFromTaskSet(input) {
    const db = await connectDB();

    const studentKey = String(input.studentId || "").trim();
    const taskSetId = toObjectIdMaybe(input.taskSetId);

    if (!studentKey || !taskSetId) throw new Error("getNextTaskFromTaskSet: missing studentId/taskSetId");

    const answered = await db
        .collection(COL_STUDENT_ANSWERS)
        .find({ userId: studentKey, taskSetId }, { projection: { taskId: 1 } })
        .toArray();

    const answeredIds = answered.map((a) => a.taskId).filter(Boolean);

    const query = answeredIds.length ? { taskSetId, _id: { $nin: answeredIds } } : { taskSetId };

    const nextTask = await db
        .collection(COL_TASKS)
        .find(query)
        .sort({ taskOrderNumber: 1, createdAt: 1 })
        .limit(1)
        .next();

    if (!nextTask) return null;

    return {
        id: String(nextTask._id),
        taskSetId: String(nextTask.taskSetId),
        teacherId: String(nextTask.teacherId),

        taskType: nextTask.taskType,
        ruleIds: nextTask.ruleIds,
        textToTranslate: nextTask.textToTranslate,
        options: nextTask.options ?? null,

        taskOrderNumber: nextTask.taskOrderNumber,
        deadline: nextTask.deadline ? toIso(nextTask.deadline) : null,
        createdAt: toIso(nextTask.createdAt),
    };
}

/**
 * Get all tasks from a task set (by teacher).
 *
 * teacherId UUID string, taskSetId ObjectId string.
 */
export async function getAllTasksFromTaskSetByTeacher(input) {
    const db = await connectDB();

    const teacherKey = String(input.teacherId || "").trim();
    const taskSetId = toObjectIdMaybe(input.taskSetId);

    if (!teacherKey || !taskSetId) throw new Error("getAllTasksFromTaskSetByTeacher: missing teacherId/taskSetId");

    const tasks = await db
        .collection(COL_TASKS)
        .find({ teacherId: teacherKey, taskSetId })
        .sort({ taskOrderNumber: 1, createdAt: 1 })
        .toArray();

    return tasks.map((t) => ({
        id: String(t._id),
        taskSetId: String(t.taskSetId),
        teacherId: String(t.teacherId),

        taskType: t.taskType,
        ruleIds: t.ruleIds,
        textToTranslate: t.textToTranslate,
        options: t.options ?? null,
        correctAnswer: t.correctAnswer ?? null,
        tipIfWrong: t.tipIfWrong ?? null,

        taskOrderNumber: t.taskOrderNumber,
        deadline: t.deadline ? toIso(t.deadline) : null,
        createdAt: toIso(t.createdAt),
    }));
}

/**
 * Get all student answers from a task set (by teacher).
 *
 * teacherId UUID string, taskSetId ObjectId string, studentId UUID string optional.
 */
export async function getAllStudentAnswersFromTaskSetByTeacher(input) {
    const db = await connectDB();

    const teacherKey = String(input.teacherId || "").trim();
    const taskSetId = toObjectIdMaybe(input.taskSetId);
    const studentKey = input.studentId ? String(input.studentId).trim() : null;

    if (!teacherKey || !taskSetId) {
        throw new Error("getAllStudentAnswersFromTaskSetByTeacher: missing teacherId/taskSetId");
    }

    const query = {
        teacherId: teacherKey,
        taskSetId,
        ...(studentKey ? { userId: studentKey } : {}),
    };

    const answers = await db.collection(COL_STUDENT_ANSWERS).find(query).sort({ createdAt: -1 }).toArray();

    return answers.map((a) => ({
        id: String(a._id),
        teacherId: String(a.teacherId),
        userId: String(a.userId),
        taskSetId: String(a.taskSetId),
        taskId: String(a.taskId),

        taskType: a.taskType,
        ruleIds: a.ruleIds,

        textToTranslate: a.textToTranslate,
        userTranslation: a.userTranslation,

        isAnswerCorrect: !!a.isAnswerCorrect,
        correctAnswer: a.correctAnswer ?? null,
        tipIfWrong: a.tipIfWrong ?? null,

        createdAt: toIso(a.createdAt),
    }));
}

/**
 * OPTIONAL helper: call once at startup (or in a script) to ensure indexes exist.
 * Safe to call multiple times.
 *
 * IMPORTANT: indexes reflect UUID strings for teacherId/userId/studentId.
 */
export async function ensureTeacherCollectionsIndexes() {
    const db = await connectDB();

    // student answers: one per student per task
    await db.collection(COL_STUDENT_ANSWERS).createIndex({ userId: 1, taskId: 1 }, { unique: true });

    // teacher: list answers in a set (sorted by latest)
    await db.collection(COL_STUDENT_ANSWERS).createIndex({ teacherId: 1, taskSetId: 1, createdAt: -1 });

    // teacher: aggregate completion per student in a set
    await db.collection(COL_STUDENT_ANSWERS).createIndex({ taskSetId: 1, teacherId: 1, userId: 1 });

    // student: completion in a set
    await db.collection(COL_STUDENT_ANSWERS).createIndex({ userId: 1, taskSetId: 1 });

    // task sets: teacher paging
    await db.collection(COL_TASK_SETS).createIndex({ teacherId: 1, createdAt: -1, _id: -1 });

    // tasks: teacher fetch tasks securely (teacherId + set)
    await db.collection(COL_TASKS).createIndex({ teacherId: 1, taskSetId: 1, taskOrderNumber: 1 });

    // tasks: lookups by taskSetId
    await db.collection(COL_TASKS).createIndex({ taskSetId: 1, taskOrderNumber: 1 });

    // assignments: unique assignment per student per set per teacher
    await db.collection(COL_ASSIGNMENTS).createIndex(
        { teacherId: 1, taskSetId: 1, studentId: 1 },
        { unique: true }
    );

    // student paging of assigned sets
    await db.collection(COL_ASSIGNMENTS).createIndex({ studentId: 1, assignedAt: -1, _id: -1 });

    // lookups by taskSetId (merge students for teacher view)
    await db.collection(COL_ASSIGNMENTS).createIndex({ taskSetId: 1, studentId: 1 });

    return { ok: true };
}

// ----------------------------------------------------------------------
// Weak rules (BE service) — UUID-safe (reads from good_lang_scores)
// ----------------------------------------------------------------------
function normalizeLevel(level) {
    const up = String(level ?? "").trim().toUpperCase();
    if (!["A1", "A2", "B1", "B2"].includes(up)) return null;
    return up;
}

function statusFor(accuracy, attempts) {
    if (attempts === 0) return "not defined";
    if (accuracy < 50) return "needs practice";
    if (accuracy > 75 && attempts > 5) return "learned";
    return "in progress";
}

/**
 * Returns array of ruleIds (strings), weakest first.
 *
 * input:
 * { userId (UUID string), level: "A1"|"A2"|"B1"|"B2", limit?: number, teacherId?: string|null }
 */
export async function getWeakRulesForStudent({ userId, level, limit = 4, teacherId = null }) {
    const db = await connectDB();

    const lvl = normalizeLevel(level);
    if (!lvl) return [];

    const allowedRules = Array.isArray(LEVEL_RULES?.[lvl]) ? LEVEL_RULES[lvl].map(String) : [];
    if (!allowedRules.length) return [];

    const teacherKey = normalizeTeacherId(teacherId); // null or UUID string (for now likely null)
    const userKey = String(userId || "").trim();
    if (!userKey) return [];

    const pipeline = [
        {
            $match: {
                userId: userKey,
                teacherId: teacherKey,
                rule: { $in: allowedRules },
            },
        },
        {
            $group: {
                _id: "$rule",
                attemptsNumber: { $sum: 1 },
                accuracy: { $avg: "$score" }, // score is 0..100
            },
        },
        {
            $project: {
                _id: 0,
                rule: "$_id",
                attemptsNumber: 1,
                accuracy: 1,
            },
        },
    ];

    const rows = await db.collection("good_lang_scores").aggregate(pipeline).toArray();

    const attempted = rows
        .filter((x) => (x?.attemptsNumber ?? 0) > 0)
        .map((x) => ({
            rule: String(x.rule),
            attemptsNumber: x.attemptsNumber ?? 0,
            accuracy: Number.isFinite(x.accuracy) ? x.accuracy : 0,
            status: statusFor(Number.isFinite(x.accuracy) ? x.accuracy : 0, x.attemptsNumber ?? 0),
        }));

    attempted.sort((a, b) => {
        const aNeeds = a.status === "needs practice" ? 0 : 1;
        const bNeeds = b.status === "needs practice" ? 0 : 1;
        if (aNeeds !== bNeeds) return aNeeds - bNeeds;

        const accA = Number.isFinite(a.accuracy) ? a.accuracy : 0;
        const accB = Number.isFinite(b.accuracy) ? b.accuracy : 0;
        if (accA !== accB) return accA - accB;

        const attA = a.attemptsNumber ?? 0;
        const attB = b.attemptsNumber ?? 0;
        return attA - attB;
    });

    const lim = Math.max(1, Math.min(10, Number(limit) || 4));
    return attempted.slice(0, lim).map((x) => x.rule);
}

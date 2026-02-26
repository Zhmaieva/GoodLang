// controllers/schoolsTaskSetsController.js — FULL DROP-IN (UPDATED)

import { authMiddleware } from "../middleware/authMiddleware.js";

import {
    createTaskSetWithTasks,
    assignTaskSetsToStudents,
    getTaskSetsListTeacherPaged,
    getTaskSetsListStudentPaged,
    getNextTaskFromTaskSet,
    getAllTasksFromTaskSetByTeacher,
    getAllStudentAnswersFromTaskSetByTeacher,
    updateTaskSetTitleById,
    getTaskSetByIdForJoin,
    assignTaskSetToStudentIdempotent, getAllTasksFromTaskSetByStudent,
} from "../database/repositories/schoolTaskRepository.js";

import {
    buildRecommendedQuotasForStudents,
    buildTaskSetTasks,
} from "../services/taskSetBuilderService.js";
import {ensureTeacherStudentPg} from "../database/repositories/teacherStudentsRepository.js";
import {createSchoolTeacherForAccount} from "../database/repositories/teacherClassesRepository.js";
import {recordAction} from "../database/repositories/accountLogRepository.js";
import {ACTION_TYPES} from "../core/constants.js";

const name = "schools";

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function normalizeArrayIds(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map((x) => String(x).trim()).filter(Boolean);
}

function normalizeRuleIds(ruleIds) {
    if (!ruleIds) return [];
    if (Array.isArray(ruleIds)) return ruleIds.map((x) => String(x).trim()).filter(Boolean);
    if (typeof ruleIds === "string") {
        return ruleIds
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
    }
    return [];
}

function normalizeTaskMode(v) {
    const m = String(v ?? "").trim().toLowerCase();
    if (m === "translations" || m === "gaps" || m === "mixed") return m;
    return null;
}

function clampInt(v, min, max, fallback) {
    const n = Number.parseInt(String(v ?? ""), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

function parseOptionalDate(v) {
    if (!v) return null;
    const d = new Date(v);
    return Number.isFinite(d.getTime()) ? d : null;
}

function parseCursorTeacher(q) {
    const cursorCreatedAt = q?.cursorCreatedAt ? String(q.cursorCreatedAt) : null;
    const cursorId = q?.cursorId ? String(q.cursorId) : null;
    if (!cursorCreatedAt || !cursorId) return null;
    return { createdAt: cursorCreatedAt, id: cursorId };
}

function parseCursorStudent(q) {
    const cursorAssignedAt = q?.cursorAssignedAt ? String(q.cursorAssignedAt) : null;
    const cursorId = q?.cursorId ? String(q.cursorId) : null;
    if (!cursorAssignedAt || !cursorId) return null;
    return { assignedAt: cursorAssignedAt, id: cursorId };
}

function normalizeRecommendedPlan(body) {
    // expected: { items: [ { studentId, numberOfTasks, seed, quotas, breakdown } ] }
    const items = body?.items;
    if (!Array.isArray(items)) return [];
    return items
        .map((x) => ({
            studentId: String(x?.studentId || "").trim(),
            numberOfTasks: Number(x?.numberOfTasks) || null,
            seed: Number(x?.seed) || null,
            quotas: x?.quotas || null,
            breakdown: x?.breakdown || null,
        }))
        .filter((x) => x.studentId && x.quotas && typeof x.quotas === "object");
}

function mapDomainErrorToHttp(e) {
    const code = String(e?.message || "");

    if (code === "TASK_SET_ID_REQUIRED" || code === "STUDENT_ID_REQUIRED" || code === "STUDENT_NEEDS_FIRST_NAME")
        return { status: 400, body: { error: code } };

    if (code === "TASK_SET_NOT_FOUND")
        return { status: 404, body: { error: code } };

    return null;
}

// --------------------------------------------------
// Controller
// --------------------------------------------------
export const schoolsTaskSetsController = {
    mapRoutes(app) {

        // ==========================================================
        // (0) RECOMMENDED PREVIEW (teacher) — per student quotas
        // ==========================================================
        // POST /schools/task-sets/recommended-preview
        // body: { studentIds: [...], seed, numberOfTasksPerStudent }
        app.post(`/${name}/task-sets/recommended-preview`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;

                const studentIds = normalizeArrayIds(req.body?.studentIds);
                if (!studentIds.length) {
                    return res.status(400).json({ error: "studentIds must be a non-empty array" });
                }

                const numberOfTasksPerStudent = clampInt(req.body?.numberOfTasksPerStudent, 1, 50, 10);

                const seedRaw = Number(req.body?.seed);
                const seed = Number.isFinite(seedRaw) ? seedRaw : 1;

                const result = await buildRecommendedQuotasForStudents({
                    studentIds,
                    seed,
                    numberOfTasksPerStudent,
                });

                return res.json(result);
            } catch (e) {
                next(e);
            }
        });

        // ==========================================================
        // (1.5) BUILD TASK SET (teacher) — create set + tasks, no assignment
        // ==========================================================
        // GET /schools/task-sets/build?taskMode=translations&ruleIds=PAST_SIMPLE,ARTICLES&numberOfTasks=10&seed=1
        app.get(`/${name}/task-sets/`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;

                const taskMode = normalizeTaskMode(req.query?.taskMode);
                if (!taskMode) {
                    return res.status(400).json({
                        error: "taskMode must be one of: translations, gaps, mixed",
                    });
                }

                const ruleIds = normalizeRuleIds(req.query?.ruleIds);
                if (!ruleIds.length) {
                    return res.status(400).json({ error: "ruleIds must be non-empty (comma-separated or array)" });
                }

                const numberOfTasks = clampInt(req.query?.numberOfTasks, 1, 50, 10);

                const seedRaw = Number(req.query?.seed);
                const seed = Number.isFinite(seedRaw) ? seedRaw : 1;

                const tasks = await buildTaskSetTasks({
                    teacherId,
                    taskMode,
                    ruleIds,
                    recommended: false, // not recommended build here
                    numberOfTasks,
                    seed,
                });

                if (!Array.isArray(tasks) || !tasks.length) {
                    return res.status(400).json({ error: "Failed to generate tasks" });
                }

                await createSchoolTeacherForAccount(teacherId);

                // create set WITHOUT title/deadline
                const created = await createTaskSetWithTasks({
                    teacherId,
                    setType: "homework",
                    title: req.query.title || 'Draft assignment',          // no title at this moment
                    deadline: null,     // no deadline here
                    tasks,
                });

                return res.status(201).json({
                    taskSetId: created.taskSetId,
                    taskMode,
                    ruleIds,
                    numberOfTasks: tasks.length,
                    seed,
                    tasks, // return full tasks list
                });
            } catch (e) {
                next(e);
            }
        });


        // ==========================================================
        // (1.6) ASSIGN TASK SET (teacher) — accepts tasks + title + studentId(s)
        // ==========================================================
        // POST /schools/task-sets/:taskSetId/assign
        // body: { title, studentIds: [...], tasks: [...] } OR { title, studentId, tasks: [...] }
        app.post(`/${name}/task-sets/:taskSetId/assign`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;
                const taskSetId = String(req.params.taskSetId || "").trim();
                if (!taskSetId) return res.status(400).json({ error: "taskSetId required" });

                const title = String(req.body?.title ?? "").trim();
                if (!title) return res.status(400).json({ error: "title is required" });

                // accept studentId OR studentIds
                const studentIds = normalizeArrayIds(
                    req.body?.studentIds?.length
                        ? req.body.studentIds
                        : (req.body?.studentId ? [req.body.studentId] : [])
                );
                if (!studentIds.length) {
                    return res.status(400).json({ error: "studentIds (or studentId) is required" });
                }

                const tasks = Array.isArray(req.body?.tasks) ? req.body.tasks : [];
                if (!tasks.length) return res.status(400).json({ error: "tasks must be a non-empty array" });

                // (B) Update title
                await updateTaskSetTitleById({
                    teacherId,
                    taskSetId,
                    title,
                });

                // (C) Assign to students (no deadline here)
                const assigned = await assignTaskSetsToStudents({
                    teacherId,
                    taskSetIds: [taskSetId],
                    studentIds,
                    setType: "homework",
                    deadline: null,
                });

                return res.status(201).json({
                    taskSetId,
                    title,
                    assigned: assigned?.inserted ?? 0,
                    tasksCount: tasks.length,
                });
            } catch (e) {
                next(e);
            }
        });


        // ==========================================================
        // (2) TEACHER: LIST TASK SETS (paged, per-student completion)
        // ==========================================================
        app.get(`/${name}/task-sets/teacher`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;
                const limit = clampInt(req.query?.limit, 1, 50, 10);
                const cursor = parseCursorTeacher(req.query);

                const result = await getTaskSetsListTeacherPaged({
                    teacherId,
                    limit,
                    ...(cursor ? { cursor } : {}),
                });

                return res.json(result);
            } catch (e) {
                next(e);
            }
        });

        // ==========================================================
        // (3) STUDENT: LIST ASSIGNED TASK SETS (paged, completion)
        // ==========================================================
        app.get(`/${name}/task-sets/student`, authMiddleware, async (req, res, next) => {
            try {
                const studentId = req.user.id;
                const limit = clampInt(req.query?.limit, 1, 50, 10);
                const cursor = parseCursorStudent(req.query);

                const result = await getTaskSetsListStudentPaged({
                    studentId,
                    limit,
                    ...(cursor ? { cursor } : {}),
                });

                return res.json(result);
            } catch (e) {
                next(e);
            }
        });

        // POST /schools/task-sets/join?taskSetId=...&firstName=...&lastName=...
        app.post(`/${name}/task-sets/join`, authMiddleware, async (req, res, next) => {
            try {
                const studentId = req.user.id;

                const taskSetId = String(req.query?.taskSetId || "").trim();

                // (1) Mongo: fetch set and get teacherId
                const set = await getTaskSetByIdForJoin({ taskSetId });
                const teacherId = set.teacherId;

                // (2) PG: ensure teacher-student relation exists (or create)
                const st = await ensureTeacherStudentPg({
                    teacherId,
                    studentId,
                });

                // (3) Mongo: assign set to student (idempotent)
                const asg = await assignTaskSetToStudentIdempotent({
                    teacherId,
                    taskSetId,
                    studentId,
                    setType: set.setType || "homework",
                    deadline: set.deadline ? new Date(set.deadline) : null,
                });

                return res.status(201).json({
                    ok: true,
                    taskSetId,
                    teacherId,
                    studentId,
                    studentCreated: Boolean(st?.created),
                    assignmentCreated: Boolean(asg?.created),
                });
            } catch (e) {
                const mapped = mapDomainErrorToHttp(e);
                if (mapped) return res.status(mapped.status).json(mapped.body);
                next(e);
            }
        });


        // ==========================================================
        // (4) TEACHER: GET ALL TASKS FROM SET
        // ==========================================================
        app.get(`/${name}/task-sets/:taskSetId/tasks`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;
                const taskSetId = String(req.params.taskSetId || "").trim();
                if (!taskSetId) return res.status(400).json({ error: "taskSetId required" });

                const result = await getAllTasksFromTaskSetByTeacher({ teacherId, taskSetId });
                return res.json(result);
            } catch (e) {
                next(e);
            }
        });

        // ==========================================================
        // (4S) STUDENT: GET ALL TASKS FROM ASSIGNED SET (safe view)
        // ==========================================================
        app.get(`/${name}/task-sets/:taskSetId/tasks-student`, authMiddleware, async (req, res, next) => {
            try {
                const studentId = req.user.id;
                const taskSetId = String(req.params.taskSetId || "").trim();
                if (!taskSetId) return res.status(400).json({ error: "taskSetId required" });

                const result = await getAllTasksFromTaskSetByStudent({ studentId, taskSetId });
                return res.json(result);
            } catch (e) {
                next(e);
            }
        });


        // ==========================================================
        // (5) TEACHER: GET ALL STUDENT ANSWERS FROM SET (read-only)
        // ==========================================================
        app.get(`/${name}/task-sets/:taskSetId/answers`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;
                const taskSetId = String(req.params.taskSetId || "").trim();
                if (!taskSetId) return res.status(400).json({ error: "taskSetId required" });

                const studentId = req.query?.studentId ? String(req.query.studentId).trim() : null;

                const answers = await getAllStudentAnswersFromTaskSetByTeacher({
                    teacherId,
                    taskSetId,
                    ...(studentId ? { studentId } : {}),
                });

                return res.json({ answers });
            } catch (e) {
                next(e);
            }
        });

        // ==========================================================
        // (7) TEACHER: ASSIGN EXISTING SET TO MORE STUDENTS
        // ==========================================================
        app.post(`/${name}/task-sets/:taskSetId/assignments`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;
                const taskSetId = String(req.params.taskSetId || "").trim();
                if (!taskSetId) return res.status(400).json({ error: "taskSetId required" });

                const studentIds = normalizeArrayIds(req.body?.studentIds);
                if (!studentIds.length) {
                    return res.status(400).json({ error: "studentIds must be a non-empty array" });
                }

                const dueDate = parseOptionalDate(req.body?.dueDate);

                const assigned = await assignTaskSetsToStudents({
                    teacherId,
                    taskSetIds: [taskSetId],
                    studentIds,
                    setType: "homework",
                    deadline: dueDate,
                });

                return res.status(201).json({
                    taskSetId,
                    assigned: assigned?.inserted ?? 0,
                    dueDate: dueDate ? dueDate.toISOString() : null,
                });
            } catch (e) {
                next(e);
            }
        });
    },
};

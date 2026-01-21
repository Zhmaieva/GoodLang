// controllers/schoolsController.js — FULL DROP-IN
//
// Routes implemented (NO "student saves answer" yet):
//
// 1) POST /schools/task-sets
//    - Teacher creates a set from config (no task content in request)
//    - Builds tasks via buildTaskSetTasks()
//    - Saves set+tasks, assigns to provided students
//
// 2) GET /schools/task-sets/teacher
//    - Teacher list last task sets with paging + per-student completion per set
//    - query: limit=10&cursorCreatedAt=...&cursorId=...
//
// 3) GET /schools/task-sets/student
//    - Student list last assigned sets with paging + completion for that student
//    - query: limit=10&cursorAssignedAt=...&cursorId=...
//
// 4) GET /schools/task-sets/:taskSetId/tasks
//    - Teacher gets all tasks in the set
//
// 5) GET /schools/task-sets/:taskSetId/answers
//    - Teacher gets all answers in the set (optional ?studentId=...)
//    - This is read-only until we implement student submission
//
// 6) GET /schools/task-sets/:taskSetId/next
//    - Student gets next unanswered task in the set
//
// 7) POST /schools/task-sets/:taskSetId/assignments
//    - Teacher assigns an existing set to additional students
//    - body: { studentIds: [...], dueDate?: ... }
//
// Depends on:
// - authMiddleware
// - buildTaskSetTasks (services/taskSetBuilderService.js)
// - repository methods (database/repositories/scoresRepository.js) :contentReference[oaicite:1]{index=1}

import { authMiddleware } from "../middleware/authMiddleware.js";

import {
    createTaskSetWithTasks,
    assignTaskSetsToStudents,
    getTaskSetsListTeacherPaged,
    getTaskSetsListStudentPaged,
    getNextTaskFromTaskSet,
    getAllTasksFromTaskSetByTeacher,
    getAllStudentAnswersFromTaskSetByTeacher,
} from "../database/repositories/scoresRepository.js";

import { buildTaskSetTasks } from "../services/taskSetBuilderService.js";

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

function normalizeLevel(v) {
    const l = String(v ?? "").trim().toUpperCase();
    if (["A1", "A2", "B1", "B2"].includes(l)) return l;
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

// --------------------------------------------------
// Controller
// --------------------------------------------------
export const schoolsTaskSetsController = {
    mapRoutes(app) {
        // ==========================================================
        // (1) CREATE TASK SET (teacher)
        // ==========================================================
        app.post(`/${name}/task-sets`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;

                const studentIds = normalizeArrayIds(req.body?.studentIds);
                if (!studentIds.length) {
                    return res.status(400).json({ error: "studentIds must be a non-empty array" });
                }

                const taskMode = normalizeTaskMode(req.body?.taskMode);
                if (!taskMode) {
                    return res.status(400).json({
                        error: "taskMode must be one of: translations, gaps, mixed",
                    });
                }

                const title = String(req.body?.title ?? "").trim();
                if (!title) {
                    return res.status(400).json({ error: "title is required" });
                }

                const numberOfTasks = clampInt(req.body?.numberOfTasks, 1, 50, 10);

                const seedRaw = Number(req.body?.seed);
                const seed = Number.isFinite(seedRaw) ? seedRaw : 1;

                const dueDate = parseOptionalDate(req.body?.dueDate);

                const ruleIds = normalizeRuleIds(req.body?.ruleIds);
                const recommended = String(req.body?.recommended ?? "false").toLowerCase() === "true";

                let level = null;

                if (!ruleIds.length) {
                    if (!recommended) {
                        return res.status(400).json({
                            error: "Provide ruleIds OR set recommended=true with level (A1–B2)",
                        });
                    }
                    level = normalizeLevel(req.body?.level);
                    if (!level) {
                        return res.status(400).json({
                            error: "level is required when recommended=true (A1–B2)",
                        });
                    }
                } else {
                    // optional
                    level = req.body?.level ? normalizeLevel(req.body.level) : null;
                }

                // Build tasks (teacher sends no content)
                const tasks = await buildTaskSetTasks({
                    teacherId,
                    studentIds,
                    taskMode,
                    ruleIds: ruleIds.length ? ruleIds : undefined,
                    recommended: !ruleIds.length,
                    level,
                    numberOfTasks,
                    seed,
                });

                if (!Array.isArray(tasks) || !tasks.length) {
                    return res.status(400).json({ error: "Failed to generate tasks" });
                }

                // Save set + tasks
                const created = await createTaskSetWithTasks({
                    teacherId,
                    setType: "homework",
                    title,
                    deadline: dueDate,
                    tasks,
                });

                // Assign to students
                const assigned = await assignTaskSetsToStudents({
                    teacherId,
                    taskSetIds: [created.taskSetId],
                    studentIds,
                    setType: "homework",
                    deadline: dueDate,
                });

                return res.status(201).json({
                    taskSetId: created.taskSetId,
                    assigned: assigned?.inserted ?? 0,
                    numberOfTasks: tasks.length,
                    taskMode,
                    title,
                    dueDate: dueDate ? dueDate.toISOString() : null,
                    seed,
                });
            } catch (e) {
                next(e);
            }
        });

        // ==========================================================
        // (2) TEACHER: LIST TASK SETS (paged, per-student completion)
        // ==========================================================
        // GET /schools/task-sets/teacher?limit=10&cursorCreatedAt=...&cursorId=...
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
        // GET /schools/task-sets/student?limit=10&cursorAssignedAt=...&cursorId=...
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

        // ==========================================================
        // (4) TEACHER: GET ALL TASKS FROM SET
        // ==========================================================
        // GET /schools/task-sets/:taskSetId/tasks
        app.get(`/${name}/task-sets/:taskSetId/tasks`, authMiddleware, async (req, res, next) => {
            try {
                const teacherId = req.user.id;
                const taskSetId = String(req.params.taskSetId || "").trim();
                if (!taskSetId) return res.status(400).json({ error: "taskSetId required" });

                const tasks = await getAllTasksFromTaskSetByTeacher({ teacherId, taskSetId });
                return res.json({ tasks });
            } catch (e) {
                next(e);
            }
        });

        // ==========================================================
        // (5) TEACHER: GET ALL STUDENT ANSWERS FROM SET (read-only)
        // ==========================================================
        // GET /schools/task-sets/:taskSetId/answers?studentId=...
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
        // (6) STUDENT: GET NEXT TASK FROM SET
        // ==========================================================
        // GET /schools/task-sets/:taskSetId/next
        app.get(`/${name}/task-sets/:taskSetId/next`, authMiddleware, async (req, res, next) => {
            try {
                const studentId = req.user.id;
                const taskSetId = String(req.params.taskSetId || "").trim();
                if (!taskSetId) return res.status(400).json({ error: "taskSetId required" });

                const task = await getNextTaskFromTaskSet({ studentId, taskSetId });
                return res.json({ task }); // can be null when completed
            } catch (e) {
                next(e);
            }
        });

        // ==========================================================
        // (7) TEACHER: ASSIGN EXISTING SET TO MORE STUDENTS
        // ==========================================================
        // POST /schools/task-sets/:taskSetId/assignments
        // body: { studentIds: [...], dueDate?: ... }
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

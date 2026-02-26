// =====================================================================
// Student: save answer for a task
// - stores into good_lang_student_answers
// - NO validation
// - correctAnswer provided externally
// =====================================================================
import {toObjectIdStrict} from "./schoolTaskRepository.js";
import {connectDB} from "../mongo.js";


function safeStr(x) {
    const s = x == null ? "" : String(x);
    return s;
}

export async function saveStudentAnswerForGapTask({
                                                   studentId,
                                                   taskId,

                                                   // attempt
                                                   chosenOption,

                                                   // task snapshot (what we evaluated against)
                                                   taskSnapshot, // { taskSetId, teacherId, taskType, sentenceTemplate, options, correctOption, rules }

                                                   // evaluation result (from evaluateGapAndCoach)
                                                   evaluation, // { sample_in_target_language, answer_is_correct, correct_answer, tip_if_wrong, scores }

                                               }) {
    const db = await connectDB();

    const userId = String(studentId || "").trim();
    if (!userId) throw new Error("studentId required");

    const taskObjId = toObjectIdStrict(taskId, "taskId");
    const now = new Date();

    const taskSetObjId =
        taskSnapshot?.taskSetId ? toObjectIdStrict(taskSnapshot.taskSetId, "taskSetId") : null;

    const doc = {
        userId,
        taskId: taskObjId,

        taskSetId: taskSetObjId,
        teacherId: taskSnapshot?.teacherId ?? null,
        taskType: taskSnapshot?.taskType ?? "gap",

        // what student chose
        chosenOption: chosenOption ?? null,

        // what we evaluated against (snapshot)
        task: {
            rules: Array.isArray(taskSnapshot?.rules) ? taskSnapshot.rules : [],
            en: [safeStr(taskSnapshot?.sentenceTemplate)],
            options: Array.isArray(taskSnapshot?.options) ? taskSnapshot.options : [],
            correct: taskSnapshot?.correctOption ?? null,
        },

        // evaluator output (store exactly, don’t reinterpret)
        evaluation: {
            answer_is_correct:
                typeof evaluation?.answer_is_correct === "boolean"
                    ? evaluation.answer_is_correct
                    : null,
            tip_if_wrong: evaluation?.tip_if_wrong ?? "",
            scores: Array.isArray(evaluation?.scores) ? evaluation.scores : [],
        },

        evaluatedAt: now,
    };

    const res = await db.collection("good_lang_student_answers").updateOne(
        { userId, taskId: taskObjId },
        {
            $set: doc,
            $setOnInsert: { createdAt: now },
        },
        { upsert: true }
    );

    return {
        saved: true,
        created: Boolean(res?.upsertedCount),
    };
}
// =====================================================================
// Student: find a task by taskId ONLY if it's assigned to the student
// - joins: good_lang_tasks + good_lang_task_set_assignments (+ task set title optional)
// - returns null if not assigned
// =====================================================================
export async function getAssignedTaskForStudentByTaskId({ studentId, taskId }) {
    const db = await connectDB();

    const studentKey = String(studentId || "").trim();
    if (!studentKey) throw new Error("studentId required");

    const taskObjId = toObjectIdStrict(taskId, "taskId");

    // 1) Load task
    const task = await db.collection("good_lang_tasks").findOne(
        { _id: taskObjId },
        {
            projection: {
                _id: 1,
                taskSetId: 1,
                teacherId: 1,
                setType: 1,
                taskType: 1,
                taskOrderNumber: 1,
                ruleIds: 1,
                textToTranslate: 1,
                options: 1,
                correctAnswer: 1,
                tipIfWrong: 1,
            },
        }
    );

    if (!task) return null;

    // 2) Verify assignment exists for this student + this taskSetId
    const asg = await db.collection("good_lang_task_set_assignments").findOne(
        {
            taskSetId: task.taskSetId,
            studentId: studentKey,
            state: "assigned",
        },
        {
            projection: {
                _id: 1,
                taskSetId: 1,
                studentId: 1,
                teacherId: 1,
                setType: 1,
                assignedAt: 1,
                deadline: 1,
            },
        }
    );

    if (!asg) return null;

    return {
        task: {
            id: String(task._id),
            taskSetId: String(task.taskSetId),
            teacherId: String(task.teacherId || ""),
            setType: task.setType ?? "homework",
            taskType: task.taskType ?? null,
            taskOrderNumber: task.taskOrderNumber ?? null,
            ruleIds: Array.isArray(task.ruleIds) ? task.ruleIds : [],
            textToTranslate: task.textToTranslate ?? null,
            options: Array.isArray(task.options) ? task.options : null,
            correctAnswer: task.correctAnswer ?? null,
            tipIfWrong: task.tipIfWrong ?? null,
        },
        assignment: {
            id: String(asg._id),
            taskSetId: String(asg.taskSetId),
            studentId: String(asg.studentId),
            teacherId: String(asg.teacherId || ""),
            setType: asg.setType ?? "homework",
            assignedAt: asg.assignedAt ? toIso(asg.assignedAt) : null,
            deadline: asg.deadline ? toIso(asg.deadline) : null,
        },
    };
}


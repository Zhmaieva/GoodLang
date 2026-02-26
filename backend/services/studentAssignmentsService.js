import { getAssignedTaskForStudentByTaskId } from "../database/repositories/studentTaskRepository.js";
import { evaluateGapAndCoach } from "../core/сore.js";
import {saveStudentAnswerForGapTask} from "../database/repositories/studentTaskRepository.js"; // adjust path


export async function submitStudentGapAnswer({
                                              studentId,
                                              taskId,
                                              chosenOption,
                                          }) {
    const found = await getAssignedTaskForStudentByTaskId({ studentId, taskId });
    if (!found) throw new Error("TASK_NOT_ASSIGNED_OR_NOT_FOUND");

    const { task, assignment } = found;

    const taskType = String(task.taskType || "");
    if (taskType !== "gap") throw new Error("UNSUPPORTED_TASK_TYPE");

    const evalTask = {
        rules: Array.isArray(task.ruleIds) ? task.ruleIds : [],
        en: [String(task.textToTranslate ?? "")],
        options: Array.isArray(task.options) ? task.options : [],
        correct: task.correctAnswer ?? "",
    };

    const evaluation = await evaluateGapAndCoach({
        task: evalTask,
        userAnswer: chosenOption ?? "",
    });

    await saveStudentAnswerForGapTask({
        studentId,
        taskId,
        chosenOption,
        taskSnapshot: {
            taskSetId: task.taskSetId,
            teacherId: assignment?.teacherId || task.teacherId || null,
            taskType: "gap",
            sentenceTemplate: evalTask.en[0],
            options: evalTask.options,
            correctOption: evalTask.correct,
            rules: evalTask.rules,
        },
        evaluation,
    });

    return {
        ok: true,
        evaluation,
    };
}

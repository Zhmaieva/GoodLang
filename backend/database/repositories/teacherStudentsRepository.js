import { pool } from "../pool.js";

const ERR = {
    teacher_account_id_REQUIRED: "teacher_account_id_REQUIRED",
    student_account_id_REQUIRED: "student_account_id_REQUIRED",
    STUDENT_NEEDS_FIRST_NAME: "STUDENT_NEEDS_FIRST_NAME",
};

export async function ensureTeacherStudentPg({ teacherId, studentId, firstName, lastName }) {
    const t = String(teacherId || "").trim();
    if (!t) throw new Error(ERR.teacher_account_id_REQUIRED);

    const s = String(studentId || "").trim();
    if (!s) throw new Error(ERR.student_account_id_REQUIRED);

    const fn = String(firstName ?? "").trim();
    const ln = String(lastName ?? "").trim();

    const existing = await pool.query(
        `SELECT id FROM teacher_students WHERE teacher_account_id=$1 AND student_account_id=$2 LIMIT 1`,
        [t, s]
    );

    if (existing.rows[0]) return { created: false }; // ignore names

    if (!fn) throw new Error(ERR.STUDENT_NEEDS_FIRST_NAME);

    const ins = await pool.query(
        `
            INSERT INTO teacher_students (teacher_account_id, student_account_id, first_name, last_name)
            VALUES ($1,$2,$3,$4)
            ON CONFLICT (teacher_account_id, student_account_id) DO NOTHING
            RETURNING id
        `,
        [t, s, fn, ln || null]
    );

    return { created: ins.rows.length > 0 };
}

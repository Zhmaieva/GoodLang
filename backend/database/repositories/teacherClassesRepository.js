import { pool } from "../pool.js";

/**
 * Helpers
 */
function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function genInviteCode6() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

/**
 * List teacher's classes
 */
export async function listTeachersClasses(teacherAccountId) {
    const { rows } = await pool.query(
        `
    SELECT id, teacher_account_id, name, invite_code, created_at
    FROM classes
    WHERE teacher_account_id = $1
    ORDER BY created_at DESC
    `,
        [teacherAccountId]
    );
    return rows;
}

/**
 * List teacher's students (across all classes) — returns both active and inactive rows.
 * If you want ONLY active students, add WHERE cs.is_active = true.
 */
export async function listTeachersStudents(teacherAccountId) {
    const { rows } = await pool.query(
        `
    SELECT
      cs.student_account_id,
      a.email,
      a.status AS account_status,
      cs.first_name,
      cs.last_name,
      cs.is_active,
      cs.created_at AS added_at,
      c.id AS class_id,
      c.name AS class_name
    FROM classes c
    JOIN class_students cs ON cs.class_id = c.id
    JOIN accounts a ON a.id = cs.student_account_id
    WHERE c.teacher_account_id = $1
    ORDER BY cs.created_at DESC
    `,
        [teacherAccountId]
    );
    return rows;
}

/**
 * List a single class's students (teacher-owned), including both active and inactive
 */
export async function listClassStudents(teacherAccountId, classId) {
    const { rows } = await pool.query(
        `
    SELECT
      cs.student_account_id,
      a.email,
      a.status AS account_status,
      cs.first_name,
      cs.last_name,
      cs.is_active,
      cs.created_at
    FROM classes c
    JOIN class_students cs ON cs.class_id = c.id
    JOIN accounts a ON a.id = cs.student_account_id
    WHERE c.teacher_account_id = $1
      AND c.id = $2
    ORDER BY cs.created_at DESC
    `,
        [teacherAccountId, classId]
    );
    return rows;
}

/**
 * Get teacher metadata
 */
export async function getTeacherMetadata(teacherAccountId) {
    const { rows } = await pool.query(
        `
    SELECT
      t.account_id,
      t.first_name,
      t.last_name,
      t.status,
      t.students_quota,
      t.created_at
    FROM teachers t
    WHERE t.account_id = $1
    LIMIT 1
    `,
        [teacherAccountId]
    );

    // Optional: include active students count
    const { rows: cnt } = await pool.query(
        `
    SELECT COUNT(*)::int AS active_students
    FROM classes c
    JOIN class_students cs ON cs.class_id = c.id
    WHERE c.teacher_account_id = $1
      AND cs.is_active = true
    `,
        [teacherAccountId]
    );

    return {
        ...(rows[0] || null),
        active_students: cnt[0]?.active_students ?? 0,
    };
}

/**
 * Create a class (invite code generated)
 */
export async function createClass(teacherAccountId, name) {
    // generate unique invite code (retry a few times)
    for (let attempt = 0; attempt < 6; attempt++) {
        const code = genInviteCode6();
        try {
            const { rows } = await pool.query(
                `
        INSERT INTO classes (teacher_account_id, name, invite_code)
        VALUES ($1, $2, $3)
        RETURNING id, teacher_account_id, name, invite_code, created_at
        `,
                [teacherAccountId, name, code]
            );
            return rows[0];
        } catch (e) {
            // unique violation on invite_code -> retry
            if (String(e?.code) === "23505") continue;
            throw e;
        }
    }
    throw new Error("Failed to generate unique invite code");
}

/**
 * Re-generate invitation code for a class (teacher-owned)
 */
export async function regenerateClassInviteCode(teacherAccountId, classId) {
    for (let attempt = 0; attempt < 6; attempt++) {
        const code = genInviteCode6();
        try {
            const { rows } = await pool.query(
                `
        UPDATE classes
        SET invite_code = $1
        WHERE id = $2
          AND teacher_account_id = $3
        RETURNING id, invite_code
        `,
                [code, classId, teacherAccountId]
            );
            if (!rows[0]) return null; // not found or not owned
            return rows[0];
        } catch (e) {
            if (String(e?.code) === "23505") continue;
            throw e;
        }
    }
    throw new Error("Failed to generate unique invite code");
}

/**
 * Internal: find existing account by email or create one.
 * Returns { id, email, status, original_status }
 */
async function findOrCreateAccountByEmail(client, email) {
    const normalized = normalizeEmail(email);

    const { rows: existing } = await client.query(
        `SELECT id, email, status, original_status FROM accounts WHERE email = $1 LIMIT 1`,
        [normalized]
    );
    if (existing[0]) return existing[0];

    const { rows: created } = await client.query(
        `
    INSERT INTO accounts (email)
    VALUES ($1)
    RETURNING id, email, status, original_status
    `,
        [normalized]
    );
    return created[0];
}

/**
 * Internal: ensure original_status is set before forcing paid
 */
async function ensureOriginalStatus(client, accountId) {
    await client.query(
        `
    UPDATE accounts
    SET original_status = COALESCE(original_status, status)
    WHERE id = $1
    `,
        [accountId]
    );
}

/**
 * Internal: set account to paid (teacher/class membership)
 */
async function setAccountPaid(client, accountId) {
    await ensureOriginalStatus(client, accountId);
    await client.query(
        `
    UPDATE accounts
    SET status = 'paid'
    WHERE id = $1
    `,
        [accountId]
    );
}

/**
 * Internal: restore account status to original_status IF the student is not active in any other class
 */
async function restoreIfNoActiveClasses(client, studentAccountId) {
    const { rows: active } = await client.query(
        `
    SELECT 1
    FROM class_students
    WHERE student_account_id = $1
      AND is_active = true
    LIMIT 1
    `,
        [studentAccountId]
    );

    if (active[0]) return; // still active somewhere -> keep paid

    await client.query(
        `
    UPDATE accounts
    SET status = COALESCE(original_status, status)
    WHERE id = $1
    `,
        [studentAccountId]
    );
}

/**
 * Add a student to a class by email (teacher-owned), thread-safe quota.
 * - Finds or creates student account
 * - Enforces teacher plan (must be 'pro')
 * - Enforces teacher.students_quota vs current active students count
 * - Upserts class_students row and activates it
 * - Sets student's account status to paid
 */
export async function addStudentToClassByEmail({
                                                   teacherAccountId,
                                                   classId,
                                                   email,
                                                   firstName = null,
                                                   lastName = null,
                                               }) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1) Verify class belongs to teacher (lock class row)
        const { rows: cls } = await client.query(
            `
                SELECT id
                FROM classes
                WHERE id = $1 AND teacher_account_id = $2
                    FOR UPDATE
            `,
            [classId, teacherAccountId]
        );
        if (!cls[0]) {
            await client.query("ROLLBACK");
            return { ok: false, reason: "class_not_found_or_not_owned" };
        }

        // 2) Lock teacher row (quota thread-safety anchor) + enforce plan
        const { rows: teacher } = await client.query(
            `
                SELECT status, students_quota
                FROM teachers
                WHERE account_id = $1
                    FOR UPDATE
            `,
            [teacherAccountId]
        );
        if (!teacher[0]) {
            await client.query("ROLLBACK");
            return { ok: false, reason: "teacher_not_found" };
        }

        // ✅ Free teachers cannot add students regardless of quota
        if (teacher[0].status !== "pro") {
            await client.query("ROLLBACK");
            return { ok: false, reason: "teacher_not_pro" };
        }

        // 3) Count active students under this teacher (within tx + teacher lock)
        const { rows: cnt } = await client.query(
            `
      SELECT COUNT(*)::int AS active_students
      FROM classes c
      JOIN class_students cs ON cs.class_id = c.id
      WHERE c.teacher_account_id = $1
        AND cs.is_active = true
      `,
            [teacherAccountId]
        );

        const activeStudents = cnt[0]?.active_students ?? 0;
        const quota = Number(teacher[0].students_quota || 0);

        // quota = 0 means "no seats" (keep consistent)
        // if you want 0 to mean "unlimited", tell me and I'll flip it
        if (quota <= 0) {
            await client.query("ROLLBACK");
            return { ok: false, reason: "quota_exceeded", activeStudents, quota };
        }

        if (activeStudents >= quota) {
            await client.query("ROLLBACK");
            return { ok: false, reason: "quota_exceeded", activeStudents, quota };
        }

        // 4) Find or create student
        const student = await findOrCreateAccountByEmail(client, email);

        // 5) Insert/activate membership
        const { rows: up } = await client.query(
            `
                INSERT INTO class_students (class_id, student_account_id, first_name, last_name, is_active)
                VALUES ($1, $2, $3, $4, true)
                    ON CONFLICT (class_id, student_account_id)
      DO UPDATE SET
                    first_name = COALESCE(EXCLUDED.first_name, class_students.first_name),
                                 last_name  = COALESCE(EXCLUDED.last_name,  class_students.last_name),
                                 is_active  = true
                                 RETURNING id, class_id, student_account_id, is_active, created_at
            `,
            [classId, student.id, firstName, lastName]
        );

        // 6) Force paid
        await setAccountPaid(client, student.id);

        await client.query("COMMIT");
        return { ok: true, studentAccountId: student.id, membership: up[0] };
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}


/**
 * Remove student from a class (deactivate).
 * If student not active in any other class -> restore status from original_status.
 */
export async function deactivateStudentInClass(teacherAccountId, classId, studentAccountId) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Ensure teacher owns class
        const { rows: cls } = await client.query(
            `
      SELECT id
      FROM classes
      WHERE id = $1 AND teacher_account_id = $2
      FOR UPDATE
      `,
            [classId, teacherAccountId]
        );
        if (!cls[0]) {
            await client.query("ROLLBACK");
            return { ok: false, reason: "class_not_found_or_not_owned" };
        }

        const { rowCount } = await client.query(
            `
      UPDATE class_students
      SET is_active = false
      WHERE class_id = $1
        AND student_account_id = $2
      `,
            [classId, studentAccountId]
        );

        // restore if no other active memberships
        await restoreIfNoActiveClasses(client, studentAccountId);

        await client.query("COMMIT");
        return { ok: rowCount === 1 };
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

/**
 * Accept invitation by code (student action)
 * - Finds class by invite_code
 * - Inserts/activates class_students row
 * - Sets account to paid (saves original_status if needed)
 */
export async function acceptInvitationByCode(studentAccountId, inviteCode) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const code = String(inviteCode || "").trim().toUpperCase();

        const { rows: cls } = await client.query(
            `
      SELECT id, teacher_account_id, name
      FROM classes
      WHERE invite_code = $1
      LIMIT 1
      FOR UPDATE
      `,
            [code]
        );

        if (!cls[0]) {
            await client.query("ROLLBACK");
            return { ok: false, reason: "invalid_code" };
        }

        await client.query(
            `
      INSERT INTO class_students (class_id, student_account_id, is_active)
      VALUES ($1, $2, true)
      ON CONFLICT (class_id, student_account_id)
      DO UPDATE SET is_active = true
      `,
            [cls[0].id, studentAccountId]
        );

        await setAccountPaid(client, studentAccountId);

        await client.query("COMMIT");
        return { ok: true, classId: cls[0].id, className: cls[0].name };
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

/**
 * Get teacher metadata by class id (student action)
 */
export async function getTeacherMetadataByClassId(classId) {
    const { rows } = await pool.query(
        `
    SELECT
      t.account_id,
      t.first_name,
      t.last_name,
      t.status,
      t.students_quota,
      t.created_at,
      c.id AS class_id,
      c.name AS class_name
    FROM classes c
    JOIN teachers t ON t.account_id = c.teacher_account_id
    WHERE c.id = $1
    LIMIT 1
    `,
        [classId]
    );
    return rows[0] || null;
}

/**
 * List classes by student id (student action)
 * Returns both active and inactive memberships (includes is_active)
 */
export async function listClassesByStudentId(studentAccountId) {
    const { rows } = await pool.query(
        `
    SELECT
      c.id,
      c.name,
      c.teacher_account_id,
      cs.is_active,
      cs.created_at AS joined_at
    FROM class_students cs
    JOIN classes c ON c.id = cs.class_id
    WHERE cs.student_account_id = $1
    ORDER BY cs.created_at DESC
    `,
        [studentAccountId]
    );
    return rows;
}

/**
 * Leave class (student action) = deactivate membership
 * If no other active memberships -> restore status to original_status
 */
export async function leaveClass(studentAccountId, classId) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const { rowCount } = await client.query(
            `
      UPDATE class_students
      SET is_active = false
      WHERE class_id = $1
        AND student_account_id = $2
      `,
            [classId, studentAccountId]
        );

        await restoreIfNoActiveClasses(client, studentAccountId);

        await client.query("COMMIT");
        return { ok: rowCount === 1 };
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

// marathonsRepository.js
import { pool } from "../pool.js";

/**
 * Start a 7-day learning marathon for an account (idempotent).
 * - If an in-progress marathon exists for the account -> returns it (no changes).
 * - Otherwise creates:
 *   - learning_marathons row (duration=7, status='in_progress')
 *   - 7 marathon_schedules rows starting NOW, each day = 24h
 *
 * @param {string} accountId
 * @param {string[]} ruleIds - must have exactly 7 rule ids (one per day)
 * @returns {Promise<{
 *   started: boolean,
 *   marathonId: string,
 *   status: 'in_progress'|'completed'|'failed',
 *   createdAt: any,
 *   duration: number
 * }>}
 */
export async function startMarathon(accountId, ruleIds) {
    if (typeof accountId !== "string" || !accountId.trim()) {
        throw new Error("startMarathon: accountId is required");
    }
    if (!Array.isArray(ruleIds) || ruleIds.length !== 7 || ruleIds.some(r => typeof r !== "string" || !r.trim())) {
        throw new Error("startMarathon: ruleIds must be an array of exactly 7 non-empty strings");
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1) Idempotency guard (row-level lock if present)
        // If there is already an in-progress marathon, return it and do nothing.
        const { rows: existingRows } = await client.query(
            `
        SELECT id, status, created_at, duration
        FROM learning_marathons
        WHERE account_id = $1
          AND status = 'in_progress'
        ORDER BY created_at DESC
        LIMIT 1
        FOR UPDATE
      `,
            [accountId]
        );

        if (existingRows[0]) {
            await client.query("COMMIT");
            return {
                started: false,
                marathonId: existingRows[0].id,
                status: existingRows[0].status,
                createdAt: existingRows[0].created_at,
                duration: Number(existingRows[0].duration),
            };
        }

        // 2) Create marathon
        const { rows: created } = await client.query(
            `
        INSERT INTO learning_marathons (account_id, duration, status)
        VALUES ($1, 7, 'in_progress')
        RETURNING id, status, created_at, duration
      `,
            [accountId]
        );

        const marathonId = created[0].id;

// 3) Create 7 schedule rows: Day 1 starts NOW, each day is 24h
// Insert + RETURNING so we have schedule IDs to create tasks
        const params = [marathonId];
        const values = [];
        let p = 2;

        const now = new Date();

        for (let i = 0; i < 7; i++) {
            const dayNumber = i + 1;
            const ruleId = ruleIds[i].trim();

            const dayStartAt = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
            const dayEndAt = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);

            params.push(dayNumber, ruleId, dayStartAt, dayEndAt);
            values.push(`($1, $${p}, $${p + 1}, $${p + 2}, $${p + 3})`);
            p += 4;
        }

        const { rows: schedules } = await client.query(
            `
    INSERT INTO marathon_schedules (marathon_id, day_number, rule_id, day_start_at, day_end_at)
    VALUES ${values.join(", ")}
    RETURNING id, day_number, rule_id
    `,
            params
        );

// 4) Create tasks for each schedule day
        const bonusByDay = { 5: 2, 6: 4, 7: 8 };

        function pushMany(out, marathonScheduleId, startOrdinal, ruleId, count) {
            for (let i = 0; i < count; i++) {
                out.push([marathonScheduleId, startOrdinal + i, ruleId, false]);
            }
            return startOrdinal + count;
        }

        const tasksRows = [];

// Sort by day_number to be safe (RETURNING order is not guaranteed)
        const sorted = [...schedules].sort((a, b) => a.day_number - b.day_number);

        for (const s of sorted) {
            const day = Number(s.day_number);
            const scheduleId = s.id;

            let ordinal = 1;

            // 1) today's main rule: 16 (+ bonus for day 5/6/7)
            const mainCount = 16 + (bonusByDay[day] || 0);
            ordinal = pushMany(tasksRows, scheduleId, ordinal, s.rule_id, mainCount);

            // 2) spaced repetition (if possible)
            // previous day: 8 rows
            if (day >= 2) {
                const prevRule = sorted[day - 2]?.rule_id;
                if (prevRule) ordinal = pushMany(tasksRows, scheduleId, ordinal, prevRule, 8);
            }

            // day before yesterday: 4 rows
            if (day >= 3) {
                const d2Rule = sorted[day - 3]?.rule_id;
                if (d2Rule) ordinal = pushMany(tasksRows, scheduleId, ordinal, d2Rule, 4);
            }

            // today - 3 days: 2 rows
            if (day >= 4) {
                const d3Rule = sorted[day - 4]?.rule_id;
                if (d3Rule) ordinal = pushMany(tasksRows, scheduleId, ordinal, d3Rule, 2);
            }

            // today - 4 days: 1 row
            if (day >= 5) {
                const d4Rule = sorted[day - 5]?.rule_id;
                if (d4Rule) ordinal = pushMany(tasksRows, scheduleId, ordinal, d4Rule, 1);
            }
        }

        if (tasksRows.length) {
            const flat = [];
            const placeholders = tasksRows
                .map((row, i) => {
                    const base = i * 4;
                    flat.push(...row);
                    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
                })
                .join(", ");

            await client.query(
                `
                    INSERT INTO marathon_schedule_tasks
                        (marathon_schedule_id, ordinal_number, rule_id, is_answered)
                    VALUES ${placeholders}
                `,
                flat
            );
        }


        await client.query("COMMIT");
        return {
            started: true,
            marathonId,
            status: created[0].status,
            createdAt: created[0].created_at,
            duration: Number(created[0].duration),
        };
    } catch (err) {
        try { await client.query("ROLLBACK"); } catch (_) {}
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Update marathon status, but ONLY if current status is 'in_progress'.
 * - Allowed transitions: in_progress -> completed | failed (or keep in_progress if you want)
 * - If the marathon is already completed/failed, status cannot be changed.
 *
 * @param {string} accountId
 * @param {'completed'|'failed'} nextStatus
 * @returns {Promise<{
 *   updated: boolean,
 *   marathonId: string,
 *   status: 'in_progress'|'completed'|'failed',
 *   previousStatus?: 'in_progress'|'completed'|'failed'
 * }>}
 */
export async function updateMarathonStatus(accountId, nextStatus) {
    const allowed = new Set(["completed", "failed"]);
    if (!allowed.has(nextStatus)) {
        throw new Error("updateMarathonStatus: nextStatus must be 'completed' or 'failed'");
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Lock the row so two updates can't race.
        const { rows: existing } = await client.query(
            `
            SELECT id, status
            FROM learning_marathons
            WHERE account_id = $1
            AND status = 'in_progress'
            LIMIT 1
            FOR UPDATE
            `,
            [accountId.trim()]
        );

        if (!existing[0]) {
            return {
                updated: false,
                status: null,
                previousStatus: null,
            };
        }

        const prev = existing[0].status;

        // Only allow changing FROM in_progress
        if (prev !== "in_progress") {
            await client.query("COMMIT");
            return {
                updated: false,
                status: prev,
                previousStatus: prev,
            };
        }

        const { rows: updated } = await client.query(
            `
            UPDATE learning_marathons
            SET status = $2
            WHERE account_id = $1
              AND status = 'in_progress'
            RETURNING id, status
            `,
            [accountId.trim(), nextStatus]
        );

        await client.query("COMMIT");

        // With the lock + WHERE guard, this should always update, but keep it safe.
        if (!updated[0]) {
            return { updated: false, status: "in_progress" };
        }

        return {
            updated: true,
            status: updated[0].status,
            previousStatus: "in_progress",
        };
    } catch (err) {
        try { await client.query("ROLLBACK"); } catch (_) {}
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Complete the current marathon day for the active in_progress marathon.
 * "Current day" = earliest (lowest day_number) schedule with is_day_completed = false.
 *
 * @param {string} accountId
 * @param {{ requireAllTasksAnswered?: boolean }} [opts]
 * @returns {Promise<{
 *   updated: boolean,
 *   marathonId?: string,
 *   scheduleId?: string,
 *   dayNumber?: number,
 *   previousIsDayCompleted?: boolean
 * }>}
 */
export async function completeCurrentMarathonDay(accountId, opts = {}) {
    const { requireAllTasksAnswered = false } = opts;

    if (typeof accountId !== "string" || !accountId.trim()) {
        throw new Error("completeCurrentMarathonDay: accountId is required");
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1) Lock active marathon
        const { rows: mRows } = await client.query(
            `
            SELECT id
            FROM learning_marathons
            WHERE account_id = $1
              AND status = 'in_progress'
            ORDER BY created_at DESC
            LIMIT 1
            FOR UPDATE
            `,
            [accountId.trim()]
        );

        if (!mRows[0]) {
            await client.query("COMMIT");
            return { updated: false };
        }

        const marathonId = mRows[0].id;

        // 2) Lock current schedule day (earliest not completed)
        const { rows: sRows } = await client.query(
            `
            SELECT id, day_number, is_day_completed
            FROM marathon_schedules
            WHERE marathon_id = $1
              AND is_day_completed = FALSE
              AND day_start_at <= NOW()
              AND day_end_at > NOW()
            LIMIT 1
            FOR UPDATE
            `,
            [marathonId]
        );

        if (!sRows[0]) {
            await client.query("COMMIT");
            return { updated: false, marathonId };
        }

        const scheduleId = sRows[0].id;
        const dayNumber = Number(sRows[0].day_number);

        // 3) Optional: require all tasks answered before completing the day
        if (requireAllTasksAnswered) {
            const { rows: tRows } = await client.query(
                `
                SELECT
                  COUNT(*)::int AS total,
                  SUM(CASE WHEN is_answered THEN 1 ELSE 0 END)::int AS answered
                FROM marathon_schedule_tasks
                WHERE marathon_schedule_id = $1
                `,
                [scheduleId]
            );

            const total = tRows?.[0]?.total ?? 0;
            const answered = tRows?.[0]?.answered ?? 0;

            if (total > 0 && answered < total) {
                await client.query("COMMIT");
                return {
                    updated: false,
                    marathonId,
                    scheduleId,
                    dayNumber,
                    previousIsDayCompleted: false,
                };
            }
        }

        // 4) Mark schedule day completed (idempotent)
        const { rows: updatedRows } = await client.query(
            `
            UPDATE marathon_schedules
            SET is_day_completed = TRUE
            WHERE id = $1
              AND is_day_completed = FALSE
            RETURNING id, day_number, is_day_completed
            `,
            [scheduleId]
        );

        await client.query("COMMIT");

        return {
            updated: !!updatedRows[0],
            marathonId,
            scheduleId,
            dayNumber,
            previousIsDayCompleted: false,
        };
    } catch (err) {
        try { await client.query("ROLLBACK"); } catch (_) {}
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Answer next available marathon task for the current day of the active marathon.
 * - If ordinalNumber is provided: answer that exact ordinal (if matches ruleId).
 * - Else: answer the earliest (lowest ordinal_number) not-answered task for that ruleId.
 * - Idempotent: if already answered, no change.
 *
 * @param {string} accountId
 * @param {string} ruleId
 * @param {{ ordinalNumber?: number|null }} [opts]
 * @returns {Promise<{
 *   updated: boolean,
 *   alreadyAnswered?: boolean,
 *   notFound?: boolean,
 *   marathonId?: string,
 *   scheduleId?: string,
 *   dayNumber?: number,
 *   ruleId?: string,
 *   ordinalNumber?: number
 * }>}
 */
export async function answerNextMarathonTaskByRuleId(accountId, ruleId, opts = {}) {
    const { ordinalNumber = null } = opts;

    if (typeof accountId !== "string" || !accountId.trim()) {
        throw new Error("answerNextMarathonTaskByRuleId: accountId is required");
    }
    if (typeof ruleId !== "string" || !ruleId.trim()) {
        throw new Error("answerNextMarathonTaskByRuleId: ruleId is required");
    }
    const cleanRuleId = ruleId.trim();

    const ord =
        ordinalNumber == null
            ? null
            : Number.isFinite(Number(ordinalNumber))
                ? Math.trunc(Number(ordinalNumber))
                : NaN;

    if (ord !== null && (!Number.isFinite(ord) || ord <= 0)) {
        throw new Error("answerNextMarathonTaskByRuleId: ordinalNumber must be a positive integer");
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1) Lock active marathon
        const { rows: mRows } = await client.query(
            `
            SELECT id
            FROM learning_marathons
            WHERE account_id = $1
              AND status = 'in_progress'
            ORDER BY created_at DESC
            LIMIT 1
            FOR UPDATE
            `,
            [accountId.trim()]
        );

        if (!mRows[0]) {
            await client.query("COMMIT");
            return { updated: false, notFound: true };
        }

        const marathonId = mRows[0].id;

        // 2) Lock current day schedule (earliest not completed)
        const { rows: sRows } = await client.query(
            `
            SELECT id, day_number
            FROM marathon_schedules
            WHERE marathon_id = $1
              AND is_day_completed = FALSE
            ORDER BY day_number ASC
            LIMIT 1
            FOR UPDATE
            `,
            [marathonId]
        );

        if (!sRows[0]) {
            await client.query("COMMIT");
            return { updated: false, notFound: true, marathonId };
        }

        const scheduleId = sRows[0].id;
        const dayNumber = Number(sRows[0].day_number);

        // 3) Select target task row (and lock it)
        let taskRow = null;

        if (ord !== null) {
            // Exact ordinal
            const { rows } = await client.query(
                `
                SELECT marathon_schedule_id, ordinal_number, rule_id, is_answered
                FROM marathon_schedule_tasks
                WHERE marathon_schedule_id = $1
                  AND ordinal_number = $2
                  AND rule_id = $3
                LIMIT 1
                FOR UPDATE
                `,
                [scheduleId, ord, cleanRuleId]
            );
            taskRow = rows[0] || null;
        } else {
            // Next available (lowest ordinal) for this rule
            const { rows } = await client.query(
                `
                SELECT marathon_schedule_id, ordinal_number, rule_id, is_answered
                FROM marathon_schedule_tasks
                WHERE marathon_schedule_id = $1
                  AND rule_id = $2
                  AND is_answered = FALSE
                ORDER BY ordinal_number ASC
                LIMIT 1
                FOR UPDATE
                `,
                [scheduleId, cleanRuleId]
            );
            taskRow = rows[0] || null;
        }

        if (!taskRow) {
            await client.query("COMMIT");
            return {
                updated: false,
                notFound: true,
                marathonId,
                scheduleId,
                dayNumber,
                ruleId: cleanRuleId,
                ...(ord !== null ? { ordinalNumber: ord } : {}),
            };
        }

        // 4) Idempotency: if already answered, do nothing
        if (taskRow.is_answered === true) {
            await client.query("COMMIT");
            return {
                updated: false,
                alreadyAnswered: true,
                marathonId,
                scheduleId,
                dayNumber,
                ruleId: taskRow.rule_id,
                ordinalNumber: Number(taskRow.ordinal_number),
            };
        }

        // 5) Mark answered (guarded)
        const { rows: updatedRows } = await client.query(
            `
            UPDATE marathon_schedule_tasks
            SET is_answered = TRUE
            WHERE marathon_schedule_id = $1
              AND ordinal_number = $2
              AND is_answered = FALSE
            RETURNING marathon_schedule_id, ordinal_number, rule_id, is_answered
            `,
            [scheduleId, Number(taskRow.ordinal_number)]
        );

        await client.query("COMMIT");

        const u = updatedRows[0];
        return {
            updated: !!u,
            marathonId,
            scheduleId,
            dayNumber,
            ruleId: u?.rule_id ?? taskRow.rule_id,
            ordinalNumber: Number(u?.ordinal_number ?? taskRow.ordinal_number),
        };
    } catch (err) {
        try { await client.query("ROLLBACK"); } catch (_) {}
        throw err;
    } finally {
        client.release();
    }
}
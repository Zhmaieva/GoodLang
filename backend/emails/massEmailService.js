export async function markSent({ pool, id }) {
    await pool.query(
        `
    UPDATE email_sendings
    SET sent_at = (NOW() AT TIME ZONE 'UTC'),
        last_error = NULL,
        last_failed_at = NULL
    WHERE id = $1
    `,
        [id]
    );
}

export async function markFailed({ pool, id, error }) {
    await pool.query(
        `
    UPDATE email_sendings
    SET last_error = $2,
        last_failed_at = (NOW() AT TIME ZONE 'UTC')
    WHERE id = $1
    `,
        [id, String(error ?? "").slice(0, 4000)]
    );
}


export async function tryInsertTrackingRow({ pool, email, accountId, letterId }) {
    try {
        // Insert only. No UPDATE. No lock. If already exists, 0 rows returned.
        const { rows } = await pool.query(
            `
      INSERT INTO email_sendings (email, account_id, letter_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (email, letter_id) DO NOTHING
      RETURNING id
      `,
            [email, accountId ?? null, letterId]
        );

        // If inserted -> rows[0] exists
        if (rows.length === 0) return { inserted: false, id: null };
        return { inserted: true, id: rows[0].id };
    } catch (e) {
        // Insert failed => MUST NOT SEND
        return { inserted: false, id: null, error: e };
    }
}

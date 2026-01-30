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


export async function tryInsertTrackingRow({
                                               pool,
                                               email,
                                               accountId,
                                               letterId,
                                               force = false,
                                           }) {
    try {
        const { rows } = await pool.query(
            force
                ? `
                  INSERT INTO email_sendings (email, account_id, letter_id)
                  VALUES ($1, $2, $3)
                  RETURNING id
                  `
                : `
                  INSERT INTO email_sendings (email, account_id, letter_id)
                  VALUES ($1, $2, $3)
                  RETURNING id
                  `,
            [email, accountId ?? null, letterId]
        );

        if (rows.length === 0) {
            return { inserted: false, id: null };
        }

        return { inserted: true, id: rows[0].id };
    } catch (e) {
        return { inserted: false, id: null, error: e };
    }
}


BEGIN;

DO $$
    DECLARE
        _email TEXT := 'pexin62110@sepole.com';
        _account_id UUID;
        _marathon_id UUID;
        _deleted_count BIGINT;
    BEGIN
        -- 1) account
        SELECT a.id
        INTO _account_id
        FROM accounts a
        WHERE lower(a.email) = lower(_email);

        IF _account_id IS NULL THEN
            RAISE EXCEPTION 'Account not found for email=%', _email;
        END IF;

        -- 2) active marathon (lock it)
        SELECT lm.id
        INTO _marathon_id
        FROM learning_marathons lm
        WHERE lm.account_id = _account_id
          AND lm.status = 'in_progress'
        ORDER BY lm.created_at DESC
        LIMIT 1
            FOR UPDATE;

        IF _marathon_id IS NULL THEN
            RAISE EXCEPTION 'No in_progress marathon found for email=%', _email;
        END IF;

        -- 3) delete all schedule tasks except ordinal_number=1 (for all days of the marathon)
        WITH schedule_ids AS (
            SELECT ms.id
            FROM marathon_schedules ms
            WHERE ms.marathon_id = _marathon_id
        ),
             deleted AS (
                 DELETE FROM marathon_schedule_tasks mst
                     USING schedule_ids s
                     WHERE mst.marathon_schedule_id = s.id
                         AND mst.ordinal_number <> 1
                     RETURNING 1
             )
        SELECT COUNT(*) INTO _deleted_count FROM deleted;

        RAISE NOTICE 'Trimmed schedule tasks for marathon % (email=%). Deleted % rows (kept only ordinal_number=1).',
            _marathon_id, _email, _deleted_count;
    END $$;

COMMIT;

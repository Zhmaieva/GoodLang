BEGIN;

DO $$
    DECLARE
        _email TEXT := 'pexin62110@sepole.com';
        _account_id UUID;
        _marathon_id UUID;
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
          OR lm.status = 'completed'
        ORDER BY lm.created_at DESC
        LIMIT 1
            FOR UPDATE;

        IF _marathon_id IS NULL THEN
            RAISE EXCEPTION 'No in_progress marathon found for email=%', _email;
        END IF;

        -- 3) shift marathon created_at back by 24h
        UPDATE learning_marathons
        SET created_at = created_at - INTERVAL '24 hours'
        WHERE id = _marathon_id;

        -- 4) shift schedule window back by 24h
        UPDATE marathon_schedules
        SET
            day_start_at = day_start_at - INTERVAL '24 hours',
            day_end_at   = day_end_at   - INTERVAL '24 hours'
        WHERE marathon_id = _marathon_id;

        RAISE NOTICE 'Shifted marathon % (email=%) and its schedule back by 24h', _marathon_id, _email;
    END $$;

COMMIT;

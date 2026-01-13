-- activity
WITH reg_users AS (
    SELECT id AS account_id
    FROM accounts
    WHERE created_at >= TIMESTAMP '2026-01-13 00:00:00+00'
      AND created_at <  TIMESTAMP '2026-02-01 00:00:00+00'
),
     action_dict AS (
         SELECT * FROM (VALUES
                            (1, 'UPDATE_ACCOUNT_STATUS_TO_PAID'),
                            (2, 'UPDATE_ACCOUNT_STATUS_TO_FREE'),
                            (3, 'UPDATE_ACCOUNT_STATUS_TO_ATTENTION'),
                            (100, 'TRANSLATION_CALL'),
                            (200, 'BUTTON_CLICK_START_USING'),
                            (201, 'BUTTON_CLICK_WANT_PREMIUM'),
                            (202, 'BUTTON_CLICK_ACCEPT_COOKIES'),
                            (203, 'BUTTON_CLICK_REJECT_COOKIES'),
                            (204, 'BUTTON_CLICK_FAQ'),
                            (205, 'BUTTON_CLICK_CHANGE_DIFFICULTY'),
                            (206, 'BUTTON_CLICK_CHANGE_DIFFICULTY_ADAPTIVE'),
                            (207, 'BUTTON_CLICK_CHANGE_DIFFICULTY_BEGINNER'),
                            (208, 'BUTTON_CLICK_CHANGE_DIFFICULTY_AVERAGE'),
                            (209, 'BUTTON_CLICK_CHANGE_DIFFICULTY_ADVANCED'),
                            (210, 'BUTTON_CLICK_SUBSCRIPTION'),
                            (211, 'BUTTON_CLICK_START_LEARNING'),
                            (212, 'BUTTON_CLICK_LEARN_MORE'),
                            (213, 'BUTTON_CLICK_RULE_PREVIEW'),
                            (300, 'PAGE_OPEN_TRAINER'),
                            (301, 'PAGE_OPEN_ANALYTICS'),
                            (400, 'MODAL_SHOWN_COOKIES'),
                            (401, 'MODAL_SHOWN_TOU'),
                            (402, 'MODAL_SHOWN_DISCOUNT_SUBSCRIPTION'),
                            (101, 'PDF_DOWNLOAD_CALL'),
                            (500, '500')
                       ) AS t(action_type, action_name)
     )
SELECT
    date_trunc('day', l.created_at) AS day,
    d.action_name,
    COUNT(*)                     AS events,
    COUNT(DISTINCT l.account_id) AS users
FROM account_log l
         JOIN reg_users r ON r.account_id = l.account_id
         JOIN action_dict d USING (action_type)
GROUP BY 1, 2
ORDER BY 1 DESC, 2;




-- retention
WITH constants AS (
    SELECT
        TIMESTAMP '2026-06-01 00:00:00+00' AS reg_from,
        TIMESTAMP '2026-02-01 00:00:00+00' AS reg_to,
        100::int AS TRANSLATION_CALL  -- TODO: replace 500 with your real action_type code
),
     reg_users AS (
         SELECT a.id AS account_id,
                date_trunc('day', a.created_at) AS cohort_day
         FROM accounts a
                  JOIN constants c ON TRUE
         WHERE a.created_at >= c.reg_from
           AND a.created_at <  c.reg_to
     ),
     activity_days AS (
         SELECT
             l.account_id,
             date_trunc('day', l.created_at) AS day
         FROM account_log l
                  JOIN constants c ON TRUE
         WHERE l.action_type = c.TRANSLATION_CALL
         GROUP BY 1, 2
     )
SELECT
    r.cohort_day,
    COUNT(*) AS cohort_users,

    COUNT(*) FILTER (WHERE ad.day = r.cohort_day + INTERVAL '1 day') AS d1_active_users,
    COUNT(*) FILTER (WHERE ad.day = r.cohort_day + INTERVAL '7 day') AS d7_active_users,

    ROUND(
            100.0 * COUNT(*) FILTER (WHERE ad.day = r.cohort_day + INTERVAL '1 day')
                / NULLIF(COUNT(*), 0),
            2
    ) AS d1_pct,

    ROUND(
            100.0 * COUNT(*) FILTER (WHERE ad.day = r.cohort_day + INTERVAL '7 day')
                / NULLIF(COUNT(*), 0),
            2
    ) AS d7_pct
FROM reg_users r
         LEFT JOIN activity_days ad
                   ON ad.account_id = r.account_id
GROUP BY 1
ORDER BY 1 DESC;







-- Session per user
WITH constants AS (
    SELECT
        TIMESTAMP '2026-01-01 00:00:00+00' AS reg_from,
        TIMESTAMP '2026-02-01 00:00:00+00' AS reg_to,
        INTERVAL '30 minutes' AS session_gap
),
     reg_users AS (
         SELECT id AS account_id
         FROM accounts a
                  JOIN constants c ON TRUE
         WHERE a.created_at >= c.reg_from
           AND a.created_at <  c.reg_to
     ),
     ordered AS (
         SELECT
             l.account_id,
             l.created_at,
             l.action_type,
             LAG(l.created_at) OVER (PARTITION BY l.account_id ORDER BY l.created_at) AS prev_at
         FROM account_log l
                  JOIN reg_users r ON r.account_id = l.account_id
     ),
     marked AS (
         SELECT
             o.*,
             CASE
                 WHEN o.prev_at IS NULL THEN 1
                 WHEN o.created_at - o.prev_at > (SELECT session_gap FROM constants) THEN 1
                 ELSE 0
                 END AS new_session
         FROM ordered o
     ),
     sessionized AS (
         SELECT
             m.*,
             SUM(m.new_session) OVER (PARTITION BY m.account_id ORDER BY m.created_at) AS session_num
         FROM marked m
     ),
     sessions AS (
         SELECT
             account_id,
             session_num,
             MIN(created_at) AS session_start,
             MAX(created_at) AS session_end,
             COUNT(*)        AS events_in_session,
             EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) AS session_duration_sec
         FROM sessionized
         GROUP BY 1, 2
     ),
     per_user AS (
         SELECT
             account_id,
             COUNT(*) AS sessions_per_user
         FROM sessions
         GROUP BY 1
     )
SELECT
    (SELECT COUNT(*) FROM sessions) AS total_sessions,

    ROUND((SELECT AVG(events_in_session) FROM sessions), 2) AS avg_events_per_session,
    (SELECT percentile_cont(0.50) WITHIN GROUP (ORDER BY events_in_session) FROM sessions) AS median_events_per_session,
    (SELECT percentile_cont(0.90) WITHIN GROUP (ORDER BY events_in_session) FROM sessions) AS p90_events_per_session,

    ROUND((SELECT AVG(session_duration_sec) FROM sessions), 2) AS avg_session_duration_sec,
    (SELECT percentile_cont(0.50) WITHIN GROUP (ORDER BY session_duration_sec) FROM sessions) AS median_session_duration_sec,
    (SELECT percentile_cont(0.90) WITHIN GROUP (ORDER BY session_duration_sec) FROM sessions) AS p90_session_duration_sec,

    ROUND((SELECT AVG(sessions_per_user) FROM per_user), 2) AS avg_sessions_per_user,
    (SELECT percentile_cont(0.50) WITHIN GROUP (ORDER BY sessions_per_user) FROM per_user) AS median_sessions_per_user,
    (SELECT percentile_cont(0.90) WITHIN GROUP (ORDER BY sessions_per_user) FROM per_user) AS p90_sessions_per_user;



update accounts set translation_limit = 3, limit_time_span_seconds = 43200 where limit_time_span_seconds > 43200



-- account activity
WITH logs AS (
    SELECT
        l.created_at AS log_created_at,
        l.account_id,
        l.action_type,
        ROW_NUMBER() OVER (ORDER BY l.created_at DESC, l.account_id, l.action_type) AS log_row
    FROM account_log l
    ORDER BY l.created_at DESC, l.account_id, l.action_type
    LIMIT 500
)
SELECT
    logs.log_row,
    logs.log_created_at,
    logs.account_id,
    logs.action_type,

    COALESCE(a.email, inq.email) AS resolved_email,

    CASE
        WHEN a.email IS NOT NULL THEN 'account'
        WHEN inq.email IS NOT NULL THEN 'inquiry_time_match'
        ELSE 'unknown'
        END AS email_source,

    -- debugging fields
    a.created_at     AS account_created_at,
    inq.created_at   AS inquiry_created_at,
    CASE
        WHEN inq.created_at IS NULL THEN NULL
        ELSE ABS(EXTRACT(EPOCH FROM (inq.created_at - a.created_at)))
        END AS account_inquiry_diff_seconds

FROM logs
         JOIN accounts a
              ON a.id = logs.account_id

         LEFT JOIN LATERAL (
    SELECT i.email, i.created_at
    FROM inquiries i
    WHERE a.email IS NULL
      AND i.email IS NOT NULL
      AND i.created_at BETWEEN a.created_at - INTERVAL '1 minute'
        AND a.created_at + INTERVAL '1 minute'
    ORDER BY ABS(EXTRACT(EPOCH FROM (i.created_at - a.created_at))) ASC
    LIMIT 1
    ) inq ON TRUE

ORDER BY logs.log_created_at DESC, logs.log_row ASC;

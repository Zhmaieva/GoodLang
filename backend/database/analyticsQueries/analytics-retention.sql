
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






--returning
WITH params AS (
    SELECT DATE '2026-01-06' AS start_day  -- <-- hardcode your start date here
),

     filtered_events AS (
         SELECT
             al.account_id,
             (al.created_at AT TIME ZONE 'UTC')::date AS day
         FROM account_log al
         WHERE al.account_id IS NOT NULL
           AND al.action_type NOT IN (300, 301)
     ),

     daily_active AS (
         -- one row per (user, day) where the user had qualifying activity
         SELECT DISTINCT
             account_id,
             day
         FROM filtered_events
     ),

     first_active_day AS (
         -- first qualifying activity day per user
         SELECT
             account_id,
             MIN(day) AS first_day
         FROM daily_active
         GROUP BY account_id
     ),

     returning_daily AS (
         SELECT
             da.day,
             da.account_id
         FROM daily_active da
                  JOIN first_active_day fad
                       ON fad.account_id = da.account_id
         WHERE da.day > fad.first_day
     )

SELECT
    d.day,
    COUNT(DISTINCT rd.account_id) AS returning_users
FROM (
         SELECT generate_series(
                        (SELECT start_day FROM params),
                        (SELECT MAX(day) FROM daily_active),
                        interval '1 day'
                )::date AS day
     ) d
         LEFT JOIN returning_daily rd
                   ON rd.day = d.day
GROUP BY d.day
ORDER BY d.day;

--returning (excluding 2 accounts by email)
WITH params AS (
    SELECT DATE '2026-01-06' AS start_day
),

     filtered_events AS (
         SELECT
             al.account_id,
             (al.created_at AT TIME ZONE 'UTC')::date AS day
         FROM account_log al
                  LEFT JOIN accounts a
                            ON a.id = al.account_id
         WHERE al.account_id IS NOT NULL
           --AND al.action_type NOT IN (300, 301, 900, 901, 902, 903)
           AND (
             a.email IS NULL
                 OR a.email NOT IN ('zorkasupreme@gmail.com', 'zhmaevajuliya@gmail.com')
             )
     ),

     daily_active AS (
         SELECT DISTINCT
             account_id,
             day
         FROM filtered_events
     ),

     first_active_day AS (
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

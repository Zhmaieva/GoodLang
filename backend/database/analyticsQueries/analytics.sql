--activity summary
WITH reg_users AS (
    SELECT
        id AS account_id,
        date_trunc('day', created_at) AS reg_day,
        translations_quota
    FROM accounts
    WHERE created_at >= TIMESTAMP '2026-01-14 00:00:00+00'
      AND created_at <  TIMESTAMP '2026-02-01 00:00:00+00'
),
     reg_counts AS (
         SELECT
             reg_day,
             COUNT(*) AS registered_accounts,
             COUNT(*) FILTER (WHERE translations_quota < 7) AS low_quota_accounts
         FROM reg_users
         GROUP BY reg_day
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
                            (214, 'BUTTON_CLICK_START_USING_TEACHER_APP'),
                            (215, 'BUTTON_CLICK_START_USING_TEACHER_PDF'),
                            (300, 'PAGE_OPEN_TRAINER'),
                            (301, 'PAGE_OPEN_ANALYTICS'),
                            (400, 'MODAL_SHOWN_COOKIES'),
                            (401, 'MODAL_SHOWN_TOU'),
                            (402, 'MODAL_SHOWN_DISCOUNT_SUBSCRIPTION'),
                            (101, 'PDF_DOWNLOAD_CALL'),
                            (900, 'LANDING_WAIT_3_SECONDS'),
                            (901, 'LANDING_WAIT_10_SECONDS'),
                            (902, 'LANDING_WAIT_20_SECONDS'),
                            (903, 'LANDING_SCROLL_START'),
                            (500, 'TEACHER_REGISTERED')
                       ) AS t(action_type, action_name)
     ),
     activity AS (
         SELECT
             date_trunc('day', l.created_at) AS day,
             d.action_name,
             COUNT(*)                     AS events,
             COUNT(DISTINCT l.account_id) AS users
         FROM account_log l
                  JOIN reg_users r
                       ON r.account_id = l.account_id
                  JOIN action_dict d
                       USING (action_type)
         GROUP BY 1, 2
     ),
     reg_rows AS (
         SELECT
             rc.reg_day AS day,
             'REGISTERED_ACCOUNTS' AS action_name,
             COALESCE(rc.registered_accounts, 0) AS events,
             COALESCE(rc.registered_accounts, 0) AS users
         FROM reg_counts rc

         UNION ALL

         SELECT
             rc.reg_day AS day,
             'LOW_QUOTA_ACCOUNTS_LT_7' AS action_name,
             COALESCE(rc.low_quota_accounts, 0) AS events,
             COALESCE(rc.low_quota_accounts, 0) AS users
         FROM reg_counts rc
     )
SELECT *
FROM activity

UNION ALL

SELECT *
FROM reg_rows

ORDER BY day DESC, action_name;


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




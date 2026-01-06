WITH reg_users AS (
    SELECT id AS account_id
    FROM accounts
    WHERE created_at >= TIMESTAMP '2026-01-06 00:00:00+00'
      AND created_at <  TIMESTAMP '2026-02-01 00:00:00+00'
),
     action_dict AS (
         SELECT * FROM (VALUES
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
                            (300, 'PAGE_OPEN_TRAINER'),
                            (301, 'PAGE_OPEN_ANALYTICS'),
                            (400, 'MODAL_SHOWN_COOKIES'),
                            (401, 'MODAL_SHOWN_TOU')
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

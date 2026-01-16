
-- registrations and inquiries
WITH teacher_accounts AS (
    SELECT
        a.email,
        a.created_at,
        (
            EXISTS (
                SELECT 1
                FROM account_log al
                WHERE al.account_id = a.id
                  AND al.action_type IN (500, 101) -- USER_TEACHER_REGISTERED or PDF_DOWNLOAD_CALL
            )
            ) AS is_teacher,
        TRUE AS is_registered
    FROM accounts a
    WHERE a.email IS NOT NULL
),
     inquiry_emails AS (
         SELECT
             i.email,
             i.created_at,
             FALSE AS is_teacher,
             FALSE AS is_registered
         FROM inquiries i
         WHERE i.email IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM accounts a
             WHERE a.email = i.email
               AND a.email IS NOT NULL
         )
     )
SELECT
    email,
    created_at,
    is_teacher,
    is_registered
FROM teacher_accounts

UNION ALL

SELECT
    email,
    created_at,
    is_teacher,
    is_registered
FROM inquiry_emails

ORDER BY
    is_teacher DESC,
    created_at DESC;
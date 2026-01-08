CREATE EXTENSION IF NOT EXISTS dblink;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT FROM pg_database WHERE datname = 'good_lang'
        ) THEN
            PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE good_lang');
        END IF;
    END
$$;

CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION postgres;

CREATE TABLE IF NOT EXISTS migrations_history (
    id VARCHAR PRIMARY KEY UNIQUE,
    applied_on TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Migration: activation_links
-- Description: Creates the activation_links table linked to accounts

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'add_accounts'
        ) THEN
            CREATE TABLE IF NOT EXISTS accounts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
            );

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_accounts', (NOW() AT TIME ZONE 'UTC'));
        END IF;
    END
$$;

COMMIT;

-- Migration: activation_links
-- Description: Creates the activation_links table linked to accounts

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'activation_links'
        ) THEN
            CREATE TABLE IF NOT EXISTS activation_links (
                account_id UUID NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
                email VARCHAR(255) UNIQUE,
                code VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
            );

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('activation_links', (NOW() AT TIME ZONE 'UTC'));
        END IF;
    END
$$;

COMMIT;

-- Migration: rename_activation_links_to_sign_in_links
-- Description: Renames activation_links table to sign_in_links and makes email NOT NULL

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'rename_activation_links_to_sign_in_links'
        ) THEN
            ALTER TABLE activation_links RENAME TO sign_in_links;
            ALTER TABLE sign_in_links ALTER COLUMN email SET NOT NULL;

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('rename_activation_links_to_sign_in_links', (NOW() AT TIME ZONE 'UTC'));
        END IF;
    END
$$;

COMMIT;

-- Migration: add_account_log
-- Description: Creates the account_log table

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'add_account_log'
        ) THEN
            CREATE TABLE IF NOT EXISTS account_log (
                   account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                   action_type INTEGER NOT NULL,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
            );

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_account_log', (NOW() AT TIME ZONE 'UTC'));
        END IF;
    END
$$;

COMMIT;

-- Migration: add_status_to_accounts
-- Description: Adds a 'status' column to accounts to track free/paid state

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'add_status_to_accounts'
        ) THEN
            ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'free';

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_status_to_accounts', (NOW() AT TIME ZONE 'UTC'));
        END IF;
    END
$$;

COMMIT;


-- Migration: add_stripe_customer_id_to_accounts
-- Description: Adds 'stripe_customer_id' to accounts to store the permanent Stripe customer identifier

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'add_stripe_customer_id_to_accounts'
        ) THEN

            ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_stripe_customer_id_to_accounts', (NOW() AT TIME ZONE 'UTC'));
        END IF;
    END
$$;

COMMIT;

-- Migration: add_sign_in_links
-- Description: Creates the sign_in_links table for email verification codes

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'add_sign_in_links'
        ) THEN
            DROP TABLE IF EXISTS sign_in_links;
            CREATE TABLE IF NOT EXISTS sign_in_links (
                 account_id UUID NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
                 email VARCHAR(255) NOT NULL UNIQUE,
                 code VARCHAR(255) NOT NULL,
                 created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
                 expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + interval '10 minutes')
            );

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_sign_in_links', (NOW() AT TIME ZONE 'UTC'));
        END IF;
    END
$$;

COMMIT;

-- Migration: make_account_id_nullable_in_sign_in_links
-- Description: Makes account_id nullable in sign_in_links

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'make_account_id_nullable_in_sign_in_links'
        ) THEN
            ALTER TABLE sign_in_links
                ALTER COLUMN account_id DROP NOT NULL;

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('make_account_id_nullable_in_sign_in_links', (NOW() AT TIME ZONE 'UTC'));
        END IF;
    END
$$;

COMMIT;

-- Migration: alter_accounts_created_at_no_tz
-- Description: Changes accounts.created_at from TIMESTAMPTZ to TIMESTAMP (no timezone) stored in UTC

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'alter_accounts_created_at_no_tz'
        ) THEN

            -- 1) Convert column type safely (keep the same moment in time)
            ALTER TABLE accounts
                ALTER COLUMN created_at
                    TYPE TIMESTAMP WITHOUT TIME ZONE
                    USING created_at AT TIME ZONE 'UTC';

            -- 2) Update default to UTC (but without timezone type)
            ALTER TABLE accounts
                ALTER COLUMN created_at
                    SET DEFAULT (NOW() AT TIME ZONE 'UTC');

            -- 3) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('alter_accounts_created_at_no_tz', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: alter_sign_in_links_timestamps_no_tz
-- Description: Convert sign_in_links created_at and expires_at to TIMESTAMP WITHOUT TIME ZONE (UTC)

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'alter_sign_in_links_timestamps_no_tz'
        ) THEN

            -- 1) created_at → TIMESTAMP WITHOUT TIME ZONE (UTC)
            ALTER TABLE sign_in_links
                ALTER COLUMN created_at
                    TYPE TIMESTAMP WITHOUT TIME ZONE
                    USING created_at AT TIME ZONE 'UTC';

            ALTER TABLE sign_in_links
                ALTER COLUMN created_at
                    SET DEFAULT (NOW() AT TIME ZONE 'UTC');

            -- 2) expires_at → TIMESTAMP WITHOUT TIME ZONE (UTC)
            ALTER TABLE sign_in_links
                ALTER COLUMN expires_at
                    TYPE TIMESTAMP WITHOUT TIME ZONE
                    USING expires_at AT TIME ZONE 'UTC';

            ALTER TABLE sign_in_links
                ALTER COLUMN expires_at
                    SET DEFAULT ((NOW() AT TIME ZONE 'UTC') + INTERVAL '10 minutes');

            -- 3) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('alter_sign_in_links_timestamps_no_tz', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;


-- Migration: fix_timestamp_defaults_use_now
-- Description: Fix defaults for TIMESTAMPTZ columns to use NOW() without AT TIME ZONE

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'fix_timestamp_defaults_use_now'
        ) THEN

            -- accounts.created_at
            ALTER TABLE accounts
                ALTER COLUMN created_at
                    SET DEFAULT NOW();

            -- sign_in_links timestamps
            ALTER TABLE sign_in_links
                ALTER COLUMN created_at
                    SET DEFAULT NOW(),
                ALTER COLUMN expires_at
                    SET DEFAULT (NOW() + INTERVAL '10 minutes');

            -- record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('fix_timestamp_defaults_use_now', NOW());

        END IF;
    END
$$;

COMMIT;


-- Migration: alter_sign_in_links_timestamps_tz
-- Description: Convert sign_in_links created_at and expires_at to TIMESTAMP WITHOUT TIME ZONE (UTC)

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'alter_sign_in_links_timestamps_tz'
        ) THEN

            -- 1) created_at → TIMESTAMP WITHOUT TIME ZONE (UTC)
            ALTER TABLE sign_in_links
                ALTER COLUMN created_at
                    TYPE TIMESTAMP WITH TIME ZONE
                    USING created_at AT TIME ZONE 'UTC';

            ALTER TABLE sign_in_links
                ALTER COLUMN created_at
                    SET DEFAULT (NOW() AT TIME ZONE 'UTC');

            -- 2) expires_at → TIMESTAMP WITHOUT TIME ZONE (UTC)
            ALTER TABLE sign_in_links
                ALTER COLUMN expires_at
                    TYPE TIMESTAMP WITH TIME ZONE
                    USING expires_at AT TIME ZONE 'UTC';

            ALTER TABLE sign_in_links
                ALTER COLUMN expires_at
                    SET DEFAULT ((NOW() AT TIME ZONE 'UTC') + INTERVAL '10 minutes');

            -- 3) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('alter_sign_in_links_timestamps_tz', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: alter_sign_in_links_unique_email
-- Description: Add UNIQUE index to email of sign_in_links table

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history WHERE id = 'alter_sign_in_links_unique_email'
        ) THEN

            -- 1) Add index
            CREATE UNIQUE INDEX IF NOT EXISTS sign_in_links_unique_email
                ON sign_in_links (email);

            -- 2) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('alter_sign_in_links_unique_email', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: alter_accounts_add_translations_quota
-- Description: Add translations_quota column to accounts table

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM migrations_history
            WHERE id = 'alter_accounts_add_translations_quota'
        ) THEN

            -- 1) Add column
            ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS translations_quota INTEGER DEFAULT 10;

            -- 2) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('alter_accounts_add_translations_quota', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: add_trial_fields_to_accounts
-- Description: Adds trial flags and start timestamp to accounts

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'add_trial_fields_to_accounts'
        ) THEN

            ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS is_trial BOOLEAN NOT NULL DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ;

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_trial_fields_to_accounts', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: rename_trial_started_at_to_trial_ended_at
-- Description: Renames trial_started_at column to trial_ended_at in accounts

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'rename_trial_started_at_to_trial_ended_at'
        ) THEN

            -- Rename column only if old one exists and new one does not
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'accounts'
                  AND column_name = 'trial_started_at'
            ) AND NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'accounts'
                  AND column_name = 'trial_ended_at'
            ) THEN
                ALTER TABLE accounts
                    RENAME COLUMN trial_started_at TO trial_ended_at;
            END IF;

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('rename_trial_started_at_to_trial_ended_at', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: alter_accounts_trial_ended_at_tz
-- Description: Convert accounts.trial_ended_at to TIMESTAMP WITH TIME ZONE (UTC)

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'alter_accounts_trial_ended_at_tz'
        ) THEN

            -- Convert column type (preserve moment in time)
            ALTER TABLE accounts
                ALTER COLUMN trial_ended_at
                    TYPE TIMESTAMP WITH TIME ZONE
                    USING trial_ended_at AT TIME ZONE 'UTC';

            -- Set default to UTC
            ALTER TABLE accounts
                ALTER COLUMN trial_ended_at
                    SET DEFAULT (NOW() AT TIME ZONE 'UTC');

            -- Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('alter_accounts_trial_ended_at_tz', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: add_inquiries_table
-- Description: Creates inquiries table to store early interest emails

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'add_inquiries_table'
        ) THEN

            CREATE TABLE IF NOT EXISTS inquiries (
                                                     email VARCHAR(255) PRIMARY KEY,
                                                     created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
            );

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_inquiries_table', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: add_promo_codes_table
-- Description: Creates promo_codes table linked to accounts

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'add_promo_codes_table'
        ) THEN

            CREATE TABLE IF NOT EXISTS promo_codes (
                                                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                       account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                                                       promo_code VARCHAR(100) NOT NULL,
                                                       expiration_date TIMESTAMPTZ NOT NULL,
                                                       original_price NUMERIC NOT NULL,
                                                       discounted_price NUMERIC NOT NULL,
                                                       discount_percentage INTEGER NOT NULL,
                                                       created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
                                                       UNIQUE (promo_code)
            );

            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_promo_codes_table', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: add_daily_translation_limit_to_accounts
-- Description: Adds daily_translation_limit column to accounts table

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'add_daily_translation_limit_to_accounts'
        ) THEN

            -- 1) Add column with default
            ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS daily_translation_limit INTEGER NOT NULL DEFAULT 7;

            -- 2) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('add_daily_translation_limit_to_accounts', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: rename_daily_translation_limit_and_add_time_span
-- Description: Renames daily_translation_limit to translation_limit and adds limit_time_span_seconds

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'rename_daily_translation_limit_and_add_time_span'
        ) THEN

            -- 1) Rename column if old exists and new does not
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'accounts'
                  AND column_name = 'daily_translation_limit'
            ) AND NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'accounts'
                  AND column_name = 'translation_limit'
            ) THEN
                ALTER TABLE accounts
                    RENAME COLUMN daily_translation_limit TO translation_limit;
            END IF;

            -- 2) Add translation_limit if neither exists (fresh DB safety)
            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'accounts'
                  AND column_name = 'translation_limit'
            ) THEN
                ALTER TABLE accounts
                    ADD COLUMN translation_limit INTEGER NOT NULL DEFAULT 7;
            END IF;

            -- 3) Add time span column
            ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS limit_time_span_seconds INTEGER NOT NULL DEFAULT (24 * 3600);

            -- 4) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('rename_daily_translation_limit_and_add_time_span', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

-- Migration: alter_accounts_set_default_translations_quota_8
-- Description: Set default value of translations_quota to 8

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'alter_accounts_set_default_translations_quota_8'
        ) THEN

            -- 1) Ensure column exists (defensive)
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'accounts'
                  AND column_name = 'translations_quota'
            ) THEN

                -- 2) Set DEFAULT to 8 for new rows
                ALTER TABLE accounts
                    ALTER COLUMN translations_quota SET DEFAULT 8;

                -- 3) Backfill NULLs (optional but safe)
                UPDATE accounts
                SET translations_quota = 8
                WHERE translations_quota IS NULL;

            END IF;

            -- 4) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('alter_accounts_set_default_translations_quota_8', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

-- Migration: alter_accounts_set_default_translations_quota_7
-- Description: Set default value of translations_quota to 7

BEGIN;

DO
$$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM migrations_history
            WHERE id = 'alter_accounts_set_default_translations_quota_7'
        ) THEN

            -- 1) Ensure column exists (defensive)
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'accounts'
                  AND column_name = 'translations_quota'
            ) THEN

                -- 2) Set DEFAULT to 8 for new rows
                ALTER TABLE accounts
                    ALTER COLUMN translations_quota SET DEFAULT 7;

                -- 3) Backfill NULLs (optional but safe)
                UPDATE accounts
                SET translations_quota = 7
                WHERE translations_quota IS NULL;

            END IF;

            -- 4) Record migration
            INSERT INTO migrations_history (id, applied_on)
            VALUES ('alter_accounts_set_default_translations_quota_7', (NOW() AT TIME ZONE 'UTC'));

        END IF;
    END
$$;

COMMIT;

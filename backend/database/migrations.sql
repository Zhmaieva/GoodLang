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

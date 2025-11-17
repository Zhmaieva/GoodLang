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
            DROP TABLE sign_in_links;
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

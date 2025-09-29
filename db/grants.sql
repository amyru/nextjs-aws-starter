-- db/grants.sql
-- Purpose: Create a production database and least-privilege user for your Next.js app on RDS.
-- Usage:
--   1) Connect as the RDS master user to the "postgres" DB:
--      psql "host=<RDS_ENDPOINT> port=5432 user=<MASTER_USER> dbname=postgres sslmode=require"
--   2) Run: \i db/grants.sql
--   3) Replace the placeholder password below before running.
-- Notes:
--   - Run Prisma migrations as 'nextapp_user' so new tables are owned by that user.
--   - If you already created the DB or user, you can selectively run only the GRANT blocks.

-- === Create isolated application database (skip if it exists) ===
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nextapp') THEN
      PERFORM dblink_exec('dbname='||current_database(), 'CREATE DATABASE nextapp');
   END IF;
EXCEPTION WHEN undefined_function THEN
   -- dblink not available; fallback to CREATE DATABASE (will fail if exists)
   BEGIN
      CREATE DATABASE nextapp;
   EXCEPTION WHEN duplicate_database THEN
      RAISE NOTICE 'Database nextapp already exists, continuing';
   END;
END $$;

-- === Create least-privilege app user (skip if exists) ===
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'nextapp_user') THEN
      EXECUTE $$CREATE USER nextapp_user WITH ENCRYPTED PASSWORD 'REPLACE_WITH_STRONG_PASSWORD'$$;
   ELSE
      RAISE NOTICE 'Role nextapp_user already exists, continuing';
   END IF;
END $$;

-- === Grant connect on the database ===
GRANT CONNECT ON DATABASE nextapp TO nextapp_user;

-- Move into the app database
\c nextapp

-- === Schema privileges ===
-- Allow using the public schema and creating objects (tables, indexes, etc.)
GRANT USAGE ON SCHEMA public TO nextapp_user;
GRANT CREATE ON SCHEMA public TO nextapp_user;

-- Existing objects: allow typical DML on all current tables & sequences
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nextapp_user;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO nextapp_user;

-- Future objects: when new tables/sequences are created, grant privileges automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nextapp_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO nextapp_user;

-- Optional: if you create FUNCTIONS or TYPES and want nextapp_user to use them by default:
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO nextapp_user;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON TYPES TO nextapp_user;

-- Verification (optional)
-- \d      -- list relations
-- \dn+    -- list schemas
-- \du     -- list roles
-- SELECT now();

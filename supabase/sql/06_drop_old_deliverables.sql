-- =====================================================
-- MIGRATION: Deliverables → Tasks Schema Update
-- =====================================================
-- Run this BEFORE running 13_tasks.sql
-- This drops the old deliverables schema and prepares for new tasks schema

-- Drop old triggers first
DROP TRIGGER IF EXISTS update_deliverables_updated_at ON deliverables;

-- Drop old tables (CASCADE removes dependent submissions)
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;

-- Now you can safely run 13_tasks.sql

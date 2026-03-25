-- Migration runner for AgriMitra 360 database
-- Executes all migrations in order
-- Usage: psql -d your_database -f migrations/run_migrations.sql

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run migrations in order
\i 001_enhance_crop_reports.sql
\i 002_create_analytics.sql
\i 003_enhance_credit_scores.sql
\i 004_create_chat_logs.sql
\i 006_create_predictions.sql
\i 005_sample_data.sql

-- Verify tables were created
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('farmers', 'crop_reports', 'credit_scores', 'analytics', 'chat_logs', 'predictions');
    
    IF table_count = 6 THEN
        RAISE NOTICE 'All migrations completed successfully!';
        RAISE NOTICE 'Tables created: farmers, crop_reports, credit_scores, analytics, chat_logs, predictions';
    ELSE
        RAISE WARNING 'Migration incomplete. Expected 6 tables, found %', table_count;
    END IF;
END $$;

-- Show table statistics
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

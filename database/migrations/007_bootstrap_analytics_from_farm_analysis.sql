-- Migration 007: Create and backfill analytics from existing farm_analysis data
-- Use this in Supabase SQL Editor when the app can reach the database but the
-- public.analytics table has not been created yet.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level TEXT NOT NULL CHECK (level IN ('district', 'state', 'national')),
    district TEXT,
    state TEXT,
    avg_risk_score DECIMAL(5,4),
    total_reports INTEGER DEFAULT 0,
    healthy_reports INTEGER DEFAULT 0,
    disease_reports INTEGER DEFAULT 0,
    avg_trust_score DECIMAL(6,2),
    avg_health_score DECIMAL(5,2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_analytics_level_district ON analytics(level, district);
CREATE INDEX IF NOT EXISTS idx_analytics_level_state ON analytics(level, state);
CREATE INDEX IF NOT EXISTS idx_analytics_last_updated ON analytics(last_updated);
CREATE INDEX IF NOT EXISTS idx_analytics_archived ON analytics(is_archived);

-- Remove any previously bootstrapped rows before rebuilding.
DELETE FROM analytics WHERE level IN ('district', 'state', 'national');

-- farm_analysis.location appears to hold state-level geography in the current DB.
-- We bootstrap district rows using the same location as a district proxy so the
-- existing district-intelligence UI continues to function.
WITH base AS (
    SELECT
        COALESCE(NULLIF(TRIM(location), ''), 'Unknown Region') AS region_name,
        COALESCE(risk, 0)::numeric AS risk,
        COALESCE(health, 0)::numeric AS health,
        COALESCE(trust_score, 0)::numeric AS trust_score
    FROM farm_analysis
),
district_rows AS (
    SELECT
        'district'::text AS level,
        region_name AS district,
        region_name AS state,
        ROUND(AVG(risk), 4) AS avg_risk_score,
        COUNT(*)::int AS total_reports,
        COUNT(*) FILTER (WHERE health >= 75)::int AS healthy_reports,
        COUNT(*) FILTER (WHERE health < 75)::int AS disease_reports,
        ROUND(AVG(trust_score), 2) AS avg_trust_score,
        ROUND(AVG(health), 2) AS avg_health_score,
        NOW() AS last_updated,
        FALSE AS is_archived
    FROM base
    GROUP BY region_name
),
state_rows AS (
    SELECT
        'state'::text AS level,
        NULL::text AS district,
        region_name AS state,
        ROUND(AVG(risk), 4) AS avg_risk_score,
        COUNT(*)::int AS total_reports,
        COUNT(*) FILTER (WHERE health >= 75)::int AS healthy_reports,
        COUNT(*) FILTER (WHERE health < 75)::int AS disease_reports,
        ROUND(AVG(trust_score), 2) AS avg_trust_score,
        ROUND(AVG(health), 2) AS avg_health_score,
        NOW() AS last_updated,
        FALSE AS is_archived
    FROM base
    GROUP BY region_name
),
national_row AS (
    SELECT
        'national'::text AS level,
        NULL::text AS district,
        NULL::text AS state,
        ROUND(AVG(risk), 4) AS avg_risk_score,
        COUNT(*)::int AS total_reports,
        COUNT(*) FILTER (WHERE health >= 75)::int AS healthy_reports,
        COUNT(*) FILTER (WHERE health < 75)::int AS disease_reports,
        ROUND(AVG(trust_score), 2) AS avg_trust_score,
        ROUND(AVG(health), 2) AS avg_health_score,
        NOW() AS last_updated,
        FALSE AS is_archived
    FROM base
)
INSERT INTO analytics (
    level,
    district,
    state,
    avg_risk_score,
    total_reports,
    healthy_reports,
    disease_reports,
    avg_trust_score,
    avg_health_score,
    last_updated,
    is_archived
)
SELECT * FROM district_rows
UNION ALL
SELECT * FROM state_rows
UNION ALL
SELECT * FROM national_row;

-- Quick verification output
SELECT
    level,
    COUNT(*) AS row_count
FROM analytics
GROUP BY level
ORDER BY level;

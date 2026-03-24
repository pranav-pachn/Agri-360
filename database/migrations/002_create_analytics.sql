-- Migration 002: Create analytics table for multi-level aggregation
-- Supports district, state, and national level analytics

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level TEXT NOT NULL CHECK (level IN ('district', 'state', 'national')),
    district TEXT,  -- NULL for state/national level
    state TEXT,     -- NULL for national level
    avg_risk_score DECIMAL(5,4),
    total_reports INTEGER DEFAULT 0,
    healthy_reports INTEGER DEFAULT 0,
    disease_reports INTEGER DEFAULT 0,
    avg_trust_score DECIMAL(6,2),
    avg_health_score DECIMAL(5,2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT FALSE
);

-- Create strategic indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_level_district ON analytics(level, district);
CREATE INDEX IF NOT EXISTS idx_analytics_level_state ON analytics(level, state);
CREATE INDEX IF NOT EXISTS idx_analytics_last_updated ON analytics(last_updated);
CREATE INDEX IF NOT EXISTS idx_analytics_archived ON analytics(is_archived);

-- Add comments for documentation
COMMENT ON TABLE analytics IS 'Multi-level analytics aggregation for district, state, and national views';
COMMENT ON COLUMN analytics.level IS 'Aggregation level: district, state, or national';
COMMENT ON COLUMN analytics.district IS 'District name (NULL for state/national level)';
COMMENT ON COLUMN analytics.state IS 'State name (NULL for national level)';
COMMENT ON COLUMN analytics.avg_risk_score IS 'Average risk score for this geography';
COMMENT ON COLUMN analytics.total_reports IS 'Total crop reports in this geography';
COMMENT ON COLUMN analytics.healthy_reports IS 'Count of healthy crop reports';
COMMENT ON COLUMN analytics.disease_reports IS 'Count of disease-detected reports';
COMMENT ON COLUMN analytics.avg_trust_score IS 'Average trust score for farmers in this geography';
COMMENT ON COLUMN analytics.avg_health_score IS 'Average health score across all reports';
COMMENT ON COLUMN analytics.is_archived IS 'Soft delete flag for data retention';

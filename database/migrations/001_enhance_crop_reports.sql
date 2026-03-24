-- Migration 001: Enhance crop_reports table
-- Add missing fields for comprehensive crop analysis
-- Safe migration with IF NOT EXISTS clauses

-- Add severity field for disease severity classification
ALTER TABLE crop_reports 
ADD COLUMN IF NOT EXISTS severity TEXT;

-- Add health_score field for overall crop health (0-100)
ALTER TABLE crop_reports 
ADD COLUMN IF NOT EXISTS health_score INTEGER;

-- Add yield_prediction field for AI yield forecasting
ALTER TABLE crop_reports 
ADD COLUMN IF NOT EXISTS yield_prediction DECIMAL(8,2);

-- Add sustainability_index field for environmental scoring
ALTER TABLE crop_reports 
ADD COLUMN IF NOT EXISTS sustainability_index INTEGER;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_crop_reports_severity ON crop_reports(severity);
CREATE INDEX IF NOT EXISTS idx_crop_reports_health_score ON crop_reports(health_score);
CREATE INDEX IF NOT EXISTS idx_crop_reports_sustainability ON crop_reports(sustainability_index);

-- Add comment for documentation
COMMENT ON COLUMN crop_reports.severity IS 'Disease severity: Low, Moderate, High, Critical';
COMMENT ON COLUMN crop_reports.health_score IS 'Overall crop health score (0-100)';
COMMENT ON COLUMN crop_reports.yield_prediction IS 'AI predicted yield in tons per hectare';
COMMENT ON COLUMN crop_reports.sustainability_index IS 'Environmental sustainability score (0-100)';

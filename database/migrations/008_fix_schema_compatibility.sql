-- Migration 008: Fix schema compatibility for current analysis and AI metadata flow
-- This migration restores columns/tables that the application now depends on.

-- crop_reports compatibility: live deployments may still be missing newer columns
ALTER TABLE crop_reports
ADD COLUMN IF NOT EXISTS crop_type TEXT;

ALTER TABLE crop_reports
ADD COLUMN IF NOT EXISTS disease TEXT;

ALTER TABLE crop_reports
ADD COLUMN IF NOT EXISTS confidence DECIMAL(5,4);

ALTER TABLE crop_reports
ADD COLUMN IF NOT EXISTS risk_score DECIMAL(5,4);

ALTER TABLE crop_reports
ADD COLUMN IF NOT EXISTS severity TEXT;

ALTER TABLE crop_reports
ADD COLUMN IF NOT EXISTS health_score INTEGER;

ALTER TABLE crop_reports
ADD COLUMN IF NOT EXISTS yield_prediction DECIMAL(8,2);

ALTER TABLE crop_reports
ADD COLUMN IF NOT EXISTS sustainability_index INTEGER;

CREATE INDEX IF NOT EXISTS idx_crop_reports_crop_type ON crop_reports(crop_type);
CREATE INDEX IF NOT EXISTS idx_crop_reports_severity ON crop_reports(severity);
CREATE INDEX IF NOT EXISTS idx_crop_reports_health_score ON crop_reports(health_score);
CREATE INDEX IF NOT EXISTS idx_crop_reports_sustainability ON crop_reports(sustainability_index);

COMMENT ON COLUMN crop_reports.crop_type IS 'Crop type detected or supplied by the analysis pipeline';
COMMENT ON COLUMN crop_reports.disease IS 'Detected disease or health condition';
COMMENT ON COLUMN crop_reports.confidence IS 'Model confidence as a decimal between 0 and 1';
COMMENT ON COLUMN crop_reports.risk_score IS 'AI risk score as a decimal between 0 and 1';

-- credit_scores compatibility: application now upserts richer finance metadata
ALTER TABLE credit_scores
ADD COLUMN IF NOT EXISTS credit_grade TEXT;

ALTER TABLE credit_scores
ADD COLUMN IF NOT EXISTS loan_amount DECIMAL(12,2);

ALTER TABLE credit_scores
ADD COLUMN IF NOT EXISTS interest_rate DECIMAL(5,2);

ALTER TABLE credit_scores
ADD COLUMN IF NOT EXISTS repayment_term INTEGER;

ALTER TABLE credit_scores
ADD COLUMN IF NOT EXISTS risk_category TEXT;

ALTER TABLE credit_scores
ADD COLUMN IF NOT EXISTS loan_eligibility BOOLEAN DEFAULT TRUE;

ALTER TABLE credit_scores
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN credit_scores.credit_grade IS 'Credit grade used by the dashboard and loan workflow';

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_scores_farmer_id_unique ON credit_scores(farmer_id);

CREATE INDEX IF NOT EXISTS idx_credit_scores_risk_category ON credit_scores(risk_category);
CREATE INDEX IF NOT EXISTS idx_credit_scores_eligibility ON credit_scores(loan_eligibility);
CREATE INDEX IF NOT EXISTS idx_credit_scores_archived ON credit_scores(is_archived);

-- AI metadata compatibility
CREATE TABLE IF NOT EXISTS predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    crop_report_id UUID REFERENCES crop_reports(id) ON DELETE SET NULL,
    crop_type TEXT NOT NULL,
    disease TEXT,
    confidence DECIMAL(5,4),
    severity TEXT,
    ai_source TEXT NOT NULL,
    fallback_used BOOLEAN DEFAULT FALSE,
    raw_label TEXT,
    raw_probability DECIMAL(5,4),
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_predictions_ai_source ON predictions(ai_source);
CREATE INDEX IF NOT EXISTS idx_predictions_fallback_used ON predictions(fallback_used);
CREATE INDEX IF NOT EXISTS idx_predictions_crop_report_id ON predictions(crop_report_id);

COMMENT ON TABLE predictions IS 'Per-inference AI metadata for reliability tracking and auditing';

-- Migration 006: Create predictions table for AI metadata reliability tracking
-- This table stores per-inference metadata so we can monitor AI reliability

CREATE TABLE IF NOT EXISTS predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    crop_report_id UUID REFERENCES crop_reports(id) ON DELETE SET NULL,
    crop_type TEXT NOT NULL,
    disease TEXT,
    confidence DECIMAL(5,4), -- normalized 0.0000 - 1.0000
    severity TEXT,
    ai_source TEXT NOT NULL, -- tensorflow | enhanced-mock | external-ai | unknown
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
COMMENT ON COLUMN predictions.ai_source IS 'AI engine source: tensorflow, enhanced-mock, external-ai, unknown';
COMMENT ON COLUMN predictions.fallback_used IS 'True if fallback path was used instead of primary TensorFlow inference';

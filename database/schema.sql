-- AgriMitra 360 - Complete Database Schema
-- Enhanced with multi-level analytics, chat functionality, and finance-ready features
-- Supports AI, finance, and decision-making capabilities

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. farmers Table (User Registration & Profile)
CREATE TABLE IF NOT EXISTS farmers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for farmers
CREATE INDEX IF NOT EXISTS idx_farmers_location ON farmers(location);
CREATE INDEX IF NOT EXISTS idx_farmers_language ON farmers(language);
CREATE INDEX IF NOT EXISTS idx_farmers_created_at ON farmers(created_at);

-- 2. crop_reports Table (Enhanced Disease Analysis)
CREATE TABLE IF NOT EXISTS crop_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    image_url TEXT,
    disease TEXT,
    confidence DECIMAL(5,4), -- AI precision: 0.9234
    risk_score DECIMAL(5,4),
    crop_type TEXT,
    severity TEXT CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical')),
    health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
    yield_prediction DECIMAL(8,2), -- tons per hectare
    sustainability_index INTEGER CHECK (sustainability_index >= 0 AND sustainability_index <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for crop_reports
CREATE INDEX IF NOT EXISTS idx_crop_reports_farmer_id ON crop_reports(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_reports_created_at ON crop_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_crop_reports_crop_type ON crop_reports(crop_type);
CREATE INDEX IF NOT EXISTS idx_crop_reports_severity ON crop_reports(severity);
CREATE INDEX IF NOT EXISTS idx_crop_reports_health_score ON crop_reports(health_score);
CREATE INDEX IF NOT EXISTS idx_crop_reports_sustainability ON crop_reports(sustainability_index);

-- 3. credit_scores Table (Enhanced Financial Data)
CREATE TABLE IF NOT EXISTS credit_scores (
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE PRIMARY KEY,
    trust_score INTEGER NOT NULL CHECK (trust_score >= 300 AND trust_score <= 900),
    credit_grade TEXT,
    loan_amount DECIMAL(12,2), -- Financial precision
    interest_rate DECIMAL(5,2), -- Loan interest rate (e.g., 8.5%)
    repayment_term INTEGER, -- Repayment term in months
    risk_category TEXT CHECK (risk_category IN ('low', 'medium', 'high')),
    loan_eligibility BOOLEAN DEFAULT TRUE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for credit_scores
CREATE INDEX IF NOT EXISTS idx_credit_scores_farmer_id ON credit_scores(farmer_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_created_at ON credit_scores(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_scores_risk_category ON credit_scores(risk_category);
CREATE INDEX IF NOT EXISTS idx_credit_scores_eligibility ON credit_scores(loan_eligibility);
CREATE INDEX IF NOT EXISTS idx_credit_scores_archived ON credit_scores(is_archived);

-- 4. analytics Table (Multi-Level Aggregation)
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

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_level_district ON analytics(level, district);
CREATE INDEX IF NOT EXISTS idx_analytics_level_state ON analytics(level, state);
CREATE INDEX IF NOT EXISTS idx_analytics_last_updated ON analytics(last_updated);
CREATE INDEX IF NOT EXISTS idx_analytics_archived ON analytics(is_archived);

-- 5. chat_logs Table (AI Assistant Conversations)
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'ai')),
    message TEXT NOT NULL,
    metadata JSONB,  -- Store model info, latency, tokens, etc.
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT FALSE
);

-- Indexes for chat_logs
CREATE INDEX IF NOT EXISTS idx_chat_conversation ON chat_logs(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_farmer ON chat_logs(farmer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_message_type ON chat_logs(message_type);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_metadata ON chat_logs USING GIN(metadata);

-- Comments for documentation
COMMENT ON TABLE farmers IS 'User registration and profile data';
COMMENT ON TABLE crop_reports IS 'Enhanced crop disease analysis with health and sustainability metrics';
COMMENT ON TABLE credit_scores IS 'Financial trust scores with loan eligibility and risk assessment';
COMMENT ON TABLE analytics IS 'Multi-level analytics aggregation for district, state, and national views';
COMMENT ON TABLE chat_logs IS 'AI assistant conversation logs with threading and metadata tracking';

-- Column comments
COMMENT ON COLUMN crop_reports.severity IS 'Disease severity: Low, Moderate, High, Critical';
COMMENT ON COLUMN crop_reports.health_score IS 'Overall crop health score (0-100)';
COMMENT ON COLUMN crop_reports.yield_prediction IS 'AI predicted yield in tons per hectare';
COMMENT ON COLUMN crop_reports.sustainability_index IS 'Environmental sustainability score (0-100)';
COMMENT ON COLUMN credit_scores.interest_rate IS 'Loan interest rate as percentage (e.g., 8.5 for 8.5%)';
COMMENT ON COLUMN credit_scores.repayment_term IS 'Loan repayment term in months';
COMMENT ON COLUMN credit_scores.risk_category IS 'Risk classification: low, medium, high';
COMMENT ON COLUMN credit_scores.loan_eligibility IS 'Automatic loan eligibility determination';
COMMENT ON COLUMN analytics.level IS 'Aggregation level: district, state, national';
COMMENT ON COLUMN analytics.district IS 'District name (NULL for state/national level)';
COMMENT ON COLUMN analytics.state IS 'State name (NULL for national level)';
COMMENT ON COLUMN chat_logs.conversation_id IS 'UUID for grouping messages into conversations';
COMMENT ON COLUMN chat_logs.message_type IS 'Message type: user or ai';
COMMENT ON COLUMN chat_logs.metadata IS 'JSON metadata: model info, latency, tokens, etc.';

-- Sample data insertion (for development/testing)
INSERT INTO farmers (name, location, language) VALUES 
    ('Demo Farmer', 'Punjab, India', 'en'),
    ('Test Farmer', 'Gujarat, India', 'hi')
ON CONFLICT DO NOTHING;

-- Get demo farmer IDs for sample data
DO $$
DECLARE
    demo_farmer_1 UUID;
    demo_farmer_2 UUID;
BEGIN
    SELECT id INTO demo_farmer_1 FROM farmers WHERE name = 'Demo Farmer' LIMIT 1;
    SELECT id INTO demo_farmer_2 FROM farmers WHERE name = 'Test Farmer' LIMIT 1;
    
    IF demo_farmer_1 IS NOT NULL THEN
        -- Sample crop reports with enhanced fields
        INSERT INTO crop_reports (farmer_id, disease, confidence, risk_score, crop_type, severity, health_score, yield_prediction, sustainability_index) VALUES
            (demo_farmer_1, 'Early Blight', 0.9234, 0.3456, 'Tomato', 'Moderate', 62, 18.5, 72),
            (demo_farmer_1, 'Healthy', 0.9876, 0.1234, 'Wheat', 'Low', 85, 22.3, 78)
        ON CONFLICT DO NOTHING;
        
        -- Sample credit scores with finance features
        INSERT INTO credit_scores (farmer_id, trust_score, credit_grade, loan_amount, interest_rate, repayment_term, risk_category, loan_eligibility) VALUES
            (demo_farmer_1, 742, 'Good', 350000.00, 8.5, 18, 'low', TRUE)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF demo_farmer_2 IS NOT NULL THEN
        -- Sample crop reports
        INSERT INTO crop_reports (farmer_id, disease, confidence, risk_score, crop_type, severity, health_score, yield_prediction, sustainability_index) VALUES
            (demo_farmer_2, 'Leaf Spot', 0.8567, 0.4567, 'Rice', 'High', 45, 16.8, 65),
            (demo_farmer_2, 'Healthy', 0.9234, 0.2345, 'Cotton', 'Low', 88, 19.2, 81)
        ON CONFLICT DO NOTHING;
        
        -- Sample credit scores
        INSERT INTO credit_scores (farmer_id, trust_score, credit_grade, loan_amount, interest_rate, repayment_term, risk_category, loan_eligibility) VALUES
            (demo_farmer_2, 678, 'Fair', 200000.00, 10.5, 12, 'medium', TRUE)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Sample analytics data (multi-level)
INSERT INTO analytics (level, district, state, avg_risk_score, total_reports, healthy_reports, avg_trust_score, avg_health_score) VALUES
    ('district', 'Punjab', 'Punjab', 0.34, 150, 120, 725, 68.5),
    ('district', 'Gujarat', 'Gujarat', 0.28, 89, 78, 758, 72.3),
    ('district', 'Maharashtra', 'Maharashtra', 0.41, 234, 156, 698, 65.2),
    ('state', NULL, 'Punjab', 0.31, 450, 380, 740, 67.8),
    ('state', NULL, 'Gujarat', 0.26, 320, 285, 765, 71.2),
    ('national', NULL, NULL, 0.32, 2850, 2341, 742, 69.8)
ON CONFLICT DO NOTHING;

-- Sample chat logs with conversation threading
INSERT INTO chat_logs (conversation_id, farmer_id, message_type, message, metadata, language) VALUES
    ('conv-001', (SELECT id FROM farmers WHERE name = 'Demo Farmer' LIMIT 1), 'user', 'My tomato plants have yellow leaves', '{"model": "gpt-4", "latency": 234}', 'en'),
    ('conv-001', (SELECT id FROM farmers WHERE name = 'Demo Farmer' LIMIT 1), 'ai', 'Yellow leaves often indicate nutrient deficiency or early-stage disease. Check soil pH and consider nitrogen-rich fertilizer.', '{"model": "gpt-4", "tokens": 156}', 'en'),
    ('conv-002', (SELECT id FROM farmers WHERE name = 'Test Farmer' LIMIT 1), 'user', 'What is best treatment for leaf blight?', '{"model": "gpt-4", "latency": 189}', 'hi'),
    ('conv-002', (SELECT id FROM farmers WHERE name = 'Test Farmer' LIMIT 1), 'ai', 'For leaf blight, use copper-based fungicide like Mancozeb 75% WP at 2.5g/L water. Apply every 7 days for 3 weeks. Also remove infected leaves.', '{"model": "gpt-4", "tokens": 198}', 'hi')
ON CONFLICT DO NOTHING;

-- Final verification
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('farmers', 'crop_reports', 'credit_scores', 'analytics', 'chat_logs');
    
    IF table_count = 5 THEN
        RAISE NOTICE 'AgriMitra 360 database setup completed successfully!';
        RAISE NOTICE 'Tables: farmers, crop_reports, credit_scores, analytics, chat_logs';
        RAISE NOTICE 'Sample data inserted for development and testing';
    ELSE
        RAISE WARNING 'Database setup incomplete. Expected 5 tables, found %', table_count;
    END IF;
END $$;

-- AgriMitra 360 - Database Schema
-- Create tables with precise data types and practical constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. farmers Table
CREATE TABLE IF NOT EXISTS farmers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on location for filtering
CREATE INDEX IF NOT EXISTS idx_farmers_location ON farmers(location);

-- 2. crop_reports Table
CREATE TABLE IF NOT EXISTS crop_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    image_url TEXT,
    disease TEXT,
    confidence DECIMAL(5,4),
    risk_score DECIMAL(5,4),
    crop_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on frequently filtered fields
CREATE INDEX IF NOT EXISTS idx_crop_reports_farmer_id ON crop_reports(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_reports_created_at ON crop_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_crop_reports_location ON crop_reports(farmer_id); -- Will need to join with farmers
CREATE INDEX IF NOT EXISTS idx_crop_reports_crop_type ON crop_reports(crop_type);

-- 3. credit_scores Table
CREATE TABLE IF NOT EXISTS credit_scores (
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE PRIMARY KEY,
    trust_score INTEGER NOT NULL CHECK (trust_score >= 300 AND trust_score <= 900),
    credit_grade TEXT,
    loan_amount DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on frequently filtered fields
CREATE INDEX IF NOT EXISTS idx_credit_scores_farmer_id ON credit_scores(farmer_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_created_at ON credit_scores(created_at);

-- Insert sample data for testing
INSERT INTO farmers (name, location, language) VALUES 
    ('Test Farmer', 'Andhra Pradesh', 'en')
ON CONFLICT DO NOTHING;

-- Get the test farmer ID for sample data
DO $$
DECLARE
    test_farmer_id UUID;
BEGIN
    SELECT id INTO test_farmer_id FROM farmers WHERE name = 'Test Farmer' LIMIT 1;
    
    IF test_farmer_id IS NOT NULL THEN
        INSERT INTO crop_reports (farmer_id, disease, confidence, risk_score, crop_type) VALUES
            (test_farmer_id, 'Leaf Blight', 0.9234, 0.3456, 'Rice'),
            (test_farmer_id, 'Healthy', 0.9876, 0.1234, 'Wheat')
        ON CONFLICT DO NOTHING;
        
        INSERT INTO credit_scores (farmer_id, trust_score, credit_grade, loan_amount) VALUES
            (test_farmer_id, 750, 'Good', 50000.00)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

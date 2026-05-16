-- Migration: Add analytics table for district/state/national aggregation
-- This table stores pre-computed analytics at multiple aggregation levels

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

-- Create chat_logs table for AI assistant conversations
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN ('user', 'assistant')),
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for chat_logs
CREATE INDEX IF NOT EXISTS idx_chat_logs_farmer_id ON chat_logs(farmer_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at);

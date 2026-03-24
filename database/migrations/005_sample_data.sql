-- Migration 005: Insert sample data for testing and demonstration
-- Provides realistic data for all enhanced tables

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
    ('conv-001', '550e8400-e29b-41d4-a716-446655440000', 'user', 'My tomato plants have yellow leaves', '{"model": "gpt-4", "latency": 234}', 'en'),
    ('conv-001', '550e8400-e29b-41d4-a716-446655440000', 'ai', 'Yellow leaves often indicate nutrient deficiency or early-stage disease. Check soil pH and consider nitrogen-rich fertilizer.', '{"model": "gpt-4", "tokens": 156}', 'en'),
    ('conv-002', '550e8400-e29b-41d4-a716-446655440001', 'user', 'What is the best treatment for leaf blight?', '{"model": "gpt-4", "latency": 189}', 'hi'),
    ('conv-002', '550e8400-e29b-41d4-a716-446655440001', 'ai', 'For leaf blight, use copper-based fungicide like Mancozeb 75% WP at 2.5g/L water. Apply every 7 days for 3 weeks. Also remove infected leaves.', '{"model": "gpt-4", "tokens": 198}', 'hi')
ON CONFLICT DO NOTHING;

-- Enhanced crop reports with new fields
UPDATE crop_reports SET 
    severity = 'Moderate',
    health_score = 62,
    yield_prediction = 18.5,
    sustainability_index = 72
WHERE id IN (
        SELECT id FROM crop_reports LIMIT 2
    );

-- Enhanced credit scores with finance features
UPDATE credit_scores SET 
    interest_rate = 8.5,
    repayment_term = 18,
    risk_category = 'low',
    loan_eligibility = true
WHERE farmer_id IN (
        SELECT id FROM farmers LIMIT 1
    );

-- Add comments for documentation
COMMENT ON TABLE analytics IS 'Multi-level aggregation table for district, state, and national views';
COMMENT ON TABLE chat_logs IS 'AI assistant conversation logs with threading and metadata tracking';

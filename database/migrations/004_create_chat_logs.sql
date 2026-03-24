-- Migration 004: Create chat_logs table for AI assistant conversations
-- Supports full conversation logging with threading and metadata

-- Create chat_logs table
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

-- Create indexes for chat queries
CREATE INDEX IF NOT EXISTS idx_chat_conversation ON chat_logs(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_farmer ON chat_logs(farmer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_message_type ON chat_logs(message_type);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_logs(created_at);

-- Create GIN index for JSONB metadata
CREATE INDEX IF NOT EXISTS idx_chat_metadata ON chat_logs USING GIN(metadata);

-- Add comments for documentation
COMMENT ON TABLE chat_logs IS 'AI assistant conversation logs with threading and metadata';
COMMENT ON COLUMN chat_logs.conversation_id IS 'UUID for grouping messages into conversations';
COMMENT ON COLUMN chat_logs.message_type IS 'Message type: user or ai';
COMMENT ON COLUMN chat_logs.message IS 'Message content from user or AI response';
COMMENT ON COLUMN chat_logs.metadata IS 'JSON metadata: model info, latency, tokens, etc.';
COMMENT ON COLUMN chat_logs.language IS 'Message language code (default: en)';
COMMENT ON COLUMN chat_logs.is_archived IS 'Soft delete flag for data retention';

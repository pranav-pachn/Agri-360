const supabase = require('../config/supabase');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const { processChat } = require('../../../ai/chatbot/chatEngine');

// Chat Service Functions
const createConversation = async (farmerId) => {
    try {
        logger.info(`Creating new conversation for farmer: ${farmerId}`);
        
        const conversationId = uuidv4();
        
        const { data, error } = await supabase
            .from('chat_logs')
            .insert([{
                conversation_id: conversationId,
                farmer_id: farmerId,
                message_type: 'user',
                message: 'New conversation started',
                language: 'en',
                metadata: { system: true, created_at: new Date().toISOString() },
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) {
            logger.error('Chat service error:', error);
            throw new Error(`Failed to create conversation: ${error.message}`);
        }
        
        logger.info(`Conversation created successfully: ${conversationId}`);
        return data?.conversation_id || conversationId;
    } catch (error) {
        logger.error('Chat service exception:', error);
        throw error;
    }
};

const addMessage = async (conversationId, farmerId, message, messageType = 'user', language = 'en', metadata = {}) => {
    try {
        logger.info(`Adding message to conversation: ${conversationId}`);
        
        // Validate conversation exists and belongs to farmer
        const conversation = await getConversationById(conversationId, farmerId);
        if (!conversation || conversation.farmer_id !== farmerId) {
            throw new Error('Conversation not found or access denied');
        }
        
        const messageData = {
            conversation_id: conversationId,
            farmer_id: farmerId,
            message_type: messageType,
            message,
            language,
            metadata: {
                ...metadata,
                source: 'web_app',
                timestamp: new Date().toISOString()
            },
            created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
            .from('chat_logs')
            .insert([messageData])
            .select()
            .single();
        
        if (error) {
            logger.error('Chat service error:', error);
            throw new Error(`Failed to add message: ${error.message}`);
        }
        
        logger.info(`Message added successfully to conversation: ${conversationId}`);
        return data;
    } catch (error) {
        logger.error('Chat service exception:', error);
        throw error;
    }
};

const getConversationById = async (conversationId, farmerId = null) => {
    try {
        logger.info(`Fetching conversation: ${conversationId}`);
        
        let query = supabase
            .from('chat_logs')
            .select('*')
            .eq('conversation_id', conversationId);
        
        // Add farmer validation if provided
        if (farmerId) {
            query = query.eq('farmer_id', farmerId);
        }
        
        const { data, error } = await query;
        
        if (error) {
            logger.error('Chat service error:', error);
            throw new Error(`Failed to fetch conversation: ${error.message}`);
        }
        
        logger.info(`Conversation retrieved successfully: ${conversationId}`);
        return data;
    } catch (error) {
        logger.error('Chat service exception:', error);
        throw error;
    }
};

const getConversationHistory = async (conversationId, limit = 50) => {
    try {
        logger.info(`Fetching conversation history: ${conversationId}, limit: ${limit}`);
        
        const { data, error } = await supabase
            .from('chat_logs')
            .select('message_type, message, language, created_at, metadata')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .limit(limit);
        
        if (error) {
            logger.error('Chat service error:', error);
            throw new Error(`Failed to fetch conversation history: ${error.message}`);
        }
        
        logger.info(`Conversation history retrieved successfully: ${conversationId}, messages: ${data?.length || 0}`);
        return data || [];
    } catch (error) {
        logger.error('Chat service exception:', error);
        throw error;
    }
};

const getFarmerConversations = async (farmerId, limit = 20) => {
    try {
        logger.info(`Fetching farmer conversations: ${farmerId}, limit: ${limit}`);
        
        // Get unique conversation IDs for this farmer
        const { data: conversationIds, error: idError } = await supabase
            .from('chat_logs')
            .select('conversation_id')
            .eq('farmer_id', farmerId);
        
        if (idError) {
            throw new Error(`Failed to fetch conversation IDs: ${idError.message}`);
        }
        
        const uniqueIds = [...new Set(conversationIds?.map(item => item.conversation_id) || [])];
        
        // Fetch latest message for each conversation
        const conversations = [];
        for (const convId of uniqueIds.slice(0, limit)) {
            const { data: latestMessage } = await supabase
                .from('chat_logs')
                .select('message_type, message, language, created_at')
                .eq('conversation_id', convId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (latestMessage) {
                conversations.push({
                    conversation_id: convId,
                    latest_message: latestMessage.message,
                    language: latestMessage.language,
                    created_at: latestMessage.created_at,
                    message_count: 1 // Would need separate query for count
                });
            }
        }
        
        logger.info(`Farmer conversations retrieved successfully: ${farmerId}, count: ${conversations.length}`);
        return conversations;
    } catch (error) {
        logger.error('Chat service exception:', error);
        throw error;
    }
};

// AI Response Generation — powered by chatEngine (intent detection + translation)
/**
 * @param {string} message   - Raw user message
 * @param {string} language  - Language code: 'en' | 'hi' | 'te'
 * @param {object} context   - Optional farm context: { disease, riskLevel, projectedYield, trustScore }
 */
const generateAIResponse = async (message, language = 'en', context = {}) => {
    try {
        logger.info(`Generating AI response via chatEngine for: ${message.substring(0, 50)}...`);

        const { reply, original, metadata: engineMetadata = {} } = await processChat({ message, language, context });

        return {
            message_type: 'ai',
            message: reply,
            language,
            metadata: {
                original_english: original,
                response_type: 'intent_based',
                engine: engineMetadata.engine || 'chatEngine_v1',
                used_llm: Boolean(engineMetadata.used_llm),
                fallback_used: Boolean(engineMetadata.fallback_used),
                fallback_reason: engineMetadata.fallback_reason || null,
                provider: engineMetadata.provider || null,
                model: engineMetadata.model || null,
                generated_at: new Date().toISOString()
            }
        };
    } catch (error) {
        logger.error('AI response generation error:', error);
        throw error;
    }
};

const addAIResponse = async (conversationId, farmerId, userMessage, language = 'en', context = {}) => {
    try {
        logger.info(`Adding AI response to conversation: ${conversationId}`);
        
        const aiResponse = await generateAIResponse(userMessage, language, context);
        
        const messageData = {
            conversation_id: conversationId,
            farmer_id: farmerId,
            message_type: 'ai',
            message: aiResponse.message,
            language: aiResponse.language,
            metadata: {
                ...aiResponse.metadata,
                response_to: userMessage.substring(0, 100),
                generated_at: new Date().toISOString()
            },
            created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
            .from('chat_logs')
            .insert([messageData])
            .select()
            .single();
        
        if (error) {
            logger.error('Chat service error:', error);
            throw new Error(`Failed to add AI response: ${error.message}`);
        }
        
        logger.info(`AI response added successfully to conversation: ${conversationId}`);
        return data;
    } catch (error) {
        logger.error('Chat service exception:', error);
        throw error;
    }
};

// Get conversation statistics
const getConversationStats = async (conversationId) => {
    try {
        logger.info(`Fetching conversation stats: ${conversationId}`);
        
        const { data, error } = await supabase
            .from('chat_logs')
            .select('message_type')
            .eq('conversation_id', conversationId);
        
        if (error) {
            throw new Error(`Failed to fetch conversation stats: ${error.message}`);
        }
        
        const stats = {
            conversation_id: conversationId,
            total_messages: data?.length || 0,
            user_messages: data?.filter(msg => msg.message_type === 'user')?.length || 0,
            ai_messages: data?.filter(msg => msg.message_type === 'ai')?.length || 0,
            system_messages: data?.filter(msg => msg.metadata?.system)?.length || 0
        };
        
        logger.info(`Conversation stats retrieved: ${conversationId}`, stats);
        return stats;
    } catch (error) {
        logger.error('Chat service exception:', error);
        throw error;
    }
};

module.exports = {
    createConversation,
    addMessage,
    getConversationById,
    getConversationHistory,
    getFarmerConversations,
    generateAIResponse,
    addAIResponse,
    getConversationStats
};

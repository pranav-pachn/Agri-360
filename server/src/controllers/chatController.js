const chatService = require('../services/chatService');
const logger = require('../utils/logger');

const normalizeChatContext = (context = {}) => ({
    disease: context.disease || context?.diagnosis?.disease || null,
    riskLevel: context.riskLevel || context?.risk?.level || context?.risk_assessment?.level || null,
    projectedYield: context.projectedYield || context?.yield?.projectedYield || context?.yield_prediction?.predicted_yield || null,
    trustScore: context.trustScore || context?.trust?.score || context?.score || context?.trust_score || null
});

const createConversation = async (req, res, next) => {
    try {
        const { farmerId } = req.body;
        
        if (!farmerId) {
            return res.status(400).json({ 
                error: 'Missing field: farmerId is required' 
            });
        }
        
        logger.info(`Creating new conversation for farmer: ${farmerId}`);
        const conversationId = await chatService.createConversation(farmerId);
        return res.status(201).json({ conversationId });
    } catch (error) {
        logger.error('Create conversation error:', error);
        next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const { conversationId, message, language = 'en', context = {} } = req.body;
        const normalizedContext = normalizeChatContext(context);
        
        if (!conversationId || !message) {
            return res.status(400).json({ 
                error: 'Missing fields: conversationId and message are required' 
            });
        }
        
        // Get farmerId from conversation for validation
        const conversation = await chatService.getConversationById(conversationId);
        const farmerId = conversation?.[0]?.farmer_id;
        
        if (!farmerId) {
            return res.status(404).json({ 
                error: 'Conversation not found' 
            });
        }
        
        logger.info(`Adding user message to conversation: ${conversationId}`);
        const chatMessage = await chatService.addMessage(
            conversationId, 
            farmerId, 
            message, 
            'user', 
            language,
            { source: 'web_app', timestamp: Date.now() }
        );
        
        // Generate AI response
        logger.info(`Generating AI response for conversation: ${conversationId}`);
        const aiResponse = await chatService.addAIResponse(
            conversationId, 
            farmerId, 
            message, 
            language,
            normalizedContext
        );
        
        return res.status(201).json({ 
            userMessage: chatMessage,
            aiResponse: aiResponse
        });
    } catch (error) {
        logger.error('Send message error:', error);
        next(error);
    }
};

const quickChat = async (req, res, next) => {
    try {
        const { message, language = 'en', context = {}, contextData = {} } = req.body;

        if (!message) {
            return res.status(400).json({
                error: 'Missing field: message is required'
            });
        }

        const normalizedContext = normalizeChatContext({ ...contextData, ...context, ...(req.contextData || {}) });
        logger.info(`Processing quick chat request: ${message.substring(0, 50)}...`);

        const response = await chatService.generateAIResponse(message, language, normalizedContext);

        return res.status(200).json({
            success: true,
            data: {
                reply: response.message,
                original: response.metadata?.original_english || response.message,
                context: normalizedContext
            }
        });
    } catch (error) {
        logger.error('Quick chat error:', error);
        next(error);
    }
};

const getConversationHistory = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { limit = 50 } = req.query;
        
        if (!conversationId) {
            return res.status(400).json({ 
                error: 'Missing parameter: conversationId is required' 
            });
        }
        
        logger.info(`Fetching conversation history: ${conversationId}, limit: ${limit}`);
        const history = await chatService.getConversationHistory(conversationId, limit);
        return res.status(200).json(history);
    } catch (error) {
        logger.error('Conversation history error:', error);
        next(error);
    }
};

const getFarmerConversations = async (req, res, next) => {
    try {
        const { farmerId } = req.params;
        const { limit = 20 } = req.query;
        
        if (!farmerId) {
            return res.status(400).json({ 
                error: 'Missing parameter: farmerId is required' 
            });
        }
        
        logger.info(`Fetching farmer conversations: ${farmerId}, limit: ${limit}`);
        const conversations = await chatService.getFarmerConversations(farmerId, limit);
        return res.status(200).json(conversations);
    } catch (error) {
        logger.error('Farmer conversations error:', error);
        next(error);
    }
};

const getConversationStats = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        
        if (!conversationId) {
            return res.status(400).json({ 
                error: 'Missing parameter: conversationId is required' 
            });
        }
        
        logger.info(`Fetching conversation stats: ${conversationId}`);
        const stats = await chatService.getConversationStats(conversationId);
        return res.status(200).json(stats);
    } catch (error) {
        logger.error('Conversation stats error:', error);
        next(error);
    }
};

module.exports = {
    createConversation,
    quickChat,
    sendMessage,
    getConversationHistory,
    getFarmerConversations,
    getConversationStats
};

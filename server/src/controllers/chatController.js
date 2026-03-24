const chatService = require('../services/chatService');
const logger = require('../utils/logger');

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
        const { conversationId, message, language = 'en' } = req.body;
        
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
            language
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
    sendMessage,
    getConversationHistory,
    getFarmerConversations,
    getConversationStats
};

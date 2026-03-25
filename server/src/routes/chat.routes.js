const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// All chat endpoints require authentication
router.post('/', chatController.quickChat);
router.post('/conversations', chatController.createConversation);
router.post('/messages', chatController.sendMessage);
router.get('/conversations/:conversationId', chatController.getConversationHistory);
router.get('/farmers/:farmerId/conversations', chatController.getFarmerConversations);
router.get('/conversations/:conversationId/stats', chatController.getConversationStats);

module.exports = router;

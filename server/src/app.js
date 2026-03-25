const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');
const analyticsRoutes = require('./routes/analytics.routes');
const chatRoutes = require('./routes/chat.routes');
const farmerRoutes = require('./routes/farmer.routes');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());

// Basic request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', analysisRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/farmers', farmerRoutes);

// Root route - Welcome page
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🌾 Welcome to AgriMitra 360 Backend API!',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: {
        path: '/health',
        method: 'GET',
        description: 'Check server health status'
      },
      analysis: {
        path: '/api/analyze',
        method: 'POST',
        description: 'Analyze crop image with AI',
        requires: 'multipart/form-data with image file'
      },
      analytics: {
        public: {
          district: '/api/v1/analytics/district/:district',
          state: '/api/v1/analytics/state/:state',
          national: '/api/v1/analytics/national',
          dashboard: '/api/v1/analytics/dashboard'
        },
        protected: {
          updateDistrict: '/api/v1/analytics/district/:district/update',
          updateState: '/api/v1/analytics/state/:state/update'
        }
      },
      chat: {
        quickChat: '/api/v1/chat',
        createConversation: '/api/v1/chat/conversations',
        sendMessage: '/api/v1/chat/messages',
        getConversation: '/api/v1/chat/conversations/:conversationId',
        farmerConversations: '/api/v1/chat/farmers/:farmerId/conversations',
        conversationStats: '/api/v1/chat/conversations/:conversationId/stats'
      },
      farmers: {
        createOrSync: {
          path: '/api/v1/farmers',
          method: 'POST',
          description: 'Create or sync farmer profile after authentication',
          body: { userId, email, name, location }
        },
        getProfile: {
          path: '/api/v1/farmers/:farmerId',
          method: 'GET',
          description: 'Get farmer profile by ID'
        },
        getProfileWithDetails: {
          path: '/api/v1/farmers/:farmerId/details',
          method: 'GET',
          description: 'Get farmer profile with crop reports and credit scores'
        },
        updateProfile: {
          path: '/api/v1/farmers/:farmerId',
          method: 'PUT',
          description: 'Update farmer profile fields'
        }
      }
    },
    ai_service: process.env.USE_TENSORFLOW === 'true' ? 'TensorFlow + Enhanced Mock' : 'Enhanced Mock',
    documentation: 'Visit /health for server status'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AgriMitra 360 Backend is running smoothly.' });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Use global error handler
app.use(errorHandler);

module.exports = app;
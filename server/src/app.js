const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');
const analyticsRoutes = require('./routes/analytics.routes');
const chatRoutes = require('./routes/chat.routes');
const farmerRoutes = require('./routes/farmer.routes');
const riskRoutes = require('./routes/risk.routes');
const weatherRoutes = require('./routes/weather.routes');
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
app.use('/api/v1/risk', riskRoutes);
app.use('/api/v1/weather', weatherRoutes);

// Root route - simple health response for Render/browser checks
app.get('/', (req, res) => {
  res.send('AgriMitra API running 🚀');
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

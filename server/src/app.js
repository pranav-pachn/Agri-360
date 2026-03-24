const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');
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

app.use('/api', analysisRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AgriMitra 360 Backend is running smoothly.' });
});

// Use global error handler
app.use(errorHandler);

module.exports = app;
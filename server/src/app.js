const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const analysisRoutes = require('./routes/analysisRoutes');
const analyticsRoutes = require('./routes/analytics.routes');
const chatRoutes = require('./routes/chat.routes');
const farmerRoutes = require('./routes/farmer.routes');
const riskRoutes = require('./routes/risk.routes');
const weatherRoutes = require('./routes/weather.routes');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

function resolveClientBuildPath() {
  const distCandidates = [
    // Monorepo run from repo root (common local/CI layout)
    path.resolve(__dirname, '../../client/dist'),
    // Render service started from repo root
    path.resolve(process.cwd(), 'client/dist'),
    // Render service started from /server
    path.resolve(process.cwd(), '../client/dist'),
    // Fallback for deployments that copy client under /server
    path.resolve(__dirname, '../client/dist')
  ];

  for (const distPath of distCandidates) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return { distPath, indexPath };
    }
  }

  return { distPath: null, indexPath: null };
}

const { distPath: clientDistPath, indexPath: clientIndexPath } = resolveClientBuildPath();
const hasClientBuild = Boolean(clientDistPath && clientIndexPath);

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

// Root route - serve SPA when available, otherwise keep API health response.
app.get('/', (req, res) => {
  if (hasClientBuild) {
    return res.sendFile(clientIndexPath);
  }

  return res.send('AgriMitra API running 🚀');
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

// Serve the built client in production so browser-router routes like /auth/callback work.
if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(clientIndexPath);
  });
} else {
  logger.warn('Client build not found. SPA routes (e.g. /auth/callback) will return 404 until client/dist is deployed.');
}

module.exports = app;

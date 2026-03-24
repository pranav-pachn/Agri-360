const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', analysisRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AgriMitra 360 Backend is running smoothly.' });
});

module.exports = app;
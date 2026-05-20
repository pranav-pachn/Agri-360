const express = require('express');
const DebugController = require('../controllers/debug.controller');

const router = express.Router();

// GET /smoke - quick smoke test for weather + crop inference
router.get('/smoke', DebugController.smoke);

module.exports = router;

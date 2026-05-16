const express = require('express');
const { getRisk } = require('../controllers/risk.controller');

const router = express.Router();

router.get('/', getRisk);

module.exports = router;

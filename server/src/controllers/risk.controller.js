const { calculateRisk } = require('../services/risk.service');

const getRisk = (req, res) => {
  try {
    // future: use req.query or req.body to adjust factors
    const data = calculateRisk();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRisk
};

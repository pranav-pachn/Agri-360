const express = require("express");
const supabase = require("../config/supabase.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { crop, location } = req.body;

  // Mock logic
  const health = Math.floor(Math.random() * 40) + 60;
  const risk = Math.random() * 0.5;
  const yieldPred = (Math.random() * 2 + 2).toFixed(1);

  const trustScore = Math.floor(
    health * 0.4 + (1 - risk) * 30 + yieldPred * 10
  );

  const { data, error } = await supabase
    .from("farm_analysis")
    .insert([
      {
        crop,
        location,
        health,
        risk,
        yield: yieldPred,
        trust_score: trustScore,
      },
    ]);

  if (error) return res.status(500).json(error);

  res.json({
    health,
    risk,
    yield: yieldPred,
    trustScore,
  });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const { updateLatestReviewsTrustpilot } = require("../services/fetchReviewsTrustpilot");

router.get("/update-latest", async (req, res) => {
  try {
    await updateLatestReviewsTrustpilot();
    res.json({ success: true, message: "Mise à jour effectuée." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

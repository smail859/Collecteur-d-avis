const express = require("express");
const router = express.Router();
const {updateLatestReviews} = require("../services/fetchReviewsGoogle")

// GET /api/force-update
router.get("/", async (req, res) => {
  try {
    await updateLatestReviews();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
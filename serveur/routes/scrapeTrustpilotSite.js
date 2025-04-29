const express = require("express");
const router = express.Router();
const axios = require("axios");
const { trustpilotSites } = require("../config/sites");
const { Review } = require("../model/model");

router.get("/scrape/:site", async (req, res) => {
  const { site } = req.params;
  const match = trustpilotSites.find(s => s.name.toLowerCase() === site.toLowerCase());

  if (!match) return res.status(404).json({ success: false, error: "Site introuvable" });

  try {
    const endpoint = `https://scraper-trustpilot-production.up.railway.app/scrape?url=${encodeURIComponent(match.url)}&name=${encodeURIComponent(match.name)}`;
    const { data } = await axios.get(endpoint);

    if (data?.reviews?.length) {
      const reviewIds = data.reviews.map(r => r.review_id);
      const existing = await Review.find({ review_id: { $in: reviewIds } }).select("review_id");
      const existingIds = new Set(existing.map(e => e.review_id));
      const newReviews = data.reviews.filter(r => !existingIds.has(r.review_id));

      if (newReviews.length > 0) {
        await Review.insertMany(newReviews, { ordered: false }).catch(() => {});
      }

      return res.json({
        success: true,
        inserted: newReviews.length,
        total: data.reviews.length
      });
    } else {
      return res.json({
        success: true,
        inserted: 0,
        total: 0,
        message: "Aucun avis récupéré depuis le scraper"
      });
    }

  } catch (err) {
    console.error("Erreur scraping Trustpilot:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

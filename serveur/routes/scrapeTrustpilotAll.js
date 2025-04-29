const express = require("express");
const router = express.Router();
const axios = require("axios");
const { trustpilotSites } = require("../config/sites");
const { Review } = require("../model/model");

router.get("/scrape-all", async (req, res) => {
  const results = [];

  for (const site of trustpilotSites) {
    try {
      const endpoint = `https://scraper-trustpilot-production.up.railway.app/scrape?url=${encodeURIComponent(site.url)}&name=${encodeURIComponent(site.name)}`;
      const { data } = await axios.get(endpoint);

      if (data?.reviews?.length) {
        const reviewIds = data.reviews.map(r => r.review_id);
        const existing = await Review.find({ review_id: { $in: reviewIds } }).select("review_id");
        const existingIds = new Set(existing.map(e => e.review_id));
        const newReviews = data.reviews.filter(r => !existingIds.has(r.review_id));

        if (newReviews.length > 0) {
          await Review.insertMany(newReviews, { ordered: false }).catch(() => {});
        }

        results.push({
          name: site.name,
          success: true,
          inserted: newReviews.length,
          total: data.reviews.length
        });
      } else {
        results.push({
          name: site.name,
          success: true,
          inserted: 0,
          total: 0,
          message: "Aucun avis récupéré depuis le scraper"
        });
      }
    } catch (err) {
      results.push({ name: site.name, success: false, error: err.message });
    }
  }

  res.json({ success: true, results });
});

module.exports = router;

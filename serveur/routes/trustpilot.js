const express = require("express");
const router = express.Router();
const cache = require("memory-cache");
const { Review } = require("../model/model.js");

// GET /api/trustpilot
router.get("/", async (req, res) => {
  const cached = cache.get("trustpilot_reviews");
  if (cached) {
    console.log("✅ Trustpilot renvoyé depuis le cache");
    return res.status(200).json(cached);
  }

  try {
    const reviews = await Review.find({ source: "trustpilot" });

    if (!reviews.length) {
      return res.status(404).json({ message: "Aucun avis Trustpilot trouvé." });
    }

    const grouped = {};
    reviews.forEach((r) => {
      if (!grouped[r.site]) {
        grouped[r.site] = { reviews: [], total: 0 };
      }

      grouped[r.site].reviews.push({
        id: r.review_id,
        site: r.site,
        date: r.date,
        iso_date: r.iso_date,
        rating: r.rating,
        text: r.text,
        source: r.source,
        service: r.site,
        user: r.user,
        link: r.link || null,
      });

      grouped[r.site].total += r.rating;
    });

    const finalResult = {};
    for (const site in grouped) {
      const siteData = grouped[site];
      const avgRating = siteData.reviews.length
        ? parseFloat((siteData.total / siteData.reviews.length).toFixed(1))
        : null;

      finalResult[site] = {
        reviews: siteData.reviews,
        avgRating,
      };
    }

    // ⏱️ Mise en cache pendant 5 minutes (300 000 ms)
    cache.put("trustpilot_reviews", finalResult, 300000);

    console.log("🧠 Trustpilot calculé et mis en cache");
    res.json(finalResult);
  } catch (err) {
    console.error("❌ Erreur API /api/trustpilot :", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des avis Trustpilot." });
  }
});

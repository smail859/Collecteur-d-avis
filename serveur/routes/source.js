const express = require("express");
const router = express.Router();
const { Review } = require("../model/model.js");
const cacheDuration = 1000 * 60 * 60 * 24 * 2; // 2 jours

router.get("/:source", async (req, res) => {
  const source = req.params.source.toLowerCase();
  const cacheKey = `${source}_reviews`;

  try {
    const reviews = await Review.find({ source });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: `Aucun avis trouvé pour ${source}` });
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
        snippet: r.snippet,
        user: r.user,
        link: r.link || null,
      });

      grouped[r.site].total += r.rating;
    });

    const finalResult = {};
    for (const site in grouped) {
      const data = grouped[site];
      const avgRating = data.reviews.length
        ? parseFloat((data.total / data.reviews.length).toFixed(1))
        : null;

      finalResult[site] = {
        reviews: data.reviews,
        avgRating,
      };
    }

    res.json(finalResult);
  } catch (err) {
    console.error(`❌ Erreur API /api/reviews/${source} :`, err.message);
    res.status(500).json({ error: `Erreur lors de la récupération des avis ${source}.` });
  }
});

module.exports = router;

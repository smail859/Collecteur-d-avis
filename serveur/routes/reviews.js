const express = require("express");
const router = express.Router();
const { Review } = require("../model/model.js");
const { sites } = require("../config/sites");
const { fetchReviewsForSite } = require("../services/fetchReviewsGoogle");

// GET /api/reviews
router.get("/", async (req, res) => {
  try {

    // Si pas dans le cache : récupérer depuis Mongo
    const dbReviews = await Review.find({ source: "Google" });


    let grouped = {};

    if (dbReviews.length > 0) {
      grouped = dbReviews.reduce((acc, review) => {
        if (!acc[review.site]) {
          acc[review.site] = { reviews: [], data_id: review.data_id, total: 0 };
        }
        acc[review.site].reviews.push(review);
        acc[review.site].total += review.rating || 0;
        return acc;
      }, {});
    } else {
      console.log("⛔ Aucun avis Google en base, scraping initial via SerpAPI...");
      const results = await Promise.all(sites.map(fetchReviewsForSite));
      const newReviews = results.flatMap((r) => r.reviews);

      if (newReviews.length > 0) {
        await Review.insertMany(newReviews, { ordered: false });
      }

      grouped = newReviews.reduce((acc, review) => {
        if (!acc[review.site]) {
          acc[review.site] = { reviews: [], data_id: review.data_id, total: 0 };
        }
        acc[review.site].reviews.push(review);
        acc[review.site].total += review.rating || 0;
        return acc;
      }, {});
    }

    // Calcul de la moyenne
    const final = {};
    for (const site in grouped) {
      const { reviews, data_id, total } = grouped[site];
      const avgRating = reviews.length > 0 ? parseFloat((total / reviews.length).toFixed(1)) : null;
      final[site] = { data_id, reviews, avgRating };
    }
    res.json(final);
  } catch (error) {
    console.error("❌ Erreur API /api/reviews :", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des avis Google." });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { Review } = require("../model/model.js");
const { formatRelativeDate } = require("../utils/dateUtils"); 

// GET /api/debug-review/:id
router.get("/debug-review/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findOne({ review_id: id });

    if (!review) {
      return res.status(404).json({
        exists: false,
        message: `Aucun avis trouvé avec l'ID ${id}`,
      });
    }

    return res.json({
      exists: true,
      message: `Avis trouvé pour l'ID ${id}`,
      review,
    });
  } catch (err) {
    console.error("Erreur debug-review :", err.message);
    return res.status(500).json({
      error: "Erreur lors de la recherche de l'avis.",
    });
  }
});

// GET /api/debug-site/:site
router.get("/debug-site/:site", async (req, res) => {
  const { site } = req.params;

  try {
    const reviews = await Review.find({ site });

    if (reviews.length === 0) {
      return res.status(404).json({
        exists: false,
        message: `Aucun avis trouvé pour le site ${site}`,
      });
    }

    return res.json({
      exists: true,
      count: reviews.length,
      message: `${reviews.length} avis trouvés pour le site ${site}`,
      reviews,
    });
  } catch (err) {
    console.error("Erreur debug-site :", err.message);
    return res.status(500).json({
      error: "Erreur lors de la recherche des avis.",
    });
  }
});

// GET /api/debug-dates
router.get("/debug-dates", async (req, res) => {
  try {
    const reviews = await Review.find();

    const inconsistencies = reviews.filter((r) => {
      const expectedDate = formatRelativeDate(r.iso_date);
      return r.date !== expectedDate;
    });

    res.json({
      count: inconsistencies.length,
      message: `${inconsistencies.length} avis avec une incohérence entre 'date' et 'iso_date'`,
      reviews: inconsistencies,
    });
  } catch (err) {
    console.error("Erreur debug-dates :", err.message);
    res.status(500).json({ error: "Erreur lors de la vérification des dates." });
  }
});

module.exports = router;

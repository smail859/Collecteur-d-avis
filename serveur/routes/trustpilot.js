const express = require("express");
const router = express.Router();
const { Review } = require("../model/model.js");
const {trustpilotSites} = require("../config/sites");
const {scrapeTrustpilot} = require("../scrapeTrustpilot");

// GET /api/reviews/:site
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ source: "trustpilot" });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "Aucun avis Trustpilot trouvé." });
    }

    const grouped = {};

    reviews.forEach((r) => {
      if (!grouped[r.site]) {
        grouped[r.site] = {
          reviews: [],
          total: 0,
        };
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

    // Calculer la moyenne par site
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

    res.json(finalResult);
  } catch (err) {
    console.error("Erreur API /api/trustpilot :", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des avis Trustpilot." });
  }
});

// GET /api/scrape-trustpilot/:site
router.get("/api/scrape-trustpilot/:site", async (req, res) => {
  const { site } = req.params;

  const trustpilotSite = trustpilotSites.find((s) => s.name.toLowerCase() === site.toLowerCase());

  if (!trustpilotSite) {
    return res.status(404).json({ error: "Site Trustpilot non trouvé." });
  }

  try {
    const result = await scrapeTrustpilot(trustpilotSite.url, trustpilotSite.name);
    res.json({ success: true, inserted: result.inserted });
  } catch (err) {
    console.error("Erreur lors du scraping Trustpilot :", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/scrape-all
router.get("/api/scrape-all-trustpilot", async (req, res) => {
  try {
    const results = await Promise.all(trustpilotSites.map(async (site) => {
      try {
        const result = await scrapeTrustpilot(site.url, site.name);
        return { name: site.name, success: true, inserted: result.inserted };
      } catch (err) {
        return { name: site.name, success: false, error: err.message };
      }
    }));
    
    res.json({
      success: true,
      results,
    });
  } catch (err) {
    console.error("Erreur lors du scraping multiple Trustpilot :", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const { trustpilotSites } = require("../config/sites");
const scrapeTrustpilot = require("../scrapeTrustpilot");
const { updateCache } = require("../updateCache"); // ← adapte le chemin si besoin

// GET /api/scrape-all-trustpilot
router.get("/scrape-all-trustpilot", async (req, res) => {
  try {
    const results = await Promise.all(trustpilotSites.map(async (site) => {
      try {
        const result = await scrapeTrustpilot(site.url, site.name);
        return { name: site.name, success: true, inserted: result.inserted };
      } catch (err) {
        return { name: site.name, success: false, error: err.message };
      }
    }));

    // 🔁 Mettre à jour le cache après les scrapes
    await updateCache();

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

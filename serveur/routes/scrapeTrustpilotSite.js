const express = require("express");
const router = express.Router();
const {trustpilotSites} = require("../config/sites");
const scrapeTrustpilot = require("../scrapeTrustpilot");


// GET /api/scrape-trustpilot/:site
router.get("/scrape-trustpilot/:site", async (req, res) => {
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

module.exports = router
  
const express = require("express");
const router = express.Router();
const { trustpilotSites } = require("../config/sites");
const { scrapeTrustpilot } = require("../scrapeTrustpilot");

router.get("/scrape/:site", async (req, res) => {
  const { site } = req.params;
  const match = trustpilotSites.find(s => s.name.toLowerCase() === site.toLowerCase());

  if (!match) return res.status(404).json({ success: false, error: "Site introuvable" });

  try {
    const result = await scrapeTrustpilot(match.url, match.name, { pages: 1 });
    res.json({ success: true, inserted: result.inserted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

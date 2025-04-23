const express = require("express");
const router = express.Router();
const { trustpilotSites } = require("../config/sites");
const { scrapeTrustpilot } = require("../scrapeTrustpilot");

router.get("/scrape-all", async (req, res) => {
  const results = [];
  for (const site of trustpilotSites) {
    try {
      const result = await scrapeTrustpilot(site.url, site.name, { pages: 10 });
      results.push({ name: site.name, success: true, inserted: result.inserted });
    } catch (err) {
      results.push({ name: site.name, success: false, error: err.message });
    }
  }
  res.json({ success: true, results });
});

module.exports = router;

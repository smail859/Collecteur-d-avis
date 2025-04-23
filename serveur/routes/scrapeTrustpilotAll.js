const express = require("express");
const router = express.Router();
const { trustpilotSites } = require("../config/sites");
const { scrapeTrustpilot, launchBrowserWithFallback } = require("../scrapeTrustpilot");

// GET /api/scrape-all-trustpilot
router.get("/scrape-all-trustpilot", async (req, res) => {
  try {
    const browser = await launchBrowserWithFallback();
    const results = [];

    for (const site of trustpilotSites) {
      try {
        const result = await scrapeTrustpilot(browser, site.url, site.name);
        results.push({ name: site.name, success: true, inserted: result.inserted });
      } catch (err) {
        results.push({ name: site.name, success: false, error: err.message });
      }
    }

    await browser.close();

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

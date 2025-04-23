const express = require("express");
const router = express.Router();
const { trustpilotSites } = require("../config/sites");
const { scrapeTrustpilot, launchBrowserWithFallback } = require("../scrapeTrustpilot");
const { updateCache } = require("../updateCache");

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
    await updateCache();

    res.json({ success: true, results });
  } catch (err) {
    console.error("Erreur scraping multiple Trustpilot :", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

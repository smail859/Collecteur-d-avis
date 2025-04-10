const cache = require("memory-cache");
const {trustpilotSites} = require("../config/sites")
const { UpdateLogTrustpilot } = require("../model/model.js");
const updateCache = require("../updateCache");
const scrapeTrustpilot = require("../scrapeTrustpilot")

// Mise à jour des avis Trustpilot
// -------------------------
// Cette fonction est appelée par le cron job et par l'API
const updateLatestReviewsTrustpilot = async () => {

  console.log("Vidage du cache avant mise à jour des avis...");
  cache.clear(); 
  console.log("Cache vidé.");

  // --- Scraping Trustpilot ---
  console.log("Mise à jour des avis Trustpilot...");

  for (const tp of trustpilotSites) {
    try {
      const result = await scrapeTrustpilot(tp.url, tp.name);
      console.log(`Trustpilot - ${tp.name} : ${result.inserted} avis insérés.`);
    } catch (err) {
      console.error(`Erreur Trustpilot pour ${tp.name} :`, err.message);
    }
  }

  // Mettre à jour le cache
  await updateCache();

  // Mettre à jour la date de dernière mise à jour
  await UpdateLogTrustpilot.findOneAndUpdate({}, { updatedAt: new Date() }, { upsert: true });

  console.log("----- Fin de la mise à jour Trustpilot -----\n");

};

module.exports = {
  updateLatestReviewsTrustpilot
}
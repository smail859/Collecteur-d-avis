const cache = require("memory-cache");
const axios = require("axios");
const { trustpilotSites } = require("../config/sites");
const { Review, UpdateLogTrustpilot } = require("../model/model.js");
const { updateCache } = require("../updateCache");

// Fonction principale
const updateLatestReviewsTrustpilot = async () => {
  console.log("Vidage du cache avant mise à jour des avis...");
  cache.clear();
  console.log("Cache vidé.");

  console.log("Mise à jour des avis Trustpilot via le scraper externe...");

  for (const tp of trustpilotSites) {
    try {
      const endpoint = `https://scraper-trustpilot-production.up.railway.app/scrape?url=${encodeURIComponent(tp.url)}&name=${encodeURIComponent(tp.name)}`;
      const { data } = await axios.get(endpoint);

      console.log(`🔍 ${tp.name} : ${data.count} avis récupérés.`);

      if (data?.reviews?.length) {
        const reviewIds = data.reviews.map(r => r.review_id);
        const existing = await Review.find({ review_id: { $in: reviewIds } }).select("review_id");
        const existingIds = new Set(existing.map(e => e.review_id));
        const newReviews = data.reviews.filter(r => !existingIds.has(r.review_id));

        if (newReviews.length > 0) {
          await Review.insertMany(newReviews, { ordered: false }).catch(() => {});
          console.log(`✔️ ${newReviews.length} nouveaux avis insérés pour ${tp.name}`);
        } else {
          console.log(`Aucun nouvel avis à insérer pour ${tp.name}`);
        }
      }

    } catch (err) {
      console.error(`❌ Erreur Trustpilot pour ${tp.name} : ${err.message}`);
    }
  }

  await updateCache();
  await UpdateLogTrustpilot.findOneAndUpdate({}, { updatedAt: new Date() }, { upsert: true });

  console.log("✅ Fin de la mise à jour Trustpilot.\n");
};

module.exports = {
  updateLatestReviewsTrustpilot,
};

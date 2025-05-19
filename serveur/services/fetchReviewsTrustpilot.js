const axios = require("axios");
const { trustpilotSites } = require("../config/sites");
const { Review, UpdateLogTrustpilot } = require("../model/model.js");

// Fonction principale
const updateLatestReviewsTrustpilot = async () => {

  for (const tp of trustpilotSites) {
    try {
      const endpoint = `https://scraper-trustpilot-production.up.railway.app/scrape?url=${encodeURIComponent(tp.url)}&name=${encodeURIComponent(tp.name)}`;
      const { data } = await axios.get(endpoint);

      console.log(`🔍 ${tp.name} : ${data.count} avis récupérés.`);

      if (data?.reviews?.length) {
        const reviewIds = data.reviews.map(r => r.review_id);
        const existing = await Review.find({ review_id: { $in: reviewIds } }).select("review_id");
        const existingIds = new Set(existing.map(e => e.review_id));

        const newReviews = data.reviews
          .filter(r => !existingIds.has(r.review_id))
          .map(r => ({
            ...r,
            service: tp.name,
            source: "Trustpilot"
          }));

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

  await UpdateLogTrustpilot.findOneAndUpdate({}, { updatedAt: new Date() }, { upsert: true });

  console.log("✅ Fin de la mise à jour Trustpilot.\n");
};

module.exports = {
  updateLatestReviewsTrustpilot,
};
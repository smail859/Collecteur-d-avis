const { Review } = require("./model/model");
const cache = require("memory-cache");

const cacheDuration = 1000 * 60 * 60 * 24 * 2; // 2 jours

const updateCache = async () => {
  console.log("Mise à jour du cache avec les nouveaux avis...");

  // Suppression ciblée avant mise à jour
  cache.del("reviews");
  cache.del("trustpilot_reviews");

  const updatedReviews = await Review.find();

  const groupedGoogleReviews = {};
  const groupedTrustpilotReviews = {};

  for (const review of updatedReviews) {
    const target = review.source === "trustpilot" ? groupedTrustpilotReviews : groupedGoogleReviews;
    
    if (!target[review.site]) {
      target[review.site] = {
        data_id: review.data_id,
        reviews: [],
      };
    }
    target[review.site].reviews.push(review);
  }

  cache.put("reviews", groupedGoogleReviews, cacheDuration);
  cache.put("trustpilot_reviews", groupedTrustpilotReviews, cacheDuration);

  console.log("Cache mis à jour.");
  console.log("Nombre total d’avis en base :", updatedReviews.length);
};

module.exports = {
  updateCache,
};

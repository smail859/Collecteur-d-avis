// -------------------------
// Mise à jour du cache
// -----------------------
const { Review } = require("./model/model");
const cache = require("memory-cache");

const cacheDuration = 1000 * 60 * 60 * 24 * 2; // 2 jours

const updateCache = async () => {
  console.log("Mise à jour du cache avec les nouveaux avis...");

  // Suppression ciblée avant mise à jour
  cache.del("reviews");
  cache.del("trustpilot_reviews");

  const updatedReviews = await Review.find();

  const groupedReviews = updatedReviews.reduce((acc, review) => {
    if (!acc[review.site]) {
      acc[review.site] = {
        data_id: review.data_id,
        reviews: [],
      };
    }
    acc[review.site].reviews.push(review);
    return acc;
  }, {});

  cache.put("reviews", groupedReviews, cacheDuration);
  console.log("Cache mis à jour.");
  console.log("Nombre total d’avis en base :", updatedReviews.length);
};

module.exports = {
  updateCache,
};

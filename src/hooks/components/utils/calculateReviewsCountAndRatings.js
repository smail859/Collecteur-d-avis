export const calculateReviewsCountAndRatings = (googleReviews, trustpilotReviews) => {
    const countByService = {};
    const ratingSumByService = {};
    const ratingCountByService = {};
  
    const googleReviewsArray = Array.isArray(googleReviews)
      ? googleReviews
      : Object.values(googleReviews).flatMap((data) => data.reviews || []);
  
    const trustpilotReviewsArray = Object.entries(trustpilotReviews).flatMap(([service, data]) =>
      (data.reviews || []).map((review) => ({
        ...review,
        service,
        rating: review.rating || 0,
      }))
    );
  
    // Traiter les avis Google
    googleReviewsArray.forEach(({ service, rating }) => {
      if (!service || rating == null) return;
  
      if (!countByService[service]) {
        countByService[service] = { google: 0, trustpilot: 0 };
        ratingSumByService[service] = { google: 0, trustpilot: 0 };
        ratingCountByService[service] = { google: 0, trustpilot: 0 };
      }
  
      countByService[service].google += 1;
      ratingSumByService[service].google += rating;
      ratingCountByService[service].google += 1;
    });
  
    // Traiter les avis Trustpilot
    trustpilotReviewsArray.forEach(({ service, rating }) => {
      if (!service || rating == null) return;
  
      if (!countByService[service]) {
        countByService[service] = { google: 0, trustpilot: 0 };
        ratingSumByService[service] = { google: 0, trustpilot: 0 };
        ratingCountByService[service] = { google: 0, trustpilot: 0 };
      }
  
      countByService[service].trustpilot += 1;
      ratingSumByService[service].trustpilot += rating;
      ratingCountByService[service].trustpilot += 1;
    });
  
    // Calcul des moyennes
    const avgRatingByService = {};
    Object.keys(ratingSumByService).forEach((service) => {
      avgRatingByService[service] = {
        google: ratingCountByService[service].google
          ? (ratingSumByService[service].google / ratingCountByService[service].google).toFixed(1)
          : "0.0",
        trustpilot: ratingCountByService[service].trustpilot
          ? (ratingSumByService[service].trustpilot / ratingCountByService[service].trustpilot).toFixed(1)
          : "0.0",
      };
    });
  
    return { countByService, avgRatingByService };
  };
  
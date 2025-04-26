export const mergeReviews = (googleReviewsData, trustpilotReviewsData) => {
    // Formater les Trustpilot Reviews d'abord
    const formattedTrustpilotReviews = Object.entries(trustpilotReviewsData).flatMap(([service, data]) =>
      (data.reviews || []).map(review => ({ ...review, service, source: "Trustpilot" }))
    );
  
    // Formater les Google Reviews
    const formattedGoogleReviews = Object.entries(googleReviewsData).flatMap(([service, data]) =>
      (data.reviews || []).map(review => ({ ...review, service }))
    );
  
    // Fusionner les deux
    return [...formattedGoogleReviews, ...formattedTrustpilotReviews];
};
  
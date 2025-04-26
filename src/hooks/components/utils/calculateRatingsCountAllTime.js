export const ratingsCountAllTime = (googleReviews, trustpilotReviews) => {
    if (!googleReviews.length && !trustpilotReviews.length) {
        return { Google: {}, Trustpilot: {} };
    }

    const counts = { Google: {}, Trustpilot: {} };

    const initializeServiceCount = (platform, service) => {
        if (!counts[platform][service]) {
        counts[platform][service] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        }
    };

    googleReviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5 && review.service) {
        initializeServiceCount("Google", review.service);
        counts.Google[review.service][review.rating] += 1;
        }
    });

    trustpilotReviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5 && review.service) {
        initializeServiceCount("Trustpilot", review.service);
        counts.Trustpilot[review.service][review.rating] += 1;
        }
    });

    return counts;
};
  
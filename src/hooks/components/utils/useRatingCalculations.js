import { parseRelativeDate } from './useDateUtils';

/**
 * Calcule la note moyenne globale
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (total / reviews.length).toFixed(1);
};

/**
 * Initialise le compteur pour un service
 */
const initializeServiceCount = (counts, platform, service) => {
  if (!counts[platform][service]) {
    counts[platform][service] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
};

/**
 * Compte les notes pour une période donnée
 */
export const calculateRatingsCount = (googleReviews, trustpilotReviews, period, parseDateFn = parseRelativeDate) => {
  if ((!googleReviews || googleReviews.length === 0) && 
      (!trustpilotReviews || trustpilotReviews.length === 0)) {
    return { Google: {}, Trustpilot: {} };
  }

  const counts = { Google: {}, Trustpilot: {} };
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const dateRanges = {
    today: now.getTime(),
    "7days": new Date(now).setDate(now.getDate() - 7),
    "30days": new Date(now).setDate(now.getDate() - 30),
  };

  const periodStart = dateRanges[period || "30days"];

  // Comptage Google
  googleReviews?.forEach((review) => {
    const reviewDate = parseDateFn(review.date).getTime();
    if (review.rating >= 1 && review.rating <= 5 && review.service && reviewDate >= periodStart) {
      initializeServiceCount(counts, "Google", review.service);
      counts.Google[review.service][review.rating] += 1;
    }
  });

  // Comptage Trustpilot
  trustpilotReviews?.forEach((review) => {
    const reviewDate = parseDateFn(review.date).getTime();
    if (review.rating >= 1 && review.rating <= 5 && review.service && reviewDate >= periodStart) {
      initializeServiceCount(counts, "Trustpilot", review.service);
      counts.Trustpilot[review.service][review.rating] += 1;
    }
  });

  return counts;
};

/**
 * Compte les notes toutes périodes confondues
 */
export const calculateAllTimeRatingsCount = (googleReviews, trustpilotReviews) => {
  if ((!googleReviews || googleReviews.length === 0) && 
      (!trustpilotReviews || trustpilotReviews.length === 0)) {
    return { Google: {}, Trustpilot: {} };
  }

  const counts = { Google: {}, Trustpilot: {} };

  // Comptage Google
  googleReviews?.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5 && review.service) {
      initializeServiceCount(counts, "Google", review.service);
      counts.Google[review.service][review.rating] += 1;
    }
  });

  // Comptage Trustpilot
  trustpilotReviews?.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5 && review.service) {
      initializeServiceCount(counts, "Trustpilot", review.service);
      counts.Trustpilot[review.service][review.rating] += 1;
    }
  });

  return counts;
};

/**
 * Calcule les statistiques par service
 */
export const calculateServiceStats = (googleReviews, trustpilotReviews) => {
  const countByService = {};
  const ratingSumByService = {};
  const ratingCountByService = {};

  // Traitement Google
  googleReviews?.forEach(({ service, rating }) => {
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

  // Traitement Trustpilot
  trustpilotReviews?.forEach(({ service, rating }) => {
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

  return {
    counts: countByService,
    averages: avgRatingByService
  };
};
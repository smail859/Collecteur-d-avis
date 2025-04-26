import { parseRelativeDate } from "./parseRelativeDate";

export const ratingsCount = (googleReviews, trustpilotReviews, periode = "30days") => {
  if (!googleReviews.length && !trustpilotReviews.length) {
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

  const selectedPeriod = periode || "30days"; // Par défaut, 30 jours

  const initializeServiceCount = (platform, service) => {
    if (!counts[platform][service]) {
      counts[platform][service] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
  };

  googleReviews.forEach((review) => {
    const reviewDate = parseRelativeDate(review.date).getTime();
    if (
      review.rating >= 1 && review.rating <= 5 &&
      review.service &&
      reviewDate >= dateRanges[selectedPeriod]
    ) {
      initializeServiceCount("Google", review.service);
      counts.Google[review.service][review.rating] += 1;
    }
  });

  trustpilotReviews.forEach((review) => {
    const reviewDate = parseRelativeDate(review.date).getTime();
    if (
      review.rating >= 1 && review.rating <= 5 &&
      review.service &&
      reviewDate >= dateRanges[selectedPeriod]
    ) {
      initializeServiceCount("Trustpilot", review.service);
      counts.Trustpilot[review.service][review.rating] += 1;
    }
  });

  return counts;
};

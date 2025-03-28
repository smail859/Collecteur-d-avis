import { parseRelativeDate } from './useDateUtils';

/**
 * Calcule les avis par période pour un service
 */
export const calculateReviewsPerPeriod = (reviews, parseDateFn = parseRelativeDate) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return { 
    today: {}, 
    "7days": {}, 
    "30days": {} 
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const dateRanges = {
    today: new Date(now),
    "7days": new Date(now),
    "30days": new Date(now)
  };

  dateRanges["7days"].setDate(now.getDate() - 7);
  dateRanges["30days"].setDate(now.getDate() - 30);
  
  const periods = { today: {}, "7days": {}, "30days": {} };
  const services = [
    "Monbien", "Startloc", "Marketing automobile", 
    "Marketing immobilier", "Pige Online", "Sinimo"
  ];

  // Initialisation
  services.forEach(service => {
    Object.keys(periods).forEach(period => {
      periods[period][service] = { count: 0, dates: [] };
    });
  });

  // Comptage
  reviews.forEach(({ date, service }) => {
    if (!date || !service || !services.includes(service)) return;

    const reviewDate = parseDateFn(date);
    reviewDate.setHours(0, 0, 0, 0);
    const reviewTimestamp = reviewDate.getTime();

    if (isNaN(reviewTimestamp)) return;

    Object.entries(dateRanges).forEach(([period, thresholdDate]) => {
      if (reviewTimestamp >= thresholdDate.getTime()) {
        periods[period][service].count += 1;
        periods[period][service].dates.push(reviewDate.toISOString().split("T")[0]);
      }
    });
  });

  return periods;
};

/**
 * Fusionne les périodes Google et Trustpilot
 */
export const mergePeriodsData = (googlePeriods, trustpilotPeriods) => {
  const periods = { today: {}, "7days": {}, "30days": {} };
  const services = [
    "Monbien", "Startloc", "Marketing automobile", 
    "Marketing immobilier", "Pige Online", "Sinimo"
  ];
  const plateformes = ["Google", "Trustpilot"];

  ["today", "7days", "30days"].forEach(period => {
    plateformes.forEach(source => {
      periods[period][source] = {};
      
      services.forEach(service => {
        const sourceData = source === "Google" 
          ? googlePeriods[period]?.[service] || { count: 0, dates: [] }
          : trustpilotPeriods[period]?.[service] || { count: 0, dates: [] };

        periods[period][source][service] = {
          count: sourceData.count,
          dates: sourceData.dates
        };
      });
    });
  });

  return periods;
};

/**
 * Formate les avis Trustpilot
 */
export const formatTrustpilotReviews = (trustpilotReviews) => {
  return Object.entries(trustpilotReviews).flatMap(([service, data]) =>
    data.reviews?.map(review => ({ ...review, service })) || []
  );
};
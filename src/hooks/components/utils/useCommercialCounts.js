import { parseRelativeDate } from './useDateUtils';

const moisLabels = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Normalise le texte pour comparaison (minuscules + sans accent)
const normalizeText = (text) =>
  text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

// Crée un index: { label: Set(variants normalisés) }
const createCommercialsIndex = (commerciauxParService) => {
  const index = {};
  Object.values(commerciauxParService).forEach(serviceCom => {
    Object.entries(serviceCom).forEach(([key, variants]) => {
      if (!index[key]) {
        index[key] = new Set();
      }
      variants.forEach(variant => index[key].add(normalizeText(variant)));
    });
  });
  return index;
};

// Compte les mentions de commerciaux pour le mois en cours
export const calculateCurrentMonthCommercialCounts = (filteredReviews, commerciauxParService, parseDateFn = parseRelativeDate) => {
  const counts = {};
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const allCommercials = createCommercialsIndex(commerciauxParService);
  const currentMonthReviews = filteredReviews.filter((review) => {
    const reviewDate = new Date(review.iso_date);
    return (
      review.rating === 5 &&
      reviewDate >= firstDay &&
      reviewDate <= lastDay
    );
  });
  
  

  currentMonthReviews.forEach(review => {
    const reviewText = normalizeText(review.snippet || review.text || "");
    const alreadyCounted = new Set();

    Object.entries(allCommercials).forEach(([commercialKey, variantsSet]) => {
      if (!alreadyCounted.has(commercialKey)) {
        for (const variant of variantsSet) {
          const regex = new RegExp(`\\b${variant}\\b`, "i");
          if (regex.test(reviewText)) {
            counts[commercialKey] = (counts[commercialKey] || 0) + 1;
            alreadyCounted.add(commercialKey);
            break;
          }
        }
      }
    });
  });

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

// Compte les mentions de commerciaux par mois pour l'année en cours
export const calculateYearlyCommercialCounts = (filteredReviews, commerciauxParService, parseDateFn = parseRelativeDate) => {
  const counts = {};
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

  // Initialiser la structure des mois/services/commerciaux
  moisLabels.forEach(mois => {
    counts[mois] = {};
    Object.entries(commerciauxParService).forEach(([service, commerciaux]) => {
      counts[mois][service] = {};
      Object.keys(commerciaux).forEach(commercial => {
        counts[mois][service][commercial] = 0;
      });
    });
  });

  const yearlyReviews = filteredReviews.filter(review => {
    const reviewDate = parseDateFn(review.date);
    return reviewDate >= firstDayOfYear && reviewDate <= lastDayOfYear;
  });

  yearlyReviews.forEach(review => {
    const reviewDate = parseDateFn(review.date);
    const moisLabel = moisLabels[reviewDate.getMonth()];
    const reviewText = normalizeText(review.snippet || review.text || "");
    const service = review.service;

    if (commerciauxParService[service]) {
      const alreadyCounted = new Set();

      Object.entries(commerciauxParService[service]).forEach(([commercialKey, variants]) => {
        if (!alreadyCounted.has(commercialKey)) {
          const matched = variants.some(variant => {
            const regex = new RegExp(`\\b${normalizeText(variant)}\\b`, "i");
            return regex.test(reviewText);
          });

          if (matched) {
            counts[moisLabel][service][commercialKey] += 1;
            alreadyCounted.add(commercialKey);
          }
        }
      });
    }
  });

  const monthlyData = moisLabels.map(mois => ({
    mois,
    services: Object.entries(counts[mois]).map(([service, commerciaux]) => ({
      service,
      commerciaux: Object.entries(commerciaux).map(([label, count]) => ({
        label,
        count
      }))
    }))
  }));

  const yearlyTotals = monthlyData.reduce((acc, { services }) => {
    services.forEach(({ commerciaux }) => {
      commerciaux.forEach(({ label, count }) => {
        acc[label] = (acc[label] || 0) + count;
      });
    });
    return acc;
  }, {});

  return {
    monthlyData,
    yearlyTotals
  };
};

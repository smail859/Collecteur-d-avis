import { parseRelativeDate } from './useDateUtils';

// Données des commerciaux par service
const commerciauxParService = {
    "Monbien": {
      "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      "joanna": ["Joanna", "Joana"],
      "johanna": ["Johanna"],
      "theo": ["Théo", "Theo", "Teo", "Téo", "teo", "téo"]
    },
    "Startloc": {
      "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      "melanie": ["Mélanie", "Melanie", "Mel"],
      "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      "manon": ["Manon", "Mano", "Mannon"],
    },
    "Marketing automobile": {
      "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      "arnaud": ["Arnaud", "arnaud", "arnot", "Arno"],
      "elodie": ["Elodie", "Élodie", "Elo", "Lodie", "Élo", "Eloody"],
    },
    "Marketing immobilier": {
      "jean-simon": ["Jean-Simon", "Jean Simon", "J-Simon", "Jean-Si", "JSimon"],
      "oceane": ["Océane", "Oceane"],
      "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      "johanna": ["Johanna"],
    },
    "Pige Online": {
      "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      "angela": ["Angela", "Angéla", "Angie", "Angel", "Ang"],
      "esteban": ["Esteban", "estebanne", "estebane", "Estebane"]
    },
    "Sinimo": {
      "anais": ["Anaïs", "Anais", "Anaïss", "Anaiss", "Annaïs", "Annais"],
      "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
    }
};

const moisLabels = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

/**
 * Normalise le texte pour la comparaison
 */
const normalizeText = (text) => 
  text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

/**
 * Crée un index de tous les commerciaux
 */
const createCommercialsIndex = () => {
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

/**
 * Compte les mentions de commerciaux pour le mois en cours
 */
export const calculateCurrentMonthCommercialCounts = (filteredReviews, parseDateFn = parseRelativeDate) => {
  const counts = {};
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const allCommercials = createCommercialsIndex();
  const currentMonthReviews = filteredReviews.filter(review => {
    const reviewDate = parseDateFn(review.date);
    return reviewDate >= firstDay && reviewDate <= lastDay;
  });
  
  currentMonthReviews.forEach(review => {
    const reviewText = normalizeText(review.snippet || review.text || "");
    const alreadyCounted = new Set();
  
    Object.entries(allCommercials).forEach(([commercialKey, variantsSet]) => {
      if (!alreadyCounted.has(commercialKey)) {
        for (const variant of variantsSet) {
          if (reviewText.split(/\b/).includes(variant)) {
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

/**
 * Compte les mentions de commerciaux par mois pour l'année
 */
export const calculateYearlyCommercialCounts = (filteredReviews, parseDateFn = parseRelativeDate) => {
  const counts = {};
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

  // Initialisation structure
  moisLabels.forEach(mois => {
    counts[mois] = {};
    Object.entries(commerciauxParService).forEach(([service, commerciaux]) => {
      counts[mois][service] = {};
      Object.keys(commerciaux).forEach(commercial => {
        counts[mois][service][commercial] = 0;
      });
    });
  });

  // Comptage
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
          const variantRegex = new RegExp(`\\b${normalizeText(variants[0])}\\b`, "i");
          if (variantRegex.test(reviewText)) {
            counts[moisLabel][service][commercialKey] += 1;
            alreadyCounted.add(commercialKey);
          }
        }
      });
    }
  });

  // Formatage résultats
  const resultYears = moisLabels.map(mois => ({
    mois,
    services: Object.entries(counts[mois]).map(([service, commerciaux]) => ({
      service,
      commerciaux: Object.entries(commerciaux).map(([label, count]) => ({
        label, 
        count
      }))
    }))
  }));

  // Totaux globaux
  const yearlyTotals = resultYears.reduce((acc, { services }) => {
    services.forEach(({ commerciaux }) => {
      commerciaux.forEach(({ label, count }) => {
        acc[label] = (acc[label] || 0) + count;
      });
    });
    return acc;
  }, {});

  return { 
    monthlyData: resultYears, 
    yearlyTotals 
  };
};
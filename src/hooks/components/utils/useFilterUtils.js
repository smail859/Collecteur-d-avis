import { parseRelativeDate } from './useDateUtils';

/**
 * Trie les avis par date (du plus récent au plus ancien)
 */
export const sortReviewsByDate = (reviews, parseDateFn = parseRelativeDate) => {
  if (!reviews || !Array.isArray(reviews)) return [];
  
  return [...reviews].sort((a, b) => {
    const dateA = a.iso_date ? new Date(a.iso_date) : parseDateFn(a.date);
    const dateB = b.iso_date ? new Date(b.iso_date) : parseDateFn(b.date);
    return dateB - dateA;
  });
};

/**
 * Filtre les avis selon les critères
 */
export const filterReviews = (allReviews, filters, parseDateFn = parseRelativeDate, reviewsPerPeriod) => {
  let result = [...allReviews];

  // Filtrage par service
  if (filters.service && filters.service !== "Tous les services") {
    result = result.filter(review => review.service === filters.service);
  }

  // Filtrage par plateforme
  if (filters.plateforme && filters.plateforme !== "Toutes les plateformes") {
    result = result.filter(review => 
      review.source?.toLowerCase() === filters.plateforme.toLowerCase()
    );
  }

  // Filtrage par note
  if (filters.note && filters.note !== "Toutes les notes") {
    const noteValue = parseInt(filters.note[0], 10);
    result = result.filter(review => review.rating === noteValue);
  }

  // Filtrage par commercial
  if (filters.commercial && filters.commercial !== "Tous les commerciaux") {
    const commerciauxParService = {
      // ... (structure identique à votre code original)
    };

    const normalizeText = (text) => text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedFilter = normalizeText(filters.commercial);
  
    result = result.filter(review => {
      const service = review.service;
      const reviewText = normalizeText(review.text || review.snippet || "");
  
      if (!commerciauxParService[service]) return false;
  
      const matchedCommercialKey = Object.entries(commerciauxParService[service]).find(([key, variants]) =>
        variants.some(variant => normalizeText(variant) === normalizedFilter)
      );
  
      if (!matchedCommercialKey) return false;
  
      const matchedVariants = matchedCommercialKey[1];
      return matchedVariants.some(variant =>
        reviewText.split(/\b/).includes(normalizeText(variant))
      );
    });
  }

  // Filtrage par période
  if (filters.periode && filters.periode !== "Toutes les périodes") {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let startDate = null;

    if (filters.periode === "Cette semaine") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (filters.periode === "Ce mois") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filters.periode === "Cette année") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (typeof filters.periode === "object" && filters.periode.start && filters.periode.end) {
      startDate = new Date(filters.periode.start);
      const endDate = new Date(filters.periode.end);
      return result.filter((review) => {
        const reviewDate = parseDateFn(review.date);
        return reviewDate >= startDate && reviewDate <= endDate;
      });
    }

    if (startDate) {
      result = result.filter((review) => {
        const reviewDate = parseDateFn(review.date);
        return reviewDate >= startDate && reviewDate <= now;
      });
    }
  }

  return result;
};
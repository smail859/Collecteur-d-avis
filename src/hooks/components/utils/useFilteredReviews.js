import { useMemo } from "react";
import useDateUtils from "./useDateUtils";

const useFilteredReviews = (allReviews, externalFilters, reviewsPerPeriod) => {
  const { parseRelativeDate } = useDateUtils();

  const filteredReviews = useMemo(() => {
    let result = allReviews;

    // Filtrer par note (ex: "5 étoiles" => 5)
    if (externalFilters.note) {
      const noteValue = parseInt(externalFilters.note[0], 10);
      result = result.filter((review) => review.rating === noteValue);
    }

    // Filtrer par période
    if (externalFilters.periode) {
      if (externalFilters.periode === "Cette semaine") {
        result = reviewsPerPeriod["7days"];
      } else if (externalFilters.periode === "Ce mois") {
        result = result.filter((review) => {
          const reviewDate = parseRelativeDate(review.date);
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return reviewDate >= startOfMonth && reviewDate <= now;
        });
      }
    }

    // Normalisation du texte pour éviter les erreurs d'accents
    const normalizeText = (text) =>
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Filtrer par commercial (nom dans le texte de l'avis)
    if (externalFilters.commercial) {
      const normalizedFilter = normalizeText(externalFilters.commercial);
      result = result.filter(
        (review) =>
          review.text && normalizeText(review.text).includes(normalizedFilter)
      );
    }

    // Filtrer par plateforme
    if (externalFilters.plateforme) {
      result = result.filter((review) => review.source === externalFilters.plateforme);
    }

    // Filtrer par service
    if (externalFilters.services) {
      result = result.filter((review) => review.service === externalFilters.services);
    }

    return result;
  }, [allReviews, externalFilters, reviewsPerPeriod, parseRelativeDate]);

  return { filteredReviews };
};

export default useFilteredReviews;

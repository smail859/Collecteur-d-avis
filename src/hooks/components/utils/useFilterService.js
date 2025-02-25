import { useMemo } from "react";

/**
 * 🔥 Classement des commerciaux pour un service donné
 */
export default function useFilterService(reviews = [], serviceName = "Startloc") {
  return useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) return { top3: [], fullRanking: [] };

    // 1️⃣ Filtrer les avis pour le service donné (par défaut : "Startloc")
    const serviceReviews = reviews.filter(review => review.service === serviceName);

    // 2️⃣ Compter les avis par commercial
    const countByCommercial = serviceReviews.reduce((acc, review) => {
      acc[review.commercial] = (acc[review.commercial] || 0) + 1;
      return acc;
    }, {});

    // 3️⃣ Trier par nombre d'avis décroissant
    const sorted = Object.entries(countByCommercial)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 4️⃣ Prendre les 3 premiers commerciaux
    const top3 = sorted.slice(0, 3);

    return { top3, fullRanking: sorted };
  }, [reviews, serviceName]);
}

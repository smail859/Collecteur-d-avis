import { useMemo } from "react";
import { parseRelativeDate } from "../components/dateUtils";

const useReviewsFiltering = (allReviews, externalFilters, reviewsPerPeriod) => {
  return useMemo(() => {
    let result = allReviews.map((review) => ({
      ...review,
      parsedDate: parseRelativeDate(review.date),
    }));

    if (externalFilters.periode === "Ce mois") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter((review) => review.parsedDate >= startOfMonth && review.parsedDate <= now);
    }

    return result;
  }, [allReviews, externalFilters, reviewsPerPeriod]);
};

export default useReviewsFiltering;

import { useMemo } from "react";
import useDateUtils from "./useDateUtils";

const useReviewSorting = (reviews, displayLimit) => {
  const { parseRelativeDate } = useDateUtils();

  // Trier les avis par date
  const sortedReviews = useMemo(() => {
    if (!reviews || typeof reviews !== "object") return [];

    return Object.values(reviews)
      .flatMap((service) => service.reviews || [])
      .sort((a, b) => {
        const dateA = a.iso_date ? new Date(a.iso_date) : parseRelativeDate(a.date);
        const dateB = b.iso_date ? new Date(b.iso_date) : parseRelativeDate(b.date);
        return dateB - dateA;
      });
  }, [reviews]);

  // Avis affichés avec limite
  const displayedReviews = useMemo(() => {
    return sortedReviews.slice(0, displayLimit);
  }, [sortedReviews, displayLimit]);

  return { sortedReviews, displayedReviews };
};

export default useReviewSorting;

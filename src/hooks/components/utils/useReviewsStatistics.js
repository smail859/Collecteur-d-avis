import { useMemo } from "react";

const useReviewsStatistics = (reviews) => {
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingsCount = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating] += 1;
      }
    });
    return counts;
  }, [reviews]);

  return { averageRating, ratingsCount };
};

export default useReviewsStatistics;

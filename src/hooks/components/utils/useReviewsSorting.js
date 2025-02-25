import { useMemo } from "react";

const useReviewsSorting = (reviews) => {
  return useMemo(() => {
    return reviews ? [...reviews].sort((a, b) => new Date(b.iso_date) - new Date(a.iso_date)) : [];
  }, [reviews]);
};

export default useReviewsSorting;

import { useState, useCallback } from "react";
import axios from "axios";

const useReviewsFetcher = (refresh, setRefresh) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalReviewsAPI, setTotalReviewsAPI] = useState(0);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    let allReviews = [];
    let nextToken = null;

    try {
      const cachedReviews = localStorage.getItem("cachedReviews");
      if (cachedReviews && !refresh) {
        try {
          const parsedReviews = JSON.parse(cachedReviews);
          if (Array.isArray(parsedReviews)) {
            setReviews(parsedReviews);
            setTotalReviewsAPI(parsedReviews.length);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Cache corrompu, récupération depuis l'API...");
        }
      }

      do {
        const url = nextToken
          ? `http://localhost:5000/api/reviews?nextPageToken=${nextToken}`
          : "http://localhost:5000/api/reviews";

        const response = await axios.get(url);
        const newReviews = response.data.reviews.filter(
          (review) => !allReviews.some((r) => r.review_id === review.review_id)
        );

        allReviews = [...allReviews, ...newReviews];
        nextToken = response.data.nextPageToken || null;
      } while (nextToken);

      setReviews(allReviews);
      setTotalReviewsAPI(allReviews.length);
      localStorage.setItem("cachedReviews", JSON.stringify(allReviews));
    } catch (error) {
      setError(error?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, [refresh]);

  return { reviews, totalReviewsAPI, loading, error, fetchReviews };
};

export default useReviewsFetcher;

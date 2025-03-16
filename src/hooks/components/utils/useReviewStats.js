import { useMemo } from "react";
import useDateUtils from "./useDateUtils";

const useReviewStats = (googleReviews, trustpilotReviews) => {
  const { parseRelativeDate } = useDateUtils();

  const averageRatingLastTwoMonths = useMemo(() => {
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    lastDayLastMonth.setHours(23, 59, 59, 999);

    const firstDayTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const lastDayTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, 0);
    lastDayTwoMonthsAgo.setHours(23, 59, 59, 999);

    const services = ["Monbien", "Startloc", "Marketing automobile", "Marketing immobilier", "Pige Online", "Sinimo"];
    const platforms = ["Google", "Trustpilot"];

    const getAverageRating = (start, end, service, platform) => {
      const reviews =
        platform === "google"
          ? googleReviews.filter((r) => r.service === service)
          : trustpilotReviews[service]?.reviews || [];

      const filteredReviews = reviews.filter((review) => {
        const reviewDate = parseRelativeDate(review.date);
        return reviewDate >= start && reviewDate <= end;
      });

      if (filteredReviews.length === 0) return "0";

      const total = filteredReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
      return (total / filteredReviews.length).toFixed(1);
    };

    let lastMonthRatings = {}, twoMonthsAgoRatings = {};
    services.forEach((service) => {
      platforms.forEach((platform) => {
        lastMonthRatings[service] = lastMonthRatings[service] || {};
        twoMonthsAgoRatings[service] = twoMonthsAgoRatings[service] || {};

        lastMonthRatings[service][platform] = getAverageRating(firstDayLastMonth, lastDayLastMonth, service, platform);
        twoMonthsAgoRatings[service][platform] = getAverageRating(firstDayTwoMonthsAgo, lastDayTwoMonthsAgo, service, platform);
      });
    });

    return { lastMonth: lastMonthRatings, twoMonthsAgo: twoMonthsAgoRatings };
  }, [googleReviews, trustpilotReviews]);

  return { averageRatingLastTwoMonths };
};

export default useReviewStats;

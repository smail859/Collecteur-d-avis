import { parseRelativeDate } from "./parseRelativeDate";

export const getReviewsPerPeriod = (reviews) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return {
      today: {},
      "7days": {},
      "30days": {},
      thismonth: {},
      thisyear: {},
      lastmonth: {},
      thisweek: {},
      lastweek: {},
    };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normaliser à minuit

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - dayOfWeek + 1);

  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastSunday = new Date(thisMonday);
  lastSunday.setDate(thisMonday.getDate() - 1);

  const dateRanges = {
    today: new Date(now),
    "7days": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    "30days": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    thismonth: new Date(now.getFullYear(), now.getMonth(), 1),
    thisyear: new Date(now.getFullYear(), 0, 1),
    lastmonth: { start: startOfLastMonth, end: endOfLastMonth },
    thisweek: thisMonday,
    lastweek: { start: lastMonday, end: lastSunday },
  };

  const periods = {
    today: {},
    "7days": {},
    "30days": {},
    thismonth: {},
    thisyear: {},
    lastmonth: {},
    thisweek: {},
    lastweek: {},
  };

  const services = ["Monbien", "Startloc", "Marketing automobile", "Marketing immobilier", "Pige Online", "Sinimo"];

  services.forEach((service) => {
    Object.keys(periods).forEach((period) => {
      periods[period][service] = { count: 0, dates: [] };
    });
  });

  reviews.forEach(({ date, service }) => {
    if (!date || !service || !services.includes(service)) return;

    const reviewDate = parseRelativeDate(date);
    if (isNaN(reviewDate.getTime())) return;

    const reviewTimestamp = reviewDate.getTime();
    const formattedDate = reviewDate.toISOString().split("T")[0];

    Object.entries(dateRanges).forEach(([period, range]) => {
      if (period === "lastmonth" || period === "lastweek") {
        if (reviewTimestamp >= range.start.getTime() && reviewTimestamp <= range.end.getTime()) {
          periods[period][service].count += 1;
          periods[period][service].dates.push(formattedDate);
        }
      } else {
        if (reviewTimestamp >= range.getTime()) {
          periods[period][service].count += 1;
          periods[period][service].dates.push(formattedDate);
        }
      }
    });
  });

  return periods;
};

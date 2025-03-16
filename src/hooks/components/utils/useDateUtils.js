import { useCallback } from "react";

const useDateUtils = () => {
  const parseRelativeDate = useCallback((relativeDate) => {
    if (!relativeDate) return new Date();

    const now = new Date();
    const result = new Date(now);

    const dateMap = {
      "il y a un jour": () => result.setDate(now.getDate() - 1),
      "il y a une semaine": () => result.setDate(now.getDate() - 7),
      "il y a un mois": () => result.setMonth(now.getMonth() - 1),
      "il y a un an": () => result.setFullYear(now.getFullYear() - 1),
    };

    if (dateMap[relativeDate.trim()]) {
      dateMap[relativeDate.trim()]();
      result.setHours(0, 0, 0, 0);
      return result;
    }

    const match = relativeDate.match(/(\d+)\s*(jour|jours|semaine|semaines|mois|an|ans)/i);
    if (!match) return new Date();

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (unit.includes("jour")) result.setDate(now.getDate() - value);
    else if (unit.includes("semaine")) result.setDate(now.getDate() - value * 7);
    else if (unit.includes("mois")) result.setMonth(now.getMonth() - value);
    else if (unit.includes("an")) result.setFullYear(now.getFullYear() - value);

    result.setHours(0, 0, 0, 0);
    return result;
  }, []);

  return { parseRelativeDate };
};

export default useDateUtils;

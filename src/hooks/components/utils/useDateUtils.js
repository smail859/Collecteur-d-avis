/**
 * Parse une date relative ou absolue en français
 * @param {string} relativeDate - Date à parser (ex: "il y a 3 jours", "15 févr. 2025")
 * @returns {Date} Objet Date correspondant
 */
export const parseRelativeDate = (relativeDate) => {
  if (!relativeDate) return new Date();

  const now = new Date();
  let result = new Date(now);

  // Normalisation du texte
  relativeDate = relativeDate.replace(/\u00A0/g, " ").trim().toLowerCase();

  // Correspondance des mois français
  const moisFrancais = {
    "janv.": 0, "janvier": 0,
    "févr.": 1, "février": 1,
    "mars": 2,
    "avr.": 3, "avril": 3,
    "mai": 4,
    "juin": 5,
    "juil.": 6, "juillet": 6,
    "août": 7,
    "sept.": 8, "septembre": 8,
    "oct.": 9, "octobre": 9,
    "nov.": 10, "novembre": 10,
    "déc.": 11, "décembre": 11
  };

  // Gestion des dates absolues (ex: "15 févr. 2025")
  const matchFullDate = relativeDate.match(/^(\d{1,2})\s+([a-zéûôî.]+)\s+(\d{4})$/iu);
  if (matchFullDate) {
    const [, day, monthStringRaw, year] = matchFullDate;
    const monthString = monthStringRaw.toLowerCase().replace(".", "").trim();
    const matchedKey = Object.keys(moisFrancais).find(key =>
      key.replace(".", "").toLowerCase() === monthString
    );

    if (matchedKey) {
      const month = moisFrancais[matchedKey];
      const parsedDay = parseInt(day, 10);
      const parsedYear = parseInt(year, 10);

      if (!isNaN(parsedDay) && !isNaN(parsedYear)) {
        result = new Date(parsedYear, month, parsedDay);
        result.setHours(0, 0, 0, 0);
        return result;
      }
    }
  }

  // Gestion des dates relatives
  const matchRelative = relativeDate.match(/il y a (\d+|un|une) (jour|jours|semaine|semaines|mois|an|ans)/i);
  if (matchRelative) {
    const value = matchRelative[1] === "un" || matchRelative[1] === "une" ? 1 : parseInt(matchRelative[1], 10);
    const unit = matchRelative[2];

    if (unit.includes("jour")) result.setDate(now.getDate() - value);
    else if (unit.includes("semaine")) result.setDate(now.getDate() - value * 7);
    else if (unit.includes("mois")) result.setMonth(now.getMonth() - value);
    else if (unit.includes("an")) result.setFullYear(now.getFullYear() - value);

    result.setHours(0, 0, 0, 0);
    return result;
  }

  // Cas spéciaux
  if (relativeDate === "hier") {
    result.setDate(now.getDate() - 1);
    result.setHours(0, 0, 0, 0);
    return result;
  }
  
  if (relativeDate === "aujourd'hui" || relativeDate === "aujourd'hui") {
    result.setHours(0, 0, 0, 0);
    return result;
  }

  console.warn("Format de date non reconnu :", relativeDate);
  return now;
};
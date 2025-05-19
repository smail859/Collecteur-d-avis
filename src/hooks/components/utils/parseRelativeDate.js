// utils/parseRelativeDate.js

/**
 * Fonction pour convertir une date relative française en objet Date
 * @param {string} relativeDate - Exemple : "il y a 7 jours" ou "15 févr. 2025"
 * @returns {Date} Objet Date correspondant
 */
export const parseRelativeDate = (relativeDate) => {
    if (!relativeDate) return new Date();
  
    const now = new Date();
    let result = new Date(now);
  
    // Normalisation
    relativeDate = relativeDate.replace(/\u00A0/g, " ").trim().toLowerCase();
  
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
  
    // Cas : Date absolue "15 févr. 2025"
    const matchFullDate = relativeDate.match(/^(\d{1,2})\s+([a-zéûôî.]+)\s+(\d{4})$/iu);
    if (matchFullDate) {
      const [, day, monthRaw, year] = matchFullDate;
      const monthClean = monthRaw.toLowerCase().replace(".", "").trim();
      const matchedKey = Object.keys(moisFrancais).find(key =>
        key.replace(".", "").toLowerCase() === monthClean
      );
      const month = moisFrancais[matchedKey];
      const parsedDay = parseInt(day, 10);
      const parsedYear = parseInt(year, 10);
  
      if (!isNaN(parsedDay) && !isNaN(parsedYear) && month !== undefined) {
        const date = new Date(parsedYear, month, parsedDay);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    }
  
    // Cas : "il y a 3 jours" / "il y a 2 semaines"
    const matchRelative = relativeDate.match(/il y a (\d+|un|une) (jour|jours|semaine|semaines|mois|an|ans)/i);
    if (matchRelative) {
      const value = (matchRelative[1] === "un" || matchRelative[1] === "une") ? 1 : parseInt(matchRelative[1], 10);
      const unit = matchRelative[2];
  
      if (unit.includes("jour")) result.setDate(now.getDate() - value);
      else if (unit.includes("semaine")) result.setDate(now.getDate() - value * 7);
      else if (unit.includes("mois")) result.setMonth(now.getMonth() - value);
      else if (unit.includes("an")) result.setFullYear(now.getFullYear() - value);
  
      result.setHours(0, 0, 0, 0);
      return result;
    }
  
    // Cas : Hier
    if (relativeDate === "hier") {
      result.setDate(now.getDate() - 1);
      result.setHours(0, 0, 0, 0);
      return result;
    }
  
    // Cas : Aujourd'hui
    if (relativeDate === "aujourd’hui" || relativeDate === "aujourd'hui") {
      result.setHours(0, 0, 0, 0);
      return result;
    }
  
    // Cas : "il y a x minutes" ou "il y a x heures"
    if (/^il y a \d+ minute/.test(relativeDate) || /^il y a \d+ heure/.test(relativeDate)) {
      return result; // garder l'heure
    }

    // Cas : format JJ/MM/AAAA
    const matchDateFr = relativeDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (matchDateFr) {
      const [, day, month, year] = matchDateFr;
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      date.setHours(0, 0, 0, 0);
      return date;
    }
      
    return now;
  };
  
const { Review } = require("../model/model");

const parseValidDate = (d) => {
  if (!d) return null;
  // Gère le format JJ/MM/AAAA
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(d)) {
    const [day, month, year] = d.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }
  // Sinon, format standard
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date;
};

const formatRelativeDate = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "à l'instant";
  if (diffInMinutes < 60) return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  if (diffInHours < 24) return `il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
  if (diffInDays === 1) return "il y a 1 jour";
  if (diffInDays < 7) return `il y a ${diffInDays} jours`;
  if (diffInDays < 14) return "il y a une semaine";
  if (diffInDays < 21) return "il y a 2 semaines";
  if (diffInDays < 28) return "il y a 3 semaines";
  if (diffInDays < 35) return "il y a 1 mois";

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `il y a ${diffInMonths} mois`;

  const diffInYears = Math.floor(diffInDays / 365);
  if (diffInYears < 1) return "il y a 1 an";
  return `il y a ${diffInYears} an${diffInYears > 1 ? "s" : ""}`;
};

const updateDates = async () => {
  try {
    const reviews = await Review.find();

    let updated = 0;
    for (const review of reviews) {
      const newDate = formatRelativeDate(review.iso_date);
      if (review.date !== newDate) {
        console.log(`${review.review_id} (${review.site}) : "${review.date}" => "${newDate}"`);
        review.date = newDate;
        await review.save();
        updated++;
      }
    }

    console.log(`Mise à jour des dates : ${updated} avis modifiés.`);
  } catch (err) {
    console.error("Erreur lors de la mise à jour des dates :", err.message);
  }
};

module.exports = {
  updateDates,
  formatRelativeDate,
  parseValidDate
};

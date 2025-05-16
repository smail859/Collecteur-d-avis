// utils/commercialsAnalytics.js

/**
 * Normalize un texte pour faciliter la comparaison
 */
const normalizeText = (text) => {
    return text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
};
  
/**
 * Calcul des commerciaux sur le mois actuel
 * @param {Array} reviews - Les avis filtrés
 * @param {Object} commerciauxParService - Les commerciaux par service
 * @returns {Array} Liste des commerciaux avec leur nombre d'avis ce mois
 */
export function calculateMonthlyCommercialCounts(reviews, commerciauxParService) {
    const counts = {};
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Construire la liste de tous les commerciaux sans doublon
    const allCommercials = {};
    Object.values(commerciauxParService).forEach(serviceCom => {
        Object.entries(serviceCom).forEach(([key, variants]) => {
        if (!allCommercials[key]) {
            allCommercials[key] = new Set();
        }
        variants.forEach(variant => allCommercials[key].add(normalizeText(variant)));
        });
    });

    const currentMonthReviews = reviews.filter((review) => {
    const reviewDate = new Date(review.iso_date);
    return (
        review.rating === 5 &&
        reviewDate >= firstDayCurrentMonth &&
        reviewDate <= lastDayCurrentMonth
    );
    });

    currentMonthReviews.forEach((review) => {
        const reviewText = normalizeText(review.snippet || review.text || "");
        const alreadyCounted = new Set();

        Object.entries(allCommercials).forEach(([commercialKey, variantsSet]) => {
        if (alreadyCounted.has(commercialKey)) return;

        for (const variant of variantsSet) {
            if (reviewText.split(/\b/).includes(variant)) {
            counts[commercialKey] = (counts[commercialKey] || 0) + 1;
            alreadyCounted.add(commercialKey);
            break;
            }
        }
        });
    });

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

/**
 * Calcul des commerciaux par mois de l'année
 * @param {Array} reviews - Les avis filtrés
 * @param {Object} commerciauxParService - Les commerciaux par service
 * @returns {Object} { resultYears, totalAvisParCommercialParService }
 */
export function calculateYearlyCommercialCounts(reviews, commerciauxParService) {
    const counts = {};
    const moisLabels = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    const yearlyReviews = reviews.filter((review) => {
        const reviewDate = new Date(review.iso_date);
        return reviewDate >= firstDayOfYear && reviewDate <= lastDayOfYear;
    });

    moisLabels.forEach((mois) => {
        counts[mois] = {};
        Object.entries(commerciauxParService).forEach(([service, commerciaux]) => {
        counts[mois][service] = {};
        Object.keys(commerciaux).forEach((commercial) => {
            counts[mois][service][commercial] = 0;
        });
        });
    });

    yearlyReviews.forEach((review) => {
        const reviewDate = new Date(review.iso_date);
        const moisLabel = moisLabels[reviewDate.getMonth()];
        const reviewText = normalizeText(review.snippet || review.text || "");
        const service = review.service;
        if (!commerciauxParService[service]) return;

        const alreadyCountedCommercials = new Set();

        Object.entries(commerciauxParService[service]).forEach(([commercialKey, variants]) => {
        if (alreadyCountedCommercials.has(commercialKey)) return;
        for (const variant of variants) {
            const variantRegex = new RegExp(`\\b${normalizeText(variant)}\\b`, "i");
            if (variantRegex.test(reviewText)) {
            counts[moisLabel][service][commercialKey] += 1;
            alreadyCountedCommercials.add(commercialKey);
            break;
            }
        }
        });
    });

    const resultYears = moisLabels.map((mois) => {
        const services = Object.entries(counts[mois]).map(([service, commerciaux]) => {
        const commerciauxAvecZero = Object.entries(commerciaux).map(([label, count]) => ({
            label,
            count,
        }));
        return { service, commerciaux: commerciauxAvecZero };
        });
        return { mois, services };
    });

    const globalCounts = {};
    resultYears.forEach(({ services }) => {
        services.forEach(({ commerciaux }) => {
        commerciaux.forEach(({ label, count }) => {
            globalCounts[label] = (globalCounts[label] || 0) + count;
        });
        });
    });

    return { resultYears, totalAvisParCommercialParService: globalCounts };
}
  
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const useFetchReviews = () => {
  // 🟢 États principaux
  const [reviews, setReviews] = useState([]); // Liste des avis récupérés
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs
  const [totalReviewsAPI, setTotalReviewsAPI] = useState(0); // Nombre total d'avis récupérés
  const [displayLimit, setDisplayLimit] = useState(8); // Nombre d'avis affichés
  const [selectedFilter, setSelectedFilter] = useState("7days"); // Filtre sélectionné
  const [refresh, setRefresh] = useState(false); // Permet de forcer le rafraîchissement des avis

  // 🟢 Mémoïsation du nombre total d'avis
  const totalReviews = useMemo(() => totalReviewsAPI, [totalReviewsAPI]);

  /**
   * 📅 Fonction pour convertir une date relative en objet Date
   * @param {string} relativeDate - Exemple : "il y a 7 jours"
   * @returns {Date} Objet Date correspondant
   */
  const parseRelativeDate = useCallback((relativeDate) => {
    if (!relativeDate) return new Date();

    const now = new Date();
    const result = new Date(now);

    // 📌 Cas spéciaux où le nombre est écrit en lettres
    if (relativeDate.trim() === "il y a un jour") {
      result.setDate(now.getDate() - 1);
      result.setHours(0, 0, 0, 0);
      return result;
    }

    if (relativeDate.trim() === "il y a une semaine") {
      result.setDate(now.getDate() - 7);
      result.setHours(0, 0, 0, 0);
      return result;
    }

    if (relativeDate.trim() === "il y a un mois") {
      result.setMonth(now.getMonth() - 1);
      result.setHours(0, 0, 0, 0);
      return result;
    }

    // 📌 Vérification via regex pour les autres formats avec chiffres
    const match = relativeDate.match(/(\d+)\s*(jour|jours|semaine|semaines|mois)/);
    if (!match) return new Date();

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (unit.includes("jour")) result.setDate(now.getDate() - value);
    else if (unit.includes("semaine")) result.setDate(now.getDate() - value * 7);
    else if (unit.includes("mois")) result.setMonth(now.getMonth() - value);

    result.setHours(0, 0, 0, 0);
    return result;
  }, []);

  /**
   * 📌 Classement des avis par période
   */
  const reviewsPerPeriod = useMemo(() => {
    if (!reviews.length) return { today: [], "7days": [], "30days": [] };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 31);

    const todayReviews = [];
    const sevenDaysReviews = [];
    const thirtyDaysReviews = [];

    reviews.forEach((r) => {
      if (!r.date) return;

      const reviewDate = parseRelativeDate(r.date);
      if (!reviewDate || isNaN(reviewDate.getTime())) return;

      const reviewTime = reviewDate.getTime();

      if (reviewTime === now.getTime()) {
        todayReviews.push(r);
      } else if (reviewTime >= sevenDaysAgo.getTime() && reviewTime <= now.getTime()) {
        sevenDaysReviews.push(r);
      } else if (reviewTime >= thirtyDaysAgo.getTime() && reviewTime < sevenDaysAgo.getTime()) {
        thirtyDaysReviews.push(r);
      }
    });

    return {
      today: todayReviews,
      "7days": sevenDaysReviews,
      "30days": thirtyDaysReviews,
    };
  }, [reviews]);

  /**
   * 📌 Gestion de l'affichage des avis
   */
  const allReviews = useMemo(() => reviews || [], [reviews]);

  const displayedReviews = useMemo(() => {
    return allReviews.slice(0, displayLimit);
  }, [allReviews, displayLimit]);

  /**
   * 📌 Fonction pour charger plus d'avis
   */
  const loadMoreReviews = () => {
    setDisplayLimit((prevLimit) => prevLimit + 8);
  };

  /**
   * 📌 Changement de filtre
   */
  const changeFilter = (filter) => {
    setSelectedFilter(filter);
  };

  /**
   * 🔍 Recherche de prénoms dans les avis
   */
  const keywords = ["Smail", "Lucas", "Mélanie", "Déborah"]; // Liste des prénoms connus

  const countNamesInReviews = (reviews) => {
    const nameCounts = {};
    const reviewsWithNames = [];

    reviews.forEach((review) => {
      if (!review.text) return;

      const reviewText = review.text.toLowerCase();
      let nameFound = false;

      keywords.forEach((name) => {
        const regex = new RegExp(`\\b${name.toLowerCase()}\\b`, "g");
        const matches = reviewText.match(regex);

        if (matches) {
          nameCounts[name] = (nameCounts[name] || 0) + matches.length;
          nameFound = true;
        }
      });

      if (nameFound) {
        reviewsWithNames.push(review);
      }
    });

    console.log("📌 Avis contenant des noms détectés :", reviewsWithNames);
    return nameCounts;
  };

  const [nameCounts, setNameCounts] = useState({});

  useEffect(() => {
    if (reviews.length > 0) {
      setNameCounts(countNamesInReviews(reviews));
    }
  }, [reviews]);

  /**
   * 📌 Fonction pour récupérer les avis
   */
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    let allReviews = [];
    let nextToken = null;

    try {
      const cachedReviews = localStorage.getItem("cachedReviews");
      if (cachedReviews && !refresh) {
        const parsedReviews = JSON.parse(cachedReviews);
        setReviews(parsedReviews);
        setTotalReviewsAPI(parsedReviews.length);
        setLoading(false);
        return;
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

  useEffect(() => {
    fetchReviews();
  }, []);

  const refreshReviews = () => {
    setRefresh(true);
    fetchReviews();
  };

  return {
    reviews: displayedReviews,
    reviewsPerPeriod,
    totalReviews,
    loading,
    error,
    fetchReviews,
    loadMoreReviews,
    displayLimit,
    changeFilter,
    selectedFilter,
    refreshReviews,
    parseRelativeDate,
    countNamesInReviews,
  };
};

export default useFetchReviews;

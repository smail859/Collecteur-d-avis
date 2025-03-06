import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import useFilterService from "../components/utils/useFilterService"; // Import du hook


const useFetchReviews = (externalFilters = { note: "", periode: "", commercial: "", plateforme: "", services: "" }) => {
  
  // États principaux
  const [reviews, setReviews] = useState([]); // Liste des avis récupérés
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs
  const [totalReviewsAPI, setTotalReviewsAPI] = useState(0); // Nombre total d'avis récupérés
  const [displayLimit, setDisplayLimit] = useState(8); // Nombre d'avis affichés
  const [selectedFilter, setSelectedFilter] = useState("7days"); // Filtre sélectionné
  const [refresh, setRefresh] = useState(false); // Permet de forcer le rafraîchissement des avis

  // Mémoïsation du nombre total d'avis
  const totalReviews = useMemo(() => totalReviewsAPI, [totalReviewsAPI]);

  // Vérifier que `reviews` est bien un tableau
  const validReviews = Array.isArray(reviews) ? reviews : [];

  // Utilisation du hook `useFilterService` pour chaque service
  const rankingsByService = {
    Startloc: useFilterService(validReviews, "Startloc"),
    Monbien: useFilterService(validReviews, "Monbien"),
    Sinimo: useFilterService(validReviews, "Sinimo"),
    "Marketing Automobile": useFilterService(validReviews, "Marketing Automobile"),
    "Marketing Immobilier": useFilterService(validReviews, "Marketing Immobilier"),
    "Pige Online": useFilterService(validReviews, "Pige Online"),
  };
  
  /**
   * Fonction pour convertir une date relative en objet Date
   * @param {string} relativeDate - Exemple : "il y a 7 jours"
   * @returns {Date} Objet Date correspondant
   */
  const parseRelativeDate = useCallback((relativeDate) => {
    if (!relativeDate) return new Date();

    const now = new Date();
    const result = new Date(now);

    // Cas spéciaux où le nombre est écrit en lettres
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

    if (relativeDate.trim() === "il y a un an") {
      result.setFullYear(now.getFullYear() - 1);
      result.setHours(0, 0, 0, 0);
      return result;
    }
    

    // Vérification via regex pour les autres formats avec chiffres
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


  /**
   * Classement des avis par période
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
   * Gestion de l'affichage des avis
   */
  const sortedReviews = useMemo(() => {
    const sorted = reviews.slice().sort((a, b) => {
      const dateA = a.iso_date ? new Date(a.iso_date) : parseRelativeDate(a.date);
      const dateB = b.iso_date ? new Date(b.iso_date) : parseRelativeDate(b.date);
      return dateB - dateA;
    });
  
    return sorted;
  }, [reviews]);
  
  const allReviews = useMemo(() => {
    return reviews
      ? reviews.slice().sort((a, b) => new Date(parseRelativeDate(b.date)) - new Date(parseRelativeDate(a.date)))
      : [];
  }, [reviews]);
  
  
  const displayedReviews = useMemo(() => {
    return allReviews.slice(0, displayLimit);
  }, [allReviews, displayLimit]);

  /**
   * Fonction pour charger plus d'avis
   */
  const loadMoreReviews = () => {
    setDisplayLimit((prevLimit) => prevLimit + 8);
  };

  /**
   * Changement de filtre
   */
  const changeFilter = (filter) => {
    setSelectedFilter(filter);
  };


  const filteredReviews = useMemo(() => {
    // Commencez par l'ensemble complet des avis
    let result = allReviews;
  
    // Filtrer par note (ex: "5 étoiles" => 5)
    if (externalFilters.note) {
      const noteValue = parseInt(externalFilters.note[0], 10);
      result = result.filter((review) => review.rating === noteValue);
    }
  
    // Filtrer par période
    if (externalFilters.periode) {
      if (externalFilters.periode === "Cette semaine") {
        result = reviewsPerPeriod["7days"];
      } else if (externalFilters.periode === "Ce mois") {
        result = result.filter((review) => {
          const reviewDate = parseRelativeDate(review.date);
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return reviewDate >= startOfMonth && reviewDate <= now;
        });
      }
    }
      
    // Fonction de normalisation pour enlever les accents
    const normalizeText = (text) =>
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    if (externalFilters.commercial) {
      const normalizedFilter = normalizeText(externalFilters.commercial);
      result = result.filter(
        (review) =>
          review.text &&
          normalizeText(review.text).includes(normalizedFilter)
      );
    }
  
    // Filtrer par plateforme
    if (externalFilters.plateforme) {
      result = result.filter((review) => review.source === externalFilters.plateforme);
    }
  
    // Filtrer par service
    if (externalFilters.services) {
      result = result.filter((review) => review.service === externalFilters.services);
    }
  
    return result;
  }, [allReviews, externalFilters, reviewsPerPeriod, parseRelativeDate]);
  
  
  // Fonction pour recuperer la notes total de l'etablissement
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1); // moyenne avec 1 décimale
  }, [reviews]);

  // Fonction pour recuperer les avis par étoiles 
  const ratingsCount = useMemo(() => {
    // Initialisation des compteurs pour chaque note de 1 à 5
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating] += 1;
      }
    });
    return counts;
  }, [reviews]);


  const commercialCounts = useMemo(() => {
    const counts = {};
  
    // Déterminer la période du mois précédent
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
    // Liste des commerciaux avec plusieurs orthographes possibles
    const commerciauxRecherches = {
      "smail": ["Smaïl", "Smail", "Ismail"],
      "melanie": ["Mélanie", "Melanie"],
      "lucas": ["Lucas", "Luka", "Luca"],
      "deborah": ["Déborah", "Deborah", "Débora", "Debora", "Déborrah", "Deborrah", "Débby", "Debby", "Debbi", "Debi", "Débborah", "Déborha", "Déboraah", "Déboraa", "Débhora", "Débhoraah"]
    };
  
    // Fonction de normalisation
    const normalizeText = (text) =>
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    // Filtrer les avis du mois précédent
    const lastMonthReviews = filteredReviews.filter((review) => {
      const reviewDate = parseRelativeDate(review.date);
      return reviewDate >= firstDayLastMonth && reviewDate <= lastDayLastMonth;
    });

    // Recherche des commerciaux dans le texte des avis filtrés
    lastMonthReviews.forEach((review) => {
      if (review.text) {
        const normalizedText = normalizeText(review.text);
        const detectedCommercials = new Set(); // Stocker les commerciaux déjà comptés dans cet avis
  
        Object.entries(commerciauxRecherches).forEach(([key, variations]) => {
          variations.forEach((variant) => {
            const normalizedVariant = normalizeText(variant);
  
            const regex = new RegExp(`\\b${normalizedVariant}\\b`, "i");
            if (regex.test(normalizedText) && !detectedCommercials.has(key)) {
              counts[key] = (counts[key] || 0) + 1;
              detectedCommercials.add(key); // Empêche de le compter plusieurs fois pour un même avis
            }
          });
        });
      }
    });
  
    // Transformer l'objet `counts` en tableau [{ name, count }]
    const result = Object.entries(counts).map(([name, count]) => ({ name, count }));
  
    return result;
  }, [filteredReviews, parseRelativeDate]);


  const commercialCountsYears = useMemo(() => {
    const counts = {}; // Structure: { "janvier": { "smail": 5, "melanie": 3, ... }, "février": { ... }, ... }

    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1); // 1er janvier
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59); // 31 décembre

    const commerciauxRecherches = {
      "smail": ["Smaïl", "Smail", "Ismail"],
      "melanie": ["Mélanie", "Melanie"],
      "lucas": ["Lucas", "Luka", "Luca"],
      "deborah": ["Déborah", "Deborah", "Débora", "Debora"]
    };

    const normalizeText = (text) =>
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Initialiser le comptage par mois
    const moisLabels = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    moisLabels.forEach((mois) => {
      counts[mois] = {}; // Crée une structure { "Janvier": {}, "Février": {}, ... }
    });

    // Filtrer les avis de l'année en cours
    const yearlyReviews = filteredReviews.filter((review) => {
      const reviewDate = parseRelativeDate(review.date);
      return reviewDate >= firstDayOfYear && reviewDate <= lastDayOfYear;
    });

    // Comptabiliser les avis par commercial et par mois
    yearlyReviews.forEach((review) => {
      if (review.text) {
        const normalizedText = normalizeText(review.text);
        const detectedCommercials = new Set();
        const reviewDate = parseRelativeDate(review.date);
        const moisIndex = reviewDate.getMonth(); // 0 = Janvier, 1 = Février...
        const moisLabel = moisLabels[moisIndex];

        Object.entries(commerciauxRecherches).forEach(([key, variations]) => {
          variations.forEach((variant) => {
            const normalizedVariant = normalizeText(variant);
            const regex = new RegExp(`\\b${normalizedVariant}\\b`, "i");

            if (regex.test(normalizedText) && !detectedCommercials.has(key)) {
              counts[moisLabel][key] = (counts[moisLabel][key] || 0) + 1;
              detectedCommercials.add(key);
            }
          });
        });
      }
    });

    // Transformer les données en tableau exploitable pour les graphiques
    const allCommerciaux = Object.keys(commerciauxRecherches);

    const resultYears = moisLabels.map((mois) => {
      // Liste des commerciaux avec leurs avis, sinon 0
      const commerciauxAvecZero = allCommerciaux.map((name) => {
        return { name, count: counts[mois][name] || 0 };
      });
    
      return {
        mois,
        commerciaux: commerciauxAvecZero,
      };
    });

    /// Initialiser un tableau pour stocker les totaux sous forme de { name, count }
    const totalAvisParCommercial = [];

    // Calcul du total des avis par commercial sur toute l'année
    const totalCounts = {}; // Temporaire pour accumuler les valeurs

    resultYears.forEach((moisData) => {
      moisData.commerciaux.forEach(({ name, count }) => {
        totalCounts[name] = (totalCounts[name] || 0) + count;
      });
    });

    // Transformer en tableau
    for (const [label, count] of Object.entries(totalCounts)) {
      totalAvisParCommercial.push({ label , count });
    } 
    return { resultYears, totalAvisParCommercial };
  }, [filteredReviews, parseRelativeDate]);

  




  /**
   * Fonction pour récupérer les avis
   */
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
          console.warn("Cache corrompu, récupération des avis depuis l'API...");
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
    averageRating,
    ratingsCount,
    filteredReviews,
    sortedReviews,
    rankingsByService,
    commercialCounts,
    commercialCountsYears,
  };
};

export default useFetchReviews;

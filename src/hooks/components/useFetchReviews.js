import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import useFilterService from "../components/utils/useFilterService";
import { calculateMonthlyCommercialCounts, calculateYearlyCommercialCounts } from "./utils/commercialsAnalytics";
import { parseRelativeDate } from "./utils/parseRelativeDate";
import { getReviewsPerPeriod } from "./utils/getReviewsPerPeriod";
import { ratingsCount as calculateRatingsCount } from "./utils/calculateRatingsCount";
import { ratingsCountAllTime as calculateRatingsCountAllTime } from "./utils/calculateRatingsCountAllTime";
import { calculateReviewsCountAndRatings } from "./utils/calculateReviewsCountAndRatings";
import { detectCommercialName } from "./utils/detectCommercialName";
import { mergeReviews } from "./utils/mergeReviews";

/**
 * Hook personnalisé `useFetchReviews`
 * =====================================
 * 
 * Ce hook gère toute la logique liée à la récupération, au traitement, au tri 
 * et au filtrage des avis clients provenant de Google et Trustpilot.
 * 
 * Fonctions principales :
 * -----------------------
 * - Récupère les avis Google et Trustpilot depuis l'API.
 * - Fusionne, trie et filtre les avis selon de nombreux critères (service, note, commercial, plateforme, période).
 * - Calcule des statistiques avancées :
 *    - Nombre d'avis par service et par plateforme
 *    - Moyennes de notes par service (mois courant et mois précédent)
 *    - Evolution des performances commerciales (par mois et par an)
 * - Sauvegarde les moyennes d'avis par mois dans le localStorage.
 * - Détecte les nouveaux avis reçus depuis la dernière consultation.
 * - Permet de charger progressivement plus d'avis à l'affichage.
 * 
 * Valeurs retournées :
 * ---------------------
 * - reviews : Liste paginée des avis affichés
 * - reviewsPerPeriod : Répartition des avis par service et par période
 * - totalReviews : Nombre total d'avis
 * - loading : État de chargement
 * - error : Message d'erreur éventuel
 * - fetchReviews : Fonction pour forcer la récupération des avis
 * - loadMoreReviews : Fonction pour charger plus d'avis
 * - displayLimit : Nombre d'avis actuellement affichés
 * - changeFilter : Fonction pour changer le filtre de période
 * - selectedFilter : Filtre de période sélectionné
 * - refreshReviews : Fonction pour rafraîchir les avis
 * - averageRating : Note moyenne globale
 * - ratingsCount : Compte des notes par service pour la période sélectionnée
 * - ratingsCountAllTime : Compte des notes par service sans filtre temporel
 * - filteredReviews : Avis filtrés selon les critères sélectionnés
 * - sortedReviews : Avis triés par date
 * - rankingsByService : Classement des avis par service
 * - commercialCounts : Performances commerciales (par mois)
 * - commercialCountsYears : Performances commerciales (par an)
 * - reviewsCountByService : Compte total des avis par service
 * - avgRatingByService : Moyenne de notes par service
 * - averageRatingLastTwoMonths : Comparaison des moyennes de notes entre 2 mois
 * - googleReviews : Avis Google "bruts"
 * - trustpilotReviews : Avis Trustpilot "bruts"
 * - setDisplayLimit : Fonction pour modifier le nombre d'avis affichés
 * - newReviewsCount : Nombre de nouveaux avis non lus
 * - updateLastCheckDate : Fonction pour mettre à jour la date de dernière consultation
 * - newReviews : Liste des nouveaux avis non lus
 * - detectCommercialName : Fonction utilitaire pour détecter un commercial mentionné dans un texte
*/



const useFetchReviews = (externalFilters = { note: "", periode: "", commercial: "", plateforme: "", service: "",} ) => {
  
  // ============================
  // États principaux
  // ============================
  const [reviews, setReviews] = useState([]); // Liste des avis récupérés
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs
  const [totalReviewsAPI, setTotalReviewsAPI] = useState(0); // Nombre total d'avis récupérés
  const [displayLimit, setDisplayLimit] = useState(8); // Nombre d'avis affichés
  const [selectedFilter, setSelectedFilter] = useState("7days"); // Filtre sélectionné
  const [, setRefresh] = useState(false); // Permet de forcer le rafraîchissement des avis
  const [googleReviews, setGoogleReviews] = useState([])
  const [trustpilotReviews, setTruspilotReviews] = useState([])
  const [reviewsCountByService, setReviewsCountByService] = useState({});
  const [avgRatingByService ,setAvgRatingByService] = useState({})
  const { notifCleared = false } = externalFilters;
  
  // Mémoïsation du nombre total d'avis
  const totalReviews = useMemo(() => totalReviewsAPI, [totalReviewsAPI]);
  // Vérifier que `reviews` est bien un tableau
  const validReviews = Array.isArray(reviews) ? reviews : [];

  // Utilisation du hook `useFilterService` pour chaque service
  // ============================
  // Classement par service
  // ============================
  const rankingsByService = {
    Startloc: useFilterService(validReviews, "Startloc"),
    Monbien: useFilterService(validReviews, "Monbien"),
    Sinimo: useFilterService(validReviews, "Sinimo"),
    "Marketing Automobile": useFilterService(validReviews, "Marketing Automobile"),
    "Marketing Immobilier": useFilterService(validReviews, "Marketing Immobilier"),
    "Pige Online": useFilterService(validReviews, "Pige Online"),
  };
  
  // ============================
  // Gestion des commerciaux
  // ============================
  const commerciauxParService = useMemo(() => ({
    Monbien: {
      lucas: ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      smail: ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      joanna: ["Joanna", "Joana"],
      johanna: ["Johanna"],
      theo: ["Théo", "Theo", "Teo", "Téo", "teo", "téo"],
    },
    Startloc: {
      smail: ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      melanie: ["Mélanie", "Melanie", "Mel"],
      lucas: ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      manon: ["Manon", "Mano", "Mannon"],
    },
    "Marketing automobile": {
      lucas: ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      smail: ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      arnaud: ["Arnaud", "arnaud", "arnot", "Arno"],
      elodie: ["Elodie", "Élodie", "Elo", "Lodie", "Élo", "Eloody"],
    },
    "Marketing immobilier": {
      "jean-simon": ["Jean-Simon", "Jean Simon", "J-Simon", "Jean-Si", "JSimon"],
      oceane: ["Océane", "Oceane"],
      lucas: ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      smail: ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      johanna: ["Johanna"],
    },
    "Pige Online": {
      lucas: ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      smail: ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
      angela: ["Angela", "Angéla", "Angie", "Angel", "Ang"],
      esteban: ["Esteban", "estebanne", "estebane", "Estebane"],
    },
    Sinimo: {
      anais: ["Anaïs", "Anais", "Anaïss", "Anaiss", "Annaïs", "Annais"],
      lucas: ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
      smail: ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
    },
  }), []);
  

  /**
   * Sauvegarde les moyennes d'avis par service dans le localStorage,
   * en associant les moyennes au mois courant (ex: "2025-04").
   * Evite de sauvegarder plusieurs fois pour le même mois.
  */
  useEffect(() => {
    const now = new Date();
    if (!avgRatingByService || Object.keys(avgRatingByService).length === 0) return;
  
    // Récupérer les moyennes enregistrées précédemment
    const storedRatings = JSON.parse(localStorage.getItem("historicalRatings")) || {};
  
    // Clé du mois actuel
    const currentMonthKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0"); // Ex: "2025-03"
  
    // Vérifier si la moyenne du mois actuel est déjà enregistrée pour éviter les doublons
    if (storedRatings[currentMonthKey]) {
      return;  // Si la donnée pour ce mois existe déjà, on quitte sans rien faire
    }
  
    // Ajouter la moyenne actuelle en utilisant la clé "YYYY-MM"
    const newStoredRatings = {
      ...storedRatings,
      [currentMonthKey]: avgRatingByService
    };


  
    try {
      localStorage.setItem("historicalRatings", JSON.stringify(newStoredRatings));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde dans localStorage:", error);
    }    
    console.log("Sauvegarde des moyennes actuelles :", newStoredRatings);
    // Après avoir enregistré les données dans localStorage
    console.log("Historique des évaluations:", localStorage.getItem("historicalRatings"));

    // Vérifie également l'objet sous forme d'objet JavaScript
    const historicalRatings = JSON.parse(localStorage.getItem("historicalRatings"));
    console.log("Historique des évaluations en format objet:", historicalRatings);


    
  }, [avgRatingByService]);
    



  /**
   * Compare les moyennes d'avis par service entre le mois courant et le mois précédent,
   * en récupérant les données sauvegardées dans le localStorage.
   * Sert à afficher l'évolution des notes sur 2 mois.
  */
  const averageRatingLastTwoMonths = useMemo(() => {
    const historicalRatings = JSON.parse(localStorage.getItem("historicalRatings")) || {};
  
    // Récupérer la date actuelle
    const currentDate = new Date();
    
    // Obtenir l'année et le mois actuels
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0 = janvier, 11 = décembre
  
    // Calculer le mois précédent (en prenant en compte les changements d'année)
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth(); // Obtenir le mois précédent
  
    // Formater les clés des mois sous forme de "YYYY-MM"
    const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`; 
    const lastMonthKey = `${lastMonthYear}-${String(lastMonth + 1).padStart(2, '0')}`;  
    const lastMonthStoredRatings = historicalRatings[lastMonthKey] || {};
    const currentMonthStoredRatings = historicalRatings[currentMonthKey] || {};
  
    return {
      lastMonth: lastMonthStoredRatings,
      currentMonth: currentMonthStoredRatings,
    };
  }, []);
  

  // Utilisation de `getReviewsPerPeriod` pour Google et Trustpilot
  const googlePeriods = useMemo(() => getReviewsPerPeriod(googleReviews), [googleReviews]);
  const formattedTrustpilotReviews = useMemo(() => {
    return Object.entries(trustpilotReviews).flatMap(([service, data]) =>
      data.reviews.map(review => ({ ...review, service }))
    );
  }, [trustpilotReviews]);
  

  const trustpilotPeriods = useMemo(() => getReviewsPerPeriod(formattedTrustpilotReviews), [formattedTrustpilotReviews]);

  // Fusionner les résultats pour avoir `reviewsPerPeriod`
  const reviewsPerPeriod = useMemo(() => {


    const periods = { today: {}, "7days": {}, "30days": {}, "thismonth": {}, "thisyear": {}, "lastmonth": {}, "thisweek": {}, "lastweek": {} };
    const services = ["Monbien", "Startloc", "Marketing automobile", "Marketing immobilier", "Pige Online", "Sinimo"];
    const plateformes = ["Google", "Trustpilot"];
  
    ["today", "7days", "30days","thismonth", "thisyear","lastmonth","thisweek","lastweek"].forEach(period => {
      plateformes.forEach(source => {
        periods[period][source] = {}; // On s'assure d'avoir un objet propre pour chaque plateforme
  
        services.forEach(service => {
          const googleData = googlePeriods[period]?.[service] || { count: 0, dates: [] };
          const trustpilotData = trustpilotPeriods[period]?.[service] || { count: 0, dates: [] };
  
          periods[period][source][service] = {
            count: source === "Google" ? googleData.count : trustpilotData.count,
            dates: source === "Google" ? googleData.dates : trustpilotData.dates,
          };
        });
      });
    });
    return periods;
  }, [googlePeriods, trustpilotPeriods]);

  
  // Tri des avis directement sur le tableau
  const sortedReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return [];
    return [...reviews].sort((a, b) => {
      const dateA = a.iso_date ? new Date(a.iso_date) : parseRelativeDate(a.date);
      const dateB = b.iso_date ? new Date(b.iso_date) : parseRelativeDate(b.date);
      return dateB - dateA;
    });
  }, [reviews]);

  // Récupérer tous les avis triés (pour le filtrage ou l'affichage)
  const allReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return [];
    return [...reviews].sort(
      (a, b) => new Date(b.iso_date) - new Date(a.iso_date)
    );
  }, [reviews]);
  


  /**
   * Filtre dynamiquement les avis selon plusieurs critères :
   * - Service
   * - Plateforme (Google, Trustpilot)
   * - Note (1 à 5 étoiles)
   * - Commercial mentionné dans l'avis
   * - Période temporelle (semaine, mois, année ou personnalisée)
   * 
   * Utilise les filtres fournis via `externalFilters`.
  */
  const filteredReviews = useMemo(() => {
    let result = [...allReviews];

    // Filtrage par service
    if (externalFilters.service && externalFilters.service !== "Tous les services") {
        result = result.filter(review => review.service === externalFilters.service);
    }

    // Filtrage par plateforme (Google, Trustpilot)
    if (externalFilters.plateforme && externalFilters.plateforme !== "Toutes les plateformes") {
        result = result.filter(review => review.source?.toLowerCase() === externalFilters.plateforme.toLowerCase());
    }

    // Filtrage par note
    if (externalFilters.note && externalFilters.note !== "Toutes les notes") {
        const noteValue = parseInt(externalFilters.note[0], 10);
        result = result.filter(review => review.rating === noteValue);
    }

    // Filtrage par commercial (via la fonction `searchCommercialName`)
    if (externalFilters.commercial && externalFilters.commercial !== "Tous les commerciaux") {


      const normalizeText = (text) => text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const normalizedFilter = normalizeText(externalFilters.commercial);
    
      result = result.filter(review => {
        const service = review.service;
        const reviewText = normalizeText(review.text || review.snippet || "");
    
        if (!commerciauxParService[service]) return false;
    
        // Recherche stricte (exact match) dans les variantes
        const matchedCommercialKey = Object.entries(commerciauxParService[service]).find(([key, variants]) =>
          variants.some(variant => normalizeText(variant) === normalizedFilter)
        );
    
        if (!matchedCommercialKey) return false;
    
        const matchedVariants = matchedCommercialKey[1];
    
        // Vérifie que le texte contient EXACTEMENT l'une des variantes du commercial recherché
        return matchedVariants.some(variant =>
          reviewText.split(/\b/).includes(normalizeText(variant))
        );
      });
    }


    // Filtrage par période (Cette semaine, Ce mois, Cette année)
    if (externalFilters.periode && externalFilters.periode !== "Toutes les périodes") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      let startDate = null;

      if (externalFilters.periode === "Cette semaine") {
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
      } else if (externalFilters.periode === "Ce mois") {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (externalFilters.periode === "Cette année") {
          startDate = new Date(now.getFullYear(), 0, 1);
      } else if (typeof externalFilters.periode === "object" && externalFilters.periode.start && externalFilters.periode.end) {
          // Période personnalisée
          startDate = new Date(externalFilters.periode.start);
          const endDate = new Date(externalFilters.periode.end);
          result = result.filter((review) => {
            const reviewDate = new Date(review.iso_date);
              return reviewDate >= startDate && reviewDate <= endDate;
          });
          return result; // On retourne directement si plage personnalisée
      }

      // Filtrage basé sur `startDate`
      if (startDate) {
          result = result.filter((review) => {
            const reviewDate = new Date(review.iso_date);
              return reviewDate >= startDate && reviewDate <= now;
          });
      }
    }

    return result;
  }, [allReviews, externalFilters, commerciauxParService]);
  

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


  // Fonction pour recuperer la notes total de l'etablissement
  const averageRating = useMemo(() => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);
    
  const ratingsCount = useMemo(() => {
    return calculateRatingsCount(googleReviews, formattedTrustpilotReviews, externalFilters.periode);
  }, [googleReviews, formattedTrustpilotReviews, externalFilters.periode]);

  const ratingsCountAllTime = useMemo(() => {
    return calculateRatingsCountAllTime(googleReviews, formattedTrustpilotReviews);
  }, [googleReviews, formattedTrustpilotReviews]);
  

  // Puis dans ton hook :
  const commercialCounts = useMemo(() => calculateMonthlyCommercialCounts(filteredReviews, commerciauxParService), [filteredReviews, commerciauxParService]);
  
  const commercialCountsYears = useMemo(() => calculateYearlyCommercialCounts(filteredReviews, commerciauxParService), [filteredReviews, commerciauxParService]);


  const LAST_REVIEW_KEY = "lastReviewCheck";

  const updateLastCheckDate = () => {
    localStorage.setItem(LAST_REVIEW_KEY, new Date().toISOString());
  };
  
  const pivotDate = useMemo(() => {
    if (notifCleared) {
      return new Date(); // si notifs clear, on reset à aujourd'hui
    }
    const rawLastCheck = localStorage.getItem("lastReviewCheck");
    const lastCheckDate = rawLastCheck ? new Date(rawLastCheck) : null;
  
    if (lastCheckDate && !isNaN(lastCheckDate.getTime())) {
      lastCheckDate.setHours(0, 0, 0, 0);
      return lastCheckDate;
    }
  
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);
    return twoDaysAgo;
  }, [notifCleared]);
  
  const newReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      const reviewDate = new Date(review.iso_date);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate > pivotDate;
    });
    return filtered;
  }, [reviews, pivotDate]);
  
  /**
   * Fonction pour récupérer les avis
   */
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
  
    try {
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
      const googleResponse = await axios.get(`${baseURL}/api/reviews`);
      const trustpilotResponse = await axios.get(`${baseURL}/api/trustpilot`);
  
      const googleReviewsData = googleResponse.data;
      const trustpilotReviewsData = trustpilotResponse.data;
  
      // Très important : reset les anciens avant de remettre
      setReviews([]);
      setGoogleReviews([]);
      setTruspilotReviews([]);
  
      const combinedReviews = mergeReviews(googleReviewsData, trustpilotReviewsData);
  
      setGoogleReviews(
        Object.entries(googleReviewsData).flatMap(([service, data]) =>
          (data.reviews || []).map(review => ({ ...review, service }))
        )
      );
      setTruspilotReviews(trustpilotReviewsData);
      setReviews(combinedReviews);
      setTotalReviewsAPI(combinedReviews.length);
  
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error.message);
      setError(error?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  const refreshReviews = useCallback(() => {
    setRefresh(true);
    fetchReviews();
  }, [fetchReviews]);
  
  useEffect(() => {
    if (!loading && googleReviews.length === 0 && trustpilotReviews.length === 0) {
      refreshReviews();
    }
  }, [googleReviews, trustpilotReviews, loading, refreshReviews]);
  
  

  useEffect(() => {
    if (reviews.length === 0) return;

    const { countByService, avgRatingByService } = calculateReviewsCountAndRatings(googleReviews, trustpilotReviews);

    setReviewsCountByService(countByService);
    setAvgRatingByService(avgRatingByService);
  }, [reviews, googleReviews, trustpilotReviews]);


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
    averageRating,
    ratingsCount,
    filteredReviews,
    sortedReviews,
    rankingsByService,
    commercialCounts,
    reviewsCountByService,
    avgRatingByService,
    averageRatingLastTwoMonths,
    googleReviews,
    trustpilotReviews,
    setDisplayLimit,
    ratingsCountAllTime,
    commercialCountsYears,
    newReviewsCount : newReviews.length,
    updateLastCheckDate,
    newReviews,
    detectCommercialName: (text, service) => detectCommercialName(text, service, commerciauxParService)
  };
};

export default useFetchReviews;
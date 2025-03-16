import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import useFilterService from "../components/utils/useFilterService";


const useFetchReviews = (externalFilters = { note: "", periode: "", commercial: "", plateforme: "", service: "" }) => {
  
  // États principaux
  const [reviews, setReviews] = useState([]); // Liste des avis récupérés
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs
  const [totalReviewsAPI, setTotalReviewsAPI] = useState(0); // Nombre total d'avis récupérés
  const [displayLimit, setDisplayLimit] = useState(8); // Nombre d'avis affichés
  const [selectedFilter, setSelectedFilter] = useState("7days"); // Filtre sélectionné
  const [refresh, setRefresh] = useState(false); // Permet de forcer le rafraîchissement des avis
  const [googleReviews, setGoogleReviews] = useState([])
  const [trustpilotReviews, setTruspilotReviews] = useState([])
  const [reviewsCountByService, setReviewsCountByService] = useState({});
  const [avgRatingByService ,setAvgRatingByService] = useState({})



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

    if (relativeDate.trim() === "il y a un jour") {
        result.setDate(now.getDate() - 1);
    } else if (relativeDate.trim() === "il y a une semaine") {
        result.setDate(now.getDate() - 7);
    } else if (relativeDate.trim() === "il y a un mois") {
        result.setMonth(now.getMonth() - 1);
    } else if (relativeDate.trim() === "il y a un an") {
        result.setFullYear(now.getFullYear() - 1);
    } else {
        const moisFrancais = {
            "janv.": 0, "févr.": 1, "mars": 2, "avr.": 3, "mai": 4, "juin": 5,
            "juil.": 6, "août": 7, "sept.": 8, "oct.": 9, "nov.": 10, "déc.": 11
        };

        const matchFullDate = relativeDate.match(/(\d{1,2})\s+([a-zéû.]+)\s+(\d{4})/i);

        if (matchFullDate) {
            const day = parseInt(matchFullDate[1], 10);
            const monthString = matchFullDate[2].toLowerCase();
            const year = parseInt(matchFullDate[3], 10);

            const month = moisFrancais[monthString];

            if (!isNaN(day) && month !== undefined && !isNaN(year)) {
                const parsedDate = new Date(Date.UTC(year, month, day)); // Création en UTC
                parsedDate.setUTCDate(day); // Force le bon jour
                return parsedDate;
            } else {
                console.error("❌ Erreur de conversion :", { day, month, year });
            }
        }

        const match = relativeDate.match(/(\d+)\s*(jour|jours|semaine|semaines|mois|an|ans)/i);
        if (match) {
            const value = parseInt(match[1], 10);
            const unit = match[2];

            if (unit.includes("jour")) result.setDate(now.getDate() - value);
            else if (unit.includes("semaine")) result.setDate(now.getDate() - value * 7);
            else if (unit.includes("mois")) result.setMonth(now.getMonth() - value);
            else if (unit.includes("an")) result.setFullYear(now.getFullYear() - value);
        }
    }



    result.setHours(0, 0, 0, 0);
    return result;
  }, []);



  // Définir la date actuelle
  const now = new Date();

  // Sauvegarde des moyennes actuelles dans localStorage
  useEffect(() => {
    if (!avgRatingByService || Object.keys(avgRatingByService).length === 0) return;

    // Récupérer les moyennes enregistrées précédemment
    const storedRatings = JSON.parse(localStorage.getItem("historicalRatings")) || {};

    // Clé du mois actuel
    const currentMonthKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0"); // Ex: "2025-03"

    // Vérifier si la moyenne du mois actuel est déjà enregistrée pour éviter les doublons
    if (storedRatings[currentMonthKey]) {
        return;
    }

    // Ajouter la moyenne actuelle en utilisant la clé "YYYY-MM"
    const newStoredRatings = {
        ...storedRatings,
        [currentMonthKey]: avgRatingByService
    };

    localStorage.setItem("historicalRatings", JSON.stringify(newStoredRatings));
    console.log("Sauvegarde des moyennes actuelles :", newStoredRatings);
  }, [avgRatingByService]);


  // Comparaison des moyennes des deux derniers mois
  const averageRatingLastTwoMonths = useMemo(() => {
    const historicalRatings = JSON.parse(localStorage.getItem("historicalRatings")) || {};

    const lastMonthKey = "2025-03"; 
    const currentMonthKey = "2025-04";

    const lastMonthStoredRatings = historicalRatings[lastMonthKey] || {};
    const currentMonthStoredRatings = historicalRatings[currentMonthKey] || {};


    return { lastMonth: lastMonthStoredRatings, currentMonth: currentMonthStoredRatings, };
  }, [googleReviews, trustpilotReviews, reviewsCountByService]);


  
  /**
   * Classement des avis par période
  */
  const getReviewsPerPeriod = useMemo(() => (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return { today: {}, "7days": {}, "30days": {} };

    const now = new Date();
    now.setHours(0, 0, 0, 0); // On fixe l'heure pour éviter les décalages

    // Correction : Utiliser `new Date()` pour chaque période pour éviter les erreurs de référence
    const dateRanges = {
      today: new Date(now),
      "7days": new Date(now),
      "30days": new Date(now)
    };

    dateRanges["7days"].setDate(now.getDate() - 7);
    dateRanges["30days"].setDate(now.getDate() - 30);
    
    const periods = { today: {}, "7days": {}, "30days": {} };
    const services = ["Monbien", "Startloc", "Marketing automobile", "Marketing immobilier", "Pige Online", "Sinimo"];

    // Initialisation centralisée des périodes
    services.forEach(service => {
      Object.keys(periods).forEach(period => {
        periods[period][service] = { count: 0, dates: [] };
      });
    });

    // Vérifier que chaque avis est bien trié par service
    reviews.forEach(({ date, service }) => {
      if (!date || !service || !services.includes(service)) return;

      const reviewDate = parseRelativeDate(date);

      reviewDate.setHours(0, 0, 0, 0); 
      const reviewTimestamp = reviewDate.getTime();
      const formattedDate = reviewDate.toISOString().split("T")[0];

      if (isNaN(reviewTimestamp)) return;

      // Vérifier la plage de dates correctement
      Object.entries(dateRanges).forEach(([period, thresholdDate]) => {
      
        if (reviewTimestamp >= thresholdDate.getTime()) { 
          periods[period][service].count += 1;
          periods[period][service].dates.push(formattedDate);
        } 
      });      
    });

    return periods;
  }, [parseRelativeDate]);


  // Utilisation de `getReviewsPerPeriod` pour Google et Trustpilot
  const googlePeriods = useMemo(() => getReviewsPerPeriod(googleReviews), [googleReviews, parseRelativeDate]);
  const formattedTrustpilotReviews = useMemo(() => {
    return Object.entries(trustpilotReviews).flatMap(([service, data]) =>
      data.reviews.map(review => ({ ...review, service }))
    );
  }, [trustpilotReviews]);

  const trustpilotPeriods = getReviewsPerPeriod(formattedTrustpilotReviews);

  // Fusionner les résultats pour avoir `reviewsPerPeriod`
  const reviewsPerPeriod = useMemo(() => {
    const periods = { today: {}, "7days": {}, "30days": {} };
    const services = ["Monbien", "Startloc", "Marketing automobile", "Marketing immobilier", "Pige Online", "Sinimo"];
    const plateformes = ["Google", "Trustpilot"];
  
    ["today", "7days", "30days"].forEach(period => {
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

  
  /**
   * Gestion de l'affichage des avis
   */
  // Tri des avis directement sur le tableau
  const sortedReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return [];
    return [...reviews].sort((a, b) => {
      const dateA = a.iso_date ? new Date(a.iso_date) : parseRelativeDate(a.date);
      const dateB = b.iso_date ? new Date(b.iso_date) : parseRelativeDate(b.date);
      return dateB - dateA;
    });
  }, [reviews, parseRelativeDate]);

  // Récupérer tous les avis triés (pour le filtrage ou l'affichage)
  const allReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return [];
    return [...reviews].sort(
      (a, b) => new Date(parseRelativeDate(b.date)) - new Date(parseRelativeDate(a.date))
    );
  }, [reviews, parseRelativeDate]);


  const filteredReviews = useMemo(() => {
    let result = [...allReviews];

    // 🔍 1️⃣ Filtrage par service
    if (externalFilters.service && externalFilters.service !== "Tous les services") {
        result = result.filter(review => review.service === externalFilters.service);
    }

    // 🔍 2️⃣ Filtrage par plateforme (Google, Trustpilot)
    if (externalFilters.plateforme && externalFilters.plateforme !== "Toutes les plateformes") {
        result = result.filter(review => review.source?.toLowerCase() === externalFilters.plateforme.toLowerCase());
    }

    // 🔍 3️⃣ Filtrage par note
    if (externalFilters.note && externalFilters.note !== "Toutes les notes") {
        const noteValue = parseInt(externalFilters.note[0], 10);
        result = result.filter(review => review.rating === noteValue);
    }

    // 🔍 4️⃣ Filtrage par commercial (via `text` ou `snippet`)
    if (externalFilters.commercial && externalFilters.commercial !== "Tous les commerciaux") {
        const normalizeText = (text) => text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedFilter = normalizeText(externalFilters.commercial);

        result = result.filter(review => {
            const reviewText = normalizeText(review.text || review.snippet || "");
            return reviewText.includes(normalizedFilter);
        });
    }

    // 🔍 5️⃣ Filtrage par période (Cette semaine, Ce mois, Cette année)
    if (externalFilters.periode && externalFilters.periode !== "Toutes les périodes") {
      if (externalFilters.periode === "Cette semaine") {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        result = result.filter(review => {
          const reviewDate = parseRelativeDate(review.date);
          return reviewDate >= sevenDaysAgo && reviewDate <= now;
        });
      }
      else if (externalFilters.periode === "Ce mois") {
            result = result.filter((review) => {
                const reviewDate = parseRelativeDate(review.date);
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return reviewDate >= startOfMonth && reviewDate <= now;
            });
        }
    }

    return result;
  }, [allReviews, externalFilters, reviewsPerPeriod]);


  
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
    

  // Fonction pour recuperer les avis par étoiles 
  const ratingsCount = useMemo(() => {
    if (!googleReviews.length && !formattedTrustpilotReviews.length) return { 
      Google: {}, 
      Trustpilot: {} 
    };
  
    const counts = { Google: {}, Trustpilot: {} };
  
    // Déterminer la plage de dates en fonction de `externalFilters.periode`
    const now = new Date();
    now.setHours(0, 0, 0, 0);
  
    const dateRanges = {
      today: now.getTime(),
      "7days": new Date(now).setDate(now.getDate() - 7),
      "30days": new Date(now).setDate(now.getDate() - 30),
    };
  
    const selectedPeriod = externalFilters.periode || "30days"; // Par défaut, 30 jours
  
    // Initialiser les objets pour chaque service et chaque note
    const initializeServiceCount = (platform, service) => {
      if (!counts[platform][service]) {
        counts[platform][service] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
    };
  
    // Filtrer et compter les avis Google par service et par note
    googleReviews.forEach((review) => {
      const reviewDate = parseRelativeDate(review.date).getTime();
      if (
        review.rating >= 1 && review.rating <= 5 && review.service &&
        reviewDate >= dateRanges[selectedPeriod]
      ) {
        initializeServiceCount("Google", review.service);
        counts.Google[review.service][review.rating] += 1;
      }
    });
  
    // Filtrer et compter les avis Trustpilot par service et par note
    formattedTrustpilotReviews.forEach((review) => {
      const reviewDate = parseRelativeDate(review.date).getTime();
      if (
        review.rating >= 1 && review.rating <= 5 && review.service &&
        reviewDate >= dateRanges[selectedPeriod]
      ) {
        initializeServiceCount("Trustpilot", review.service);
        counts.Trustpilot[review.service][review.rating] += 1;
      }
    });
  
    return counts;
  }, [googleReviews, formattedTrustpilotReviews, externalFilters.periode, parseRelativeDate]);

  const ratingsCountAllTime = useMemo(() => {
    if (!googleReviews.length && !formattedTrustpilotReviews.length) return { 
      Google: {}, 
      Trustpilot: {} 
    };
  
    const counts = { Google: {}, Trustpilot: {} };
  
    // Initialiser les objets pour chaque service et chaque note
    const initializeServiceCount = (platform, service) => {
      if (!counts[platform][service]) {
        counts[platform][service] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
    };
  
    // Compter les avis Google par service et par note (sans filtre de période)
    googleReviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5 && review.service) {
        initializeServiceCount("Google", review.service);
        counts.Google[review.service][review.rating] += 1;
      }
    });
  
    // Compter les avis Trustpilot par service et par note (sans filtre de période)
    formattedTrustpilotReviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5 && review.service) {
        initializeServiceCount("Trustpilot", review.service);
        counts.Trustpilot[review.service][review.rating] += 1;
      }
    });
  
    return counts;
  }, [googleReviews, formattedTrustpilotReviews]);

  
 

  const commercialCounts = useMemo(() => {
    const counts = {}; 
    const commerciauxParService = {
      "Monbien": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "joanna": ["Joanna", "Johanna", "Joana"],
        "theo": ["Théo", "Theo", "Teo", "Téo"],
        "anais": ["Anaïs", "Anais"],
      },
      "Startloc": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "melanie": ["Mélanie", "Melanie", "Mel"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "deborah": ["Déborah", "Deborah", "Débora", "Debora", "Déborrah", "Deborrah", "Débby", "Debby", "Debbi", "Debi", "Débborah", "Déborha"],
        "manon": ["Manon", "Mano", "Mannon"],
      },
      "Marketing automobile": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "oceane": ["Océane", "Oceane"],
        "elodie": ["Elodie", "Élodie", "Elo", "Lodie", "Élo", "Eloody"],
      },
      "Marketing immobilier": {
        "jean-simon": ["Jean-Simon", "Jean Simon", "J-Simon", "Jean-Si", "JSimon"],
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "johanna": ["Johanna"],
      },
      "Pige Online": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "angela": ["Angela", "Angéla", "Angie", "Angel", "Ang"],
      },
      "Sinimo": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "anais": ["Anaïs", "Anais", "Anaïss", "Anaiss", "Annaïs", "Annais"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "luna": ["Luna", "Louna"],
      }
    };
  
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
    const normalizeText = (text) =>
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    // Filtrer les avis du mois dernier
    const lastMonthReviews = filteredReviews.filter((review) => {
      const reviewDate = parseRelativeDate(review.date);
      return reviewDate >= firstDayLastMonth && reviewDate <= lastDayLastMonth;
    });
  
    // Parcours des avis pour compter par service et commercial
    lastMonthReviews.forEach((review) => {
      if ((review.snippet || review.text) && review.service) {
        const normalizedText = normalizeText(review.snippet || review.text || "");
        const detectedCommercials = new Set();
        const service = review.service;
  
        if (!counts[service]) {
          counts[service] = {};
        }
  
        if (commerciauxParService[service]) {
          Object.entries(commerciauxParService[service]).forEach(([key, variations]) => {
            variations.forEach((variant) => {
              const normalizedVariant = normalizeText(variant);
              const regex = new RegExp(`\\b${normalizedVariant}\\b`, "i");
  
              if (regex.test(normalizedText) && !detectedCommercials.has(key)) {
                counts[service][key] = (counts[service][key] || 0) + 1;
                detectedCommercials.add(key);
              }
            });
          });
        }
      }
    });

  
    // Récupérer les compteurs par service sous forme de tableau
    const resultPerService = Object.entries(counts).map(([service, commerciaux]) => ({
      service,
      commerciaux: Object.entries(commerciaux).map(([name, count]) => ({ name, count }))
    }));
  
    // Fusionner les résultats pour obtenir un total global par commercial
    // Pour "smail" et "lucas" on additionne, pour les autres on prend le maximum
    const globalCounts = {};
    resultPerService.forEach(({ service, commerciaux }) => {
      commerciaux.forEach(({ name, count }) => {
        const normalizedName = normalizeText(name);
        globalCounts[normalizedName] = (globalCounts[normalizedName] || 0) + count;
      });
    });
    // globalCounts contient désormais le total global par commercial selon votre règle
    return Object.entries(globalCounts).map(([name, count]) => ({ name, count }));
  }, [filteredReviews, parseRelativeDate]);

  console.log("commercialCounts : ", commercialCounts)
  

  const commercialCountsYears = useMemo(() => {
    const counts = {};
  
    const commerciauxParService = {
      "Monbien": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "joanna": ["Joanna", "Johanna", "Joana"],
        "theo": ["Théo", "Theo", "Teo", "Téo"],
        "anais": ["Anaïs", "Anais"],
      },
      "Startloc": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "melanie": ["Mélanie", "Melanie", "Mel"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "deborah": ["Déborah", "Deborah", "Débora", "Debora", "Déborrah", "Deborrah", "Débby", "Debby", "Debbi", "Debi", "Débborah", "Déborha"],
        "manon": ["Manon", "Mano", "Mannon"],
      },
      "Marketing automobile": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "oceane": ["Océane", "Oceane"],
        "elodie": ["Elodie", "Élodie", "Elo", "Lodie", "Élo", "Eloody"],
      },
      "Marketing immobilier": {
        "jean-simon": ["Jean-Simon", "Jean Simon", "J-Simon", "Jean-Si", "JSimon"],
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "johanna": ["Johanna"],
      },
      "Pige Online": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "angela": ["Angela", "Angéla", "Angie", "Angel", "Ang"],
      },
      "Sinimo": {
        "benoit": ["Benoit", "Benoît", "Ben", "Benoi", "Beno"],
        "anais": ["Anaïs", "Anais", "Anaïss", "Anaiss", "Annaïs", "Annais"],
        "lucas": ["Lucas", "Luka", "Luca", "Loucas", "Louka"],
        "smail": ["Smaïl", "Smail", "Ismail", "Ismael", "Ismaël"],
        "luna": ["Luna", "Louna"],
      }
    };
  
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  
    const normalizeText = (text) =>
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  
    const moisLabels = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  
    // Initialiser counts par mois
    moisLabels.forEach((mois) => {
      counts[mois] = {};
    });
  
    const yearlyReviews = filteredReviews.filter((review) => {
      const reviewDate = parseRelativeDate(review.date);
      return reviewDate >= firstDayOfYear && reviewDate <= lastDayOfYear;
    });
  
    yearlyReviews.forEach((review) => {
      if ((review.snippet || review.text) && review.service) {
        const normalizedText = normalizeText(review.snippet || review.text || "");
        const detectedCommercials = new Set();
        const reviewDate = parseRelativeDate(review.date);
        const moisIndex = reviewDate.getMonth();
        const moisLabel = moisLabels[moisIndex];
        const service = review.service;
  
        if (!counts[moisLabel][service]) {
          counts[moisLabel][service] = {};
        }
  
        if (commerciauxParService[service]) {
          Object.entries(commerciauxParService[service]).forEach(([key, variations]) => {
            variations.forEach((variant) => {
              const normalizedVariant = normalizeText(variant);
              const regex = new RegExp(`\\b${normalizedVariant}\\b`, "i");
  
              if (regex.test(normalizedText) && !detectedCommercials.has(key)) {
                counts[moisLabel][service][key] = (counts[moisLabel][service][key] || 0) + 1;
                detectedCommercials.add(key);
              }
            });
          });
        }
      }
    });
  
    // Construire resultYears : un tableau avec pour chaque mois, la liste des services et leurs commerciaux
    const resultYears = moisLabels.map((mois) => {
      const servicesData = Object.entries(counts[mois]).map(([service, commerciaux]) => {
        const commerciauxAvecZero = Object.keys(commerciauxParService[service] || {}).map((label) => ({
          label,
          count: commerciaux[label] || 0
        }));
        return { service, commerciaux: commerciauxAvecZero };
      });
      return { mois, services: servicesData };
    });
  
    // Fusionner les résultats pour obtenir un total global par commercial (sur tous les services)
    const globalCounts = {};
    resultYears.forEach(({ services }) => {
      services.forEach(({ commerciaux }) => {
        commerciaux.forEach(({ label, count }) => {
          globalCounts[label] = (globalCounts[label] || 0) + count;
        });
      });
    });

  
    // Ici, globalCounts contient le total par commercial en appliquant la règle.
    // Vous pouvez renommer cette variable pour qu'elle corresponde à l'usage en aval.
    const totalAvisParCommercialParService = globalCounts;

    
    return { resultYears, totalAvisParCommercialParService };
  }, [filteredReviews, parseRelativeDate]);


  /**
   * Fonction pour récupérer les avis
   */
  const fetchReviews = useCallback(async () => {
    if (googleReviews.length > 0 && trustpilotReviews.length > 0) {
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/api/reviews");
      const googleReviewsData = Object.entries(response.data).flatMap(([service, data]) =>
          (data.reviews || []).map(review => ({
              ...review,
              service // Ajoute la clé `service` à chaque avis
          }))
      );

      const responseTrustpilot = await axios.get("http://localhost:5000/api/trustpilot");
      const trustpilotReviewsData = responseTrustpilot.data;

      const formattedTrustpilotReviews = Object.entries(trustpilotReviewsData).flatMap(([service, data]) =>
        (data.reviews || []).map(review => ({ ...review, service, source: "Trustpilot" })) 
      );
    
      const combinedReviews = [...googleReviewsData, ...formattedTrustpilotReviews];

      setGoogleReviews(googleReviewsData);
      setTruspilotReviews(trustpilotReviewsData);
      setReviews(combinedReviews);
      setTotalReviewsAPI(combinedReviews.length);

    } catch (error) {
        setError(error?.message || " Une erreur est survenue");
    } finally {
        setLoading(false);
        setRefresh(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && googleReviews.length === 0 && trustpilotReviews.length === 0) {
      fetchReviews();
    }
  }, [googleReviews, trustpilotReviews]);
  

  const refreshReviews = () => {
    setRefresh(true);
    fetchReviews();
  };
  useEffect(() => {
    if (reviews.length === 0) return; // Éviter d'exécuter si aucun avis n'est chargé
  
  
    // Initialisation des compteurs
    const countByService = {};
    const ratingSumByService = {};
    const ratingCountByService = {};
  
    // Extraire les avis Google et Trustpilot
    const googleReviewsArray = Array.isArray(googleReviews) 
      ? googleReviews 
      : Object.values(googleReviews).flatMap((data) => data.reviews || []);
  
    const trustpilotReviewsArray = Object.entries(trustpilotReviews).flatMap(([service, data]) => 
      (data.reviews || []).map(review => ({ ...review, service })) // Ajoute `service` manuellement
    );
  
    // Traiter les avis Google
    googleReviewsArray.forEach(({ service, rating }) => {
      if (!service || rating == null) return; // Accepte rating = 0
  
      if (!countByService[service]) {
        countByService[service] = { google: 0, trustpilot: 0 };
        ratingSumByService[service] = { google: 0, trustpilot: 0 };
        ratingCountByService[service] = { google: 0, trustpilot: 0 };
      }
  
      countByService[service].google += 1;
      ratingSumByService[service].google += rating;
      ratingCountByService[service].google += 1;
    });
  
    // Traiter les avis Trustpilot
    trustpilotReviewsArray.forEach(({ service, rating }) => {
      if (!service || rating == null) return;
  
      if (!countByService[service]) {
        countByService[service] = { google: 0, trustpilot: 0 };
        ratingSumByService[service] = { google: 0, trustpilot: 0 };
        ratingCountByService[service] = { google: 0, trustpilot: 0 };
      }
  
      countByService[service].trustpilot += 1;
      ratingSumByService[service].trustpilot += rating;
      ratingCountByService[service].trustpilot += 1;
    });
  
    // Calcul des moyennes
    const avgRatingByService = {};
    Object.keys(ratingSumByService).forEach((service) => {
      avgRatingByService[service] = {
        google: ratingCountByService[service].google
          ? (ratingSumByService[service].google / ratingCountByService[service].google).toFixed(1)
          : "0.0",
        trustpilot: ratingCountByService[service].trustpilot
          ? (ratingSumByService[service].trustpilot / ratingCountByService[service].trustpilot).toFixed(1)
          : "0.0",
      };
    });
  
    // Mettre à jour les états
    setReviewsCountByService(countByService);
    setAvgRatingByService(avgRatingByService);
  
  }, [reviews, googleReviews, trustpilotReviews]); // Ajout des dépendances

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
    reviewsCountByService,
    avgRatingByService,
    averageRatingLastTwoMonths,
    googleReviews,
    trustpilotReviews,
    setDisplayLimit,
    ratingsCountAllTime,
    commercialCountsYears
  };
};

export default useFetchReviews;

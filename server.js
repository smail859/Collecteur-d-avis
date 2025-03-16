const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let cachedReviews = null;
let lastFetchTime = 0;
const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 an

const CACHE_FILE = "./cache.json"; 

const apiKey = "";

// Liste des sites avec leur `data_id`
const sites = [
  { name: "Startloc", id: "0x479184d4eff4c4d7:0x7899f13a20c78918" },
  { name: "Monbien", id: "0x479184d502446031:0x3dc3354f518ad246" },
  { name: "Marketing automobile", id: "0x479185440a06d1e1:0x2391239b2b5d84b1" },
  { name: "Marketing immobilier", id: "0x47919b8544571e67:0x621ea08da3594e1e" },
  { name: "Pige Online", id: "0x47919b8544571e67:0x52e0eab98e405b90"}
];

// Fonction pour sauvegarder les avis en cache sur le disque
const saveCacheToFile = () => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ lastFetchTime, cachedReviews }, null, 2));
  console.log("Cache sauvegardé sur disque.");
};

// Fonction pour charger les avis depuis le cache du disque au démarrage
const loadCacheFromFile = () => {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      cachedReviews = data.cachedReviews;
      lastFetchTime = data.lastFetchTime;
      console.log("Cache rechargé depuis le fichier !");
    } catch (error) {
      console.error("Erreur lors du chargement du cache :", error);
    }
  }
};

// Charger le cache depuis le fichier au démarrage du serveur
loadCacheFromFile();

const fetchReviewsForSite = async (site) => {
  let allReviews = [];
  let nextPageToken = null;

  try {
    do {
      const params = {
        engine: "google_maps_reviews",
        data_id: site.id,
        hl: "fr",
        api_key: apiKey,
        reviews_limit: 300, 
      };

      if (nextPageToken) {
        params.next_page_token = nextPageToken;
      }

      const json = await new Promise((resolve, reject) => {
        getJson(params, (result) => {
          if (result.error) {
            return reject(result.error);
          }
          resolve(result);
        });
      });

      // Ajoute les nouveaux avis récupérés
      if (json.reviews) {
        allReviews = [...allReviews, ...json.reviews];
      }

      // Met à jour le nextPageToken pour continuer
      nextPageToken = json.serpapi_pagination?.next_page_token || null;

    } while (nextPageToken); // Continue tant qu'il y a une page suivante

    console.log(`Site: ${site.name} - Avis récupérés: ${allReviews.length}`);

    return {
      site: site.name,
      data_id: site.id,
      reviews: allReviews,
    };
  } catch (error) {
    console.error(`Erreur pour ${site.name} :`, error);
    return { site: site.name, error };
  }
};

// Route API pour récupérer les avis de tous les services
app.get("/api/reviews", async (req, res) => {
  try {
    const now = Date.now();

    // Si les avis sont déjà en cache et pas trop vieux, on les renvoie sans requêter SerpAPI
    if (cachedReviews && now - lastFetchTime < CACHE_DURATION) {
      console.log("Récupération des avis depuis le cache !");
      console.log("Contenu du cache actuel :", cachedReviews);
      console.log("Temps écoulé depuis le dernier fetch :", now - lastFetchTime);

      return res.json(cachedReviews);
    }

    console.log("Cache expiré, récupération des avis depuis SerpAPI...");
    const reviewsPromises = sites.map((site) => fetchReviewsForSite(site));

    const allReviews = await Promise.allSettled(reviewsPromises);

    // Organiser les avis par site
    const reviewsBySite = {};
    allReviews.forEach((result) => {
      if (result.status === "fulfilled") {
        reviewsBySite[result.value.site] = {
          data_id: result.value.data_id,
          reviews: result.value.reviews,
        };
      } else {
        reviewsBySite[result.reason.site] = { error: result.reason.error };
      }
    });

    // Met à jour le cache
    cachedReviews = reviewsBySite;
    lastFetchTime = now;

    // Sauvegarde le cache sur disque
    saveCacheToFile();

    // Log du total
    const totalReviews = Object.values(reviewsBySite).reduce(
      (acc, site) => acc + (site.reviews ? site.reviews.length : 0),
      0
    );
    console.log(`Nombre total d'avis récupérés et mis en cache : ${totalReviews}`);

    res.json(reviewsBySite);
  } catch (error) {
    res.status(500).json({ error: "❌ Erreur lors de la récupération des avis." });
  }
});

// Simuler une réponse de l'API Trustpilot avec notes moyennes
app.get("/api/trustpilot", (req, res) => {
  const fakeTrustpilotReviews = {
    "Sinimo": {
      reviews: [
        { id: "1", rating: 5, date: "15 févr. 2025", text: "Excellent service, Smail a assuré !" },
        { id: "2", rating: 4, date: "15 févr. 2025", text: "Service de qualité, Smail est très professionnel." },
        { id: "3", rating: 5, date: "15 févr. 2025", text: "Je recommande, Smail est au top !" },
        { id: "4", rating: 4, date: "15 févr. 2025", text: "Très bon service, merci Smail." },
        { id: "5", rating: 5, date: "15 févr. 2025", text: "Smail a rendu mon expérience inoubliable." },
        { id: "6", rating: 4, date: "15 févr. 2025", text: "Service rapide et efficace, bravo Smail !" },
        { id: "7", rating: 5, date: "15 févr. 2025", text: "Merci à Anaïs pour ce service impeccable." },
        { id: "8", rating: 4, date: "15 févr. 2025", text: "Très satisfait, Smail a fait un excellent travail." },
        { id: "9", rating: 5, date: "15 févr. 2025", text: "Un service exceptionnel, Smail est vraiment professionnel." },
        { id: "10", rating: 4, date: "15 févr. 2025", text: "Je suis très content, Smail a tout géré parfaitement." }
      ],
      avgRating: 4.5,
    },
    "Pige Online": {
      reviews: [
        { id: "1", rating: 2, date: "15 févr. 2025", text: "Expérience mitigée, Smail n'a pas été à la hauteur." },
        { id: "2", rating: 3, date: "15 févr. 2025", text: "Service moyen, Smail a fait son possible." },
        { id: "3", rating: 2, date: "15 févr. 2025", text: "Pas satisfait, Smail aurait pu mieux faire." },
        { id: "4", rating: 3, date: "15 févr. 2025", text: "Expérience passable, merci Smail pour l'effort." },
        { id: "5", rating: 2, date: "15 févr. 2025", text: "Décevant, Smail n'a pas répondu à mes attentes." },
        { id: "6", rating: 3, date: "15 févr. 2025", text: "Service correct, Smail est compétent." },
        { id: "7", rating: 2, date: "15 févr. 2025", text: "Bof, Smail n'a pas été très réactif." },
        { id: "8", rating: 3, date: "15 févr. 2025", text: "Smail a tenté de faire au mieux, service moyen." },
        { id: "9", rating: 2, date: "15 févr. 2025", text: "Mauvaise expérience, Smail a laissé à désirer." },
        { id: "10", rating: 3, date: "15 févr. 2025", text: "Expérience mitigée, Smail a essayé de s'améliorer." }
      ],
      avgRating: 2.5,
    },
  };

  console.log("Simulation API Trustpilot - Avis et notes :", fakeTrustpilotReviews);
  res.json(fakeTrustpilotReviews);
});


// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

 


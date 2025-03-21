// -------------------------
// Import des dépendances
// -------------------------
const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

// -------------------------
// Initialisation serveur
// -------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// -------------------------
// Vérification des variables d'environnement
// -------------------------
const requiredEnv = ["MONGO_URI", "SERPAPI_KEY", "PORT"];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Erreur : La variable d'environnement ${env} est manquante.`);
    process.exit(1);
  }
});

// -------------------------
// Schémas Mongoose
// -------------------------
const reviewSchema = new mongoose.Schema({
  review_id: { type: String, unique: true },
  data_id: String,
  site: String,
  link: String,
  rating: Number,
  snippet: String,
  iso_date: Date,
  iso_date_of_last_edit: Date,
  date: String,
  source: String,
  likes: Number,
  user: {
    name: String,
    link: String,
    contributor_id: String,
    thumbnail: String,
    reviews: Number,
    photos: Number,
  },
});

const updateLogSchema = new mongoose.Schema({
  updatedAt: { type: Date, default: Date.now },
});


// Validation de la note
reviewSchema.path("rating").validate(
  (value) => value >= 1 && value <= 5,
  "La note doit être comprise entre 1 et 5."
);


// -------------------------
// Modèles Mongoose
// -------------------------
const Review = mongoose.model("Review", reviewSchema);
const UpdateLog = mongoose.model("UpdateLog", updateLogSchema);

// -------------------------
// Liste des sites à surveiller
// -------------------------
const sites = [
  { name: "Startloc", id: "0x479184d4eff4c4d7:0x7899f13a20c78918" },
  { name: "Monbien", id: "0x479184d502446031:0x3dc3354f518ad246" },
  { name: "Marketing automobile", id: "0x479185440a06d1e1:0x2391239b2b5d84b1" },
  { name: "Marketing immobilier", id: "0x47919b8544571e67:0x621ea08da3594e1e" },
  { name: "Pige Online", id: "0x47919b8544571e67:0x52e0eab98e405b90" },
];

const CHECK_INTERVAL_DAYS = 2;

// -------------------------
// Vérifie s'il faut mettre à jour
// -------------------------
const shouldUpdateReviews = async () => {
  const lastLog = await UpdateLog.findOne().sort({ updatedAt: -1 });
  console.log("Dernière mise à jour enregistrée :", lastLog); // Ajoute ce log
  if (!lastLog) return true;

  const now = new Date();
  const diffDays = (now - lastLog.updatedAt) / (1000 * 60 * 60 * 24);
  console.log("Jours écoulés depuis la dernière mise à jour :", diffDays); // Ajoute ce log

  return diffDays >= CHECK_INTERVAL_DAYS;
};

// -------------------------
// Delay helper
// -------------------------
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// -------------------------
// Récupération des avis SerpAPI
// -------------------------
const fetchReviewsForSite = async (site) => {
  let allReviews = [];
  let nextPageToken = null;
  let retries = 3;

  try {
    do {
      const params = {
        engine: "google_maps_reviews",
        data_id: site.id,
        hl: "fr",
        api_key: process.env.SERPAPI_KEY,
        reviews_limit: 50,
      };
      if (nextPageToken) params.next_page_token = nextPageToken;

      let json;
      for (let i = 0; i < retries; i++) {
        try {
          json = await new Promise((resolve, reject) => {
            getJson(params, (result) => {
              if (result.error) reject(result.error);
              else resolve(result);
            });
          });
          break;
        } catch (err) {
          console.warn(`Tentative ${i + 1} échouée pour ${site.name}: ${err}`);
          await delay(2000);
        }
      }

      if (!json || !json.reviews) break;

      const existingReviewIds = new Set(
        (await Review.find({ review_id: { $in: json.reviews.map((r) => r.review_id) } })).map((r) => r.review_id)
      );

      const newReviews = json.reviews
        .filter((r) => !existingReviewIds.has(r.review_id))
        .map((review) => ({
          review_id: review.review_id,
          data_id: site.id,
          site: site.name,
          link: review.link,
          rating: review.rating,
          snippet: review.snippet,
          iso_date: new Date(review.iso_date),
          iso_date_of_last_edit: new Date(review.iso_date_of_last_edit || review.iso_date),
          date: review.date || "",
          source: review.source,
          likes: review.likes || 0,
          user: {
            name: review.user.name,
            link: review.user.link,
            contributor_id: review.user.contributor_id,
            thumbnail: review.user.thumbnail,
            reviews: review.user.reviews || 0,
            photos: review.user.photos || 0,
          },
        }));

      if (newReviews.length > 0) {
        await Review.insertMany(newReviews, { ordered: false }).catch(() => {});
        console.log(`${newReviews.length} nouveaux avis ajoutés pour ${site.name}`);
      } else {
        console.log(`Aucun nouvel avis à insérer pour ${site.name}`);
      }

      allReviews = [...allReviews, ...newReviews];
      nextPageToken = json.serpapi_pagination?.next_page_token || null;
      if (nextPageToken) await delay(2000);
    } while (nextPageToken);

    return { site: site.name, reviews: allReviews };
  } catch (error) {
    console.error(`Erreur pour ${site.name} :`, error.message);
    return { site: site.name, error: error.message };
  }
};

// -------------------------
// Mise à jour globale
// -------------------------
const updateLatestReviews = async () => {
  console.log("🔄 Vérification des nouveaux avis...");

  await Promise.all(
    sites.map(async (site) => {
      try {
        const latestReviews = await Review.find({ site: site.name }).sort({ iso_date: -1 }).limit(10);
        const existingReviewIds = new Set(latestReviews.map((r) => r.review_id));

        const json = await new Promise((resolve, reject) => {
          getJson(
            {
              engine: "google_maps_reviews",
              data_id: site.id,
              hl: "fr",
              api_key: process.env.SERPAPI_KEY,
              reviews_limit: 10,
            },
            (result) => {
              if (result.error) reject(result.error);
              else resolve(result);
            }
          );
        });

        const newReviews = json.reviews
          .filter((r) => !existingReviewIds.has(r.review_id))
          .map((review) => ({
            review_id: review.review_id,
            data_id: site.id,
            site: site.name,
            link: review.link,
            rating: review.rating,
            snippet: review.snippet,
            iso_date: new Date(review.iso_date),
            iso_date_of_last_edit: new Date(review.iso_date_of_last_edit || review.iso_date),
            date: review.date || "",
            source: review.source,
            likes: review.likes || 0,
            user: {
              name: review.user.name,
              link: review.user.link,
              contributor_id: review.user.contributor_id,
              thumbnail: review.user.thumbnail,
              reviews: review.user.reviews || 0,
              photos: review.user.photos || 0,
            },
          }));

        if (newReviews.length > 0) {
          await Review.insertMany(newReviews, { ordered: false });
          console.log(`${newReviews.length} nouveaux avis ajoutés pour ${site.name}`);
        } else {
          console.log(`Aucun nouvel avis pour ${site.name}`);
        }
      } catch (error) {
        console.error(`Erreur de mise à jour pour ${site.name} :`, error.message);
      }
    })
  );

  await UpdateLog.findOneAndUpdate({}, { updatedAt: new Date() }, { upsert: true });
  console.log("Date de dernière mise à jour enregistrée.");
};


// -------------------------
// Routes API
// -------------------------

// GET /api/reviews
app.get("/api/reviews", async (req, res) => {
  try {
    console.log("Récupération des avis depuis la base de données...");
    const dbReviews = await Review.find();

    if (dbReviews.length > 0) {
      console.log("Données trouvées en base, envoi des avis !");
      const groupedReviews = dbReviews.reduce((acc, review) => {
        if (!acc[review.site]) acc[review.site] = { 
          data_id: review.data_id, 
          reviews: [] 
        };
        acc[review.site].reviews.push(review);
        return acc;
      }, {});

      return res.json(groupedReviews);
    }

    console.log("Aucun avis trouvé en base, récupération depuis SerpAPI...");
    const reviewsPromises = sites.map(fetchReviewsForSite);
    const allReviews = await Promise.all(reviewsPromises);

    const newReviews = allReviews.flatMap(r => r.reviews);
    
    if (newReviews.length > 0) {
      await Review.insertMany(newReviews, { ordered: false });
      console.log(`${newReviews.length} avis ajoutés en base !`);
    }

    const groupedReviews = newReviews.reduce((acc, review) => {
      if (!acc[review.site]) acc[review.site] = { 
        data_id: review.data_id, 
        reviews: [] 
      };
      acc[review.site].reviews.push(review);
      return acc;
    }, {});

    res.json(groupedReviews);
  } catch (error) {
    console.error("Erreur API /api/reviews :", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des avis." });
  }
});

app.get("/api/trustpilot", (req, res) => {
  const fakeTrustpilotReviews = {
    "Sinimo": {
      reviews: [
        { id: "1", rating: 5, date: "il y a 1 mois", text: "Excellent service, Arnaud a assuré !" },
        { id: "2", rating: 4, date: "30 févr. 2025", text: "Service de qualité, est très professionnel." },
        { id: "3", rating: 5, date: "15 févr. 2025", text: "Je recommande, est au top !" },
        { id: "4", rating: 4, date: "15 févr. 2025", text: "Très bon service, merci." },
        { id: "5", rating: 5, date: "15 févr. 2025", text: " Mon expérience inoubliable." },
        { id: "6", rating: 4, date: "15 févr. 2025", text: "Service rapide et efficace, bravo !" },
        { id: "7", rating: 5, date: "15 févr. 2025", text: "Merci à pour ce service impeccable." },
        { id: "8", rating: 4, date: "15 févr. 2025", text: "Très satisfait, a fait un excellent travail." },
        { id: "9", rating: 5, date: "15 févr. 2025", text: "Un service exceptionnel, est vraiment professionnel." },
        { id: "10", rating: 4, date: "15 févr. 2025", text: "Je suis très content, a tout géré parfaitement." }
      ],
      avgRating: 4.5,
    },
    "Pige Online": {
      reviews: [
        { id: "1", rating: 2, date: "15 févr. 2025", text: "Expérience mitigée, n'a pas été à la hauteur." },
        { id: "2", rating: 3, date: "15 févr. 2025", text: "Service moyen, a fait son possible." },
        { id: "3", rating: 2, date: "15 févr. 2025", text: "Pas satisfait, aurait pu mieux faire." },
        { id: "4", rating: 3, date: "15 févr. 2025", text: "Expérience passable, merci pour l'effort." },
        { id: "5", rating: 2, date: "15 févr. 2025", text: "Décevant, n'a pas répondu à mes attentes." },
        { id: "6", rating: 3, date: "15 févr. 2025", text: "Service correct, est compétent." },
        { id: "7", rating: 2, date: "15 févr. 2025", text: "Bof, n'a pas été très réactif." },
        { id: "8", rating: 3, date: "15 févr. 2025", text: " a tenté de faire au mieux, service moyen." },
        { id: "9", rating: 2, date: "15 févr. 2025", text: "Mauvaise expérience, a laissé à désirer." },
        { id: "10", rating: 3, date: "15 févr. 2025", text: "Expérience mitigée, a essayé de s'améliorer." }
      ],
      avgRating: 2.5,
    },
  };

  res.json(fakeTrustpilotReviews);
});



// GET /api/force-update
app.get("/api/force-update", async (req, res) => {
  try {
    await updateLatestReviews();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------
// Démarrage du serveur
// -------------------------
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Vérifier s'il faut faire une màj dès le démarrage
    if (await shouldUpdateReviews()) {
      console.log("📌 Mise à jour nécessaire au démarrage");
      await updateLatestReviews();
    } else {
      console.log("Dernière mise à jour récente, pas besoin au démarrage.");
    }

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erreur MongoDB :", err.message);
    process.exit(1);
  }
};


startServer();

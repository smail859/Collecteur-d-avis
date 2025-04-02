// -------------------------
// Import des dépendances
// -------------------------
const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cache = require('memory-cache');
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




//-------------------------
// Connexion à memory-cache
//-------------------------
const cacheDuration = 1000 * 60 * 60 * 24 * 2;  // 2 jours en millisecondes

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
  if (!lastLog) return true;

  const now = new Date();
  const diffDays = (now - lastLog.updatedAt) / (1000 * 60 * 60 * 24);

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

  if (!site || !site.id) {
    console.warn(`⛔ Site mal formé : ${site?.name}`);
    return { site: site.name, reviews: [] };
  }
  

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
          try {
            json = await new Promise((resolve, reject) => {
              getJson(params, (result) => {
                if (result.error) reject(result.error);
                else resolve(result);
              });
            });
          } catch (err) {
            console.warn(`❌ Erreur SerpAPI pour ${site.name} : ${err.error || err}`);
            break; // sortir de la boucle si quota dépassé ou autre erreur bloquante
          }          
          break;
        } catch (err) {
          console.warn(`Tentative ${i + 1} échouée pour ${site.name}: ${err}`);
          await delay(2000);
        }
      }
      if (!json || !json.reviews) {
        console.warn(`⚠️ Pas d'avis trouvés pour ${site.name}. Peut-être quota dépassé ?`);
        break;
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

// Script pour mettre à jour les dates des avis enregistrées dans la base de données MongoDB en fonction de la date ISO stockée dans le champ `iso_date`.
const parseValidDate = (d) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date;
};

const formatRelativeDate = (date) => {
  const now = new Date(); // Date actuelle
  const diffInMs = now - date; // Différence en millisecondes entre maintenant et la date passée
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // En minutes
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // En heures
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // En jours

  // Cas : moins d'une minute
  if (diffInMinutes < 1) return "à l'instant";

  // Cas : moins d'une heure → afficher en minutes
  if (diffInMinutes < 60) return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;

  // Cas : moins d'un jour → afficher en heures
  if (diffInHours < 24) return `il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;

  // Cas : exactement 1 jour
  if (diffInDays === 1) return "il y a 1 jour";

  // Cas : moins d'une semaine → afficher en jours
  if (diffInDays < 7) return `il y a ${diffInDays} jours`;

  // Cas : entre 7 et 13 jours
  if (diffInDays < 14) return "il y a une semaine";

  // Cas : entre 14 et 20 jours
  if (diffInDays < 21) return "il y a 2 semaines";

  // Cas : entre 21 et 27 jours
  if (diffInDays < 28) return "il y a 3 semaines";

  // Cas : entre 28 et 34 jours → arrondi à "1 mois"
  if (diffInDays < 35) return "il y a 1 mois";

  // Calcul du nombre de mois
  const diffInMonths = Math.floor(diffInDays / 30);

  // Cas : moins de 12 mois → afficher en mois
  if (diffInMonths < 12) return `il y a ${diffInMonths} mois`;

  // Calcul du nombre d'années (arrondi bas)
  const diffInYears = Math.floor(diffInDays / 365);

  // Cas particulier : si moins d’un an (mais plus de 12 mois) → forcer "il y a 1 an"
  if (diffInYears < 1) return "il y a 1 an";

  // Cas : 2 ans et plus → afficher en années
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

// Toutes les 24h (en ms) → 1000 * 60 * 60 * 24
const ONE_DAY = 1000 * 60 * 60 * 24;

setInterval(() => {
  console.log("Mise à jour des dates relatives des avis...");
  updateDates();
}, ONE_DAY);

updateDates();

// -------------------------
// Mise à jour globale
// -------------------------

const updateLatestReviews = async () => {
  console.log("Vidage du cache avant mise à jour des avis...");
  cache.clear(); 
  console.log("Cache vidé.");

  const newReviewIds = new Set();

  await Promise.all(
    sites.map(async (site) => {
      try {
        const latestReviews = await Review.find({ site: site.name })
          .sort({ iso_date: -1 })
          .limit(10);

        const existingMap = new Map(latestReviews.map((r) => [r.review_id, r]));

        const json = await new Promise((resolve, reject) => {
          getJson(
            {
              engine: "google_maps_reviews",
              data_id: site.id,
              hl: "fr",
              api_key: process.env.SERPAPI_KEY,
              reviews_limit: 20,
              sort_by: "newestFirst"
            },
            (result) => {
              if (result.error) reject(result.error);
              else resolve(result);
            }
          );
        });
        

        let newReviews = [];

        for (const review of json.reviews) {
          const baseDate = parseValidDate(review.iso_date);
          const adjustedDate = new Date(baseDate); // pas de décalage ici

          const reviewDoc = {
            review_id: review.review_id,
            data_id: site.id,
            site: site.name,
            link: review.link,
            rating: review.rating,
            snippet: review.snippet,
            iso_date: adjustedDate,
            iso_date_of_last_edit: parseValidDate(review.iso_date_of_last_edit || review.iso_date),
            date: formatRelativeDate(adjustedDate),
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
          };

          const existing = existingMap.get(review.review_id);

          if (!existing) {
            newReviews.push(reviewDoc);
            newReviewIds.add(review.review_id);
            console.log(`Nouvel avis ajouté : ${review.review_id} (${site.name})`);
          } else {
            const changes = [];
          
            if (existing.snippet !== review.snippet) {
              changes.push(`snippet: "${existing.snippet}" => "${review.snippet}"`);
            }
          
            if (existing.likes !== review.likes) {
              changes.push(`likes: ${existing.likes} => ${review.likes}`);
            }
          
            if (
              existing.iso_date_of_last_edit.getTime() !==
              reviewDoc.iso_date_of_last_edit.getTime()
            ) {
              changes.push(
                `iso_date_of_last_edit: ${existing.iso_date_of_last_edit.toISOString()} => ${reviewDoc.iso_date_of_last_edit.toISOString()}`
              );
            }
          
            if (
              existing.iso_date.getTime() !== reviewDoc.iso_date.getTime()
            ) {
              changes.push(
                `iso_date: ${existing.iso_date.toISOString()} => ${reviewDoc.iso_date.toISOString()}`
              );
            }
          
            const shouldUpdate = changes.length > 0;
          
            await Review.updateOne(
              { review_id: review.review_id },
              shouldUpdate ? reviewDoc : { iso_date: reviewDoc.iso_date, date: reviewDoc.date }
            );
          
            if (shouldUpdate) {
              console.log(`Avis mis à jour complètement : ${review.review_id} (${site.name})`);
              changes.forEach(change => console.log(`   └─ ${change}`));
            } else {
              console.log(`Avis inchangé, date recalculée : ${review.review_id} (${site.name})`);
            }
          }
          
        }


        if (newReviews.length > 0) {
          const newIds = newReviews.map((r) => r.review_id);
          const alreadyInDb = await Review.find({ review_id: { $in: newIds } }).select("review_id");
          const existingIds = new Set(alreadyInDb.map((r) => r.review_id));
          const trulyNew = newReviews.filter((r) => !existingIds.has(r.review_id));

          if (trulyNew.length > 0) {
            try {
              await Review.insertMany(trulyNew, { ordered: false });
              console.log(`✔️ ${trulyNew.length} avis insérés avec succès dans la BDD.`);
            } catch (err) {
              console.error("❌ Erreur d'insertion MongoDB : ", err.message);
          
              if (err.writeErrors && Array.isArray(err.writeErrors)) {
                err.writeErrors.forEach((e, index) => {
                  console.error(`   [Erreur #${index + 1}] ${e.errmsg || e.message}`);
                  console.error(`   → Avis concerné : ${JSON.stringify(e.getOperation(), null, 2)}`);
                });
              }
            }
          }
          
          
        }

        console.log(`${newReviews.length} nouveaux avis ajoutés pour ${site.name}`);
      } catch (error) {
        console.error(`Erreur de mise à jour pour ${site.name} :`, error.message);
      }
    })
  );
  // Mettre à jour le cache
  console.log("Mise à jour du cache avec les nouveaux avis...");
  const updatedReviews = await Review.find();
  const groupedReviews = updatedReviews.reduce((acc, review) => {
    if (!acc[review.site]) acc[review.site] = {
      data_id: review.data_id,
      reviews: [],
    };
    acc[review.site].reviews.push(review);
    return acc;
  }, {});
  cache.put("reviews", groupedReviews, cacheDuration);
  console.log("Cache mis à jour.");

  // Log de dernière mise à jour
  await UpdateLog.findOneAndUpdate({}, { updatedAt: new Date() }, { upsert: true });
};


// -------------------------
// Routes API
// -------------------------

// GET /api/reviews
app.get("/api/reviews", async (req, res) => {
  try {
    // Vérifier si les avis sont dans le cache
    const cacheKey = "reviews";
    // Vérifier si les avis sont dans le cache
    const cachedReviews = cache.get(cacheKey);

    if (cachedReviews && Object.keys(cachedReviews).length > 0) {
      console.log("Utilisation du cache pour les avis");
      return res.json(cachedReviews); // Retourner les avis du cache
    } else {
      console.log("Le cache est vide ou mal formé.");
    }


    // Si pas dans le cache, récupérer les avis depuis la base de données ou SerpAPI
    const dbReviews = await Review.find();

    let reviewsToReturn = [];
    if (Array.isArray(dbReviews) && dbReviews.length > 0) {
      const groupedReviews = dbReviews.reduce((acc, review) => {
        if (!acc[review.site]) acc[review.site] = { 
          data_id: review.data_id, 
          reviews: [] 
        };
        acc[review.site].reviews.push(review);
        return acc;
      }, {});
    
      reviewsToReturn = groupedReviews;
    } else {
      console.log("Aucun avis trouvé dans la base de données. Récupération depuis SerpAPI...");
      const reviewsPromises = sites.map(fetchReviewsForSite);
      const allReviews = await Promise.all(reviewsPromises);
      const newReviews = allReviews.flatMap(r => r.reviews);
    
      if (newReviews && newReviews.length > 0) {
        await Review.insertMany(newReviews, { ordered: false });
      }
    
      const groupedReviews = newReviews.reduce((acc, review) => {
        if (!acc[review.site]) acc[review.site] = { 
          data_id: review.data_id, 
          reviews: [] 
        };
        acc[review.site].reviews.push(review);
        return acc;
      }, {});
    
      reviewsToReturn = groupedReviews;
    }
    
    // Mettre les avis dans le cache pour 2 jours
    cache.put(cacheKey, reviewsToReturn, cacheDuration);

    res.json(reviewsToReturn);
  } catch (error) {
    console.error("Erreur API /api/reviews :", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des avis." });
  }
});


app.get("/api/trustpilot", (req, res) => {
  const fakeTrustpilotReviews = {
    "Sinimo": {
      reviews: [
        { id: "1", rating: 5, date: "il y a 1 heure", text: "Excellent service, Arnaud a assuré !" },
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
        { id: "1", rating: 2, date: "3 mars 2025", text: "Expérience mitigée, n'a pas été à la hauteur." },
        { id: "2", rating: 3, date: "23 mars 2025", text: "Service moyen, a fait son possible." },
        { id: "3", rating: 2, date: "30 mars 2025", text: "Pas satisfait, aurait pu mieux faire." },
        { id: "4", rating: 3, date: "31 mars 2025", text: "Expérience passable, merci pour l'effort." },
        { id: "5", rating: 2, date: "13 mars 2025", text: "Décevant, n'a pas répondu à mes attentes." },
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

app.get("/api/debug-review/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findOne({ review_id: id });

    if (!review) {
      return res.status(404).json({
        exists: false,
        message: `❌ Aucun avis trouvé avec l'ID ${id}`,
      });
    }

    return res.json({
      exists: true,
      message: `✅ Avis trouvé pour l'ID ${id}`,
      review,
    });
  } catch (err) {
    console.error("❌ Erreur debug-review :", err.message);
    return res.status(500).json({
      error: "Erreur lors de la recherche de l'avis.",
    });
  }
});


app.get("/api/debug-site/:site", async (req, res) => {
  const { site } = req.params;

  try {
    const reviews = await Review.find({ site });

    if (reviews.length === 0) {
      return res.status(404).json({
        exists: false,
        message: `❌ Aucun avis trouvé pour le site ${site}`,
      });
    }

    return res.json({
      exists: true,
      count: reviews.length,
      message: `${reviews.length} avis trouvés pour le site ${site}`,
      reviews,
    });
  } catch (err) {
    console.error("❌ Erreur debug-site :", err.message);
    return res.status(500).json({
      error: "Erreur lors de la recherche des avis.",
    });
  }
});

// GET /api/debug-dates
app.get("/api/debug-dates", async (req, res) => {
  try {
    const reviews = await Review.find();

    const inconsistencies = reviews.filter((r) => {
      const expectedDate = formatRelativeDate(r.iso_date);
      return r.date !== expectedDate;
    });

    res.json({
      count: inconsistencies.length,
      message: `${inconsistencies.length} avis avec une incohérence entre 'date' et 'iso_date'`,
      reviews: inconsistencies,
    });
  } catch (err) {
    console.error("❌ Erreur debug-dates :", err.message);
    res.status(500).json({ error: "Erreur lors de la vérification des dates." });
  }
});




app.get("/", (req, res) => {
  res.send("API Reviews opérationnelle !");
});

// -------------------------
// Démarrage du serveur
// -------------------------
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Vérifier s'il faut faire une màj dès le démarrage
    if (await shouldUpdateReviews()) {
      console.log("Mise à jour automatique au démarrage...");
      try {
        await updateLatestReviews();
      } catch (err) {
        console.error("⚠️ Erreur pendant la mise à jour auto :", err.message || err);
      }
    } else {
      console.log("Pas besoin de mise à jour au démarrage.");
    }
    
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erreur MongoDB :", err.message);
    process.exit(1);
  }
};


startServer();
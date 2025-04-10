// -------------------------
// Import des dépendances
// -------------------------
const express = require("express");
const cors = require("cors");

const { getJson } = require("serpapi");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cache = require('memory-cache');
const scrapeTrustpilot = require("./scrapeTrustpilot");
require("dotenv").config();
const { Review, UpdateLog, UpdateLogTrustpilot  } = require("./model");

// Juste après tes imports et avant de démarrer le serveur
const createCollectionsIfNotExist = async () => {
  try {
    await UpdateLog.createCollection();
    await UpdateLogTrustpilot.createCollection();
  } catch (err) {
    console.error("Erreur lors de la création des collections :", err);
  }
};

createCollectionsIfNotExist();


const handledErrors = new Set();

process.on("unhandledRejection", (reason) => {
  const stringified = JSON.stringify(reason);
  if (!handledErrors.has(stringified)) {
    console.error("Unhandled Rejection détecté :", reason);
    handledErrors.add(stringified);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception :", err);
});


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
    console.error(`Erreur : La variable d'environnement ${env} est manquante.`);
    process.exit(1);
  }
});


//-------------------------
// Connexion à memory-cache
//-------------------------
const cacheDuration = 1000 * 60 * 60 * 24 * 2;  // 2 jours en millisecondes

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

const trustpilotSites = [
  { name: "Pige Online", url: "https://fr.trustpilot.com/review/pige-online.fr" },
  { name: "Startloc", url: "https://fr.trustpilot.com/review/www.startloc.fr" },
  { name: "Marketing immobilier", url: "https://fr.trustpilot.com/review/www.marketing-immo.fr" },
  { name: "Monbien", url: "https://fr.trustpilot.com/review/monbien.fr" },
  { name: "Sinimo", url: "https://fr.trustpilot.com/review/sinimo.fr" },
];


// -------------------------
// Intervalle de vérification en jours
// -------------------------
const CHECK_INTERVAL_DAYS = 2;

// -------------------------
// Vérifie s'il faut mettre à jour
// -------------------------
const shouldUpdateReviewsTrustpilot = async () => {
  const now = new Date();

  const lastLogTrustpilot = await UpdateLogTrustpilot.findOne().sort({ updatedAt: -1 });

  const diffTrustpilot = lastLogTrustpilot ? (now - lastLogTrustpilot.updatedAt) / (1000 * 60 * 60 * 24) : Infinity;

  return diffTrustpilot >= CHECK_INTERVAL_DAYS;
};

const shouldUpdateReviews = async () => {
  const now = new Date();

  const lastLog = await UpdateLog.findOne().sort({ updatedAt: -1 });
  const lastLogTrustpilot = await UpdateLogTrustpilot.findOne().sort({ updatedAt: -1 });

  const diffGoogle = lastLog ? (now - lastLog.updatedAt) / (1000 * 60 * 60 * 24) : Infinity;
  const diffTrustpilot = lastLogTrustpilot ? (now - lastLogTrustpilot.updatedAt) / (1000 * 60 * 60 * 24) : Infinity;

  return diffGoogle >= CHECK_INTERVAL_DAYS || diffTrustpilot >= CHECK_INTERVAL_DAYS;
};



// -------------------------
// Delay helper
// -------------------------
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// -------------------------
// Mise à jour du cache
// -------------------------
const updateCache = async () => {
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
};


// -------------------------
// Récupération des avis SerpAPI
// -------------------------
const fetchReviewsForSite = async (site) => {
  let allReviews = [];
  let nextPageToken = null;
  let retries = 3;

  if (!site || !site.id) {
    console.warn(`Site mal formé : ${site?.name}`);
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


      let json = null;
      for (let i = 0; i < retries; i++) {
        try {
          json = await new Promise((resolve, reject) => {
            getJson(params, (result) => {
              if (result.error) return reject(new Error(result.error));
              resolve(result);
            });
          });
        } catch (err) {
          console.warn(`Erreur lors de l’appel SerpAPI pour ${site.name} : ${err.message}`);
          return; // on sort proprement de la boucle sans crash
        }
      }
      if (!json || !json.reviews) {
        console.warn(`Pas d'avis trouvés pour ${site.name}. Peut-être quota dépassé ?`);
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

// -------------------------
// Il s'agit d'une tâche de maintenance qui s'exécute toutes les 24 heures pour 
// s'assurer que les dates affichées soient toujours à jour et cohérentes avec la date actuelle.
// -------------------------
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

// -------------------------
// Mise à jour des dates
// -------------------------
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

// ---------------------------
// Lancer la mise à jour des dates toutes les 24 heures
// ---------------------------
setInterval(() => {
  console.log("Mise à jour des dates relatives des avis...");
  updateDates();
}, ONE_DAY);

updateDates();

// -------------------------
// Mise à jour globale
// -------------------------
const updateLatestReviews = async () => {
  const newReviewIds = new Set();

  // --- Mise à jour Google Maps ---
  const results = await Promise.allSettled(
    sites.map(async (site) => {
      try {
        const latestReviews = await Review.find({ site: site.name })
          .sort({ iso_date: -1 })
          .limit(10);

        const existingMap = new Map(latestReviews.map((r) => [r.review_id, r]));

        let json;
        try {
          json = await new Promise((resolve, reject) => {
            getJson(
              {
                engine: "google_maps_reviews",
                data_id: site.id,
                hl: "fr",
                api_key: process.env.SERPAPI_KEY,
                reviews_limit: 20,
                sort_by: "newestFirst",
              },
              (result) => {
                if (result.error) {
                  reject(new Error(result.error));
                } else {
                  resolve(result);
                }
              }
            );
          });
        } catch (err) {
          console.error(`Erreur SERPAPI pour ${site.name} : ${err.message}`);
          throw err;
        }

        if (!json?.reviews || !Array.isArray(json.reviews)) {
          console.warn(`Données invalides pour ${site.name}`);
          return;
        }

        let newReviews = [];

        for (const review of json.reviews) {
          const baseDate = parseValidDate(review.iso_date);
          const adjustedDate = new Date(baseDate);

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

            if (existing.iso_date.getTime() !== reviewDoc.iso_date.getTime()) {
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
              changes.forEach((change) => console.log(`   └─ ${change}`));
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
              console.log(`${trulyNew.length} avis insérés avec succès dans la BDD.`);
            } catch (err) {
              console.error("Erreur d'insertion MongoDB : ", err.message);
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
        throw error; // important pour allSettled
      }
    })

  );

  const hasError = results.some((r) => r.status === "rejected");

  console.log("----- Fin de la mise à jour Google Maps -----\n");

  if (hasError) throw new Error("Une ou plusieurs erreurs pendant la mise à jour Google.");
  // Mettre à jour le cache
  await updateCache();

  await UpdateLog.findOneAndUpdate({}, { updatedAt: new Date() }, { upsert: true });
  console.log("Date de dernière mise à jour Google enregistrée.");
};

// -------------------------
// Mise à jour des avis Trustpilot
// -------------------------
// Cette fonction est appelée par le cron job et par l'API
const updateLatestReviewsTrustpilot = async () => {

  console.log("Vidage du cache avant mise à jour des avis...");
  cache.clear(); 
  console.log("Cache vidé.");

  // --- Scraping Trustpilot ---
  console.log("Mise à jour des avis Trustpilot...");

  for (const tp of trustpilotSites) {
    try {
      const result = await scrapeTrustpilot(tp.url, tp.name);
      console.log(`Trustpilot - ${tp.name} : ${result.inserted} avis insérés.`);
    } catch (err) {
      console.error(`Erreur Trustpilot pour ${tp.name} :`, err.message);
    }
  }

  // Mettre à jour le cache
  await updateCache();

  // Mettre à jour la date de dernière mise à jour
  await UpdateLogTrustpilot.findOneAndUpdate({}, { updatedAt: new Date() }, { upsert: true });

  console.log("----- Fin de la mise à jour Trustpilot -----\n");

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
    const dbReviews = await Review.find({ source: { $ne: "trustpilot" } });

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




// GET /api/reviews/:site
app.get("/api/trustpilot", async (req, res) => {
  try {
    const reviews = await Review.find({ source: "trustpilot" });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "Aucun avis Trustpilot trouvé." });
    }

    const grouped = {};

    reviews.forEach((r) => {
      if (!grouped[r.site]) {
        grouped[r.site] = {
          reviews: [],
          total: 0,
        };
      }

      grouped[r.site].reviews.push({
        id: r.review_id,
        site: r.site,
        date: r.date,
        iso_date: r.iso_date,
        rating: r.rating,
        text: r.text,
        source: r.source,
        service: r.site,
        user: r.user, 
        link: r.link || null,
      });

      grouped[r.site].total += r.rating;
    });

    // Calculer la moyenne par site
    const finalResult = {};
    for (const site in grouped) {
      const siteData = grouped[site];
      const avgRating = siteData.reviews.length
        ? parseFloat((siteData.total / siteData.reviews.length).toFixed(1))
        : null;

      finalResult[site] = {
        reviews: siteData.reviews,
        avgRating,
      };
    }

    res.json(finalResult);
  } catch (err) {
    console.error("Erreur API /api/trustpilot :", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des avis Trustpilot." });
  }
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
        message: `Aucun avis trouvé avec l'ID ${id}`,
      });
    }

    return res.json({
      exists: true,
      message: `Avis trouvé pour l'ID ${id}`,
      review,
    });
  } catch (err) {
    console.error("Erreur debug-review :", err.message);
    return res.status(500).json({
      error: "Erreur lors de la recherche de l'avis.",
    });
  }
});

// GET /api/debug-site/:site
app.get("/api/debug-site/:site", async (req, res) => {
  const { site } = req.params;

  try {
    const reviews = await Review.find({ site });

    if (reviews.length === 0) {
      return res.status(404).json({
        exists: false,
        message: `Aucun avis trouvé pour le site ${site}`,
      });
    }

    return res.json({
      exists: true,
      count: reviews.length,
      message: `${reviews.length} avis trouvés pour le site ${site}`,
      reviews,
    });
  } catch (err) {
    console.error("Erreur debug-site :", err.message);
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
    console.error("Erreur debug-dates :", err.message);
    res.status(500).json({ error: "Erreur lors de la vérification des dates." });
  }
});


// GET /api/scrape-all
app.get("/api/scrape-all-trustpilot", async (req, res) => {
  try {
    const results = await Promise.all(trustpilotSites.map(async (site) => {
      try {
        const result = await scrapeTrustpilot(site.url, site.name);
        return { name: site.name, success: true, inserted: result.inserted };
      } catch (err) {
        return { name: site.name, success: false, error: err.message };
      }
    }));
    
    res.json({
      success: true,
      results,
    });
  } catch (err) {
    console.error("Erreur lors du scraping multiple Trustpilot :", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/scrape-trustpilot/:site
app.get("/api/scrape-trustpilot/:site", async (req, res) => {
  const { site } = req.params;

  const trustpilotSite = trustpilotSites.find((s) => s.name.toLowerCase() === site.toLowerCase());

  if (!trustpilotSite) {
    return res.status(404).json({ error: "Site Trustpilot non trouvé." });
  }

  try {
    const result = await scrapeTrustpilot(trustpilotSite.url, trustpilotSite.name);
    res.json({ success: true, inserted: result.inserted });
  } catch (err) {
    console.error("Erreur lors du scraping Trustpilot :", err.message);
    res.status(500).json({ success: false, error: err.message });
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
    try {
      // Mise a jour des avis Trustpilot
      try {
        if (await shouldUpdateReviewsTrustpilot()) {
          console.log("Mise à jour automatique de trustpilot au démarrage...");
          try {
            await updateLatestReviewsTrustpilot();
          } catch (err) {
            console.error("Erreur pendant la mise à jour Trustpilot :", err.message || err);
          }
        } else {
          console.log("Pas besoin de mise à jour Trustpilot au démarrage.");
        }
      } catch (err) {
        console.error("Mise à jour auto échouée complètement :", err.message || err);
      }
      // Mise à jour des avis Google
      if (await shouldUpdateReviews()) {
        console.log("Mise à jour automatique de google au démarrage...");
        try {
          await updateLatestReviews();
        } catch (err) {
          console.error("Erreur pendant la mise à jour Google :", err.message || err);
        }
        
      } else {
        console.log("Pas besoin de mise à jour Google au démarrage.");
      }
    } catch (err) {
      console.error("Mise à jour auto échouée complètement :", err.message || err);
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
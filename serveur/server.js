// -------------------------
// Import des dépendances
// -------------------------
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

// -------------------------
// Imports internes
// -------------------------
const { UpdateLog, UpdateLogTrustpilot } = require("./model/model");
const routesReviews = require("../serveur/routes/reviews");
const routesTrustpilot = require("../serveur/routes/trustpilot");
const routeTrustpilotSites = require("../serveur/routes/scrapeTrustpilotSite")
const routeTrustpilotAll = require("../serveur/routes/scrapeTrustpilotAll")
const routesUpdate = require("../serveur/routes/update");
const routesDebug = require("../serveur/routes/debugRoutes");
const {shouldUpdateReviews, shouldUpdateReviewsTrustpilot } = require("./services/shouldUpdate")
const { updateLatestReviews } = require("./services/fetchReviewsGoogle");
const { updateLatestReviewsTrustpilot } = require("./services/fetchReviewsTrustpilot");
const { updateDates } = require("./utils/dateUtils");
// -------------------------
// Initialisation serveur
// -------------------------
const app = express();
const PORT = process.env.PORT || 5000;
const ONE_DAY = 1000 * 60 * 60 * 24;

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

// -------------------------
// Routes API
// -------------------------
app.use("/api/reviews", routesReviews);
app.use("/api/trustpilot", routesTrustpilot);
app.use("/api/force-update", routesUpdate);
app.use("/api", routeTrustpilotAll)
app.use("/api", routeTrustpilotSites)
app.use("/api", routesDebug);
app.get("/", (req, res) => {
  res.send("API Reviews opérationnelle !");
});

// -------------------------
// Tâche de mise à jour des dates (toutes les 24h)
// -------------------------
setInterval(() => {
  console.log("Mise à jour des dates relatives des avis...");
  updateDates();
}, ONE_DAY);

updateDates();

// -------------------------
// Démarrage du serveur
// -------------------------
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Création des collections si elles n’existent pas
    await UpdateLog.createCollection();
    await UpdateLogTrustpilot.createCollection();

    // Mise à jour Trustpilot si besoin
    if (await shouldUpdateReviewsTrustpilot()) {
      console.log("Mise à jour automatique de Trustpilot au démarrage...");
      await updateLatestReviewsTrustpilot();
    } else {
      console.log("Pas besoin de mise à jour Trustpilot au démarrage.");
    }

    // Mise à jour Google si besoin
    if (await shouldUpdateReviews()) {
      console.log("Mise à jour automatique de Google au démarrage...");
      await updateLatestReviews();
    } else {
      console.log("Pas besoin de mise à jour Google au démarrage.");
    }

    // Lancer l'application
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Erreur au démarrage du serveur :", err.message);
    process.exit(1);
  }
};

startServer();

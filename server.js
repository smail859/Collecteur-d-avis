const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");
const rateLimit = require("express-rate-limit")

const app = express();
const PORT = 5000;

app.use(cors()); // Autorise les requêtes depuis React
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1, // Limite à 1 requete par IP
  message: "Trop de requetes veuillez reessayer plus tard."
})

const apiKey = "7b7a9e8069dd613c40026dcea341e76bf84c1216b3dd40eb6c6700e1b0e18895";
const dataId = "0x479184d4eff4c4d7:0x7899f13a20c78918";

// Fonction pour récupérer les avis
const fetchReviews = (req, res) => {
  const nextPageToken = req.query.nextPageToken || null; 

  getJson(
    nextPageToken
      ? {
          engine: "google_maps_reviews",
          data_id: dataId,
          hl: "fr",
          api_key: apiKey,
          next_page_token: nextPageToken,
        }
      : {
          engine: "google_maps_reviews",
          data_id: dataId,
          hl: "fr",
          api_key: apiKey,
          reviews_limit: 50, 
        },
    (json) => {
      if (json.error) {
        return res.status(500).json({ error: json.error });
      }

      const formattedReviews = json.reviews.map((review) => ({
        link: review.link,
        rating: review.rating, // note de l'avis
        date: review.date,
        source: review.source,
        likes: review.likes,
        review_id: review.review_id,
        text: review.snippet,
        user: {
          name: review.user.name,
          link: review.user.link,
          contributor_id: review.user.contributor_id,
          thumbnail: review.user.thumbnail,
          reviews_count: review.user.reviews,
          photos_count: review.user.photos,
        },
      }));

      res.json({
        reviews: formattedReviews,
        nextPageToken: json.serpapi_pagination?.next_page_token || null, // Passer seulement le token
      });
    }
  );
};

// Route API pour récupérer les avis
app.get("/api/reviews", fetchReviews);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Utiliser le limiter
app.use(limiter);

const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");

const app = express();
const PORT = 5000;

app.use(cors()); // Autorise les requêtes depuis React
app.use(express.json());

const apiKey = "4546b3a57afe8d74757c0ddb90ef60d2e778e2afce5ffc489d971792699a9256";
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
        rating: review.rating,
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

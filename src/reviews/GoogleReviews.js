import { useState, useEffect } from "react";
import axios from "axios";

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les avis (avec gestion de la pagination)
  const fetchReviews = async (url = "http://localhost:5000/api/reviews") => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(url);
      console.log("Réponse du backend :", response.data);

      // Ajoute les nouveaux avis à la liste existante
      setReviews((prevReviews) => [...prevReviews, ...response.data.reviews]);

      // Met à jour le lien vers la page suivante (ou null s'il n'y en a pas)
      setNextPage(response.data.nextPage || null);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger la première page au démarrage
  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <h2>Avis Google</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={review.user.thumbnail} alt={review.user.name} width="40" height="40" style={{ borderRadius: "50%" }} />
              <div>
                <a href={review.user.link} target="_blank" rel="noopener noreferrer">
                  <strong>{review.user.name}</strong>
                </a>
                <p>📷 {review.user.photos_count} photos • 📝 {review.user.reviews_count} avis</p>
              </div>
            </div>
            <p><strong>Note : {review.rating} ⭐</strong> • {review.date}</p>
            <p>{review.text}</p>
            <a href={review.link} target="_blank" rel="noopener noreferrer">Voir l'avis sur Google</a>
            <p>👍 {review.likes} J'aime</p>
          </div>
        ))
      ) : (
        <p>Chargement des avis...</p>
      )}

      {nextPage && (
        <button onClick={() => fetchReviews(nextPage)} disabled={loading}>
          {loading ? "Chargement..." : "Charger plus d'avis"}
        </button>
      )}
    </div>
  );
};

export default GoogleReviews;

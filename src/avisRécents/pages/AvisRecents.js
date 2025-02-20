import { Stack, Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import FullAvis from "../components/FullAvis";
import NoteParService from "../components/NoteParService";
import ListChip from "../components/ListChip";
import ListChipFiltre from "../components/ListChipFiltre";
import MONBIEN from "../../image/MONBIEN.png";
import STARTLOC from "../../image/STARTLOC.png";
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png";
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png";
import SINIMO from "../../image/SINIMO.png";
import PIGEONLINE from "../../image/PIGEONLINE.png";

const AvisRecents = ({ onFilterChange }) => {
  const [selected, setSelected] = useState();
  const [reviews, setReviews] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les avis depuis l'API
  const fetchReviews = async (nextPageToken = null) => {
    if (loading) return;
    setLoading(true);
  
    try {
      const url = nextPageToken 
        ? `http://localhost:5000/api/reviews?nextPageToken=${nextPageToken}` 
        : "http://localhost:5000/api/reviews";
  
      const response = await axios.get(url);
      console.log("Réponse du backend :", response.data);
  
      // Ajouter les nouveaux avis sans doublons
      const newReviews = response.data.reviews.filter(
        (review) => !reviews.some((r) => r.review_id === review.review_id)
      );
      setReviews((prevReviews) => [...prevReviews, ...newReviews]);
  
      // Mettre à jour le token pour la page suivante
      setNextPage(response.data.nextPageToken || null);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les avis au démarrage
  useEffect(() => {
    fetchReviews();
  }, []);

  // Gestion des services sélectionnés
  const handleServiceChange = (newService) => {
    if (newService !== null) {
      setSelected(newService);
      if (typeof onFilterChange === "function") {
        onFilterChange(newService);
      } else {
        console.warn("onFilterChange is not a function");
      }
    }
  };

  // Services disponibles
  const servicesChip = [
    { label: "Monbien", icon: MONBIEN },
    { label: "Startloc", icon: STARTLOC },
    { label: "Sinimo", icon: SINIMO },
    { label: "Pige Online", icon: PIGEONLINE },
    { label: "Marketing Immobilier", icon: MARKETINGIMMO },
    { label: "Marketing Automobile", icon: MARKETINGAUTO },
    { label: "Sav", icon: MARKETINGIMMO },
  ];

  return (
    <Box maxWidth="1400px" mx="auto">
      <Typography fontSize="54px" fontWeight="900" textAlign="start" mt="20px" gutterBottom>
        Avis Récents
      </Typography>
      <Typography fontSize="16px" fontWeight="bold" textAlign="start" mt="20px" color="#8B5CF6" gutterBottom>
        Suivez les derniers retours de nos utilisateurs
      </Typography>


      <Stack direction="row" spacing={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 10, padding: "20px", borderRadius: "20px", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <ListChip servicesChip={servicesChip} handleServiceChange={handleServiceChange} selected={selected} />
        </Box>

        <NoteParService logo={MONBIEN} labelService={"Monbien"} noteService={"4.8"} nombreAvis={"1 004"} />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", width: "1300px", mx: "auto", overflowY: "auto", paddingBottom: 4, paddingTop: 4, borderRadius: "20px", backgroundColor: "white" }}>
          <ListChipFiltre />


          {/* Affichage des avis */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", width: "1300px", mx: "auto", overflowY: "auto", paddingBottom: 4, paddingTop: 4, borderRadius: "20px", backgroundColor: "white" }}>
            {reviews.length > 0 ? (
              reviews.map((review, index) => <FullAvis key={index} avisData={review} />)
            ) : (
              <Typography>Chargement des avis...</Typography>
            )}
          </Box>

          {/* Bouton pour charger plus d'avis */}
          {nextPage && (
            <Button onClick={() => fetchReviews(nextPage)} disabled={loading} variant="contained" sx={{ backgroundColor: "#8B5CF6", color: "white", borderRadius: "20px", mt: 3 }}>
              {loading ? "Chargement..." : "Charger plus d'avis"}
            </Button>
          )}
        </Box>
        <Box/>
      </Stack>
    </Box>
  );
};

export default AvisRecents;



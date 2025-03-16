import { Stack, Box, Typography, Button, Fade } from "@mui/material";
import { useState, useMemo } from "react";
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
import useFetchReviews from "../../hooks/components/useFetchReviews";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";



const AvisRecents = ({ onFilterChange }) => {


  const [selected, setSelected] = useState('Monbien');
  const [filters, setFilters] = useState({
    note: "",
    periode: "",
    commercial: "",
    plateforme: "",
    service: "",  
  });



  const { 
    reviews, 
    totalReviews, 
    loadMoreReviews, 
    displayLimit, 
    ratingsCountAllTime, 
    filteredReviews,
    setDisplayLimit,
    avgRatingByService,
    reviewsCountByService
  } = useFetchReviews(filters);



  console.log(reviewsCountByService)

  // Gestion des services sélectionnés
  const handleServiceChange = (newService) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        service: newService === "Tous les services" ? "" : newService, // Réinitialiser si "Tous les services"
      };
      return updatedFilters;
    });
  
    setSelected(newService === "Tous les services" ? "" : newService);
    setDisplayLimit(8);
  
    if (typeof onFilterChange === "function") {
      onFilterChange(newService);
    }
  };
  
  

  // Calculer le pourcentage pour chaque note
  const progressPercentages = useMemo(() => {
    const percentages = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
    if (ratingsCountAllTime?.Google?.[selected]) { // ✅ Prend tous les avis et pas seulement 30 jours
      const total = Object.values(ratingsCountAllTime.Google[selected]).reduce((sum, val) => sum + val, 0);
      if (total > 0) {
        Object.keys(ratingsCountAllTime.Google[selected]).forEach((rating) => {
          percentages[rating] = ((ratingsCountAllTime.Google[selected][rating] / total) * 100).toFixed(0);
        });
      }
    }
  
    return percentages;
  }, [ratingsCountAllTime, selected]);
  


  // Services disponibles
  const servicesChip = [
    { label: "Monbien", icon: MONBIEN },
    { label: "Startloc", icon: STARTLOC },
    { label: "Sinimo", icon: SINIMO },
    { label: "Pige Online", icon: PIGEONLINE },
    { label: "Marketing immobilier", icon: MARKETINGIMMO },
    { label: "Marketing automobile", icon: MARKETINGAUTO },
  ];

  const dataFilters = [
    { name: "service", label: "Sélectionner un service", options: ["Tous les services", "Startloc", "Monbien", "Pige Online", "Marketing automobile", "Marketing immobilier", "Sinimo"] },
    { name: "note", label: "Notes", options: ["Toutes les notes", "5 étoiles", "4 étoiles", "3 étoiles", "2 étoiles", "1 étoile"] },
    { name: "commercial", label: "Toutes l'équipe Realty", options: ["Tous les commerciaux", "Joanna", "Mélanie", "Smaïl", "Lucas", "SAV"] },
    { name: "plateforme", label: "Toutes les plateformes", options: ["Toutes les plateformes", "Google", "Trustpilot"] },
    { name: "periode", label: "Sélectionner une période", options: ["Toutes les périodes", "Cette semaine", "Ce mois", "Cette année"] },
  ];

  const isFiltering = Object.values(filters).some((value) => value !== "");
  
  // On limite à 8 avis au départ, mais on augmente avec le bouton "Charger plus d'avis"
  const isDefaultFilters = useMemo(() => {
    return Object.values(filters).every(value => 
      value === "" || 
      value === "Tous les services" || 
      value === "Toutes les notes" || 
      value === "Toutes les périodes" || 
      value === "Tous les commerciaux" || 
      value === "Toutes les plateformes"
    );
  }, [filters]);
  
  const reviewsToDisplay = useMemo(() => {
    if (isDefaultFilters) return reviews.slice(0, displayLimit); // Si aucun filtre, afficher tous les avis
    if (isFiltering) return Array.isArray(filteredReviews) ? filteredReviews.slice(0, displayLimit) : [];
    return reviews.slice(0, displayLimit);
  }, [filteredReviews, reviews, isFiltering, displayLimit, isDefaultFilters]);


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

        {selected === '' && <Typography>Aucun service sélectionné</Typography>}
        {selected && avgRatingByService[selected] && (
          <Fade in={true} timeout={800}>
            <div>
              <NoteParService 
                logo={servicesChip.find(s => s.label === selected)?.icon} 
                labelService={selected} 
                noteService={parseFloat(avgRatingByService[selected].google).toFixed(1)} // Convertit en nombre proprement
                nombreAvis={reviewsCountByService?.[selected]?.google || 0} 
                progress={progressPercentages}

              />
            </div>
          </Fade>
        )}



        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", width: "1300px", mx: "auto", overflowY: "auto", paddingBottom: 4, paddingTop: 4, borderRadius: "20px", backgroundColor: "white" }}>
          <ListChipFiltre dataFilters={dataFilters} filters={filters} onChangeFilters={setFilters} filteredReviews={filteredReviews} />
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1, marginBottom: "20px", justifyContent: "center" }}>
            <Typography component="span" sx={{ color: "#8B5CF6" }}>
   

              {(isDefaultFilters ? totalReviews : filteredReviews.length) || 0} avis 
              <SearchOutlinedIcon sx={{ width: "19.5px", height: "19.5px", color: "#2972FF" }} />
            </Typography>

          </Box>


          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", width: "1300px", mx: "auto", overflowY: "auto", paddingBottom: 4, paddingTop: 4, borderRadius: "20px", backgroundColor: "white" }}>
          {reviewsToDisplay && reviewsToDisplay.length > 0 ? (
                reviewsToDisplay.map((review, index) => (
                    <FullAvis key={index} avisData={review} defaultValueAvis={review.rating} />
                ))
            ) : (
                <Typography sx={{ color: "#8B5CF6", fontSize: "20px", fontWeight: "bold", textAlign: "center", mt: 3 }}>
                    Aucun avis ne correspond à votre recherche.
                </Typography>
            )}
          </Box>


          {/* Bouton pour charger plus d'avis */}
          {displayLimit < totalReviews && (
            <Button
              onClick={loadMoreReviews}
              variant="contained"
              sx={{ backgroundColor: "#8B5CF6", color: "white", borderRadius: "20px", mt: 3 }}
            >
              Charger plus d'avis
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default AvisRecents;

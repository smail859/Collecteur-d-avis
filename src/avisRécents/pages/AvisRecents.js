// Description: La page AvisRecents est la page principale de l'application. Elle affiche les avis récents des utilisateurs.

//Import des composants depuis Material-UI
import { Stack, Box, Typography, Button, Fade } from "@mui/material";

//Import des composants depuis React
import { useState, useMemo } from "react";

// Import de mes composants
import FullAvis from "../components/FullAvis";
import NoteParService from "../components/NoteParService";
import ListChip from "../components/ListChip";
import ListChipFiltre from "../components/ListChipFiltre";
import  CalendarDate from "../../date/CalendarDate";

// Logo rond pour ListChipFiltre
import MonbienRadius from "../../image/MonbienRadius.png";
import MARadius from "../../image/MARadius.png";
import MIRadius from "../../image/MIRadius.png";
import PORadius from "../../image/PORadius.png";
import SinimoRadius from "../../image/SinimoRadius.png";
import StartlocRadius from "../../image/StartlocRadius.png";

// Logos pour NoteParService
import MONBIEN from "../../image/MONBIEN.png";
import STARTLOC from "../../image/STARTLOC.png";
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png";
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png";
import SINIMO from "../../image/SINIMO.png";
import PIGEONLINE from "../../image/PIGEONLINE.png";

// Import du hook useFetchReviews
import useFetchReviews from "../../hooks/components/useFetchReviews";

// Icone de recherche
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

// Librairie lodash pour supprimer les accents
import deburr from "lodash/deburr"; 





const AvisRecents = ({ onFilterChange }) => {


  const [selected, setSelected] = useState('Monbien');
  const [filters, setFilters] = useState({
    note: "",
    periode: "Toutes les périodes", 
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


  // Gestion du changement de service
  const handleServiceChange = (newService) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      service: newService === "Tous les services" ? "" : newService,
    }));

    setSelected(newService === "Tous les services" ? "" : newService);
    setDisplayLimit(8);

    if (typeof onFilterChange === "function") {
      onFilterChange(newService);
    }
  };
  

  // Calculer le pourcentage pour chaque note
  const progressPercentages = useMemo(() => {
    const percentages = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
    if (ratingsCountAllTime?.Google?.[selected]) {
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
    { label: "Monbien", icon: MonbienRadius },
    { label: "Startloc", icon: StartlocRadius },
    { label: "Sinimo", icon: SinimoRadius },
    { label: "Pige Online", icon: PORadius },
    { label: "Marketing immobilier", icon: MIRadius },
    { label: "Marketing automobile", icon: MARadius },
  ];

  // Mapping des logos pour NoteParService
  const serviceLogos = {
    "Monbien": MONBIEN,
    "Startloc": STARTLOC,
    "Marketing automobile": MARKETINGAUTO,
    "Marketing immobilier": MARKETINGIMMO,
    "Sinimo": SINIMO,
    "Pige Online": PIGEONLINE
  };



  const dataFilters = [
    { name: "service", label: "Sélectionner un service", options: ["Tous les services", "Startloc", "Monbien", "Pige Online", "Marketing automobile", "Marketing immobilier", "Sinimo"] },
    { name: "note", label: "Notes", options: ["Toutes les notes", "5 étoiles", "4 étoiles", "3 étoiles", "2 étoiles", "1 étoile"] },
    { name: "commercial", label: "Toutes l'équipe Realty", options: ["Tous les commerciaux", "Joanna", "Mélanie", "Smaïl", "Lucas", "Théo", "Manon", "Arnaud", "Jean-Simon", "Océane","Johanna", "Angela", "Esteban", "Anais", "Elodie"] },
    { name: "plateforme", label: "Toutes les plateformes", options: ["Toutes les plateformes", "Google", "Trustpilot"] },
  ];
  const detectCommercial = (text) => {
    if (!text) return text;
  
    const commerciaux = ["Joanna", "Mélanie", "Smaïl", "Lucas", "Théo", "Manon", "Arnaud", "Jean-Simon", "Océane", "Johanna", "Angela", "Esteban", "Anais", "Elodie"];
  
    // Fonction pour normaliser le texte (enlever accents + minuscule)
    const normalize = (str) => deburr(str).toLowerCase();
  
    // Création de la regex insensible à la casse et aux accents
    const regex = new RegExp(`\\b(${commerciaux.map(normalize).join("|")})\\b`, "gi");
  
    return text.split(regex).map((part, index) =>
      commerciaux.some(com => normalize(com) === normalize(part)) ? (
        <Typography key={index} component="span" sx={{ fontWeight: 800, color: "black", fontSize: "16px" }}>
          {part}
        </Typography>
      ) : (
        part
      )
    );
  };
  
  const isFiltering = useMemo(() => {
    return Object.values(filters).some((value) => value !== "" && value !== "Toutes les périodes");
  }, [filters]);
  
  
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
    if (isDefaultFilters) return reviews.slice(0, displayLimit);
    if (isFiltering) return Array.isArray(filteredReviews) ? filteredReviews.slice(0, displayLimit) : [];
    return reviews.slice(0, displayLimit);
  }, [filteredReviews, reviews, isFiltering, displayLimit, isDefaultFilters]);
  

  const activeFiltersText = useMemo(() => {
    const filtersArray = [];
  
    if (filters.service && filters.service !== "Tous les services") {
      filtersArray.push(` ${filters.service}`);
    }
    if (filters.note && filters.note !== "Toutes les notes") {
      filtersArray.push(`${filters.note}`);
    }
    if (filters.commercial && filters.commercial !== "Tous les commerciaux") {
      filtersArray.push(`pour ${filters.commercial}`);
    }
    if (filters.plateforme && filters.plateforme !== "Toutes les plateformes") {
      filtersArray.push(` sur ${filters.plateforme}`);
    }
    if (filters.periode && filters.periode !== "Toutes les périodes") {
      if (typeof filters.periode === "object") {
        filtersArray.push(` du ${filters.periode.start} au ${filters.periode.end}`);
      } else {
        filtersArray.push(` ${filters.periode.toLowerCase()}`);
      }
    }
    
  
    return filtersArray.length > 0 ? ` ${filtersArray.join(" ")}` : "";
  }, [filters]);
  

  const handlePeriodChange = (newPeriod) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      periode: newPeriod || "Toutes les périodes",
    }));
  };
  
  return (
    <Box maxWidth="1500px" mx="auto">
      <Typography fontSize="54px" fontWeight="900" mt="20px"gutterBottom>
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
                logo={serviceLogos[selected]}
                labelService={selected} 
                noteService={parseFloat(avgRatingByService[selected].google).toFixed(1)}
                nombreAvis={reviewsCountByService?.[selected]?.google || 0} 
                progress={progressPercentages}
              />
            </div>
          </Fade>
        )}

        <Box 
          sx={{     
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            minWidth: "1599px",
            mx: "auto",
            overflowY: "auto",
            paddingBottom: 4,
            paddingTop: 4,
            borderRadius: "20px",
            backgroundColor: "white", 
          }}
        > 
          {/* Groupe ListChipFiltre + CalendarDate */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 2,  // Espacement entre les éléments

            }}
          >
            <ListChipFiltre 
              dataFilters={dataFilters}  
              filters={filters} 
              onChangeFilters={setFilters} 
              filteredReviews={filteredReviews} 
            />
            <CalendarDate onPeriodChange={handlePeriodChange} />
              {/* Bouton pour réinitialiser les filtres */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setFilters({
                    note: "",
                    periode: "Toutes les périodes",
                    commercial: "",
                    plateforme: "",
                    service: "",
                  });
                  setSelected("");
                }}
                disabled={!isFiltering}
                sx={{
                  textTransform: "none",
                  borderColor: "#FF4D4D",
                  color: "#FF4D4D",
                  fontWeight: "bold",
                  width: "300px",
                  height: "30px",
                  "&:hover": { backgroundColor: "#FFE5E5" },
                }}
              >
                Réinitialiser les filtres
              </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, marginBottom: "20px", justifyContent: "center" }}>
            <Typography component="span" sx={{ color: "#8B5CF6", fontWeight: "800", fontSize: "16px", display: "inline-flex", alignItems: "center" }}>
              {(isDefaultFilters ? totalReviews : filteredReviews.length) || 0} Avis
              <span style={{ color: 'black', fontWeight: "600", marginLeft: "4px" }}>{activeFiltersText}</span>
              <SearchOutlinedIcon sx={{ width: "19.5px", height: "19.5px", color: "#2972FF", verticalAlign: "middle", ml: "5px"}} />
            </Typography>

          </Box>


          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", width: "1599px", mx: "auto", overflowY: "auto", paddingBottom: 4, paddingTop: 4, borderRadius: "20px", backgroundColor: "white" }}>
            {reviewsToDisplay && reviewsToDisplay.length > 0 ? (
                  reviewsToDisplay.map((review, index) => (
                      <FullAvis key={index} avisData={review} defaultValueAvis={review.rating} detectCommercial={detectCommercial}/>
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

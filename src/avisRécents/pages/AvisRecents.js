import { Stack, Box, Typography, Button, Fade} from "@mui/material";
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


  const [selected, setSelected] = useState('');
  const [filters, setFilters] = useState({
    note: "",
    periode: "",
    commercial: "",
    plateforme: "",
    services: "",
  });


  const { reviews, totalReviews, loadMoreReviews, displayLimit, averageRating, ratingsCount, filteredReviews } = useFetchReviews(filters);


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

  // Calculer le pourcentage pour chaque note
  const progressPercentages = useMemo(() => {
    const percentages = {};
    Object.keys(ratingsCount).forEach((rating) => {
      percentages[rating] =
        totalReviews > 0
          ? ((ratingsCount[rating] / totalReviews) * 100).toFixed(0)
          : 0;
    });
    return percentages;
  }, [ratingsCount, totalReviews]);
  

  // Services disponibles
  const servicesChip = [
    { label: "Monbien", icon: MONBIEN },
    { label: "Startloc", icon: STARTLOC },
    { label: "Sinimo", icon: SINIMO },
    { label: "Pige Online", icon: PIGEONLINE },
    { label: "Marketing Immobilier", icon: MARKETINGIMMO },
    { label: "Marketing Automobile", icon: MARKETINGAUTO },
  ];
  
  const dataFilters = 
  [
    { name: "note", label: "Notes", options: ["5 étoiles", "4 étoiles", "3 étoiles", "2 étoiles", "1 étoile"] },
    { name: "commercial", label: "Tous l'équipe Realty", options: ["Joanna", "Mélanie", "Smaïl", "Lucas", "SAV"] },
    { name: "plateforme", label: "Toutes les plateformes", options: ["Google", "TrustPilot"] },
    { name: "periode", label: "Sélectionner une période", options: ["Cette semaine", "Ce mois", "Cette année"] },
  ]

  const isFiltering = Object.values(filters).some((value) => value !== "");
  const reviewsToDisplay = isFiltering ? filteredReviews : reviews;
  


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

        {selected === '' && <Typography>Aucun service selectionné</Typography>}
        {selected === 'Monbien' && (
          <Fade in={selected === 'Monbien'} timeout={800}>
            <div>
              <NoteParService 
                logo={MONBIEN} 
                labelService="Monbien" 
                noteService="4.8" 
                nombreAvis="1 004" 
                progress={progressPercentages}
              />
            </div>
          </Fade>
        )}
        {selected === 'Startloc' && (
          <Fade in={selected === 'Startloc'} timeout={800}>
            <div>
              <NoteParService 
                logo={STARTLOC} 
                labelService="Startloc" 
                noteService={averageRating} 
                nombreAvis={totalReviews} 
                defaultValue={averageRating} 
                progress={progressPercentages}
              />
            </div>
          </Fade>
        )}
        {selected === 'Marketing Automobile' && <NoteParService logo={MARKETINGAUTO} labelService={"Marketing Automobile"} noteService={"4.8"} nombreAvis={"1 004"} />}
        {selected === 'Marketing Immobilier' && <NoteParService logo={MARKETINGIMMO} labelService={"Marketing Immobilier"} noteService={"4.8"} nombreAvis={"1 004"} />}
        {selected === 'Sinimo' && <NoteParService logo={SINIMO} labelService={"Sinimo"} noteService={"4.8"} nombreAvis={"1 004"} />}
        {selected === 'Pige Online' && <NoteParService logo={PIGEONLINE} labelService={"Pige Online"} noteService={"4.8"} nombreAvis={"1 004"} />}
        {selected === 'SAV' && <NoteParService logo={PIGEONLINE} labelService={"SAV"} noteService={"4.8"} nombreAvis={"1 004"} />}
        
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", width: "1300px", mx: "auto", overflowY: "auto", paddingBottom: 4, paddingTop: 4, borderRadius: "20px", backgroundColor: "white" }}>
          <ListChipFiltre dataFilters={dataFilters} filters={filters} onChangeFilters={setFilters} filteredReviews={filteredReviews} />
          {/* Affichage d'une typographie ou d'une icône */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              marginBottom: "20px",
              justifyContent: "center",
            }}
          >
            {isFiltering && reviewsToDisplay.length > 0 ? (
              <Typography component="span" sx={{ color: "#8B5CF6" }}>
                {reviewsToDisplay.length} avis <SearchOutlinedIcon sx={{ width: "19.5px", height: "19.5px", color: "#2972FF" }} />
              </Typography>
            ) : null}
            
          </Box>



          {/* Affichage des avis */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", width: "1300px", mx: "auto", overflowY: "auto", paddingBottom: 4, paddingTop: 4, borderRadius: "20px", backgroundColor: "white" }}>
            {reviewsToDisplay.length > 0 ? (
              reviewsToDisplay.map((review, index) => <FullAvis key={index} avisData={review} defaultValueAvis={review.rating}/>)
            ) : (
              <Typography>Chargement des avis...</Typography>
            )}
          </Box>


          
          {/* <TextField
            label="Rechercher un avis..."
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}


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
        <Box/>
      </Stack>
    </Box>
  );
};

export default AvisRecents;



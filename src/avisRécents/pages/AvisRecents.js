import {
  Box,
  Typography,
  Button,
  Fade,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState, useMemo } from "react";
import FullAvis from "../components/FullAvis";
import NoteParService from "../components/NoteParService";
import ListChip from "../components/ListChip";
import ListChipFiltre from "../components/ListChipFiltre";
import CalendarDate from "../../date/CalendarDate";
import useFetchReviews from "../../hooks/components/useFetchReviews";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import deburr from "lodash/deburr";

// Logos
import MonbienRadius from "../../image/MonbienRadius.png";
import MARadius from "../../image/MARadius.png";
import MIRadius from "../../image/MIRadius.png";
import PORadius from "../../image/PORadius.png";
import SinimoRadius from "../../image/SinimoRadius.png";
import StartlocRadius from "../../image/StartlocRadius.png";
import MONBIEN from "../../image/MONBIEN.png";
import STARTLOC from "../../image/STARTLOC.png";
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png";
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png";
import SINIMO from "../../image/SINIMO.png";
import PIGEONLINE from "../../image/PIGEONLINE.png";

const AvisRecents = ({ onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selected, setSelected] = useState("Monbien");
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
    reviewsCountByService,
    loading,
  } = useFetchReviews(filters);

  const servicesChip = [
    { label: "Monbien", icon: MonbienRadius },
    { label: "Startloc", icon: StartlocRadius },
    { label: "Sinimo", icon: SinimoRadius },
    { label: "Pige Online", icon: PORadius },
    { label: "Marketing immobilier", icon: MIRadius },
    { label: "Marketing automobile", icon: MARadius },
  ];

  const serviceLogos = {
    Monbien: MONBIEN,
    Startloc: STARTLOC,
    "Marketing automobile": MARKETINGAUTO,
    "Marketing immobilier": MARKETINGIMMO,
    Sinimo: SINIMO,
    "Pige Online": PIGEONLINE,
  };

  const dataFilters = [
    {
      name: "service",
      label: "Sélectionner un service",
      options: ["Tous les services", "Startloc", "Monbien", "Pige Online", "Marketing automobile", "Marketing immobilier", "Sinimo"],
    },
    {
      name: "note",
      label: "Notes",
      options: ["Toutes les notes", "5 étoiles", "4 étoiles", "3 étoiles", "2 étoiles", "1 étoile"],
    },
    {
      name: "commercial",
      label: "Toutes l'équipe Realty",
      options: [
        "Tous les commerciaux",
        "Joanna", "Mélanie", "Smaïl", "Lucas", "Théo", "Manon", "Arnaud", "Jean-Simon",
        "Océane", "Johanna", "Angela", "Esteban", "Anais", "Elodie",
      ],
    },
    {
      name: "plateforme",
      label: "Toutes les plateformes",
      options: ["Toutes les plateformes", "Google", "Trustpilot"],
    },
  ];

  const detectCommercial = (text) => {
    if (!text) return text;
    const commerciaux = ["Joanna", "Mélanie", "Smaïl", "Lucas", "Théo", "Manon", "Arnaud", "Jean-Simon", "Océane", "Johanna", "Angela", "Esteban", "Anais", "Elodie"];
    const normalize = (str) => deburr(str).toLowerCase();
    const regex = new RegExp(`\\b(${commerciaux.map(normalize).join("|")})\\b`, "gi");

    return text.split(regex).map((part, index) =>
      commerciaux.some((com) => normalize(com) === normalize(part)) ? (
        <Typography key={index} component="span" sx={{ fontWeight: 800, color: "black", fontSize: "16px" }}>
          {part}
        </Typography>
      ) : (
        part
      )
    );
  };

  const handleServiceChange = (newService) => {
    setFilters((prev) => ({ ...prev, service: newService === "Tous les services" ? "" : newService }));
    setSelected(newService === "Tous les services" ? "" : newService);
    setDisplayLimit(8);
    if (typeof onFilterChange === "function") onFilterChange(newService);
  };

  const handlePeriodChange = (newPeriod) => {
    setFilters((prev) => ({
      ...prev,
      periode: newPeriod || "Toutes les périodes",
    }));
  };

  const isFiltering = useMemo(() => {
    return Object.values(filters).some((value) => value !== "" && value !== "Toutes les périodes");
  }, [filters]);

  const isDefaultFilters = useMemo(() => {
    return Object.values(filters).every((value) =>
      ["", "Tous les services", "Toutes les notes", "Toutes les périodes", "Tous les commerciaux", "Toutes les plateformes"].includes(value)
    );
  }, [filters]);

  const reviewsToDisplay = useMemo(() => {
    if (isDefaultFilters) return reviews.slice(0, displayLimit);
    if (isFiltering) return Array.isArray(filteredReviews) ? filteredReviews.slice(0, displayLimit) : [];
    return reviews.slice(0, displayLimit);
  }, [filteredReviews, reviews, isFiltering, displayLimit, isDefaultFilters]);

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

  const activeFiltersText = useMemo(() => {
    const filtersArray = [];

    if (filters.service && filters.service !== "Tous les services") filtersArray.push(` ${filters.service}`);
    if (filters.note && filters.note !== "Toutes les notes") filtersArray.push(`${filters.note}`);
    if (filters.commercial && filters.commercial !== "Tous les commerciaux") filtersArray.push(`pour ${filters.commercial}`);
    if (filters.plateforme && filters.plateforme !== "Toutes les plateformes") filtersArray.push(` sur ${filters.plateforme}`);
    if (filters.periode && filters.periode !== "Toutes les périodes") {
      if (typeof filters.periode === "object") {
        filtersArray.push(` du ${filters.periode.start} au ${filters.periode.end}`);
      } else {
        filtersArray.push(` ${filters.periode.toLowerCase()}`);
      }
    }

    return filtersArray.length > 0 ? ` ${filtersArray.join(" ")}` : "";
  }, [filters]);

  return (
    <Box width="100%" mx="auto" px={isMobile ? 2 : 4}>
      <Typography
        fontSize={isMobile ? "32px" : "54px"}
        textAlign={isMobile ? "center" : "start"}
        fontWeight="900"
        mt={isMobile ? "10px" : "20px"}
        gutterBottom
      >
        Avis Récents
      </Typography>

      <Typography
        fontSize={isMobile ? "14px" : "16px"}
        fontWeight="bold"
        textAlign={isMobile ? "center" : "start"}
        mt="20px"
        color="#8B5CF6"
        gutterBottom
      >
        Suivez les derniers retours de nos utilisateurs
      </Typography>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 4 }}>
        <ListChip servicesChip={servicesChip} handleServiceChange={handleServiceChange} selected={selected} />
      </Box>

      {selected === "" && <Typography textAlign="center">Aucun service sélectionné</Typography>}

      {selected && avgRatingByService[selected] && (
        <Fade in={true} timeout={800}>
          <Box mt={4}>
            <NoteParService
              logo={serviceLogos[selected]}
              labelService={selected}
              noteService={
                avgRatingByService[selected]?.google > 0
                  ? parseFloat(avgRatingByService[selected].google).toFixed(1)
                  : parseFloat(avgRatingByService[selected]?.trustpilot || 0).toFixed(1)
              }
              nombreAvis={reviewsCountByService?.[selected]?.google || 0}
              progress={progressPercentages}
            />
          </Box>
        </Fade>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          width: "100%",
          mt: 5,
          p: isMobile ? 2 : 4,
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexWrap: "wrap",
          }}
        >

          <ListChipFiltre dataFilters={dataFilters} filters={filters} onChangeFilters={setFilters} filteredReviews={filteredReviews} />

          <CalendarDate onPeriodChange={handlePeriodChange} />
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setFilters({ note: "", periode: "Toutes les périodes", commercial: "", plateforme: "", service: "" });
              setSelected("");
            }}
            disabled={!isFiltering}
            sx={{
              textTransform: "none",
              borderColor: "#FF4D4D",
              color: "#FF4D4D",
              fontWeight: "bold",
              width: isMobile ? "50%" : "300px",
              height: "30px",
              "&:hover": { backgroundColor: "#FFE5E5" },
            }}
          >
            Réinitialiser les filtres
          </Button>

        </Box>


        <Typography component="span" sx={{ color: "#8B5CF6", fontWeight: "800", fontSize: "16px", display: "inline-flex", alignItems: "center", mt: 2 }}>
          {(isDefaultFilters ? totalReviews : filteredReviews.length) || 0} Avis
          <span style={{ color: "black", fontWeight: "600", marginLeft: "4px" }}>{activeFiltersText}</span>
          <SearchOutlinedIcon sx={{ width: "20px", height: "20px", color: "#2972FF", ml: "5px" }} />
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {reviewsToDisplay && reviewsToDisplay.length > 0 ? (
            loading ? (
              <CircularProgress size={90} sx={{ my: 6 }} />
            ) : (
              reviewsToDisplay.map((review, index) => (
                <FullAvis key={index} avisData={review} defaultValueAvis={review.rating} detectCommercial={detectCommercial} />
              ))
            )
          ) : (
            <Typography sx={{ color: "#8B5CF6", fontSize: "20px", fontWeight: "bold", textAlign: "center", mt: 3 }}>
              Aucun avis ne correspond à votre recherche.
            </Typography>
          )}
        </Box>

        {displayLimit < totalReviews && (
          <Button onClick={loadMoreReviews} variant="contained" sx={{ backgroundColor: "#8B5CF6", color: "white", borderRadius: "20px", mt: 3 }}>
            Charger plus d'avis
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AvisRecents;

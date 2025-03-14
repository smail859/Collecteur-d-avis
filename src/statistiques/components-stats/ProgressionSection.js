import Wave from "react-wavify";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, Typography } from "@mui/material";

// Composant pour la progression avec les flammes et la vague animée
const ProgressionSection = ({ progression = 0, commercialCountMount, commercialCountYears, isYearly, selectedCommercial}) => {

  console.log("Progression affichée :", progression, "%");
  console.log("Commercial sélectionné dans ProgressionSection :", selectedCommercial);
  const OBJECTIF_MENSUEL = 5; 
  const OBJECTIF_ANNUEL = 60;
  const BASE_HEIGHT = 0; // La vague commence avec une hauteur de 0%

  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "275px",
        height: "700px",
        borderRadius: "20px",
        bgcolor: "#F2F3FB",
        position: "relative",
        overflow: "hidden", 
      }}
    >
      {/* Texte du pourcentage */}
      <Typography
        variant="h2"
        fontWeight="bold"
        color="white"
        sx={{
          position: "absolute",
          top: "25%",
          zIndex: 2, 
        }}
      >
        {progression}%
      </Typography>



      <Wave
        fill="#8B5CF6"
        paused={false}
        options={{
          height: 30,
          amplitude: 30, 
          speed: 0.3,
          points: 3,
        }}
        style={{
          position: "absolute",
          bottom: "0%", // La vague commence bien depuis le bas
          width: "100%",
          height: `${BASE_HEIGHT + (progression * (100 - BASE_HEIGHT) / 100)}%`, 
          zIndex: 1,
        }}
      />

      {/* Icônes et Texte */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          display: "flex",
          alignItems: "center",
          zIndex: 2,
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography fontSize="14px" fontWeight="200" color="white">
          {isYearly ? (
            commercialCountYears >= OBJECTIF_ANNUEL ? (
              "Bravo, vous avez atteint votre objectif de l'année !"
            ) : (
              <>
                Plus que{" "}
                <span style={{ color: "white", fontWeight: "bold" }}>
                  {Math.max(0, OBJECTIF_ANNUEL - commercialCountYears)} avis
                </span>
              </>
            )
          ) : (
            commercialCountMount >= OBJECTIF_MENSUEL ? (
              "Bravo, vous avez atteint votre objectif du mois !"
            ) : (
              <>
                Plus que{" "}
                <span style={{ color: "white", fontWeight: "bold" }}>
                  {Math.max(0, OBJECTIF_MENSUEL - commercialCountMount)} avis
                </span>
              </>
            )
          )}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {Array.from({ length: 5 }, (_, index) => (
            <LocalFireDepartmentIcon
              key={index}
              sx={{ 
                color: (isYearly 
                  ? commercialCountYears / (OBJECTIF_ANNUEL / 5) 
                  : commercialCountMount / (OBJECTIF_MENSUEL / 5)
                ) > index ? "#FFA500" : "#ddd" 
              }}
            />
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default ProgressionSection;

import Wave from "react-wavify";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, Typography } from "@mui/material";

// Composant pour la progression avec les flammes et la vague animée
const ProgressionSection = ({ commercialCountMount, commercialCountYears, isYearly }) => {
  const OBJECTIF_MENSUEL = 10;
  const OBJECTIF_ANNUEL = 120;
  const BASE_HEIGHT = 0; // La vague commence avec une hauteur de 0%

  // Calcul de la progression en pourcentage
  const computedProgression = isYearly
    ? Math.min((commercialCountYears / OBJECTIF_ANNUEL) * 100, 100)
    : Math.min((commercialCountMount / OBJECTIF_MENSUEL) * 100, 100);

  // Nombre de flammes à allumer (entre 0 et 5)
  const flamesToLight = isYearly
    ? Math.round((commercialCountYears / OBJECTIF_ANNUEL) * 5)
    : Math.round((commercialCountMount / OBJECTIF_MENSUEL) * 5);


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
        {Math.round(computedProgression)}%
      </Typography>

      {/* Vague animée */}
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
          bottom: "0%",
          width: "100%",
          height: `${BASE_HEIGHT + (computedProgression * (100 - BASE_HEIGHT) / 100)}%`,
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

        {/* Flammes */}
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center", mt: 1 }}>
          {Array.from({ length: 5 }, (_, index) => (
            <LocalFireDepartmentIcon
              key={index}
              sx={{
                color: index < flamesToLight ? "#FFA500" : "#ddd",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressionSection;
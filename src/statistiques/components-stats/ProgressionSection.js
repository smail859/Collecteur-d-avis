import Wave from "react-wavify";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, Typography } from "@mui/material";

// Composant pour la progression avec les flammes et la vague animée
const ProgressionSection = ({ progression = 0, top3 = [] }) => {
  // Récupération du nombre d'avis du premier commercial du top 3 (avec gestion du cas vide)
  const avisPremierCommercial = top3.length > 0 ? top3[0].avis : 0;

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
        overflow: "hidden", // Empêche la vague de dépasser
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
          zIndex: 2, // S'assure que le texte est au-dessus de la vague
        }}
      >
        {progression}%
      </Typography>

      {/* Vague animée */}
      <Wave
        fill="#8B5CF6"
        paused={false}
        options={{
          height: 10, // Contrôle la hauteur de la vague
          amplitude: 20, // Gère l’ondulation
          speed: 0.3, // Vitesse de l'animation
          points: 3, // Nombre de vagues
        }}
        style={{
          position: "absolute",
          bottom: `${80 - progression}%`, // Monte en fonction de la progression
          width: "100%",
          height: "80%",
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
          {avisPremierCommercial >= 5 ? (
            "Bravo, vous avez atteint votre objectif du mois !"
          ) : (
            <>
              Plus que{" "}
              <span style={{ color: "white", fontWeight: "bold" }}>
                {5 - avisPremierCommercial} avis
              </span>
            </>
          )}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          {Array.from({ length: 5 }, (_, index) => (
            <LocalFireDepartmentIcon
              key={index}
              sx={{ color: avisPremierCommercial > index ? "#FFA500" : "#ddd" }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressionSection;

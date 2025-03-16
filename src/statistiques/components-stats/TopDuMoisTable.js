import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

// Composant pour afficher le Top du mois
const TopDuMoisTable = ({ top3, selectedCommercial, selectedCommercialData, selectedRank, isSelectedInTop3, isSelectedCommercialValid }) => {
  
  const getRankStyle = (rank, isActive) => ({
    background: isActive ? "red" : rank === 1 ? "linear-gradient(to right, #8B5CF6, #2972FF)" : rank === 2 ? "transparent" : rank === 3 ? "#FFF" : "transparent",
    color : isActive ? "white" : "black",
    borderBottom: "none"
  });

  const getTrendIcon = (trend) => {
    if (trend === "up") return <ArrowOutwardIcon sx={{ color: 'green' }} />;
    if (trend === "down") return <SouthEastIcon sx={{ color: 'red' }} />;
    return <HorizontalRuleIcon />;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "auto",
        bgcolor: "#F2F3FB",
        marginTop: "20px",
        borderRadius: "20px",
        padding: "20px",
        fontSize: "20px"
      }}
    >
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", padding: "12px", borderRadius: "10px", color: "#8B5CF6" }}>
          <Box sx={{ flex: 1, fontWeight: "900" }}>Top du mois</Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>Avis</Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>Gains bruts</Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>Gains nets</Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>Note moyenne</Box>
        </Box>

        {/* Affichage du top 3 */}
        {top3.map((commercial, index) => {
          const isActive = commercial.name === selectedCommercial;

          // Calcul des gains nets (plafonnés)
          let gainNet = commercial.avis * 10;
          if (commercial.name === "Lucas" || commercial.name === "Smaïl") gainNet = Math.min(gainNet, 200);
          else gainNet = Math.min(gainNet, 100);

          return (
            <Box key={commercial.name} sx={{ display: "flex", alignItems: "center", padding: "16px", borderRadius: "20px", ...getRankStyle(commercial.top, isActive) }}>
              {/* Rang + Nom */}
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1, fontWeight: "bold", color: commercial.top === 1 ? "white" : "black" }}>
                <Box sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                  backgroundColor: isActive ? "red" : commercial.top === 1 ? "#FF8C00" : commercial.top === 2 ? "#FF007F" : "#FF0063",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  color: "white",
                }}>
                  {index + 1}
                </Box>
                {commercial.name}
              </Box>

              {/* Avis reçus */}
              <Box sx={{ flex: 1, textAlign: "center",color: commercial.top === 1 ? "white" : "black" }}>{commercial.avis}</Box>

              {/* Gains bruts */}
              <Box sx={{ flex: 1, textAlign: "center",color: commercial.top === 1 ? "white" : "black" }}>{commercial.avis * 10}€</Box>

              {/* Gains nets */}
              <Box sx={{ flex: 1, textAlign: "center", color: commercial.top === 1 ? "white" : "black" }}>{gainNet}€</Box>

              {/* Note moyenne sur 10 */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  fontSize: "16px",
                  backgroundColor: "white",
                  padding: "8px 12px",
                  maxWidth: "131px",
                  maxHeight: "62px",
                  borderRadius: "10px",
                  margin: "auto",
                  boxShadow: commercial.top === 3 ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "none",
                }}
              >
                {getTrendIcon(commercial.trend)}
                <strong>{(commercial.avis / 10).toFixed(1)} <StarIcon sx={{ color: "gold" }} /></strong>
              </Box>
            </Box>
          );
        })}

        {/* Affichage du commercial sélectionné si hors top 3 */}
        {!isSelectedInTop3 && isSelectedCommercialValid && selectedRank > 3 && (
          <Box key={selectedCommercial} sx={{ display: "flex", alignItems: "center", padding: "16px", borderRadius: "20px", backgroundColor: "red" }}>
            {/* Rang + Nom */}
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1, fontWeight: "bold", color: "white" }}>
              <Box sx={{
                width: "50px",
                height: "50px",
                borderRadius: "15px",
                backgroundColor: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                color: "white",
              }}>
                {selectedRank}
              </Box>
              {selectedCommercialData.name}
            </Box>

            {/* Avis reçus */}
            <Box sx={{ flex: 1, textAlign: "center", color: "white" }}>
              {selectedCommercialData.count}
            </Box>

            {/* Gains bruts */}
            <Box sx={{ flex: 1, textAlign: "center", color: "white" }}>
              {selectedCommercialData.count * 10}€
            </Box>

            {/* Gains nets */}
            <Box sx={{ flex: 1, textAlign: "center", color: "white" }}>
              {selectedCommercialData.count * 10}€
            </Box>

            {/* Note moyenne sur 10 */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                fontSize: "16px",
                backgroundColor: "white",
                padding: "8px 12px",
                maxWidth: "131px",
                maxHeight: "62px",
                borderRadius: "10px",
                margin: "auto",
              }}
            >
              <strong>{(selectedCommercialData.count / 10).toFixed(1)} <StarIcon sx={{ color: "gold" }} /></strong>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TopDuMoisTable;
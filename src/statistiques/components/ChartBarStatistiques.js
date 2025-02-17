import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/system";
import StarIcon from "@mui/icons-material/Star";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import PropTypes from "prop-types";

// Barre de progression personnalisée
const CustomLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    '& .MuiLinearProgress-bar': {
      borderRadius: 5,
      backgroundImage: 'linear-gradient(to right, #1CB5E0, #e01cd5)',
    },
}));

const ChartBarStatistiques = ({ data, rows, progression }) => {
  const getRankStyle = (rank) => ({
    background: rank === 1 ? "linear-gradient(to right, #8B5CF6, #2972FF)" : rank === 2 ? "transparent" : rank === 3 ? "#FFF" : "transparent", 
    color: "black",
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
        justifyContent: "space-between", 
        alignItems: "flex-start",
        maxWidth: "1600px",
        height: "auto",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "20px",
        bgcolor: "white",
        gap: 3,
      }}
    >
      {/* Partie gauche : Statistiques en Grid */}
      <Box sx={{ flex: 1 }}>
        <Grid container spacing={4}>
          {data.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                  height: "200px",
                  borderRadius: 2,
                  bgcolor: "#F2F3FB",
                  padding: "20px"
                }}
              >
                <Box>
                  {/* Barre verte pour les gains */}
                  {item.type === "money" && (
                    <CustomLinearProgress variant="determinate" value={75} sx={{ width: "120px", height: "18px", bgcolor: "white", borderRadius: "7px", marginBottom: "10px" }} />
                  )}

                  {/* Étoiles pour les avis */}
                  {item.type === "rating" && (
                    <Rating value={item.stars} precision={0.5} readOnly />
                  )}
                  
                  {/* Texte */}
                  <Typography variant="body1" sx={{ fontWeight: "bold", marginTop: "8px" }}>
                    {item.text}
                  </Typography>

                  {/* Nombre total */}
                  <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: "8px", fontSize: "100px", color: "#8B5CF6" }}>
                    {item.total}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Tableau Top du mois */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "480px",
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

            {rows.map((row) => (
              <Box key={row.top} sx={{ display: "flex", alignItems: "center", padding: "16px", borderRadius: "20px", ...getRankStyle(row.top) }}>
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1, fontWeight: "bold", color: row.top === 1 ? "white" : "black" }}>
                  <Box sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "15px",
                    backgroundColor: row.top === 1 ? "#FF8C00" : row.top === 2 ? "#FF007F" : "#FF0063",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}>
                    {row.top}
                  </Box>
                  {row.name}
                </Box>
                <Box sx={{ flex: 1, textAlign: "center", color: row.top === 1 ? "white" : "black" }}>{row.avis}</Box>
                <Box sx={{ flex: 1, textAlign: "center",color: row.top === 1 ? "white" : "black"  }}>{row.gainBruts}</Box>
                <Box sx={{ flex: 1, textAlign: "center", color: row.top === 1 ? "white" : "black"  }}>{row.gainNets}</Box>
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
                    boxShadow: row.top === 3 ? " rgba(149, 157, 165, 0.2) 0px 8px 24px;" : 'none',
                  }}
                >
                  {getTrendIcon(row.trend)}
                  <strong>{row.noteMoyenne} <StarIcon sx={{ color: "gold" }} /></strong>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Partie droite : Progression */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "240px",
        height: "700px",
        borderRadius: 2,
        bgcolor: "#F2F3FB",
        flexShrink: 0,
      }}>
        <Box sx={{ width: "100%", height: "80%", background: "linear-gradient(180deg, #6A5ACD 0%, #7B68EE 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h2" fontWeight="bold" color="white">
            {progression}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Validation avec PropTypes
ChartBarStatistiques.propTypes = {
  data: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  progression: PropTypes.number.isRequired,
};

export default ChartBarStatistiques;

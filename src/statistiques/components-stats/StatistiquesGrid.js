import { Typography, Box, Grid, LinearProgress, styled, Rating } from "@mui/material";
import PropTypes from "prop-types";

const StatistiquesGrid = ({ data = [], selectedCommercial, isYearly = false, totalAvisParCommercialParService = {} }) => {

  // Vérification de la structure des données
  const totalAvis = totalAvisParCommercialParService || {};

  // Normalisation du texte
  const normalizeText = (text) =>
    text ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  // Recherche des données mensuelles
  const selectedData = data.find(
    (item) =>
      normalizeText(item.label.trim()) === normalizeText(selectedCommercial.trim())
  );
  
  if (!selectedData) {
    return <Typography>Aucune donnée disponible pour ce commercial.</Typography>;
  }
  

  // Total annuel (extrait de l'objet global)
  const normalizedCommercial = normalizeText(selectedCommercial);
  const nombreAvisYears = totalAvis[normalizedCommercial] || 0;
  // Total mensuel (extrait de selectedData)
  const nombreAvis = selectedData.count || 0;


  const objectifMensuelle = 5;
  const objectifAnnuel = 60; // Ajusté si besoin

  const gainsBruts = nombreAvis * 10;
  const gainsNets = (gainsBruts * 7.96) / 10;

  const gainsBrutsYears = nombreAvisYears * 10;
  const gainsNetsYears = (gainsBrutsYears * 7.96) / 10;

  const progression = nombreAvis > 0 ? Math.min((nombreAvis / objectifMensuelle) * 100, 100) : 0;
  const progressionYears =
    nombreAvisYears > 0 ? Math.min((nombreAvisYears / objectifAnnuel) * 100, 100) : 0;

  // Style Progress Bar
  const CustomLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    "& .MuiLinearProgress-bar": {
      borderRadius: 5,
      backgroundImage: "linear-gradient(to right, #B4EC51, #429321)",
    },
  }));


  return (
    <Box>
      <Grid container sx={{ display: "flex", flexDirection: "row", justifyContent: "start", gap: 10, marginLeft: "70px" }}>
        {!isYearly && (
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ width: "350px", height: "240px", borderRadius: 2, bgcolor: "#F2F3FB", padding: "34px" }}>
              <Rating value={5} precision={0.5} readOnly />
              <Typography variant="h6" sx={{ fontWeight: "400", color: "#8B5CF6" }}>
                <span style={{ fontWeight: "bold" }}>Total</span> d'avis collectés
              </Typography>
              <Typography variant="h1" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "120px" }}>
                {nombreAvis}
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Nombre d'avis annuels */}
        {isYearly && (
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ width: "350px", height: "240px", borderRadius: 2, bgcolor: "#F2F3FB", padding: "34px" }}>
              <Rating value={5} precision={0.5} readOnly />
              <Typography variant="h6" sx={{ fontWeight: "400", color: "#8B5CF6" }}>
                <span style={{ fontWeight: "bold" }}>Total</span> d'avis annuels
              </Typography>
              <Typography variant="h1" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "120px" }}>
                {nombreAvisYears}
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Gains bruts */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: "350px", height: "240px", borderRadius: 2, bgcolor: "#F2F3FB", padding: "34px" }}>
            <CustomLinearProgress variant="determinate" value={isYearly ? progressionYears : progression} sx={{ width: "100%", height: "18px", marginBottom: "10px", maxWidth: "120px" }} />
            <Typography variant="h6">
              <span style={{ fontWeight: "bold" }}>Gains</span> bruts (€)
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "90px" }}>
              {isYearly ? gainsBrutsYears : gainsBruts}€
            </Typography>
          </Box>
        </Grid>

        {/* Gains nets */}
        <Grid item xs={12} sm={6} md={2}>
          <Box sx={{ width: "350px", height: "240px", borderRadius: 2, bgcolor: "#F2F3FB", padding: "34px" }}>
            <CustomLinearProgress variant="determinate" value={isYearly ? progressionYears : progression} sx={{ width: "120px", height: "18px", marginBottom: "10px" }} />
            <Typography variant="h6">
              <span style={{ fontWeight: "bold" }}>Gains</span> nets (€)
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "70px" }}>
              {isYearly ? gainsNetsYears.toFixed(2) : gainsNets.toFixed(2)}€
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Validation des props
StatistiquesGrid.propTypes = {
  data: PropTypes.array.isRequired,
  selectedCommercial: PropTypes.string.isRequired,
  isYearly: PropTypes.bool,
  totalAvisParCommercialParService: PropTypes.object,
};

export default StatistiquesGrid;

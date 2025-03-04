import { Typography, Box, Grid, LinearProgress, styled, Rating } from "@mui/material";
import PropTypes from "prop-types";

const StatistiquesGrid = ({ data = [], selectedCommercial, isYearly = false, commercialCountsYears }) => {
  const CustomLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    "& .MuiLinearProgress-bar": {
      borderRadius: 5,
      backgroundImage: "linear-gradient(to right, #1CB5E0, #e01cd5)",
    },
  }));

  if (!selectedCommercial) {
    return <Typography color="error">Aucun commercial sélectionné.</Typography>;
  }

  const normalizeText = (text) =>
    text ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  const selectedData = data.find((item) => normalizeText(item.label) === normalizeText(selectedCommercial));

  if (!selectedData) {
    return <Typography>Aucune donnée disponible pour ce commercial.</Typography>;
  }

  const selectedDataYears = commercialCountsYears.totalAvisParCommercial[selectedCommercial] || 0;


  // Calcul des gains
  const nombreAvis = selectedData.count;
  const nombreAvisYears = selectedDataYears;
  const gainsBruts = nombreAvis * 10; // 10€ par avis
  const gainsNets = (gainsBruts * 7.96) / 10; // Gains nets avec un coefficient
  const progression = nombreAvis > 0 ? (nombreAvis / gainsBruts) * 100 : 0;

  return (
    <Box>
      <Typography variant="h5" textAlign="left" mt={3} mb={2}>
        {isYearly ? "Statistiques annuelles" : "Statistiques mensuelles"}
      </Typography>

      <Grid container spacing={5}>
        {/* Nombre d'avis (uniquement en mode mensuel) */}
        {!isYearly && (
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ width: "290px", height: "240px", borderRadius: 2, bgcolor: "#F2F3FB", padding: "34px" }}>
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


        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: "290px", height: "240px", borderRadius: 2, bgcolor: "#F2F3FB", padding: "34px" }}>
            <Rating value={5} precision={0.5} readOnly />
            <Typography variant="h6" sx={{ fontWeight: "400", color: "#8B5CF6" }}>
              <span style={{ fontWeight: "bold" }}>Total</span> d'avis collectés
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "120px" }}>
              {nombreAvisYears}
            </Typography>
          </Box>
        </Grid>
        

        {/* Gains bruts */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: "290px", height: "240px", borderRadius: 2, bgcolor: "#F2F3FB", padding: "34px" }}>
            <CustomLinearProgress variant="determinate" value={progression} sx={{ width: "120px", height: "18px", marginBottom: "10px" }} />
            <Typography variant="h6">
              <span style={{ fontWeight: "bold" }}>Gains</span> bruts (€)
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "90px" }}>
              {gainsBruts}€
            </Typography>
          </Box>
        </Grid>

        {/* Gains nets */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ width: "290px", height: "240px", borderRadius: 2, bgcolor: "#F2F3FB", padding: "34px" }}>
            <CustomLinearProgress variant="determinate" value={progression} sx={{ width: "120px", height: "18px", marginBottom: "10px" }} />
            <Typography variant="h6">
              <span style={{ fontWeight: "bold" }}>Gains</span> nets (€)
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "70px" }}>
              {gainsNets.toFixed(2)}€
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Validation des props
StatistiquesGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedCommercial: PropTypes.string,
  isYearly: PropTypes.bool,
};

export default StatistiquesGrid;

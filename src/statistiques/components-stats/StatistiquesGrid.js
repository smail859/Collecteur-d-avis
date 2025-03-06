import { Typography, Box, Grid, LinearProgress, styled, Rating } from "@mui/material";
import PropTypes from "prop-types";
import useFetchReviews from "../../hooks/components/useFetchReviews";

const StatistiquesGrid = ({ data = [], selectedCommercial, isYearly = false }) => {
  const { commercialCountsYears } = useFetchReviews();
  const totalAvis = commercialCountsYears?.totalAvisParCommercial || [];

  const CustomLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    overflow: "hidden", // Empêche tout dépassement
    "& .MuiLinearProgress-bar": {
      borderRadius: 5,
      backgroundImage: "linear-gradient(to right, #B4EC51, #429321)", 
      boxShadow: "none", 
    },
  }));
  

  if (!selectedCommercial) {
    return <Typography color="error">Aucun commercial sélectionné.</Typography>;
  }

  const normalizeText = (text) =>
    text ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  const selectedData = data.find((item) => normalizeText(item.label) === normalizeText(selectedCommercial));

  const selectedYearlyData = totalAvis.find((item) => normalizeText(item.label) === normalizeText(selectedCommercial));

  if (!selectedData) {
    return <Typography>Aucune donnée disponible pour ce commercial.</Typography>;
  }

  // Calcul des avis et des gains
  const nombreAvis = selectedData.count;
  const nombreAvisYears = selectedYearlyData ? selectedYearlyData.count : 0;
  
  const objectifMensuelle = 60;
  const gainsBruts = nombreAvis * 10; // 10€ par avis
  const gainsNets = (gainsBruts * 7.96) / 10; // Gains nets avec un coefficient
  const progression = Math.min((nombreAvis / objectifMensuelle) * 100, 100);

  const gainsBrutsYears = nombreAvisYears * 10;
  const gainsNetsYears = (gainsBrutsYears * 7.96) / 10;
  const objectifAnnuel = 60;
  const progressionYears = Math.min((nombreAvisYears / objectifAnnuel) * 100, 100);


  return (
    <Box>
      <Typography variant="h5" textAlign="left" mt={3} mb={2}>
        {isYearly ? "Statistiques annuelles" : "Statistiques mensuelles"}
      </Typography>

      <Grid container sx={{display: "flex", flexDirection: "row", justifyContent: "start", gap: 10, marginLeft: "70px"}}>
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
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedCommercial: PropTypes.string.isRequired,
  isYearly: PropTypes.bool,
};

export default StatistiquesGrid;

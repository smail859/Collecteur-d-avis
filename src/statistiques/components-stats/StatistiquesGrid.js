import { Typography, Box, Grid, LinearProgress, styled, Rating, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const StatistiquesGrid = ({
  data = [],
  selectedCommercial,
  isYearly = false,
  totalAvisParCommercialParService = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const normalizeText = (text) =>
    text ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  const selectedData =
    data.find((item) => normalizeText(item.label.trim()) === normalizeText(selectedCommercial.trim())) || {};

  const normalizedCommercial = normalizeText(selectedCommercial);
  const nombreAvisYears = totalAvisParCommercialParService[normalizedCommercial] || 0;
  const nombreAvis = selectedData.count || 0;

  const objectifMensuelle = 5;
  const objectifAnnuel = 60;

  const gainsBruts = nombreAvis * 10;
  const gainsNets = (gainsBruts * 7.96) / 10;

  const gainsBrutsYears = nombreAvisYears * 10;
  const gainsNetsYears = (gainsBrutsYears * 7.96) / 10;

  const progression = Math.min((nombreAvis / objectifMensuelle) * 100, 100);
  const progressionYears = Math.min((nombreAvisYears / objectifAnnuel) * 100, 100);

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
    <Box sx={{ width: "100%", px: isMobile ? 2 : 6, mt: 4 }}>
      <Grid
        container
        spacing={isMobile ? 2 : 4}
        justifyContent={isMobile ? "center" : "start"}
      >
        {/* Carte total d'avis */}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              width: "100%",
              height: isMobile ? "180px" : "240px",
              borderRadius: 2,
              bgcolor: "#F2F3FB",
              padding: isMobile ? 2 : 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Rating value={5} precision={0.5} readOnly />
            <Typography variant="h6" sx={{ fontWeight: 400, color: "#8B5CF6" }}>
              <span style={{ fontWeight: "bold" }}>Total</span> d'avis {isYearly ? "annuels" : "ce mois"}
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                color: "#8B5CF6",
                fontSize: isMobile ? "54px" : "120px",
              }}
            >
              {isYearly ? nombreAvisYears : nombreAvis}
            </Typography>
          </Box>
        </Grid>

        {/* Carte gains bruts */}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              width: "100%",
              height: isMobile ? "180px" : "240px",
              borderRadius: 2,
              bgcolor: "#F2F3FB",
              padding: isMobile ? 2 : 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CustomLinearProgress
              variant="determinate"
              value={isYearly ? progressionYears : progression}
              sx={{
                width: "100%",
                height: "18px",
                marginBottom: "10px",
                maxWidth: "120px",
              }}
            />
            <Typography variant="h6">
              <span style={{ fontWeight: "bold" }}>Gains</span> bruts (€)
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#8B5CF6",
                fontSize: isMobile ? "42px" : "90px",
              }}
            >
              {isYearly ? gainsBrutsYears : gainsBruts}€
            </Typography>
          </Box>
        </Grid>

        {/* Carte gains nets */}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              width: "100%",
              height: isMobile ? "180px" : "240px",
              borderRadius: 2,
              bgcolor: "#F2F3FB",
              padding: isMobile ? 2 : 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CustomLinearProgress
              variant="determinate"
              value={isYearly ? progressionYears : progression}
              sx={{ width: "120px", height: "18px", marginBottom: "10px" }}
            />
            <Typography variant="h6">
              <span style={{ fontWeight: "bold" }}>Gains</span> nets (€)
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#8B5CF6",
                fontSize: isMobile ? "36px" : "70px",
              }}
            >
              {(isYearly ? gainsNetsYears : gainsNets).toFixed(2)}€
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

StatistiquesGrid.propTypes = {
  data: PropTypes.array.isRequired,
  selectedCommercial: PropTypes.string.isRequired,
  isYearly: PropTypes.bool,
  totalAvisParCommercialParService: PropTypes.object,
};

export default StatistiquesGrid;

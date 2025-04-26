import {
  Typography,
  Box,
  Grid,
  Rating,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import StatCard from "./StatCard"

const StatistiquesGrid = ({
  data = [],
  selectedCommercial,
  isYearly = false,
  totalAvisParCommercialParService = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const normalizeText = (text) =>
    text
      ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      : "";

  const selectedData =
    data.find(
      (item) =>
        normalizeText(item.label.trim()) ===
        normalizeText(selectedCommercial.trim())
    ) || {};

  const normalizedCommercial = normalizeText(selectedCommercial);
  const nombreAvisYears =
    totalAvisParCommercialParService[normalizedCommercial] || 0;
  const nombreAvis = selectedData.count || 0;

  const objectifMensuelle = 10;
  const objectifAnnuel = 60;

  const gainsBruts = nombreAvis * 10;
  const gainsNets = (gainsBruts * 7.96) / 10;

  const gainsBrutsYears = nombreAvisYears * 10;
  const gainsNetsYears = (gainsBrutsYears * 7.96) / 10;

  const progression = Math.min((nombreAvis / objectifMensuelle) * 100, 100);
  const progressionYears = Math.min(
    (nombreAvisYears / objectifAnnuel) * 100,
    100
  );


  return (
    <Box
      sx={{
        width: "100%",
        px: isMobile ? 2 : 6,
        mt: 1,
      }}
    >
      <Grid
        container
        spacing={isMobile ? 3 : 4}
        justifyContent={isMobile ? "center" : "start"}
        alignItems="center"
      >
        {/* Carte total d'avis */}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              width: "100%",
              maxWidth: "300px",
              height: isMobile ? "180px" : "240px",
              borderRadius: 3,
              bgcolor: "#F6F7FE",
              padding: isMobile ? 2 : 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              mx: "auto",
              boxShadow: "0px 4px 10px rgba(139, 92, 246, 0.1)",
            }}
          >
            <Rating value={5} precision={0.5} readOnly />
            <Typography sx={{ fontWeight: 400, fontSize: "16px", mt: "10px" }}>
              <span style={{ fontWeight: "bold", color: "#8B5CF6" }}>
                Total
              </span>{" "}
              <span style={{ color: "#8B5CF6" }}>d'avis collectés</span>{" "}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                color: "#8B5CF6",
                fontSize: isMobile ? "54px" : "100px",
              }}
            >
              {isYearly ? nombreAvisYears : nombreAvis}
            </Typography>
          </Box>
        </Grid>

        {/* Carte gains bruts */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="bruts"
            value={isYearly ? gainsBrutsYears : gainsBruts}
            progress={isYearly ? progressionYears : progression}
          />
        </Grid>

        {/* Carte gains nets */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="nets"
            value={(isYearly ? gainsNetsYears : gainsNets).toFixed(0)}
            progress={isYearly ? progressionYears : progression}
          />
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

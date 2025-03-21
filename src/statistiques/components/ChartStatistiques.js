import { Box } from "@mui/material";
import PropTypes from "prop-types";
import ProgressionSection from "../components-stats/ProgressionSection";
import TopDuMoisTable from "../components-stats/TopDuMoisTable";
import StatistiquesGrid from "../components-stats/StatistiquesGrid";

const ChartStatistiques = ({ data, tableauCommerciaux, selectedCommercial }) => {
  // Trier et extraire le top 3
  const top3 = [...tableauCommerciaux]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((commercial, index) => ({
      top: index + 1,
      name: commercial.name,
      avis: commercial.count,
      gainBruts: `${commercial.count * 10}€`,
      gainNets: `${commercial.count * 10}€`,
      trend: index === 0 ? "up" : index === 1 ? "neutral" : "down",
    }));

  const normalizeText = (text) => {
    if (!text || typeof text !== "string") {
      return "";
    }
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  

    

  const selectedCommercialData = tableauCommerciaux.find(
    com => normalizeText(com.name) === normalizeText(selectedCommercial)
  );

  const OBJECTIF_MENSUEL = 5;
  const commercialCountMount = selectedCommercialData ? selectedCommercialData.count : 0;
  const progressionCommercial = selectedCommercial
    ? Math.min(100, Math.round((commercialCountMount / OBJECTIF_MENSUEL) * 100))
    : 0;
  




  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        maxWidth: "1600px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "20px",
        bgcolor: "white",
        gap: 3,
      }}
    >
      {/* Bloc des statistiques et tableau */}
      <Box sx={{ flex: 1 }}>
        <StatistiquesGrid data={data} selectedCommercial={selectedCommercial} />

        {/* Tableau Top du Mois */}
        <Box sx={{ marginTop: "30px", bgcolor: "#F2F3FB", borderRadius: "20px", padding: "20px" }}>
          <TopDuMoisTable
            top3={top3}
            selectedCommercial={selectedCommercial}
            selectedCommercialData={selectedCommercialData}
          />
        </Box>
      </Box>

      {/* Bloc de progression */}
      <Box
        sx={{
          width: "275px",
          height: "700px",
          borderRadius: "20px",
          bgcolor: "#F2F3FB",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ProgressionSection
          progression={progressionCommercial}
          commercialCountMount={commercialCountMount}
          isYearly={false}
          selectedCommercial={selectedCommercial}
        />
      </Box>
    </Box>
  );
};



// Validation avec PropTypes
ChartStatistiques.propTypes = {
  data: PropTypes.array.isRequired,
  progression: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
  tableauCommerciaux: PropTypes.array.isRequired,
  selectedCommercial: PropTypes.string.isRequired,
};

export default ChartStatistiques;
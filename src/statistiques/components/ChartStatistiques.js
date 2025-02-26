import { useMemo } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import ChartBarStatistiques from "./ChartBarStatistiques";
import ProgressionSection from "../components-not-use/ProgressionSection";
import TopDuMoisTable from "../components-not-use/TopDuMoisTable";
import StatistiquesGrid from "../components-not-use/StatistiquesGrid";

const ChartStatistiques = ({ data, progression, tableauCommerciaux, selectedCommercial }) => {
  // Trier et extraire le top 3
  const top3 = useMemo(() => {
    return [...tableauCommerciaux]
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
  }, [tableauCommerciaux]);

  const normalizeText = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Vérifier si le commercial sélectionné est dans le top 3
  const isSelectedInTop3 = top3.some(com => normalizeText(com.name) === normalizeText(selectedCommercial));

  // Trouver les données du commercial sélectionné
  const selectedCommercialData = tableauCommerciaux.find(
    com => normalizeText(com.name) === normalizeText(selectedCommercial)
  );

  // Trouver le rang du commercial sélectionné
  const sortedCommercials = [...tableauCommerciaux].sort((a, b) => b.count - a.count);
  const selectedRank = sortedCommercials.findIndex(
    com => normalizeText(com.name) === normalizeText(selectedCommercial)
  ) + 1;

  const isSelectedCommercialValid = selectedCommercialData !== undefined;

  // Données pour le graphique
  const ratingData = [
    { rank: 1, label: "4 - 5", value:  80 },
    { rank: 2, label: "1 - 2", value:  20 },
  ];
  const colors = ["#7B61FF", "#E3E4FE"];

  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDirection: "row",
        maxWidth: "1600px",
        height: "auto",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "20px",
        bgcolor: "white",
        gap: 3,
      }}
    >
      <StatistiquesGrid data={data} selectedCommercial={selectedCommercial} colors={colors} ratingData={ratingData}/>

      <TopDuMoisTable
        top3={top3}
        selectedCommercial={selectedCommercial}
        selectedCommercialData={selectedCommercialData}
        selectedRank={selectedRank}
        isSelectedInTop3={isSelectedInTop3}
        isSelectedCommercialValid={isSelectedCommercialValid}
      />
      <ProgressionSection progression={progression} top3={top3} />
      {/* <ChartBarStatistiques data={data} /> */}
    </Box>

    
  );
};

// Validation avec PropTypes
ChartStatistiques.propTypes = {
  data: PropTypes.array.isRequired,
  progression: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
  ratingData: PropTypes.array.isRequired,
  tableauCommerciaux: PropTypes.array.isRequired,
  selectedCommercial: PropTypes.string.isRequired,
};

export default ChartStatistiques;

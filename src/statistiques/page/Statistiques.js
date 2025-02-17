import ChartStatistiques from "../components/ChartStatistiques";
import ChartBarStatistiques from "../components/ChartBarStatistiques";
import Box from "@mui/material/Box";

const Statistiques = () => {
  const rows = [
    { top: 1, name: "Joanna M", avis: "8 avis", gainBruts: "80€", gainNets: "62€", noteMoyenne: 4.8, trend: "down" },
    { top: 2, name: "Mélanie", avis: "7 avis", gainBruts: "70€", gainNets: "54€", noteMoyenne: 4.3, trend: "up" },
    { top: 3, name: "Jean-Simon", avis: "5 avis", gainBruts: "50€", gainNets: "39€", noteMoyenne: 4.1, trend: "neutral" }
  ];

  const data = [
    { id: 1, stars: 4, text: "Total d'avis collectés", total: 8, type: "rating" },
    { id: 2, stars: 0, text: "Gains Bruts (€)", total: 80, type: "money" },
    { id: 3, stars: 0, text: "Gains Nets (€)", total: 62, type: "money" },
    { id: 4, stars: 1.5, text: "Notes (nombre d'étoiles)", type: "chart" },
  ];

  return (
    <Box>
      <ChartStatistiques data={data} rows={rows} progression={80} />
      <ChartBarStatistiques data={data} rows={rows} progression={80} />
      
    </Box>
  );
};

export default Statistiques;

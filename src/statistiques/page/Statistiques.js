import ChartStatistiques from "../components/ChartStatistiques";
import ChartBarStatistiques from "../components/ChartBarStatistiques";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography"
import {useState} from "react"
import MONBIEN from "../../image/MONBIEN.png"
import STARTLOC from "../../image/STARTLOC.png"
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png"
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png"
import SINIMO from "../../image/SINIMO.png"
import PIGEONLINE from "../../image/PIGEONLINE.png"
import ListChip from "../../avisRécents/components/ListChip";


const Statistiques = ({onFilterChange}) => {
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
  const [selected, setSelected] = useState()

  const handleServiceChange = (newService) => {
    if (newService !== null) {
        setSelected(newService);
        if (typeof onFilterChange === "function") {
            onFilterChange(newService);
        } else {
            console.warn("onFilterChange is not a function");
        }
    }
  };
    
  const servicesChip = [
    {
      label: "Monbien",
      icon: MONBIEN, 
    },
    {
      label: "Startloc",
      icon: STARTLOC,
    },
    {
      label: "Sinimo",
      icon: SINIMO,
    },
    {
      label: "Pige Online",
      icon: PIGEONLINE,
    },
    {
      label: "Marketing Immobilier",
      icon: MARKETINGIMMO,
    },
    {
      label: "Marketing Automobile",
      icon: MARKETINGAUTO,
    },
    {
      label: "Sav",
      icon: MARKETINGIMMO,
    },
  ];

  const ratingData = [
    { rank: 1, label: "4 - 5", value: 80 },
    { rank: 2, label: "1 - 2", value: 20 },
  ];
  
  const colors = ["#7B61FF", "#E3E4FE"];
  
  
        

  return (
    <Box>
      <Typography variant="h2" textAlign="left" ml="180px" mt="50px" gutterBottom>
        <span style={{ fontWeight: 'bold', color: "#121826"}}>Statistiques détaillées</span>
        <span style={{ color: '#8B5CF6', fontWeight: "200" }}> par collaborateur</span>
      </Typography>
      <ListChip
        servicesChip={servicesChip}
        handleServiceChange={handleServiceChange}
        selected={selected}
        // ne pas oublier d'ajouter un bouton selecte pour selectionne un collaborateurs
      />
        <ChartStatistiques data={data} rows={rows} progression={80} ratingData={ratingData} colors={colors} />
        <Typography variant="subtitle1" textAlign="left" ml="180px" mt="50px" gutterBottom>
          <span style={{ fontWeight: 'bold', color: "#121826"}}>Bilan annuel </span>
          <span style={{ color: '#8B5CF6', fontWeight: "500" }}>de Joanna</span>
        </Typography>
        <ChartBarStatistiques data={data} rows={rows} progression={70} ratingData={ratingData} colors={colors} />
    </Box>
  );
};

export default Statistiques;

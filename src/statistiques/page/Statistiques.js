import ChartStatistiques from "../components/ChartStatistiques";
import ChartBarStatistiques from "../components/ChartBarStatistiques";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import MONBIEN from "../../image/MONBIEN.png";
import STARTLOC from "../../image/STARTLOC.png";
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png";
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png";
import SINIMO from "../../image/SINIMO.png";
import PIGEONLINE from "../../image/PIGEONLINE.png";
import ListChip from "../../avisRécents/components/ListChip";
import useFetchReviews from "../../hooks/components/useFetchReviews";

const Statistiques = () => {

  const { commercialCounts, totalAvisParCommercial} = useFetchReviews();
  
  
  // Données des commerciaux
  const servicesData = [
    { label: "Monbien", icon: MONBIEN, commerciaux: ["Joanna", "Théo"] },
    { label: "Startloc", icon: STARTLOC, commerciaux: ["Mélanie", "Smaïl", "Lucas", "Deborah"] },
    { label: "Sinimo", icon: SINIMO, commerciaux: ["Anaïs"] },
    { label: "Marketing Automobile", icon: MARKETINGAUTO, commerciaux: ["Jean-Simon", "Elodie"] },
    { label: "Marketing Immobilier", icon: MARKETINGIMMO, commerciaux: ["Jean Dupont"] },
    { label: "Pige Online", icon: PIGEONLINE, commerciaux: ["Alice Robert"] },
  ];

  // États : Service et Commercial sélectionnés
  const [selectedService, setSelectedService] = useState("");
  const [selectedCommercial, setSelectedCommercial] = useState("Smaïl");

  // Fonction pour gérer le changement de commercial
  const handleCommercialChange = (serviceLabel, commercial) => {
    setSelectedService(serviceLabel);
    setSelectedCommercial(commercial);
  };

  const tableauCommerciaux = Array.isArray(commercialCounts) ? commercialCounts : [];
  
  // Données pour le graphique
  const ratingData = [
    { rank: 1, label: "4 - 5", value:  80 },
    { rank: 2, label: "1 - 2", value:  20 },
  ];

  const data = tableauCommerciaux.map((commercial, index) => ({
    rank: index + 1,
    label: commercial.name,
    count: commercial.count, 
  }));
  const colors = ["#7B61FF", "#E3E4FE"];
  const progression = 80

  // Partie ChartBar



  return (
    <Box>
      <Typography variant="h2" textAlign="left" ml="180px" mt="50px" gutterBottom>
        <span style={{ fontWeight: "bold", color: "#121826" }}>Statistiques détaillées</span>
        <span style={{ color: "#8B5CF6", fontWeight: "200" }}> par collaborateur</span>
      </Typography>

      {/* Sélection des commerciaux */}
      <ListChip
        servicesChip={servicesData}
        selectedService={selectedService}
        selectedCommercial={selectedCommercial}
        handleCommercialChange={handleCommercialChange}
        variant="select"
      />

      {/* Affichage des statistiques dynamiques */}
      {selectedCommercial && (
        <>
          <Typography variant="h4" textAlign="start" mt={5} marginLeft={20}>
            <span style={{ color: "#8B5CF6", fontWeight: "500" }}>Bilan de {selectedCommercial}</span>
            <span style={{ fontWeight: "bold", color: "#121826" }}> pour le mois en cours</span>
          </Typography>

          <ChartStatistiques
            data={data}
            progression={progression}
            colors={colors}
            ratingData={ratingData}
            selectedCommercial={selectedCommercial}
            tableauCommerciaux={tableauCommerciaux}
          />

          <Typography variant="h4" textAlign="left" ml="180px" mt="50px" gutterBottom>
            <span style={{ fontWeight: "bold", color: "#121826" }}>Bilan annuel </span>
            <span style={{ color: "#8B5CF6", fontWeight: "500" }}>de {selectedCommercial}</span>
          </Typography>
          <ChartBarStatistiques 
            data={data} 
            progression={progression} 
            colors={colors} 
            ratingData={ratingData} 
            selectedCommercial={selectedCommercial} 
            totalAvisParCommercial={totalAvisParCommercial}
          />
        </>
      )}
    </Box>
  );
};

export default Statistiques;

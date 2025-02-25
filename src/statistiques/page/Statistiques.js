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
import useFetchReviews from "../../hooks/components/useFetchReviews"; // Import du hook pour le classement

const Statistiques = () => {
  // Données des commerciaux
  const servicesData = [
    { label: "Monbien", icon: MONBIEN, commerciaux: ["Joanna", "Théo"] },
    { label: "Startloc", icon: STARTLOC, commerciaux: ["Mélanie"] },
    { label: "Sinimo", icon: SINIMO, commerciaux: ["Anaïs"] },
    { label: "Marketing Automobile", icon: MARKETINGAUTO, commerciaux: ["Jean-Simon", "Elodie"] },
    { label: "Marketing Immobilier", icon: MARKETINGIMMO, commerciaux: ["Jean Dupont"] },
    { label: "Pige Online", icon: PIGEONLINE, commerciaux: ["Alice Robert"] },
  ];

  // États : Service et Commercial sélectionnés
  const [selectedService, setSelectedService] = useState("");
  const [selectedCommercial, setSelectedCommercial] = useState("");

  // Fonction pour gérer le changement de commercial
  const handleCommercialChange = (serviceLabel, commercial) => {
    setSelectedService(serviceLabel);
    setSelectedCommercial(commercial);
  };

  // Données dynamiques selon le commercial sélectionné
  const commercialStats = {
    Joanna: { avis: 8, gainBruts: 80, gainNets: 62, progression: 80 },
    Mélanie: { avis: 7, gainBruts: 70, gainNets: 54, progression: 75 },
    "Jean-Simon": { avis: 5, gainBruts: 50, gainNets: 39, progression: 65 },
    "Alice Robert": { avis: 10, gainBruts: 100, gainNets: 78, progression: 90 },
  };

  const stats = commercialStats[selectedCommercial] || { avis: 0, gainBruts: 0, gainNets: 0, progression: 0 };

  // Données pour le graphique
  const ratingData = [
    { rank: 1, label: "4 - 5", value: (stats.avis / 10) * 80 },
    { rank: 2, label: "1 - 2", value: (stats.avis / 10) * 20 },
  ];
  const colors = ["#7B61FF", "#E3E4FE"];

  // 🔥 Récupération du classement des commerciaux pour Startloc
  const { top3, fullRanking } = useFetchReviews();

  // 🔥 Trouver la place du commercial sélectionné
  const selectedRank = fullRanking.findIndex((c) => c.name === selectedCommercial) + 1;
  const isTop3 = selectedRank > 0 && selectedRank <= 3;

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
          <Typography variant="h4" textAlign="center" mt={5}>
            Commercial sélectionné : {selectedCommercial}
          </Typography>

          <ChartStatistiques
            data={[
              { id: 1, stars: 4, text: "Total d'avis collectés", total: stats.avis, type: "rating" },
              { id: 2, stars: 0, text: "Gains Bruts (€)", total: stats.gainBruts, type: "money" },
              { id: 3, stars: 0, text: "Gains Nets (€)", total: stats.gainNets, type: "money" },
              { id: 4, stars: 1.5, text: "Notes (nombre d'étoiles)", type: "chart" },
            ]}
            rows={[
              {
                top: 1,
                name: selectedCommercial,
                avis: `${stats.avis} avis`,
                gainBruts: `${stats.gainBruts}€`,
                gainNets: `${stats.gainNets}€`,
                noteMoyenne: 4.5,
                trend: "up",
              },
            ]}
            progression={stats.progression}
            colors={colors}
            ratingData={ratingData}
            top3={top3} // 🔥 Ajout du Top 3
            fullRanking={fullRanking} // 🔥 Liste complète du classement
            selectedCommercial={selectedCommercial} // 🔥 Commercial sélectionné
            selectedRank={selectedRank} // 🔥 Position du commercial sélectionné
            isTop3={isTop3} // 🔥 Indique s'il est dans le Top 3
          />

          <Typography variant="subtitle1" textAlign="left" ml="180px" mt="50px" gutterBottom>
            <span style={{ fontWeight: "bold", color: "#121826" }}>Bilan annuel </span>
            <span style={{ color: "#8B5CF6", fontWeight: "500" }}>de {selectedCommercial}</span>
          </Typography>

          <ChartBarStatistiques
            data={[
              { id: 1, stars: 4, text: "Total d'avis collectés", total: stats.avis, type: "rating" },
              { id: 2, stars: 0, text: "Gains Bruts (€)", total: stats.gainBruts, type: "money" },
              { id: 3, stars: 0, text: "Gains Nets (€)", total: stats.gainNets, type: "money" },
              { id: 4, stars: 1.5, text: "Notes (nombre d'étoiles)", type: "chart" },
            ]}
            rows={[
              {
                top: 1,
                name: selectedCommercial,
                avis: `${stats.avis} avis`,
                gainBruts: `${stats.gainBruts}€`,
                gainNets: `${stats.gainNets}€`,
                noteMoyenne: 4.5,
                trend: "up",
              },
            ]}
            progression={stats.progression}
            ratingData={ratingData}
            colors={colors}
          />
        </>
      )}
    </Box>
  );
};

export default Statistiques;

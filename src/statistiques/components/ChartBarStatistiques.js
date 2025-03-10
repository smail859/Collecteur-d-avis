import {Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";
import Wave from "react-wavify";
import { useState } from "react";
import StatistiquesGrid from "../components-stats/StatistiquesGrid";
import useFetchReviews from "../../hooks/components/useFetchReviews";
import ProgressionSection from "../components-stats/ProgressionSection"



const ChartBarStatistiques = ({ data, progression, onFilterChange, colors, selectedCommercial, totalAvisParCommercial }) => {
  const [selectedFilter, setSelectedFilter] = useState("gains");
  const { commercialCountsYears } = useFetchReviews();
  const totalAvisGraph = commercialCountsYears?.resultYears || [];
  const normalizeText = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
const selectedCommercialData = totalAvisGraph.map((moisData) => {

  const commercialData = moisData.commerciaux.find(c => 
    normalizeText(c.label) === normalizeText(selectedCommercial)
  );

  const nombreAvis = commercialData ? commercialData.count : 0;
  const gainsBruts = nombreAvis * 10; // 10€ par avis
  const gainsNets = (gainsBruts * 7.96) / 10; // Appliquer le coefficient

  return {
    mois: moisData.mois,
    nombreAvis,
    gainsBruts,
    gainsNets
    };
  });

  
  console.log("Informations sur le commercial sélectionné", selectedCommercialData);  
  console.log("Commercial sélectionné:", selectedCommercial);
  console.log("Données brutes:", totalAvisGraph);

  const OBJECTIF_ANNUEL = 60; // Objectif de l'année

  // Trouver les avis annuels pour le commercial sélectionné
  const selectedCommercialYearData = totalAvisGraph.map((moisData) => {
    const commercialData = moisData.commerciaux.find(c => 
      normalizeText(c.label) === normalizeText(selectedCommercial)
    );

    return {
      mois: moisData.mois,
      nombreAvis: commercialData ? commercialData.count : 0
    };
  });

  // Calcul du total des avis annuels pour le commercial sélectionné
  const commercialCountYears = selectedCommercialYearData.reduce((sum, mois) => sum + mois.nombreAvis, 0);

  const progressionYears = selectedCommercial
  ? Math.min(100, Math.round((commercialCountYears / OBJECTIF_ANNUEL) * 100)) // Max à 100%
  : 0;


  
  

  const handleFilterChange = (_, newValue) => {
    if (newValue !== null) {
      setSelectedFilter(newValue);
      if (onFilterChange) {
        onFilterChange(newValue); 
      }
    }
  };
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        maxWidth: "1600px",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "20px",
        bgcolor: "white",
        gap: 3,
      }}
    >
      <Box sx={{ flex: 1 }}>
          <StatistiquesGrid 
            isYearly={true} 
            data={data}             
            selectedCommercial={selectedCommercial} 
            colors={colors} 
            totalAvisParCommercial={totalAvisParCommercial}
          />

        {/* Toggle Gains / Nombre d'avis */}
        <Box sx={{ bgcolor: "#F2F3FB", borderRadius: "20px", padding: "20px", marginTop: "20px" }}>
          <ToggleButtonGroup
            value={selectedFilter}
            exclusive
            onChange={handleFilterChange}
            sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
          >
            <ToggleButton
              value="avis"
              sx={{
                backgroundColor: selectedFilter === "avis" ? "#8B5CF6" : "white",
                color: selectedFilter === "avis" ? "white" : "#8B5CF6",
                borderRadius: "50px",
                padding: "8px 16px",
                fontWeight: "bold",
                border: "1px solid #8B5CF6",
              }}
            >
              Nombre d'avis
            </ToggleButton>
            <ToggleButton
              value="gains"
              sx={{
                backgroundColor: selectedFilter === "gains" ? "#8B5CF6" : "white",
                color: selectedFilter === "gains" ? "white" : "#8B5CF6",
                borderRadius: "50px",
                padding: "8px 16px",
                fontWeight: "bold",
                border: "1px solid #8B5CF6",
              }}
            >
              Gains (€)
            </ToggleButton>
          </ToggleButtonGroup>

          {selectedCommercial ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={selectedCommercialData}>
                <XAxis dataKey="mois" tick={{ fill: "#8B5CF6", fontWeight: "bold" }} />
                <YAxis tick={{ fill: "#8B5CF6", fontWeight: "bold" }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                
                {selectedFilter === "avis" && (
                  <Bar dataKey="nombreAvis" name="Nombre d'avis" fill="#8B5CF6" barSize={40} radius={[10, 10, 0, 0]} />
                )}

                {selectedFilter === "gains" && (
                  <>
                    <Bar dataKey="gainsBruts" name="Gains Bruts (€)" fill="#FAB245" barSize={40} radius={[10, 10, 0, 0]} />
                    <Bar dataKey="gainsNets" name="Gains Nets (€)" fill="#34A853" barSize={40} radius={[10, 10, 0, 0]} />
                  </>
                )}

              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", color: "#8B5CF6" }}>
              Sélectionnez un commercial pour voir ses statistiques
            </Typography>
          )}

        </Box>
      </Box>



      {/* Bloc de progression */}
      <Box sx={{ width: "275px", height: "760px", borderRadius: "20px", bgcolor: "#F2F3FB", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <ProgressionSection 
          progression={progressionYears} 
          commercialCountMount={0} // On ne gère pas ici les avis mensuels
          commercialCountYears={commercialCountYears} 
          isYearly={true} 
          selectedCommercial={selectedCommercial} 
        />
        <Wave fill="#8B5CF6" paused={false} options={{ height: 10, amplitude: 20, speed: 0.3, points: 3 }} style={{ position: "absolute", bottom: `${60 - progression}%`, width: "100%", height: "80%", zIndex: 1 }} />
      </Box>
    </Box>
  );
};


ChartBarStatistiques.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      totalAvis: PropTypes.number.isRequired,
      gainsBruts: PropTypes.number.isRequired,
      gainsNets: PropTypes.number.isRequired,
    })
  ).isRequired,
  progression: PropTypes.number,
  onFilterChange: PropTypes.func,
  colors: PropTypes.arrayOf(PropTypes.string),
  selectedCommercial: PropTypes.string,
};


export default ChartBarStatistiques;
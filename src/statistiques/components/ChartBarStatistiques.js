import {Typography, Rating, Box, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

import PropTypes from "prop-types";
import Wave from "react-wavify";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useState } from "react";
import StatistiquesGrid from "../components-stats/StatistiquesGrid";



const ChartBarStatistiques = ({ data, progression, onFilterChange, colors, selectedCommercial, totalAvisParCommercial }) => {
  const [selectedFilter, setSelectedFilter] = useState("gains");

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

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <XAxis dataKey="mois" tick={{ fill: "#8B5CF6", fontWeight: "bold" }} />
              <YAxis tick={{ fill: "#8B5CF6", fontWeight: "bold" }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} iconType="circle" />

              {selectedFilter === "gains" ? (
                <>
                  <Bar dataKey="gainsNets" stackId="a" fill="#8B5CF6" barSize={40} radius={[10, 10, 0, 0]} />
                  <Bar dataKey="gainsBruts" stackId="a" fill="#FAB245" barSize={40} radius={[10, 10, 0, 0]} />
                </>
              ) : (
                <Bar dataKey="nombreAvis" fill="#8B5CF6" barSize={40} radius={[10, 10, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Bloc de progression */}
      <Box sx={{ width: "275px", height: "760px", borderRadius: "20px", bgcolor: "#F2F3FB", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <Typography variant="h2" fontWeight="bold" color="white" sx={{ position: "absolute", top: "35%", zIndex: 2 }}>{progression}%</Typography>
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <Typography fontSize="14px" fontWeight="200" color="white">
            Plus que <span style={{ color: "white", fontWeight: "bold"}}>2 avis</span> 
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <LocalFireDepartmentIcon sx={{ color: progression >= 20 ? "#FFA500" : "#ddd" }} />
            <LocalFireDepartmentIcon sx={{ color: progression >= 40 ? "#FFA500" : "#ddd" }} />
            <LocalFireDepartmentIcon sx={{ color: progression >= 60 ? "#FFA500" : "#ddd" }} />
            <LocalFireDepartmentIcon sx={{ color: progression >= 80 ? "#FFA500" : "#ddd" }} />
            <LocalFireDepartmentIcon sx={{ color: progression === 100 ? "#FFA500" : "#ddd" }} />
          </Box>

        </Box>
       
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
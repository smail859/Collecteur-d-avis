import { LinearProgress, Typography, Rating, Box, Grid, Chip, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import Wave from "react-wavify";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useState } from "react";

// Barre de progression personnalisée
const CustomLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: "#E0E0E0",
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundImage: "linear-gradient(to right, #1CB5E0, #e01cd5)",
  },
}));

const dataset = [
  { mois: "Jan", gainsNets: 61, gainsBruts: 80, nombreAvis: 10 },
  { mois: "Fév", gainsNets: 75, gainsBruts: 95, nombreAvis: 20 },
  { mois: "Mars", gainsNets: 90, gainsBruts: 110, nombreAvis: 30 },
  { mois: "Avr", gainsNets: 120, gainsBruts: 150, nombreAvis: 50 },
  { mois: "Mai", gainsNets: 200, gainsBruts: 250, nombreAvis: 70 },
  { mois: "Juin", gainsNets: 250, gainsBruts: 310, nombreAvis: 100 },
  { mois: "Juil", gainsNets: 300, gainsBruts: 380, nombreAvis: 130 },
];

const ChartBarStatistiques = ({ data, progression, onFilterChange, colors, ratingData }) => {
  const [selectedFilter, setSelectedFilter] = useState("gains");

  const handleFilterChange = (_, newValue) => {
    if (newValue !== null) {
      setSelectedFilter(newValue);
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
        <Grid container spacing={4}>
          {data.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={3}>
              <Box sx={{ bgcolor: "#F2F3FB", padding: "20px", borderRadius: 2, width: "290px", height: "240px" }}>
                {item.type === "money" && <CustomLinearProgress variant="determinate" value={75} sx={{ width: "120px", height: "18px", marginBottom: "10px" }} />}
                {item.type === "rating" && <Rating value={item.stars} precision={0.5} readOnly />}
                <Typography variant="body1" fontWeight="bold" mt={1}>{item.text}</Typography>
                <Typography variant="h4" fontWeight="bold" fontSize={"100px"} color="#8B5CF6" mt={1}>{item.total}</Typography>
                {item.type === "chart" && (
                  <Box sx={{ textAlign: "left" }}>
                    <PieChart width={80} height={80}>
                      <Pie data={ratingData} dataKey="value" outerRadius={20}>
                        {ratingData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
                      </Pie>
                    </PieChart>
                    {ratingData.map((entry, index) => (
                      <Chip key={index} icon={<StarIcon sx={{ color: "white" }} />} label={entry.label} sx={{ background: colors[index], color: "white", fontWeight: "bold", marginBottom: 1 }} />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

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
            <BarChart data={dataset}>
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
  data: PropTypes.array.isRequired,
  progression: PropTypes.number.isRequired,
  colors: PropTypes.array,
  ratingData: PropTypes.array,
};

export default ChartBarStatistiques;

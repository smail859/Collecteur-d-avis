import { LinearProgress, Typography, Rating, Box, Grid, Chip } from "@mui/material";
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
  { mois: "Jan", gainsNets: 61, gainsBruts: 80 },
  { mois: "Fév", gainsNets: 75, gainsBruts: 95 },
  { mois: "Mars", gainsNets: 90, gainsBruts: 110 },
  { mois: "Avr", gainsNets: 120, gainsBruts: 150 },
  { mois: "Mai", gainsNets: 200, gainsBruts: 250 },
  { mois: "Juin", gainsNets: 250, gainsBruts: 310 },
  { mois: "Juil", gainsNets: 300, gainsBruts: 380 },
];
console.log(dataset);


const ChartBarStatistiques = ({ data, progression, onFilterChange, colors, ratingData }) => {
  const [selected, setSelected] = useState();

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
            <Grid item key={item.id} xs={12} sm={6} md={3} >
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
        <Box sx={{ bgcolor: "#F2F3FB", borderRadius: "20px", padding: "20px", marginTop: "20px" }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dataset} layout="horizontal">
              <XAxis type="number" domain={[10, 'dataMax']} />
              <YAxis dataKey="mois" type="category" width={40} />
              <Tooltip />
              <Legend />
              <Bar dataKey="gainsNets" fill="#8B5CF6" barSize={1} radius={[5, 5, 0, 0]} />
              <Bar dataKey="gainsBruts" fill="#FAB245" barSize={10} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

      </Box>
      <Box sx={{ width: "275px", height: "700px", borderRadius: "20px", bgcolor: "#F2F3FB", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <Typography variant="h2" fontWeight="bold" color="white" sx={{ position: "absolute", top: "25%", zIndex: 2 }}>{progression}%</Typography>
        <Wave fill="#8B5CF6" paused={false} options={{ height: 10, amplitude: 20, speed: 0.3, points: 3 }} style={{ position: "absolute", bottom: `${70 - progression}%`, width: "100%", height: "80%", zIndex: 1 }} />
        <Box sx={{ position: "absolute", bottom: "20px", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {[20, 40, 60, 80, 100].map((level) => (
              <LocalFireDepartmentIcon key={level} sx={{ color: progression >= level ? "#FFA500" : "#ddd" }} />
            ))}
          </Box>
          <Typography fontSize="14px" fontWeight="200" color="white">Plus que <span style={{ fontWeight: "bold" }}>2 avis</span></Typography>
        </Box>
      </Box>
    </Box>
  );
};

ChartBarStatistiques.propTypes = { data: PropTypes.array.isRequired, progression: PropTypes.number.isRequired, colors: PropTypes.array, ratingData: PropTypes.array };

export default ChartBarStatistiques;

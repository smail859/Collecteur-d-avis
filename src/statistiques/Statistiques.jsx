import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography'
import LinearProgress from "@mui/material/LinearProgress";
import { PieChart } from '@mui/x-charts/PieChart';
import {maxWidth, styled, width } from "@mui/system";
import StarIcon from "@mui/icons-material/Star";
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';


const Statistiques = () => {

  const rows = [
    { top: 1, name: "Joanna M", avis: "8 avis", gainBruts: "80€", gainNets: "62€", noteMoyenne: 4.8, trend: "down" },
    { top: 2, name: "Mélanie", avis: "7 avis", gainBruts: "70€", gainNets: "54€", noteMoyenne: 4.3, trend: "up" },
    { top: 3, name: "Jean-Simon", avis: "5 avis", gainBruts: "50€", gainNets: "39€", noteMoyenne: 4.1, trend: "neutral" }
  ];
  
  const getRankStyle = (rank) => ({
    background: rank === 1 ? "linear-gradient(to right, #8B5CF6, #2972FF)" : rank === 2 ? "transparent" : rank === 3 ? "#FFF" : "transparent", 
    color: "black",
    borderBottom: "none"
  });

  const getTrendIcon = (trend) => {
    if (trend === "up") return <ArrowOutwardIcon sx={{color: 'green'}}/>;
    if (trend === "down") return <SouthEastIcon sx={{color: 'red'}}/>;
    return <HorizontalRuleIcon/>;
  };

  // Styles pour la légende personnalisée
  const LegendContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginLeft: "20px",
    width: 'auto',
    height: 'auto',
  });

  const LegendItem = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
  }));

  const dataChart = [
    { id: 1, label: "4 - 5", value: 75, color: "#8B5CF6" }, // Bleu-Violet
    { id: 2, label: "1 - 2", value: 25, color: "white" }, // blanc
  ];

  const data = [
    { id: 1, stars: 4, text: "Total d'avis collectés", total: 8, type: "rating" },
    { id: 2, stars: 0, text: "Gains Bruts (€)", total: 80, type: "money" },
    { id: 3, stars: 0, text: "Gains Nets (€)", total: 62, type: "money" },
    { id: 4, stars: 1.5, text: "Notes (nombre d'étoiles)", type: "chart" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between", 
        alignItems: "flex-start",
        maxWidth: "1600px",
        height: "auto",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "20px",
        bgcolor: "white",
        gap: 3,
      }}
    >
      {/* Partie gauche : Les 4 Box en Grid */}
      <Box sx={{ flex: 1 }}> 
        <Grid container spacing={4}>
          {data.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                  height: "200px",
                  borderRadius: 2,
                  bgcolor: "#F2F3FB",
                }}
              >
                <Box sx={{margin: "20px", marginBotom: "10px"}}>


                    {/* Barre verte pour les gains */}
                    {item.type === "money" && (
                        <LinearProgress variant="determinate" value={75} sx={{ width: "120px", height: "18px", bgcolor: "white", borderRadius: "7px", marginBottom: "10px", color: "green" }} />
                    )}

                    {/* Étoiles pour les avis */}
                    {item.type === "rating" && (
                        <Rating value={item.stars} precision={0.5} readOnly />
                    )}
                    
                    {/* Texte */}
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", marginTop: "8px",  }}
                      >
                      {item.text}
                    </Typography>

                    {/* Graphique pour les avis */}
                    {item.type === "chart" && (
                       <Box display="flex" alignItems="center" ustifyContent= 'center'>
                       {/* Graphique sans légende intégrée */}
                       <PieChart
                        sx={{ marginTop: "20px", marginLeft: "50px" }}
                        legend={{ hidden: true }} 
                         series={[
                           {
                              data: dataChart,
                              outerRadius: 90, // Augmente la taille du graphique
                              paddingAngle: 3, // Améliore le style
                              cornerRadius: 8, // Arrondit les bords
                           },
                           
                        ]}
                        width={120}
                        height={120}

                       />
                       
                       {/* Légende personnalisée avec icônes */}
                       <LegendContainer>
                         {dataChart.map((item) => (
                           <LegendItem key={item.id} style={{ backgroundColor: item.color }}>
                             <StarIcon style={{ color: "gold" }} />
                             <Typography variant="body2">
                               {item.label}
                             </Typography>
                           </LegendItem>
                         ))}
                       </LegendContainer>
                     </Box>
                    )}

                    
                    {/* Nombre total */}
                    <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", marginTop: "8px", fontSize: "100px", color: "#8B5CF6" }}
                    >
                    {item.total}
                    </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Grande Box en bas */}
        <Box
           sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "480px",
            minHeight: "200px",
            bgcolor: "#F2F3FB",
            marginTop: "20px",
            borderRadius: "20px"
          }}
        >
          <Box
            sx={{
              width: "1250px",
              borderRadius: "20px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: 1
            }}
          >
            {/* Header */}
            <Box sx={{ display: "flex", padding: "12px", borderRadius: "10px", fontWeight: "600", color: "#8B5CF6" }}>
              <Box sx={{ flex: 1, fontWeight: "900" }}>Top du mois</Box>
              <Box sx={{ flex: 1, textAlign: "center" }}>Avis</Box>
              <Box sx={{ flex: 1, textAlign: "center" }}>Gains bruts</Box>
              <Box sx={{ flex: 1, textAlign: "center" }}>Gains nets</Box>
              <Box sx={{ flex: 1, textAlign: "center" }}>Note moyenne</Box>
            </Box>
    
            {/* Rows */}
            {rows.map((row, index) => (
              <Box
                key={row.top}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "20px",
                  ...getRankStyle(row.top),
                }}
              >
                {/* Rang et Nom */}
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1, fontWeight: "bold", color: row.top === 1 ? "white" : "black" }}>
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "15px",
                      backgroundColor: row.top === 1 ? "#FF8C00" : row.top === 2 ? "#FF007F" : "#FF0063",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      color: "white",
                      fontSize: row.top === 3 ? "24px" : "32px",
                    }}
                  >
                    {row.top}
                  </Box>
                  {row.name}
                </Box>
    
                {/* Avis */}
                <Box sx={{ flex: 1, textAlign: "center", color: row.top === 1 ? "white" : "black" }}>{row.avis}</Box>
    
                {/* Gains Bruts */}
                <Box sx={{ flex: 1, textAlign: "center", color: row.top === 1 ? "white" : "black" }}>{row.gainBruts}</Box>
    
                {/* Gains Nets */}
                <Box sx={{ flex: 1, textAlign: "center", color: row.top === 1 ? "white" : "black" }}>{row.gainNets}</Box>
    
                {/* Note Moyenne */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
            
                    gap: 1,
                    fontSize: "16px",
                    backgroundColor: "white",
                    padding: "8px 12px",
                    maxWidth: "131px",
                    maxHeight: "62px",
                    borderRadius: "10px",
                    margin: "auto",
                    boxShadow: row.top === 3 ? " rgba(149, 157, 165, 0.2) 0px 8px 24px;" : 'none',
                  }}
                >
                  {getTrendIcon(row.trend)}
                  <strong>{row.noteMoyenne} <StarIcon sx={{ color: "gold" }} /></strong>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Partie droite : La Box additionnelle placée en haut */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "240px",
          height: "700px",
          borderRadius: 2,
          bgcolor: "#F2F3FB",
          flexShrink: 0, // Empêche la Box de se réduire
          position: "relative", // Permet de positionner les éléments à l'intérieur
          overflow: "hidden", // Empêche les débordements
        }}
      >
      {/* Partie Progression */}
        <Box
          sx={{
            width: "100%",
            height: "80%",
            background: "linear-gradient(180deg, #6A5ACD 0%, #7B68EE 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 0,
          }}
        >

          <Typography variant="h2" fontWeight="bold" color="white">
            80%
          </Typography>
        </Box>

        {/* Texte et icônes en bas */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            position: "absolute",
            bottom: "20px",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            opacity: 0.8,
          }}
        >
          <LocalFireDepartmentOutlinedIcon sx={{ color: "orange" }} />
          <LocalFireDepartmentOutlinedIcon sx={{ color: "orange" }} />
          <LocalFireDepartmentOutlinedIcon sx={{ color: "orange" }} />
          <LocalFireDepartmentOutlinedIcon sx={{ color: "lightgray" }} />
          <Typography>Plus que 2 avis</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Statistiques;


import Grid from '@mui/material/Grid';
import { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ServicesTable from './Chart/ServicesTable';
import ServicesChart from './Chart/ServicesChart'
import StatCard from './StatCard';
import ActionButtons from './ActionsButtons'; // Importation du nouveau composant
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom"; 
import MONBIEN from "../../image/MONBIEN.png"
import STARTLOC from "../../image/STARTLOC.png"
import MARKETINGA from "../../image/MARKETINGA.png"
import MARKETING from "../../image/MARKETING.png"
import SINIMO from "../../image/SINIMO.png"
import PIGEONLINE from "../../image/PIGEONLINE.png"

// Données des services avec icônes
const servicesData = [
  { id: 1, name: 'Monbien', icon: MONBIEN, trustpilot: '568 - 4.8/5', google: '568 - 4.8/5', appStore: '-', googlePlay: '-', totalReviews: '1 004 avis', avgRating: 4.8, trend: 'down' },
  { id: 2, name: 'Startloc', icon: STARTLOC, trustpilot: '260 - 4.8/5', google: '260 - 4.8/5', appStore: '18 - 4.8/5', googlePlay: '36 - 4.8/5', totalReviews: '398 avis', avgRating: 4.3, trend: 'up' },
  { id: 3, name: 'Marketing Automobile', icon: MARKETINGA, trustpilot: '568 - 4.8/5', google: '568 - 4.8/5', appStore: '-', googlePlay: '-', totalReviews: '1 004 avis', avgRating: 4.1, trend: 'neutral' },
  { id: 4, name: 'Marketing Immobilier', icon: MARKETING, trustpilot: '260 - 4.8/5', google: '84 - 4.8/5', appStore: '-', googlePlay: '-', totalReviews: '344 avis', avgRating: 3.8, trend: 'down' },
  { id: 5, name: 'Sinimo', icon: SINIMO, trustpilot: '260 - 4.8/5', google: '260 - 4.8/5', appStore: '360 - 4.8/5', googlePlay: '360 - 4.8/5', totalReviews: '140 avis', avgRating: 3.3, trend: 'up' },
  { id: 6, name: 'Pige Online', icon: PIGEONLINE, trustpilot: '360 - 4.8/5', google: '360 - 4.8/5', appStore: '-', googlePlay: '-', totalReviews: '140 avis', avgRating: 2.2, trend: 'neutral' },
];


export default function MainGrid() {
  const [selectedFilter, setSelectedFilter] = useState("7days");

  const handleFilterChange = (filter) => {
    console.log("Filtre sélectionné :", filter);
    setSelectedFilter(filter);
  };

  const dataSets = {
    today: {
      labels: ["10:00", "12:00", "14:00", "16:00"],
      data: [5, 10, 8, 12]
    },
    "7days": {
      labels: ["01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01"],
      data: [35, 18, 42, 40, 30, 33, 41]
    },
    "30days": {
      labels: ["01/01", "05/01", "10/01", "15/01", "20/01", "25/01", "30/01"],
      data: [120, 150, 180, 200, 175, 160, 140]
    }
  };
  const navigate = useNavigate()
  const myButtons = [
  
    {
      label: "Voir les avis récents",
      icon: <CalendarTodayIcon />,
      onClick: () => navigate("/avisRecents"), // Redirige vers la page des avis
      variant: "contained",
      color: "#121826",
      bgColor: "white",
    },
    {
      label: "Collecter un avis",
      icon: <AddIcon />,
      onClick: () => navigate("/collecterAvis"), // Redirige vers la page des avis
      variant: "contained",
      color: "white",
      bgColor: "#6B5BFF",
    }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: '1900px', margin: 'auto', p: 2 }}>
      {/* Titre */}
      <Typography variant="h2" textAlign="center" gutterBottom>
        <span style={{ fontWeight: 'bold', color: "#121826"}}>Tableau de bord </span>
        <span style={{ color: '#8B5CF6', fontWeight: "200" }}>des performances et retours clients du groupe Realty</span>
      </Typography>
      <Typography variant="h6" sx={{ color: "#121826", textAlign: 'center', mb: 4 }}>
        Tous les retours clients pour l'ensemble des services en un seul coup d'œil
      </Typography>

      {/* StatCard Centrée */}
      <Grid 
        container 
        sx={{ 
          mb: 4, 
          mt: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' // Sépare les éléments sur la ligne
        }}
      >
        {/* StatCard à gauche */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Avis collectés" value="5 209" />
        </Grid>

        {/* Boutons à droite */}
        <Grid item sx={{ marginLeft: '50px' }} >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end',
              gap: 2, 
              mt: 2 
            }}
          >
            <ActionButtons buttons={myButtons} />
          </Box>
          
        </Grid>
      </Grid>


      {/* Tableau et Graphique côte à côte */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
        <ServicesTable services={servicesData} />
        </Grid>

        <Grid item xs={12} md={6} mt={2}>
          <Box>

          <ServicesChart dataSets={dataSets} title="d’avis par services" onFilterChange={handleFilterChange} selectedFilter={selectedFilter}/>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

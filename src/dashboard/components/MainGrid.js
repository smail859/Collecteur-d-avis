import * as React from 'react';
<<<<<<< HEAD
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';

const data = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
=======
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from './CustomizedDataGrid';
import PageViewsBarChart from './PageViewsBarChart';
import StatCard from './StatCard';
import ActionButtons from './ActionsButtons'; // Importation du nouveau composant

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: '1900px', margin: 'auto', p: 2 }}>
      {/* Titre */}
      <Typography variant="h2" textAlign="center" gutterBottom>
        <span style={{ fontWeight: '900', color: "#121826"}}>Tableau de bord </span>
        <span style={{ color: '#6B5BFF' }}>des performances et retours clients du groupe Realty</span>
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
          <ActionButtons 
            onFirstClick={() => console.log("Voir les avis récents")}
            onSecondClick={() => console.log("Collecter un avis")}
          />
        </Grid>
      </Grid>


      {/* Tableau et Graphique côte à côte */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <CustomizedDataGrid />
        </Grid>

        <Grid item xs={12} md={6} mt={2}>
          <Box>
            <PageViewsBarChart />
          </Box>
        </Grid>
      </Grid>
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
    </Box>
  );
}

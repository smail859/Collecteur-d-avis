import * as React from 'react';
<<<<<<< HEAD
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function PageViewsBarChart() {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Page views and downloads
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              1.3M
            </Typography>
            <Chip size="small" color="error" label="-8%" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Page views and downloads for the last 6 months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            },
          ]}
          series={[
            {
              id: 'page-views',
              label: 'Page views',
              data: [2234, 3872, 2998, 4125, 3357, 2789, 2998],
              stack: 'A',
            },
            {
              id: 'downloads',
              label: 'Downloads',
              data: [3098, 4215, 2384, 2101, 4752, 3593, 2384],
              stack: 'A',
            },
            {
              id: 'conversions',
              label: 'Conversions',
              data: [4051, 2275, 3129, 4693, 3904, 2038, 2275],
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
=======
import { Card, CardContent, Typography, Stack, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

// Diagramme en bar 

export default function PageViewsBarChart() {
  const colorGradient = ['#6B5BFF', '#9C78FF']; // Dégradé bleu-violet

  return (
    <div style={{marginTop: "30px"}}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ color: '#333' }}>
        Évolution du nombre <span style={{ color: '#6B5BFF' }}>d’avis par services</span> 
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ color: '#555', marginBottom: '16px' }}>
        Suivez les performances de vos services et leur évolution au fil du temps
      </Typography>

      {/* Filtres */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginBottom: '20px' }}>
        <Button variant="outlined" sx={{ background: '#F2F3FB', color: '#8B5CF6' }}>Tous les services</Button>
        <Button variant="outlined" sx={{ background: '#F2F3FB', color: '#8B5CF6' }}>Toutes les plateformes</Button>
        <Button variant="outlined" sx={{ background: '#F2F3FB', color: '#8B5CF6' }}>Notes</Button>
        <Button variant="outlined" sx={{ background: '#F2F3FB', color: '#8B5CF6' }}>Sélectionner une période</Button>
      </Stack>

      {/* Sélecteur de période */}
      <ToggleButtonGroup
        exclusive
        aria-label="Période"
        sx={{ marginBottom: '20px' }}
      >
        <ToggleButton value="today" sx={{ color: '#8B5CF6', borderColor: '#6B5BFF' }}>Aujourd'hui</ToggleButton>
        <ToggleButton value="7days" sx={{ background: 'linear-gradient(90deg, #2972FF, #8B5CF6)', color: 'white', borderColor: '#6B5BFF' }}>7 derniers jours</ToggleButton>
        <ToggleButton value="30days" sx={{ color: '#8B5CF6', borderColor: '#6B5BFF' }}>30 derniers jours</ToggleButton>
      </ToggleButtonGroup>

      {/* Graphique */}
      <Card variant="outlined" sx={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
        <CardContent>
          <BarChart
            xAxis={[
              {
                scaleType: 'band',
                categoryGapRatio: 0.5,
                data: ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01', '08/01'],
              },
            ]}
            series={[
              {
                id: 'reviews',
                label: 'Nombre d’avis',
                data: [35, 18, 42, 40, 30, 33, 41, 12],
                stack: 'A',
                color: colorGradient[0], // Couleur des barres
              },
            ]}
            height={300}
            margin={{ left: 50, right: 20, top: 20, bottom: 50 }}
            grid={{ horizontal: true }}
            sx={{
              '& .MuiChartsLegend-root': { display: 'none' }, // Masquer la légende
              '& .MuiChartsAxis-root text': { fill: '#6B5BFF' }, // Couleur des axes
              '& .MuiChartsBars-root rect': {
                rx: 8, // Arrondir les barres
                fill: `url(#bar-gradient)`,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Dégradé pour les barres */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="bar-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colorGradient[0]} />
            <stop offset="100%" stopColor={colorGradient[1]} />
          </linearGradient>
        </defs>
      </svg>
    </div>
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
  );
}

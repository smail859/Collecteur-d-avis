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
  );
}

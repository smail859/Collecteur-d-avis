import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Stack, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

/**
 * Composant réutilisable pour afficher un graphique d'évolution des avis.
 * @param {Array} data - Liste des valeurs à afficher.
 * @param {Array} labels - Labels de l'axe X.
 * @param {string} title - Titre du graphique.
 * @param {function} onFilterChange - Callback pour filtrer les données.
 */

export default function ServicesChart({ dataSets, title, onFilterChange, onActiveFilterChange }) {
  const colorGradient = ['#6B5BFF', '#9C78FF']; // Dégradé bleu-violet
  const [selectedFilter, setSelectedFilter] = useState('7days')
  const handleFilterChange = (_, newPeriode) => {
    if(newPeriode !== null) {
      setSelectedFilter(newPeriode)
      onFilterChange(newPeriode)
    }
  }
  const [activeFilter, setActiveFilter] = useState('all');
  const handleFilterEvolutionChange = (newPeriodeEvolution) => {
    setActiveFilter(newPeriodeEvolution);
    if (typeof onActiveFilterChange === 'function') {
      onActiveFilterChange(newPeriodeEvolution);
    }
  };
  
  // Sélectionne les données en fonction de la période choisie
  const { data, labels } = dataSets[selectedFilter] || dataSets["7days"];
  return (
    <div style={{ marginTop: "30px" }}>
      {/* Titre */}
      <Typography variant="h4" fontWeight="bold"  sx={{ color: '#333' }}>
        Évolution du nombre <span style={{ color: '#6B5BFF' }}>{title}</span> 
      </Typography>
      <Typography variant="body1"  sx={{ color: '#121826', marginBottom: '16px' }}>
        Suivez les performances de vos services et leur évolution au fil du temps
      </Typography>

      {/* Filtres */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginBottom: '20px' }}>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: activeFilter === 'all' ? '#8B5CF6' : '#F2F3FB',
            color: activeFilter === 'all' ? 'white' : '#8B5CF6'
          }}
          onClick={() => handleFilterEvolutionChange('all')}
        >
          Tous les services
        </Button>

        <Button
          variant="outlined"
          sx={{
            backgroundColor: activeFilter === 'platforms' ? '#8B5CF6' : '#F2F3FB',
            color: activeFilter === 'platforms' ? '#FFFFFF' : '#8B5CF6'
          }}
          onClick={() => handleFilterEvolutionChange('platforms')}
        >
          Toutes les plateformes
        </Button>

        <Button
          variant="outlined"
          sx={{
            backgroundColor: activeFilter === 'notes' ? '#8B5CF6' : '#F2F3FB',
            color: activeFilter === 'notes' ? '#FFFFFF' : '#8B5CF6'
          }}
          onClick={() => handleFilterEvolutionChange('notes')}
        >
          Notes
        </Button>

        <Button
          variant="outlined"
          sx={{
            backgroundColor: activeFilter === 'date' ? '#8B5CF6' : '#F2F3FB',
            color: activeFilter === 'date' ? '#FFFFFF' : '#8B5CF6'
          }}
          onClick={() => handleFilterEvolutionChange('date')}
        >
          Sélectionner une période
        </Button>
      </Stack>


      {/* Sélecteur de période */}
      <ToggleButtonGroup
        exclusive
        value={selectedFilter}
        onChange={handleFilterChange}
        aria-label="Période"
        sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent' }}
      >
        <ToggleButton 
          value="today"
          sx={{
            color: selectedFilter === 'today' ? 'white' : "#8B5CF6",
            borderColor: '#6B5BFF',
            backgroundColor: selectedFilter === 'today' ? '#8B5CF6' : '#F2F3FB',
            '&.Mui-selected': { backgroundColor: '#8B5CF6', color: 'white' }
          }}
        >
          Aujourd'hui
        </ToggleButton>

        <ToggleButton 
          value="7days"
          sx={{
            backgroundColor: selectedFilter === '7days' ? '#8B5CF6' : '#F2F3FB',
            color: selectedFilter === '7days' ? 'white' : "#8B5CF6",
            borderColor: '#6B5BFF',
            '&.Mui-selected': { background: 'linear-gradient(90deg, #2972FF, #8B5CF6)', color: 'white' }
          }}
        >
          7 derniers jours
        </ToggleButton>

        <ToggleButton 
          value="30days"
          sx={{
            color: selectedFilter === '30days' ? 'white' : "#8B5CF6",
            borderColor: '#6B5BFF',
            '&.Mui-selected': { backgroundColor: '#8B5CF6', color: 'white' }
          }}
        >
          30 derniers jours
        </ToggleButton>
      </ToggleButtonGroup>


      {/* Graphique mis à jour dynamiquement */}
      <Card variant="outlined" sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
              <CardContent>
                <BarChart
                  xAxis={[{ scaleType: 'band', categoryGapRatio: 0.5, data: labels }]}
                  series={[{
                    id: 'reviews',
                    label: 'Nombre d’avis',
                    data: data,
                    stack: 'A',
                    color: colorGradient[0],
                  }]}
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

// Validation avec PropTypes
ServicesChart.propTypes = {
  dataSets: PropTypes.objectOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onActiveFilterChange: PropTypes.func.isRequired,
};
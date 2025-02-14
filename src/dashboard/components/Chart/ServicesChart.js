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

export default function ServicesChart({ dataSets, title, onFilterChange }) {
  const colorGradient = ['#6B5BFF', '#9C78FF']; // Dégradé bleu-violet
  const [selectedFilter, setSelectedFilter] = useState('7days')
  const handleFilterChange = (_, newPeriode) => {
    if(newPeriode !== null) {
      setSelectedFilter(newPeriode)
      onFilterChange(newPeriode)
    }
  }
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
        <Button variant="outlined" sx={{ background: '#F2F3FB', color: '#8B5CF6' }} onClick={() => onFilterChange('all')}>
          Tous les services
        </Button>
        <Button variant="outlined" sx={{ background: '#F2F3FB', color: '#8B5CF6' }} onClick={() => onFilterChange('platforms')}>
          Toutes les plateformes
        </Button>
        <Button variant="outlined" sx={{ background: '#F2F3FB', color: '#8B5CF6' }} onClick={() => onFilterChange('notes')}>
          Notes
        </Button>
        <Button variant="outlined" sx={{ background: '#F2F3FB', color: '#8B5CF6' }} onClick={() => onFilterChange('date')}>
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
        <ToggleButton value="today" sx={{ color: '#8B5CF6', borderColor: '#6B5BFF' }} onClick={() => onFilterChange('today')}>
          Aujourd'hui
        </ToggleButton>
        <ToggleButton value="7days" sx={{ background: 'linear-gradient(90deg, #2972FF, #8B5CF6)', color: 'white', borderColor: '#6B5BFF' }} onClick={() => onFilterChange('7days')}>
          7 derniers jours
        </ToggleButton>
        <ToggleButton value="30days" sx={{ color: '#8B5CF6', borderColor: '#6B5BFF' }} onClick={() => onFilterChange('30days')}>
          30 derniers jours
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Graphique mis à jour dynamiquement */}
      <Card variant="outlined" sx={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
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
};
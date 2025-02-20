import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Stack, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

/**
 * Composant réutilisable pour afficher un graphique d'évolution des avis.
 */
export default function ServicesChart({ dataSets, title, onFilterChange, onActiveFilterChange, colorGradient = ['#6B5BFF', '#9C78FF'] }) {

  /**
   * Revoir les bouton "Toutes les plateformes" etc.. pour en faire des bouton select
   * Filtrer les avis dans le graphiques par services
   * Filtrer les avis dans le graphique par plateformes (Google, Trustpilot)
   * Filtrer les avis dans le graphique par notes (5,4,3,2,1 etoiles)
   * Filtrer les avis par périodes avec les bouton "Aujourd'hui, 7 derniers jours et 30 derniers jours"
   */
  const [selectedFilter, setSelectedFilter] = useState('7days');
  const [activeFilter, setActiveFilter] = useState('all');

  // Gestion du changement de période
  const handleFilterChange = (_, newPeriode) => {
    if (newPeriode !== null && onFilterChange) {
      setSelectedFilter(newPeriode);
      onFilterChange(newPeriode);
    }
  };

  // Gestion du changement de filtre actif
  const handleFilterEvolutionChange = (newPeriodeEvolution) => {
    setActiveFilter(newPeriodeEvolution);
    onActiveFilterChange?.(newPeriodeEvolution);
  };

  // Sélection des données en fonction du filtre
  const { data, labels } = dataSets[selectedFilter] || dataSets["7days"];

  /**
   * Styles des boutons de filtrage.
   */
  const getButtonStyle = (isActive) => ({
    backgroundColor: isActive ? '#8B5CF6' : '#F2F3FB',
    color: isActive ? 'white' : '#8B5CF6',
    fontWeight: isActive ? 'bold' : '500',
    borderRadius: '8px',
    padding: '8px 16px',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    '&:hover': {
      backgroundColor: '#7A52E4',
      color: 'white',
      border: '2px solid #8B5CF6',
    },
  });

  /**
   * Styles des boutons de sélection de période.
   */
  const getToggleButtonStyle = (isActive) => ({
    backgroundColor: isActive ? '#8B5CF6' : 'white',
    color: isActive ? 'white' : '#121826',
    fontWeight: isActive ? 'bold' : '500',
    borderRadius: '8px',
    padding: '8px 16px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#8B5CF6',
      color: 'white',
    },
  });

  return (
    <div style={{ marginTop: "30px" }}>
      {/* Titre du graphique */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#333' }}>
        Évolution du nombre <span style={{ color: '#6B5BFF' }}>{title}</span> 
      </Typography>
      <Typography variant="body1" sx={{ color: '#121826', marginBottom: '16px' }}>
        Suivez les performances de vos services et leur évolution au fil du temps
      </Typography>

      {/* Filtres de type de données */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginBottom: '20px' }}>
        {["all", "platforms", "notes"].map((filter) => (
          <Button key={filter} variant="outlined" sx={getButtonStyle(activeFilter === filter)} onClick={() => handleFilterEvolutionChange(filter)}>
            {filter === "all" ? "Tous les services" : filter === "platforms" ? "Toutes les plateformes" : filter === "notes" ? "Notes" : "Sélectionner une période"}
          </Button>
        ))}
      </Stack>

      {/* Sélecteur de période */}
      <ToggleButtonGroup
        exclusive
        value={selectedFilter}
        onChange={handleFilterChange}
        sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {["today", "7days", "30days"].map((period) => (
          <ToggleButton key={period} value={period} sx={getToggleButtonStyle(selectedFilter === period)}>
            {period === "today" ? "Aujourd'hui" : period === "7days" ? "7 derniers jours" : "30 derniers jours"}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Graphique BarChart */}
      <Card variant="elevation" sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
        <CardContent>
          <BarChart
            xAxis={[{ scaleType: 'band', categoryGapRatio: 0.5, data: labels }]}
            series={[{ id: 'reviews', label: 'Nombre d’avis', data: data, stack: 'A', color: colorGradient[0] }]}
            height={300}
            margin={{ left: 50, right: 20, top: 20, bottom: 50 }}
            grid={{ horizontal: true }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Définition des types de props attendues
ServicesChart.propTypes = {
  dataSets: PropTypes.objectOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func,
  onActiveFilterChange: PropTypes.func,
  colorGradient: PropTypes.arrayOf(PropTypes.string),
};

// Valeurs par défaut des props
ServicesChart.defaultProps = {
  onFilterChange: () => {},
  onActiveFilterChange: () => {},
  colorGradient: ['#6B5BFF', '#9C78FF'],
};

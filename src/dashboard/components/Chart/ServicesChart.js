import PropTypes from 'prop-types';
import { useEffect } from 'react';
import {
  Card, CardContent, Typography, ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import useFetchReviews from '../../../hooks/components/useFetchReviews';

/**
 * 📊 Composant `ServicesChart`
 * Affiche un graphique des avis par période et permet de filtrer les données par service, plateforme ou note.
 */
export default function ServicesChart({ dataSets = {}, title, onFilterChange, onActiveFilterChange, colorGradient = ['#6B5BFF', '#9C78FF'] }) {
  const { changeFilter, selectedFilter } = useFetchReviews();

  // Sélection des données en fonction du filtre
  const dataset = dataSets[selectedFilter] || { data: [], labels: [] };
  const { data = [], labels = [] } = dataset;

  
  // 🔄 Effet pour notifier les changements de filtre actif
  useEffect(() => {
    if (onActiveFilterChange) {
      onActiveFilterChange(selectedFilter);
    }
  }, [selectedFilter, onActiveFilterChange]);

  return (
    <div style={{ marginTop: "30px" }}>
      {/* Titre du graphique */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#333' }}>
        Évolution du nombre <span style={{ color: '#6B5BFF' }}>{title}</span>
      </Typography>
      <Typography variant="body1" sx={{ color: '#121826', marginBottom: '16px' }}>
        Suivez les performances de vos services et leur évolution au fil du temps
      </Typography>

      {/* 📅 Sélecteur de période */}
      <ToggleButtonGroup
        exclusive
        value={selectedFilter}
        onChange={(_, newFilter) => {
          if (newFilter && newFilter !== selectedFilter) {
            changeFilter(newFilter);
            if (onFilterChange) onFilterChange(newFilter);
          }
        }}
        sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ToggleButton value="today">Aujourd'hui</ToggleButton>
        <ToggleButton value="7days">7 derniers jours</ToggleButton>
        <ToggleButton value="30days">30 derniers jours</ToggleButton>
      </ToggleButtonGroup>

      {/* 📊 Graphique BarChart */}
      <Card variant="elevation" sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
        <CardContent>
          {data.length > 0 ? (
            <BarChart
              xAxis={[{ scaleType: 'band', categoryGapRatio: 0.5, data: labels }]}
              series={[{ id: 'reviews', label: 'Nombre d’avis', data: data, stack: 'A', color: colorGradient[0] }]}
              height={300}
              margin={{ left: 50, right: 20, top: 20, bottom: 50 }}
              grid={{ horizontal: true }}
            />
          ) : (
            <Typography variant="body2" sx={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>
              Aucune donnée disponible pour cette période.
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 🔧 Définition des types de props attendues
ServicesChart.propTypes = {
  dataSets: PropTypes.objectOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
  title: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func,
  onActiveFilterChange: PropTypes.func,
  colorGradient: PropTypes.arrayOf(PropTypes.string),
};

// 🌟 Valeurs par défaut des props
ServicesChart.defaultProps = {
  dataSets: {},
  colorGradient: ['#6B5BFF', '#9C78FF'],
};

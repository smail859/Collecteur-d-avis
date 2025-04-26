// Hooks React
import { useState, useMemo } from 'react';

// Composant de filtres personnalisés
import ToggleButtonGroup from '../../../avisRécents/components/ToggleButtonGroup';

// Composants Recharts pour créer le graphique en barres
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Composants MUI pour la structure et le style
import { Typography, Box, useMediaQuery, useTheme } from '@mui/material';

// Hook de récupération des avis filtrés
import useFetchReviews from '../../../hooks/components/useFetchReviews';

// Boutons prédéfinis pour la sélection rapide de périodes
import PeriodToggleButtons from '../../../components/PeriodToggleButtons';


// Composant d'affichage du graphique des avis par service
const ServicesChart = () => {
  const theme = useTheme(); // Utilisation du thème Material UI
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Détection du format mobile

  // États des filtres sélectionnés
  const [selectedFilters, setSelectedFilters] = useState({
    period: '7days',
    service: '',
    plateforme: '',
    rating: '',
  });

  // Récupération des données d’avis en fonction des filtres
  const { reviewsPerPeriod, ratingsCount } = useFetchReviews({
    periode: selectedFilters.period,
    note: selectedFilters.rating,
  });

  // Définition des couleurs par service
  const serviceColors = {
    Startloc: "#FF66B2",
    Sinimo: "#4D9B9B",
    "Pige Online": "#4A90E2",
    "Marketing immobilier": "#8A2BE2",
    "Marketing automobile": "#FF4500", 
    Monbien: "#FF7F32",
  };

  // Liste des services disponibles
  const allServices = useMemo(() => [
    "Monbien",
    "Startloc",
    "Marketing automobile",
    "Marketing immobilier",
    "Pige Online",
    "Sinimo",
  ], []);
  
  const periodData = reviewsPerPeriod[selectedFilters.period] || {};

  // Composant de tooltip personnalisé (info-bulle au survol)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "8px",
            padding: isMobile ? "" : "12px",
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[2],
            fontSize: isMobile ? "12px" : "14px",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: isMobile ? "50px" : "200px",
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            {selectedFilters.rating ? `Période : ${label}` : `Date : ${label}`}
          </Typography>
          {payload.map((item, index) => (
            <Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: item.fill }}>{item.name}</Typography>
              <Typography sx={{ fontWeight: 500 }}>{item.value}</Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Définition des filtres disponibles pour l'utilisateur
  const filters = [
    {
      key: "service",
      label: "Service",
      value: selectedFilters.service,
      options: [{ label: "Tous les services", value: "" }].concat(
        Object.keys(periodData).reduce((services, platform) => {
          Object.keys(periodData[platform]).forEach(service => {
            if (!services.includes(service)) services.push(service);
          });
          return services;
        }, []).map(service => ({ label: service, value: service }))
      ),
    },
    {
      key: "plateforme",
      label: "Plateforme",
      value: selectedFilters.plateforme,
      options: [
        { label: "Toutes les plateformes", value: "" },
        { label: "Google", value: "Google" },
        { label: "Trustpilot", value: "Trustpilot" },
      ],
    },
    {
      key: "rating",
      label: "Note",
      value: selectedFilters.rating,
      options: [
        { label: "Toutes les notes", value: "" },
        { label: "1 étoile", value: "1" },
        { label: "2 étoiles", value: "2" },
        { label: "3 étoiles", value: "3" },
        { label: "4 étoiles", value: "4" },
        { label: "5 étoiles", value: "5" },
      ],
    },
    {
      key: "period",
      label: "Période",
      value: selectedFilters.period,
      options: [
        { label: "Aujourd'hui", value: "today" },
        { label: "7 derniers jours", value: "7days" },
        { label: "30 derniers jours", value: "30days" },
        { label: "Ce mois", value: "thismonth" },
        { label: "Le mois dernier", value: "lastmonth" },
        { label: "Cette semaine", value: "thisweek" },
        { label: "La semaine dernière", value: "lastweek" },
        { label: "Cette année", value: "thisyear" },
      ],
    },
  ];

  // Mise à jour des filtres
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Préparation des données du graphique (selon filtre par note OU par date)
  const chartData = useMemo(() => {
    if (selectedFilters.rating) {
      const data = { period: selectedFilters.period };
      if (selectedFilters.plateforme) {
        if (ratingsCount[selectedFilters.plateforme]) {
          Object.keys(ratingsCount[selectedFilters.plateforme]).forEach(service => {
            if (selectedFilters.service && selectedFilters.service !== service) return;
            const count = ratingsCount[selectedFilters.plateforme][service][selectedFilters.rating] || 0;
            data[service] = count;
          });
        }
      } else {
        const counts = {};
        Object.keys(ratingsCount).forEach(source => {
          Object.keys(ratingsCount[source]).forEach(service => {
            if (selectedFilters.service && selectedFilters.service !== service) return;
            const count = ratingsCount[source][service][selectedFilters.rating] || 0;
            counts[service] = (counts[service] || 0) + count;
          });
        });
        Object.entries(counts).forEach(([service, count]) => {
          data[service] = count;
        });
      }
      return [data];
    } else {
      // Mode graphique temporel
      const dailyCounts = {};
      let sources = selectedFilters.plateforme ? [selectedFilters.plateforme] : Object.keys(reviewsPerPeriod[selectedFilters.period] || {});
      
      sources.forEach(source => {
        const sourceData = reviewsPerPeriod[selectedFilters.period][source];
        if (sourceData) {
          Object.keys(sourceData).forEach(service => {
            if (selectedFilters.service && selectedFilters.service !== service) return;
            sourceData[service].dates.forEach(date => {
              if (!dailyCounts[date]) dailyCounts[date] = { date };
              dailyCounts[date][service] = (dailyCounts[date][service] || 0) + 1;
            });
          });
        }
      });

      const dataArray = Object.values(dailyCounts).sort((a, b) => new Date(a.date) - new Date(b.date));

      dataArray.forEach(entry => {
        allServices.forEach(serviceName => {
          if (!entry.hasOwnProperty(serviceName)) {
            entry[serviceName] = 0;
          }
        });
      });

      return dataArray;
    }
  }, [reviewsPerPeriod, selectedFilters, ratingsCount, allServices]);

  // --- RENDER -----------------------------------------------------------------------
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        mt: 8,
      }}
    >
      {/* Titre principal */}
      <Typography 
        variant="h2" 
        fontWeight="bold"
        sx={{ fontSize: isMobile ? '28px' : '54px' }}
      >
        Évolution du nombre{" "}
        <Box component="span" sx={{ color: theme.palette.custom.violetRealty }}>
          d’avis par services
        </Box>
      </Typography>

      {/* Sous-titre */}
      <Typography variant="body1" sx={{ color: theme.palette.custom.violetRealty, mt: 2, mb: 2 }}>
        Suivez les performances de vos services et leur évolution au fil du temps
      </Typography>

      {/* Bloc contenant filtres + graphique */}
      <Box
        sx={{
          p: isMobile ? 3 : 6,
          borderRadius: '16px',
          backgroundColor: 'white',
          mt: 5,
          boxShadow: theme.shadows[3],
          overflow: 'hidden'
        }}
      >
        {/* Filtres (service, plateforme, note, période) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <ToggleButtonGroup filters={filters} onFilterChange={handleFilterChange} />
          <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', width: isMobile ? '100%' : 'auto' }}>
            <PeriodToggleButtons
              selected={selectedFilters.period}
              onChange={(newValue) => handleFilterChange('period', newValue)}
            />
          </Box>
        </Box>

        {/* Graphique principal (responsive) */}
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 500}>
          <BarChart data={chartData} margin={{ top: 30, right: 0, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey={selectedFilters.rating ? "period" : "date"}
              tickFormatter={date => new Date(date).toLocaleDateString()}
              style={{ fontSize: isMobile ? '10px' : '12px', fill: theme.palette.text.secondary }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            {!isMobile && (
              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 20 }} />
            )}

            {/* Génération dynamique des barres par service */}
            {chartData.length > 0 &&
              Object.keys(chartData[0])
                .filter(key => key !== "period" && key !== "date")
                .map(service => (
                  <Bar
                    key={service}
                    dataKey={service}
                    fill={serviceColors[service] || theme.palette.primary.main}
                    name={service}
                    legendType="square"
                    radius={[10, 10, 0, 0]}
                    animationDuration={1500}
                  />
                ))
            }
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ServicesChart;

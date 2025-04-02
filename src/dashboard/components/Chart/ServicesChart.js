import { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles'; 
import ToggleButtonGroup from '../../../avisRécents/components/ToggleButtonGroup';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Typography, Box } from '@mui/material';
import useFetchReviews from '../../../hooks/components/useFetchReviews';

const ServicesChart = () => {
  const theme = useTheme(); // Récupérer le thème actuel

  const [selectedFilters, setSelectedFilters] = useState({
    period: '30days',
    service: '',
    plateforme: '',
    rating: '',
  });

  const { reviewsPerPeriod, ratingsCount } = useFetchReviews({
    periode: selectedFilters.period,
    note: selectedFilters.rating,
  });

  console.log(reviewsPerPeriod)

  const serviceColors = {
    Startloc: "#FF66B2",
    Sinimo: "#4D9B9B",
    "Pige Online": "#4A90E2",
    "Marketing immobilier": "#8A2BE2",
    "Marketing automobile": "#FF4500", 
    Monbien: "#FF7F32",
  };

  const allServices = [
    "Monbien",
    "Startloc",
    "Marketing immobilier",
    "Marketing automobile",
    "Sinimo",
    "Pige Online",
  ];

  const periodData = reviewsPerPeriod[selectedFilters.period] || {};

  // Tooltip personnalisé (utilise theme.palette)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: theme.palette.background.paper, // Adaptation au mode sombre
          border: `1px solid ${theme.palette.divider}`,
          padding: '10px',
          borderRadius: '4px',
          color: theme.palette.text.primary // Texte adaptable
        }}>
          <p>{selectedFilters.rating ? `Période : ${label}` : `Date : ${label}`}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.fill, margin: 0 }}>
              {`${item.name} : ${item.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Construction des données pour le graphique
  const chartData = useMemo(() => {
    if (selectedFilters.rating) {
      // Mode "filtre par note"
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
          if (source === "Google" || source === "Trustpilot") {
            Object.keys(ratingsCount[source]).forEach(service => {
              if (selectedFilters.service && selectedFilters.service !== service) return;
              const count = ratingsCount[source][service][selectedFilters.rating] || 0;
              counts[service] = (counts[service] || 0) + count;
            });
          }
        });
        Object.entries(counts).forEach(([service, count]) => {
          data[service] = count;
        });
      }
      return [data];
    } else {
      // Mode "graphique temporel"
      const dailyCounts = {};
      let sources = [];
      if (selectedFilters.plateforme) {
        sources.push(selectedFilters.plateforme);
      } else {
        sources = Object.keys(reviewsPerPeriod[selectedFilters.period] || {});
      }
      sources.forEach(source => {
        const sourceData = reviewsPerPeriod[selectedFilters.period][source];
        if (sourceData) {
          Object.keys(sourceData).forEach(service => {
            if (selectedFilters.service && selectedFilters.service !== service) return;
            const { dates } = sourceData[service];
            dates.forEach(date => {
              if (!dailyCounts[date]) dailyCounts[date] = { date };
              dailyCounts[date][service] = (dailyCounts[date][service] || 0) + 1;
            });
          });
        }
      });
  
      const dataArray = Object.values(dailyCounts).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
  
      dataArray.forEach(entry => {
        allServices.forEach(serviceName => {
          if (!entry.hasOwnProperty(serviceName)) {
            entry[serviceName] = 0;
          }
        });
      });
  
      return dataArray;
    }
  }, [reviewsPerPeriod, selectedFilters, ratingsCount]);

  return (
    <Box sx={{ display: 'flex', flexDirection: "column", mt: 3 }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        sx={{ color: theme.palette.text.primary }} // Texte adaptatif
      >
        Évolution du nombre <span style={{ color: theme.palette.primary.main }}>d’avis par services</span>
      </Typography>

      <Typography variant="body1" sx={{ color: theme.palette.secondary.main, mt: 2, mb: 2 }}>
        Suivez les performances de vos services et leur évolution au fil du temps
      </Typography>

      <Box
        sx={{
          p: 6,
          borderRadius: '16px',
          backgroundColor: theme.palette.background.paper, // Fond adaptatif
          mt: 4,
          boxShadow: theme.shadows[3], // Ombre adaptable
          overflow: 'hidden'
        }}
      >
        <ToggleButtonGroup filters={filters} onFilterChange={handleFilterChange} />

        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData} margin={{ top: 30, right: 40, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} /> 
            <XAxis
              dataKey={selectedFilters.rating ? "period" : "date"}
              tickFormatter={date => new Date(date).toLocaleDateString()}
              style={{ fontSize: '12px', fill: theme.palette.text.secondary }}
            />
            <YAxis
              label={{
                value: "Nombre d'avis",
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '12px', fill: theme.palette.text.secondary }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ marginTop: 20 }}
            />
            {chartData.length > 0 &&
              Object.keys(chartData[0])
                .filter(key => key !== "period" && key !== "date")
                .map(service => (
                  <Bar
                    key={service}
                    dataKey={service}
                    fill={serviceColors[service] || theme.palette.primary.main} // Utilisation de theme.palette
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

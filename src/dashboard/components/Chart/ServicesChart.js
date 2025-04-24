import { useState, useMemo } from 'react';
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
import { Typography, Box, useMediaQuery,useTheme  } from '@mui/material';
import useFetchReviews from '../../../hooks/components/useFetchReviews';
import PeriodToggleButtons from '../../../components/PeriodToggleButtons';


const ServicesChart = () => {
  const theme = useTheme(); // Récupérer le thème actuel
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  

  const [selectedFilters, setSelectedFilters] = useState({
    period: '7days',
    service: '',
    plateforme: '',
    rating: '',
  });

  const { reviewsPerPeriod, ratingsCount } = useFetchReviews({
    periode: selectedFilters.period,
    note: selectedFilters.rating,
  });

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
          color: theme.palette.text.primary, // Texte adaptable
          display: isMobile ? "flex" : "block",
          flexDirection:isMobile ? "row" : "column",
          justifyContent:isMobile ? "center" : "flex-start",
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

      <Typography variant="body1" sx={{ color: theme.palette.custom.violetRealty, mt: 2, mb: 2 }}>
        Suivez les performances de vos services et leur évolution au fil du temps
      </Typography>

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

  


        <ResponsiveContainer width="100%" height={isMobile ? 300 : 500}>
          <BarChart       
            data={chartData}
            margin={{ top: 30, right: 0, left: 0, bottom: 40 }}

          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} /> 
            <XAxis
              dataKey={selectedFilters.rating ? "period" : "date"}
              tickFormatter={date => new Date(date).toLocaleDateString()}
              style={{ fontSize: isMobile ? '10px' : '12px', fill: theme.palette.text.secondary }}
            />
            <YAxis/>
            <Tooltip content={<CustomTooltip />} />
            {isMobile ? (
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, marginTop: 2, }}
              >
              </Typography>
            ) : (
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginTop: 20 }}
              />
            )}
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

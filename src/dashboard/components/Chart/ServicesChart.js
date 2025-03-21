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
import { Typography, Box } from '@mui/material';
import useFetchReviews from '../../../hooks/components/useFetchReviews';

const ServicesChart = () => {
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

  // Construction du jeu de données pour le graphique
  const chartData = useMemo(() => {
    if (selectedFilters.rating) {
      // Mode "filtre par note" : un objet unique avec, pour chaque service, le nombre d'avis
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
      // Mode "graphique temporel" : agrégation des avis par date et par service
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
  
      // Transformer dailyCounts en tableau et trier par date
      const dataArray = Object.values(dailyCounts).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
  
      // Pour chaque entrée, ajouter tous les services manquants avec 0
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

  

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#fff',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px'
        }}>
          {selectedFilters.rating ? (
            <p>{`Période : ${label}`}</p>
          ) : (
            <p>{`Date : ${label}`}</p>
          )}
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

  // Légende personnalisée qui utilise serviceColors
  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul style={{
        display: 'flex',
        justifyContent: 'center',
        listStyle: 'none',
        margin: 0,
        padding: 0
      }}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{
            marginRight: 20,
            display: 'flex',
            alignItems: 'center'
          }}>
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: serviceColors[entry.value] || entry.color,
                marginRight: 5,
                borderRadius: '50%'
              }}
            />
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
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
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  console.log("📊 reviewsPerPeriod:", reviewsPerPeriod);


  return (
    <Box sx={{ display: 'flex', flexDirection: "column", marginTop: "25px" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#333' }}>
      Évolution du nombre <span style={{ color: '#6B5BFF' }}>d’avis par services</span>
      </Typography>
      <Typography variant="body1" sx={{ color: '#8B5CF6', mt: 2, mb: 2 }}>
        Suivez les performances de vos services et leur évolution au fil du temps
      </Typography>

      <Box
        sx={{
          p: 6,
          borderRadius: '16px',
          backgroundColor: '#fff',
          mt: 4,
          boxShadow: 3,
          overflow: 'hidden'
        }}
      >
        <ToggleButtonGroup filters={filters} onFilterChange={handleFilterChange} />

        {selectedFilters.rating ? (
          // Mode "Note" : graphique par service (une barre par service)
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData} margin={{ top: 30, right: 40, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" hide />
              <YAxis
                label={{
                  value: "Nombre d'avis",
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '12px', fill: '#555' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={renderCustomLegend}
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginTop: 20 }}
              />
              {chartData.length > 0 &&
                Object.keys(chartData[0])
                  .filter(key => key !== "period")
                  .map(service => (
                    <Bar
                      key={service}
                      dataKey={service}
                      fill={serviceColors[service] || "#8884d8"}
                      name={service}
                      legendType="square"
                      radius={[10, 10, 0, 0]}
                      animationDuration={1500}
                    />
                  ))
              }
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // Mode "temps" : graphique temporel (une barre par service par date)
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 30, right: 40, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={date => new Date(date).toLocaleDateString()}
                style={{ fontSize: '12px', fill: '#555' }}
              />
              <YAxis
                label={{
                  value: "Nombre d'avis",
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '12px', fill: '#555' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={renderCustomLegend}
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginTop: 20 }}
              />
              {chartData.length > 0 &&
                Object.keys(chartData[0])
                  .filter(key => key !== "date")
                  .map(service => (
                    <Bar
                      key={service}
                      dataKey={service}
                      fill={serviceColors[service] || "#8884d8"}
                      name={service}
                      legendType="square"
                      radius={[10, 10, 0, 0]}
                      animationDuration={1500}
                    />
                  ))
              }
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default ServicesChart;

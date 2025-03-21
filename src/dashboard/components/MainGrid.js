import { useMemo, useState, useEffect, useCallback } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import ServicesTable from './Chart/ServicesTable';
import ServicesChart from './Chart/ServicesChart';
import StatCard from './StatCard';
import ActionButtons from './ActionsButtons';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import useFetchReviews from '../../hooks/components/useFetchReviews';

// Importation des icônes des services
import MONBIEN from "../../image/MONBIEN.png";
import STARTLOC from "../../image/STARTLOC.png";
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png";
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png";
import SINIMO from "../../image/SINIMO.png";
import PIGEONLINE from "../../image/PIGEONLINE.png";

/**
 * Composant principal `MainGrid`
 * Affiche le tableau de bord avec les statistiques, le tableau des services et les graphiques.
 */
export default function MainGrid() {
  const navigate = useNavigate();
  const { totalReviews, selectedFilter, reviewsCountByService,avgRatingByService, averageRatingLastTwoMonths} = useFetchReviews();
  // État pour gérer le filtre actif du graphique
  const [activeFilter, setActiveFilter] = useState(selectedFilter);

  // Synchroniser l'état interne `activeFilter` avec `selectedFilter`
  useEffect(() => {
    setActiveFilter(selectedFilter);
  }, [selectedFilter]);

  /**
   * Génère les labels de dates dynamiques en fonction du filtre sélectionné
   * @param {string} filter - "today", "7days", "30days"
   * @returns {Array} Tableau de labels de dates formatées
   */
  
  const trendByService = useMemo(() => {
    let trend = {};

    const services = ["Monbien", "Startloc", "Marketing automobile", "Marketing immobilier", "Pige Online", "Sinimo"];
    const platforms = ["Google", "Trustpilot"];

    services.forEach((service) => {
        platforms.forEach((platform) => {
            if (!trend[service]) trend[service] = {};

            // Vérifier si les valeurs existent avant d'accéder
            const lastMonthData = averageRatingLastTwoMonths.lastMonth?.[service] || {};
            const twoMonthsAgoData = averageRatingLastTwoMonths.twoMonthsAgo?.[service] || {};

            const lastMonthRating = parseFloat(lastMonthData[platform] || 0);
            const twoMonthsAgoRating = parseFloat(twoMonthsAgoData[platform] || 0);

            if (lastMonthRating > twoMonthsAgoRating) {
                trend[service][platform] = "up";
            } else if (lastMonthRating < twoMonthsAgoRating) {
                trend[service][platform] = "down";
            } else {
                trend[service][platform] = "neutral";
            }
        });
    });

    return trend;
  }, [averageRatingLastTwoMonths]);


  /**
   * Liste des services affichés dans le tableau avec leurs avis et notes
  */
  const servicesData = useMemo(() => [
    { 
      id: 1, 
      name: 'Monbien', 
      icon: MONBIEN, 
      trustpilot: `${reviewsCountByService?.["Monbien"]?.trustpilot || 0} - ${(parseFloat(avgRatingByService?.["Monbien"]?.trustpilot) || 0).toFixed(1)}/5`, 
      google: `${reviewsCountByService?.["Monbien"]?.google || 0} - ${(parseFloat(avgRatingByService?.["Monbien"]?.google) || 0).toFixed(1)}/5`, 
      avgRating: parseFloat(avgRatingByService?.["Monbien"]?.google) || parseFloat(avgRatingByService?.["Monbien"]?.trustpilot) || 0,
      trend: trendByService["Monbien"]?.google || "neutral",
      totalReviews: (reviewsCountByService?.["Monbien"]?.trustpilot || 0) + (reviewsCountByService?.["Monbien"]?.google || 0)
    },
    { 
      id: 2, 
      name: 'Startloc', 
      icon: STARTLOC, 
      trustpilot: `${reviewsCountByService?.["Startloc"]?.trustpilot || 0} - ${(parseFloat(avgRatingByService?.["Startloc"]?.trustpilot) || 0).toFixed(1)}/5`, 
      google: `${reviewsCountByService?.["Startloc"]?.google || 0} - ${(parseFloat(avgRatingByService?.["Startloc"]?.google) || 0).toFixed(1)}/5`, 
      avgRating: parseFloat(avgRatingByService?.["Startloc"]?.google) || parseFloat(avgRatingByService?.["Startloc"]?.trustpilot) || 0,
      trend: trendByService["Startloc"]?.google || "neutral",
      totalReviews: (reviewsCountByService?.["Startloc"]?.trustpilot || 0) + (reviewsCountByService?.["Startloc"]?.google || 0)
    },
    { 
      id: 3, 
      name: 'Marketing automobile', 
      icon: MARKETINGAUTO, 
      trustpilot: `${reviewsCountByService?.["Marketing automobile"]?.trustpilot || 0} - ${(parseFloat(avgRatingByService?.["Marketing automobile"]?.trustpilot) || 0).toFixed(1)}/5`, 
      google: `${reviewsCountByService?.["Marketing automobile"]?.google || 0} - ${(parseFloat(avgRatingByService?.["Marketing automobile"]?.google) || 0).toFixed(1)}/5`, 
      avgRating: parseFloat(avgRatingByService?.["Marketing automobile"]?.google) || parseFloat(avgRatingByService?.["Marketing automobile"]?.trustpilot) || 0,
      trend: trendByService["Marketing automobile"]?.google || "neutral",
      totalReviews: (reviewsCountByService?.["Marketing automobile"]?.trustpilot || 0) + (reviewsCountByService?.["Marketing automobile"]?.google || 0)
    },
    { 
      id: 4, 
      name: 'Marketing immobilier', 
      icon: MARKETINGIMMO, 
      trustpilot: `${reviewsCountByService?.["Marketing immobilier"]?.trustpilot || 0} - ${(parseFloat(avgRatingByService?.["Marketing immobilier"]?.trustpilot) || 0).toFixed(1)}/5`, 
      google: `${reviewsCountByService?.["Marketing immobilier"]?.google || 0} - ${(parseFloat(avgRatingByService?.["Marketing immobilier"]?.google) || 0).toFixed(1)}/5`, 
      avgRating: parseFloat(avgRatingByService?.["Marketing immobilier"]?.google) || parseFloat(avgRatingByService?.["Marketing immobilier"]?.trustpilot) || 0,
      trend: trendByService["Marketing immobilier"]?.google || "neutral",
      totalReviews: (reviewsCountByService?.["Marketing immobilier"]?.trustpilot || 0) + (reviewsCountByService?.["Marketing immobilier"]?.google || 0)
    },
    { 
      id: 5, 
      name: 'Sinimo', 
      icon: SINIMO, 
      trustpilot: `${reviewsCountByService?.["Sinimo"]?.trustpilot || 0} - ${(parseFloat(avgRatingByService?.["Sinimo"]?.trustpilot) || 0).toFixed(1)}/5`, 
      google: `${reviewsCountByService?.["Sinimo"]?.google || 0} - ${(parseFloat(avgRatingByService?.["Sinimo"]?.google) || 0).toFixed(1)}/5`, 
      avgRating: parseFloat(avgRatingByService?.["Sinimo"]?.google) || parseFloat(avgRatingByService?.["Sinimo"]?.trustpilot) || 0,
      trend: trendByService["Sinimo"]?.google || "neutral",
      totalReviews: (parseInt(reviewsCountByService?.["Sinimo"]?.trustpilot) || 0) + (parseInt(reviewsCountByService?.["Sinimo"]?.google) || 0)
    },
    { 
      id: 6, 
      name: 'Pige Online', 
      icon: PIGEONLINE, 
      trustpilot: `${reviewsCountByService?.["Pige Online"]?.trustpilot || 0} - ${(parseFloat(avgRatingByService?.["Pige Online"]?.trustpilot) || 0).toFixed(1)}/5`, 
      google: `${reviewsCountByService?.["Pige Online"]?.google || 0} - ${(parseFloat(avgRatingByService?.["Pige Online"]?.google) || 0).toFixed(1)}/5`, 
      avgRating: parseFloat(avgRatingByService?.["Pige Online"]?.google) || parseFloat(avgRatingByService?.["Pige Online"]?.trustpilot) || 0,
      trend: trendByService["Pige Online"]?.google || "neutral",
      totalReviews: (parseInt(reviewsCountByService?.["Pige Online"]?.trustpilot) || 0) + (parseInt(reviewsCountByService?.["Pige Online"]?.google) || 0)
    }
  ], [reviewsCountByService, avgRatingByService, trendByService]);
  

  /**
   * Boutons d'action pour naviguer vers différentes pages
   */
  const myButtons = useMemo(() => [
    {
      label: "Voir les avis récents",
      icon: <CalendarTodayIcon />,
      onClick: () => navigate("/avisRecents"),
      variant: "contained",
      color: "#121826",
      bgColor: "white",
    },
    {
      label: "Collecter un avis",
      icon: <AddIcon />,
      onClick: () => navigate("/collecterAvis"),
      variant: "contained",
      color: "white",
      bgColor: "#6B5BFF",
    }
  ], [navigate]);



  return (
    <Box sx={{ width: '100%', maxWidth: '1900px', margin: 'auto', p: 2, marginTop: "100px" }}>
      {/* En-tête */}
      <Typography variant="h2" textAlign="center" gutterBottom>
        <span style={{ fontWeight: 'bold', color: "#121826" }}>Tableau de bord </span>
        <span style={{ color: '#8B5CF6', fontWeight: "200" }}>des performances et retours clients du groupe Realty</span>
      </Typography>
      <Typography variant="h6" sx={{ color: "#121826", textAlign: 'center', mb: "64px", mt: "80px" }}>
        Tous les retours clients pour l'ensemble des services en un seul coup d'œil
      </Typography>

      {/* Statistiques et actions */}
      <Grid container sx={{ mb: 4, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Avis collectés" value={totalReviews} />
        </Grid>
        <Grid item sx={{ marginLeft: '50px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, mt: 2 }}>
            <ActionButtons buttons={myButtons} />
          </Box>
        </Grid>
      </Grid>

      {/* Tableau des services et graphique */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ServicesTable services={servicesData} />
        </Grid>
        <Grid item xs={12} md={6} mt={2}>
        <ServicesChart/>
        </Grid>
      </Grid>
    </Box>
  );
}

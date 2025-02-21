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
 * 📊 Composant principal `MainGrid`
 * Affiche le tableau de bord avec les statistiques, le tableau des services et les graphiques.
 */
export default function MainGrid() {
  const navigate = useNavigate();
  const { reviewsPerPeriod, totalReviews, selectedFilter, changeFilter, parseRelativeDate } = useFetchReviews();

  // État pour gérer le filtre actif du graphique
  const [activeFilter, setActiveFilter] = useState(selectedFilter);

  // Synchroniser l'état interne `activeFilter` avec `selectedFilter`
  useEffect(() => {
    setActiveFilter(selectedFilter);
  }, [selectedFilter]);

  /**
   * 🏷️ Génère les labels de dates dynamiques en fonction du filtre sélectionné
   * @param {string} filter - "today", "7days", "30days"
   * @returns {Array} Tableau de labels de dates formatées
   */
  const getDateLabels = useCallback((filter) => {
    const days = filter === "today" ? 1 : filter === "7days" ? 8 : 32 ;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }).reverse();
  }, []);

  /**
   * 📊 Prépare les datasets pour `ServicesChart`
   */
  const dataSets = useMemo(() => {
    if (!reviewsPerPeriod || !reviewsPerPeriod[selectedFilter]) {
      return {
        today: { labels: ["Pas de données"], data: [0] },
        "7days": { labels: ["Pas de données"], data: [0] },
        "30days": { labels: ["Pas de données"], data: [0] },
      };
    }

    const filteredReviews = reviewsPerPeriod[selectedFilter] || [];
    const labels = getDateLabels(selectedFilter);

    return {
      today: {
        labels,
        data: [filteredReviews.length],
      },
      "7days": {
        labels,
        data: labels.map(labelDate => {
            return filteredReviews.filter(r => {
                const reviewDate = parseRelativeDate(r.date);
                return reviewDate.getDate() === parseInt(labelDate.split('/')[0], 10) &&
                      reviewDate.getMonth() + 1 === parseInt(labelDate.split('/')[1], 10);
            }).length || 0;
        }),
      },
      "30days": {
        labels,
        data: labels.map(labelDate => {
            return filteredReviews.filter(r => {
                const reviewDate = parseRelativeDate(r.date);
                return reviewDate.getDate() === parseInt(labelDate.split('/')[0], 10) &&
                      reviewDate.getMonth() + 1 === parseInt(labelDate.split('/')[1], 10);
            }).length || 0;
        }),
      },
    };
  }, [reviewsPerPeriod, selectedFilter, parseRelativeDate, getDateLabels]);

  console.log("📊 Vérification des avis dans '30days' :");
  reviewsPerPeriod["30days"]?.forEach(r => {
      const reviewDate = parseRelativeDate(r.date);
      console.log(`📆 Avis ID: ${r.review_id} | Date brute: ${r.date} | Date calculée: ${reviewDate.toLocaleDateString('fr-FR')}`);
  });




  /**
   * 📌 Liste des services affichés dans le tableau avec leurs avis et notes
   */
  const servicesData = useMemo(() => [
    { id: 1, name: 'Monbien', icon: MONBIEN, trustpilot: totalReviews, google: totalReviews, appStore: '-', googlePlay: '-', avgRating: 4.8, trend: 'down' },
    { id: 2, name: 'Startloc', icon: STARTLOC, trustpilot: totalReviews, google: totalReviews, appStore: '18 - 4.8/5', googlePlay: '36 - 4.8/5', avgRating: 4.3, trend: 'up' },
    { id: 3, name: 'Marketing Automobile', icon: MARKETINGAUTO, trustpilot: '568 - 4.8/5', google: '568 - 4.8/5', appStore: '-', googlePlay: '-', avgRating: 4.1, trend: 'neutral' },
    { id: 4, name: 'Marketing Immobilier', icon: MARKETINGIMMO, trustpilot: '260 - 4.8/5', google: '84 - 4.8/5', appStore: '-', googlePlay: '-', avgRating: 3.8, trend: 'down' },
    { id: 5, name: 'Sinimo', icon: SINIMO, trustpilot: '260 - 4.8/5', google: '260 - 4.8/5', appStore: '360 - 4.8/5', googlePlay: '360 - 4.8/5', avgRating: 3.3, trend: 'up' },
    { id: 6, name: 'Pige Online', icon: PIGEONLINE, trustpilot: '360 - 4.8/5', google: '360 - 4.8/5', appStore: '-', googlePlay: '-', avgRating: 2.2, trend: 'neutral' },
  ], [totalReviews]);

  /**
   * 🛠️ Boutons d'action pour naviguer vers différentes pages
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
    <Box sx={{ width: '100%', maxWidth: '1900px', margin: 'auto', p: 2 }}>
      {/* 🏆 En-tête */}
      <Typography variant="h2" textAlign="center" gutterBottom>
        <span style={{ fontWeight: 'bold', color: "#121826" }}>Tableau de bord </span>
        <span style={{ color: '#8B5CF6', fontWeight: "200" }}>des performances et retours clients du groupe Realty</span>
      </Typography>
      <Typography variant="h6" sx={{ color: "#121826", textAlign: 'center', mb: 4 }}>
        Tous les retours clients pour l'ensemble des services en un seul coup d'œil
      </Typography>

      {/* 🛠️ Statistiques et actions */}
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

      {/* 📊 Tableau des services et graphique */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ServicesTable services={servicesData} />
        </Grid>
        <Grid item xs={12} md={6} mt={2}>
          <ServicesChart dataSets={dataSets} title="d’avis par services" onFilterChange={changeFilter} onActiveFilterChange={setActiveFilter} />
        </Grid>
      </Grid>
    </Box>
  );
}

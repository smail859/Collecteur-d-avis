
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from './CustomizedDataGrid';
import PageViewsBarChart from './PageViewsBarChart';
import StatCard from './StatCard';
import ActionButtons from './ActionsButtons'; // Importation du nouveau composant

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: '1900px', margin: 'auto', p: 2 }}>
      {/* Titre */}
      <Typography variant="h2" textAlign="center" gutterBottom>
        <span style={{ fontWeight: '900', color: "#121826"}}>Tableau de bord </span>
        <span style={{ color: '#6B5BFF' }}>des performances et retours clients du groupe Realty</span>
      </Typography>
      <Typography variant="h6" sx={{ color: "#121826", textAlign: 'center', mb: 4 }}>
        Tous les retours clients pour l'ensemble des services en un seul coup d'œil
      </Typography>



      {/* StatCard Centrée */}
      <Grid 
        container 
        sx={{ 
          mb: 4, 
          mt: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' // Sépare les éléments sur la ligne
        }}
      >
        {/* StatCard à gauche */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Avis collectés" value="5 209" />
        </Grid>

        {/* Boutons à droite */}
        <Grid item sx={{ marginLeft: '50px' }} >
          <ActionButtons 
            onFirstClick={() => console.log("Voir les avis récents")}
            onSecondClick={() => console.log("Collecter un avis")}
          />
        </Grid>
      </Grid>


      {/* Tableau et Graphique côte à côte */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <CustomizedDataGrid />
        </Grid>

        <Grid item xs={12} md={6} mt={2}>
          <Box>
            <PageViewsBarChart />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

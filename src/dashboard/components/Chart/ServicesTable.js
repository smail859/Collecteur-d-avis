import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Star, ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

/**
 * Composant réutilisable pour afficher une liste de services et avis.
 * @param {Array} services - Liste des services avec leurs avis et notes.
 */

export default function ServicesTable({ services }) {
  // Fonction pour afficher l'icône de tendance
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUpward style={{ color: 'green' }} />;
    if (trend === 'down') return <ArrowDownward style={{ color: 'red' }} />;
    return <Remove style={{ color: 'gray' }} />;
  };

  return (
    <Box sx={{ padding: '40px', borderRadius: '12px' }}>
      {/* Titre */}
      <Typography variant="h4" fontWeight="bold"  sx={{ color: '#333' }}>
        Nombre d’avis et notes <span style={{ color: '#6B5BFF' }}>par services</span>
      </Typography>

      {/* Sous-titre */}
      <Typography variant="body1"  sx={{ color: '#8B5CF6', marginTop: '20px', marginBottom: "20px" }}>
        Analysez les performances de vos services grâce aux notes et avis clients collectés sur chaque plateforme.
      </Typography>

      {/* Tableau */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', overflow: 'hidden', padding: '10px' }}>
        <Table>
          {/* En-tête */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '900', color: '#8B5CF6', fontSize: '20px' }}>Services</TableCell>
              <TableCell sx={{ fontWeight: '200', color: '#8B5CF6', fontSize: '20px' }}>Trustpilot avis/notes</TableCell>
              <TableCell sx={{ fontWeight: '200', color: '#8B5CF6', fontSize: '20px' }}>Google avis/notes</TableCell>
              <TableCell sx={{ fontWeight: '200', color: '#8B5CF6', fontSize: '20px' }}>App Store avis/notes</TableCell>
              <TableCell sx={{ fontWeight: '200', color: '#8B5CF6', fontSize: '20px' }}>Google Play avis/notes</TableCell>
              <TableCell sx={{ fontWeight: '200', color: '#8B5CF6', fontSize: '20px' }}>Total d’avis</TableCell>
              <TableCell sx={{ fontWeight: '200', color: '#8B5CF6', fontSize: '20px'}}>Note moyenne</TableCell>
            </TableRow>
          </TableHead>

          {/* Corps du tableau */}
          <TableBody>
            {services.length > 0 ? (
              services.map((service, index) => (
                <TableRow 
                  key={service.id} 
                  sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#F2F3FB', borderBottom: '1px solid #6B5BFF' }}
                >
                  {/* Service avec icône */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <img src={service.icon} alt={service.name} width={32} height={32} />
                      <Typography sx={{color: '#121826', fontWeight: '600'}}>{service.name}</Typography>
                    </Box>
                  </TableCell>

                  {/* Avis et notes */}
                  <TableCell>{service.trustpilot}</TableCell>
                  <TableCell>{service.google}</TableCell>
                  <TableCell>{service.appStore}</TableCell>
                  <TableCell>{service.googlePlay}</TableCell>
                  <TableCell>{service.totalReviews}</TableCell>

                  {/* Note moyenne avec icône */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getTrendIcon(service.trend)}
                      <Typography>{service.avgRating}</Typography>
                      <Star style={{ color: '#FFC107' }} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Aucun service disponible.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Validation avec PropTypes
ServicesTable.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      trustpilot: PropTypes.string.isRequired,
      google: PropTypes.string.isRequired,
      appStore: PropTypes.string,
      googlePlay: PropTypes.string,
      totalReviews: PropTypes.string.isRequired,
      avgRating: PropTypes.number.isRequired,
      trend: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
    })
  ).isRequired,
};

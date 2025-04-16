import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box ,  useMediaQuery, useTheme} from '@mui/material';
import { Star, ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

/**
 * Composant réutilisable pour afficher une liste de services et avis.
 * @param {Array} services - Liste des services avec leurs avis et notes.
 */
export default function ServicesTable({ services }) {
  const theme = useTheme(); 
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTrendIcon = useMemo(() => {
    return {
      up: <ArrowUpward style={{ color: 'green' }} />,
      down: <ArrowDownward style={{ color: 'red' }} />,
      neutral: <Remove style={{ color: 'gray' }} />
    };
  }, []);

  // VERSION MOBILE - AFFICHAGE EN CARTES
  if (isMobile) {
    return (
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.text.primary, fontSize: "30px", mb: 2 }}>
          Nombre d’avis et notes <span style={{ color: theme.palette.secondary.main }}>par services</span>
        </Typography>

        {services.map(service => (
          <Box key={service.id} sx={{ border: "1px solid #eee", borderRadius: "12px", p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <img src={service.icon} alt={service.name} width={32} height={32} />
              <Typography fontWeight="bold">{service.name}</Typography>
            </Box>
            <Typography variant="body2">Trustpilot : {service.trustpilot}</Typography>
            <Typography variant="body2">Google : {service.google} </Typography>
            <Typography variant="body2">Total : {service.totalReviews} avis </Typography>
            <Typography variant="body2">
              Note Moyenne : {service.avgRating}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  //  VERSION DESKTOP - AFFICHAGE EN TABLEAU
  return (
    <Box sx={{ padding: '40px', borderRadius: '12px' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
        Nombre d’avis et notes <span style={{ color: theme.palette.secondary.main }}>par services</span>
      </Typography>

      
      {/* Sous-titre */}
      <Typography variant="body1" sx={{ color: theme.palette.secondary.main, marginTop: '20px', marginBottom: "20px" }}>
        Analysez les performances de vos services grâce aux notes et avis clients collectés sur chaque plateforme.
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px',
          boxShadow: theme.shadows[3],
          overflow: 'hidden',
          padding: '10px',
          mt: 4
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {['Services', 'Trustpilot avis/notes', 'Google avis/notes', 'App Store avis/notes', 'Google Play avis/notes', 'Total d’avis', 'Note moyenne'].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: ['Services', 'Note moyenne'].includes(header) ? 'bold' : 'normal',
                    color: theme.palette.text.primary,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map((service, index) => (
              <TableRow
                key={service.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? theme.palette.background.default : theme.palette.background.alt,
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    {service.icon && <img src={service.icon} alt={service.name} width={32} height={32} />}
                    <Typography fontWeight="600">{service.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{service.trustpilot}</TableCell>
                <TableCell>{service.google}</TableCell>
                <TableCell>{service.appStore}</TableCell>
                <TableCell>{service.googlePlay}</TableCell>
                <TableCell>{service.totalReviews}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getTrendIcon[service.trend]}
                    <Typography>{service.avgRating}</Typography>
                    <Star style={{ color: theme.palette.warning.main }} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


// Définition des types de props attendues
ServicesTable.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      trustpilot: PropTypes.string.isRequired,
      google: PropTypes.string.isRequired,
      appStore: PropTypes.string,
      googlePlay: PropTypes.string,
      totalReviews: PropTypes.string.isRequired,
      avgRating: PropTypes.func.isRequired,
      trend: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
    })
  ).isRequired,
};

// Valeurs par défaut
ServicesTable.defaultProps = {
  services: [],
};

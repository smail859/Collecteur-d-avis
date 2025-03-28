import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles'; // ✅ Importer useTheme
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Star, ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

/**
 * Composant réutilisable pour afficher une liste de services et avis.
 * @param {Array} services - Liste des services avec leurs avis et notes.
 */
export default function ServicesTable({ services }) {
  const theme = useTheme(); // ✅ Récupérer le thème actuel

  // Styles factorisés
  const headerCellStyle = { fontWeight: '600', color: theme.palette.primary.main, fontSize: '14px' };

  // Styles spécifiques pour "Services" et "Note Moyenne"
  const boldHeaders = ["Services", "Note moyenne"];

  // Fonction optimisée avec useMemo pour éviter de recalculer inutilement
  const getTrendIcon = useMemo(() => {
    return {
      up: <ArrowUpward style={{ color: 'green' }} />,
      down: <ArrowDownward style={{ color: 'red' }} />,
      neutral: <Remove style={{ color: 'gray' }} />
    };
  }, []);

  return (
    <Box sx={{ padding: '40px', borderRadius: '12px' }}>
      {/* Titre */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
        Nombre d’avis et notes <span style={{ color: theme.palette.secondary.main }}>par services</span>
      </Typography>

      {/* Sous-titre */}
      <Typography variant="body1" sx={{ color: theme.palette.secondary.main, marginTop: '20px', marginBottom: "20px" }}>
        Analysez les performances de vos services grâce aux notes et avis clients collectés sur chaque plateforme.
      </Typography>

      {/* Tableau */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.background.paper, // ✅ Fond adaptable
          borderRadius: '12px',
          boxShadow: theme.shadows[3], // ✅ Ombre adaptable
          overflow: 'hidden',
          padding: '10px',
        }}
      >
        <Table>
          {/* En-tête */}
          <TableHead>
            <TableRow>
              {['Services', 'Trustpilot avis/notes', 'Google avis/notes', 'App Store avis/notes', 'Google Play avis/notes', 'Total d’avis', 'Note moyenne'].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    ...headerCellStyle,
                    fontWeight: boldHeaders.includes(header) ? 'bold' : 'normal',
                    color: theme.palette.text.primary, // ✅ Couleur texte du header adaptable
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Corps du tableau */}
          <TableBody>
            {services.length > 0 ? (
              services.map((service, index) => (
                <TableRow
                  key={service.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? theme.palette.background.default : theme.palette.background.alt,
                    borderBottom: `1px solid ${theme.palette.divider}`, // ✅ Utilisation de palette.divider
                  }}
                >
                  {/* Service avec icône */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      {service.icon ? (
                        <img src={service.icon} alt={service.name} width={32} height={32} />
                      ) : (
                        <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>No Icon</Typography>
                      )}
                      <Typography sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>
                        {service.name}
                      </Typography>
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
                      {getTrendIcon[service.trend]}
                      <Typography>{service.avgRating}</Typography>
                      <Star style={{ color: theme.palette.warning.main }} /> {/* ✅ Utilisation de palette.warning */}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography sx={{ color: theme.palette.text.secondary }}>Aucun service disponible.</Typography>
                </TableCell>
              </TableRow>
            )}
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

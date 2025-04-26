import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box ,  useMediaQuery, useTheme} from '@mui/material';
import { Star, ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

/**
 * Composant réutilisable pour afficher une liste de services et avis.
 * @param {Array} services - Liste des services avec leurs avis et notes.
 */
export default function ServicesTable({ services = [] }) {
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
            <Typography variant="body2" sx={{ color: "#00B67A" }}>
              Trustpilot : {service.trustpilot}
            </Typography>
            <Typography variant="body2" sx={{ color: "#4285F4" }}>
              Google : {service.google}
            </Typography>

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
      <Typography fontWeight="bold" sx={{ color: theme.palette.text.primary, fontSize: "54px", mt: "100px" }}>
        Nombre d'avis et notes <span style={{ color: theme.palette.custom.violetRealty }}>par services</span>
      </Typography>

      
      {/* Sous-titre */}
      <Typography sx={{ color: theme.palette.custom.violetRealty, marginTop: '20px', marginBottom: "20px", fontWeight: "600" }}>
        Analysez les performances de vos services grâce aux notes et avis clients collectés sur chaque plateforme.
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px',
          boxShadow: theme.shadows[3],
          overflow: 'hidden',
          padding: '34px',
          mt: 4,
          mb: "100px"
        }}
      >
        <Table
          sx={{
            borderCollapse: 'collapse',
            '& td, & th': {
              borderBottom: `1px solid ${theme.palette.custom.violetRealty}`,
            },
          }}
        >


          <TableHead>
            <TableRow>
              {['Services', 'Trustpilot avis/notes', 'Google avis/notes', 'App Store avis/notes', 'Google Play avis/notes', 'Total d’avis', 'Note moyenne'].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: ['Services', 'Note moyenne', "Total d’avis"].includes(header) ? 600 : 400,
                    
                    color: theme.palette.custom.violetRealty,
                    fontSize: "20px"
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
                  backgroundColor: index % 2 === 1 ? theme.palette.background.default : theme.palette.background.alt

                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    {service.icon && <img src={service.icon} alt={service.name} width="70px" height="70px"  />}
                    <Typography fontWeight="600" fontSize="16px">{service.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{fontWeight: "400", fontSize: "16px"}}>{service.trustpilot}</TableCell>
                <TableCell sx={{fontWeight: "400", fontSize: "16px"}} >{service.google}</TableCell>
                <TableCell sx={{fontWeight: "400", fontSize: "16px"}} >{service.appStore}</TableCell>
                <TableCell sx={{fontWeight: "400", fontSize: "16px"}} >{service.googlePlay}</TableCell>
                <TableCell sx={{fontWeight: "400", fontSize: "16px"}} >{service.totalReviews}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: 'white',
                      padding: "24px",
                      borderRadius: '20px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                      width: 'fit-content',
                      mx: 'auto'
                    }}
                  >
                    {getTrendIcon[service.trend]}
                    <Typography fontWeight="bold">{service.avgRating}</Typography>
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
      avgRating: PropTypes.number.isRequired,
      trend: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
    })
  ).isRequired,
};
import PropTypes from 'prop-types'; // Pour documenter et sécuriser les props
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Box, Typography, Button, Avatar 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

/**
 * Composant réutilisable pour afficher une liste de services et générer des liens uniques.
 * @param {string} title - Titre principal du module.
 * @param {string} subtitle - Sous-titre expliquant l'utilisation du module.
 * @param {Array} services - Liste des services avec leurs icônes et liens associés.
 * @param {Function} onCopy - Fonction appelée lorsqu'un bouton de copie est cliqué.
 */

/**
 * Masquer les liens en arrière plan et afficher uniquement Google ou TrustPilot
 */
const CollecterAvis = ({ title, subtitle, services, onCopy }) => {
  return (
    <Box maxWidth="1400px" mx="auto" p={3}>
      
      {/* Titre principal */}
      <Typography fontSize="54px" fontWeight="900" textAlign="start" ml="20px" gutterBottom>
        {title}
      </Typography>

      {/* Sous-titre */}
      <Typography fontSize="16px" fontWeight="bold" textAlign="start" ml="20px" mb="40px" color='#8B5CF6' gutterBottom>
        {subtitle}
      </Typography>

      {/* Tableau des services */}
      <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: 3, padding: 3 }}>
        <Table sx={{ minWidth: 1000 }} aria-label="tableau des avis">
          
          {/* En-tête du tableau */}
          <TableHead sx={{ borderBottom: '1px solid #8B5CF6'}}>
            <TableRow>
              <TableCell sx={{ fontWeight: '900', color: '#8B5CF6', fontSize: '18px', borderBottom: 'none'}}>
                Services
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: '900', color: '#8B5CF6', fontSize: '18px', borderBottom: 'none' }}>
                Copier le lien
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service, index) => (
                <TableRow 
                  key={service.name} 
                  sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#F2F3FB', borderBottom: '1px solid #8B5CF6' }}
                >
                  {/* Logo + Nom du service */}
                  <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center', gap: 2, borderBottom: 'none', padding: '30px' }}>
                    <Avatar src={service.icon} sx={{ width: 60, height: 60 }} />
                    <Typography fontWeight="600">{service.name}</Typography>
                  </TableCell>

                  {/* Liens dynamiques */}
                  <TableCell align="right" sx={{ borderBottom: '1px solid #8B5CF6' }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                      {service.links.map((link) => (
                        <Button 
                          key={link}
                          variant="contained" 
                          sx={{ 
                            backgroundColor: 'white', 
                            color: '#8B5CF6',
                            fontWeight: 'bold',
                            boxShadow: 1,
                            borderRadius: '20px',
                            '&:hover': { backgroundColor: '#F0E8FF' }
                          }}
                          endIcon={<ContentCopyIcon />}
                          onClick={() => onCopy(service.name, link)} 
                        >
                          {link}
                        </Button>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography variant="body1" color="text.secondary">Aucun service disponible</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>


        </Table>
      </TableContainer>

    </Box>
  );
};

// Définition des `propTypes` pour la documentation et la validation des props
CollecterAvis.propTypes = {
  title: PropTypes.string.isRequired, // Titre principal obligatoire
  subtitle: PropTypes.string.isRequired, // Sous-titre obligatoire
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired, // Nom du service
      icon: PropTypes.string.isRequired, // Icône du service
      links: PropTypes.arrayOf(PropTypes.string).isRequired, // Liens associés au service
    })
  ).isRequired,
  onCopy: PropTypes.func, // Fonction appelée lors de la copie d'un lien
};

// Valeurs par défaut des props (au cas où elles ne sont pas fournies)
CollecterAvis.defaultProps = {
  onCopy: (service, link) => alert(`Lien copié pour ${service} - ${link}`), // Alert par défaut
};

export default CollecterAvis;

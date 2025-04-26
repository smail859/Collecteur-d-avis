import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";
import PropTypes from 'prop-types';

/**
 * Composant réutilisable pour afficher un lien de navigation.
 * @param {string} path - Chemin du lien.
 * @param {string} label - Texte affiché.
 * @param {ReactNode} icon - Icône optionnelle à afficher avant le texte.
 * @param {boolean} isFooter - Si `true`, applique un background et une taille spécifique à l'icône (pour le footer uniquement).
 */
const NavLinks = ({ path = '/', label = 'Dashboard', icon = null, isFooter = false }) => {
  return (
    <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexGrow: 1 }}>
      <NavLink
        to={path}
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column', // Place l'icône au-dessus du texte
          alignItems: 'center',
          textDecoration: 'none',
          color: isActive ? '#8B5CF6' : '#121826',
          fontWeight: '600',
          fontSize: '18px',
        })}
      >
        {({ isActive }) => (
          <>
            {/* Icône avec background actif uniquement si `isFooter` est `true` */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isFooter ? '40px' : 'auto', // Taille fixe pour le footer
                height: isFooter ? '40px' : 'auto',
                borderRadius: isFooter ? '50%' : 'none', // Cercle uniquement dans le footer
                backgroundColor: isFooter ? (isActive ? '#8B5CF6' : 'white') : 'transparent', // Fond violet si actif, blanc si inactif
                color: isActive ? 'white' : '#8B5CF6', // Couleur de l'icône
                boxShadow: isFooter ? (isActive ? "rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px" : "none") : "none",
                transition: 'background 0.3s ease, width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {icon}
            </span>
            
            {/* Label du lien */}
            <span>{label}</span>
          </>
        )}
      </NavLink>
    </Box>
  );
};

// Définition des types de props
NavLinks.propTypes = {
  path: PropTypes.string.isRequired, // Chemin du NavLink
  label: PropTypes.string.isRequired, // Texte affiché
  icon: PropTypes.node, // Icône facultative
  isFooter: PropTypes.bool, // Active le background sur l'icône uniquement dans le footer
};

export default NavLinks;

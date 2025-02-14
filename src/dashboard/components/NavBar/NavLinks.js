import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";
import PropTypes from 'prop-types'; // Pour documenter et sécuriser les props


/**
 * Composant réutilisable pour créer les navLinks.
 * @param {string} path - Chemin pour le navLinks.
 * @param {string} label - Nom du navLinks.
*/

// N'oublie pas de créer un tableau lorsque tu utilise ce composant avec tes propres chemins et nom pour utilise ce composant par exemple :
// const links = [
//     { path: "/", label: "Tableau de bord" }

const NavLinks = ({path= '/', label= 'Dashboard'}) => {
    return(
        // Center Section - Navigation Links 
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexGrow: 1 }}>
            <NavLink
            to={path}
            style={({ isActive }) => ({
              color: isActive ? '#8B5CF6' : '#121826',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '18px'
            })}
            >
            {label}
            </NavLink>
        </Box>
    )
    
}


NavLinks.propTypes = {
    path: PropTypes.string.isRequired, // Chemin pour le Navlinks
    label: PropTypes.string.isRequired // Le nom de ton NavLinks
}

export default NavLinks;
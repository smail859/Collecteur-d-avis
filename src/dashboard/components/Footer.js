import { Container, Box, useMediaQuery, useTheme } from '@mui/material';
import NavLinks from "./NavBar/NavLinks";
import icon from '../../image/icon.png';
import AddIcon from '@mui/icons-material/Add';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const links = [
  { path: "/", label: "Tableau de bord", icon: <HomeOutlinedIcon /> },
  { path: "/avisRecents", label: "Avis récents", icon: <CalendarMonthOutlinedIcon /> },
  { path: "/collecterAvis", label: "Collecter des avis", icon: <AddIcon /> },
  { path: "/statistiques", label: "Statistiques", icon: <CalendarMonthOutlinedIcon /> }
];

const Footer = () => {
  const theme = useTheme(); // Récupérer le thème actuel
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (isMobile) return null; // Affichage désactivé sur mobile

  return (
    <footer 
      style={{
        position: "static", // Fixe le footer en bas
        bottom: 0,
        left: 0,
        right: 0,
        height: "100%", // Taille ajustée
        width: "100%",
        backgroundColor: "white",
        borderTop: "1px solid #E0E0E0", // Séparation avec le contenu
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Toujours au-dessus du contenu
        padding: "10px 0"
      }}
    >
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "flex-end", // Tout aligner à droite
            width: "100%"
          }}
        >
          {/* Logo à gauche (mais poussé à droite) */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
            <img src={icon} alt="Logo" style={{ height: "50px" }} />
          </Box>

          {/* Liens alignés à droite */}
          <Box sx={{ display: "flex", justifyContent: "right", gap: 5, ml: "auto" }}>
            {links.map((link) => (
              <Box 
                key={link.path} 
                sx={{
                  transition: "all 0.3s ease-in-out", 
                  '&:hover': { transform: "scale(1.1)" } // Animation au survol
                }}
              >
                <NavLinks label={link.label} path={link.path} icon={link.icon} isFooter={true} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </footer>
  );
}

export default Footer;

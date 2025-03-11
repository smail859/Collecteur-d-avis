import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: "#F5F7FF", 
    },
  },
  typography: {
    h1: {
      fontSize: "3rem", // Taille par défaut (desktop)
      "@media (max-width:960px)": { fontSize: "2.5rem" }, // Tablette
      "@media (max-width:600px)": { fontSize: "2rem" }, // Mobile
    },
  },
  spacing: 8, // Définit une base pour le padding et margin
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960, // Jusqu'à cette valeur, la responsivité s'applique
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;

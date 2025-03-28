import { createTheme } from '@mui/material/styles';

// Fonction pour créer un thème en fonction du mode clair ou sombre
const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? "dark" : "light",
    background: {
      default: darkMode ? "#121212" : "#F5F7FF",
      paper: darkMode ? "#1E1E1E" : "#FFFFFF",
    },
    text: {
      primary: darkMode ? "#ffffff" : "#000000",
    },
  },
});

export default getTheme;

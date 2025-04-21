// getTheme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const getTheme = (darkMode) => {
  let theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#8B5CF6', // violet
      },
      background: {
        default: darkMode ? '#121212' : '#F5F7FF',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#121826',
        secondary: '#8B5CF6',
      },
      backgrounds: {
        gradientMain: "linear-gradient(180deg, #EDEFFF 0%, #D0D9FF 50%, #FFFFFF 100%)",
      },
      custom: {
        violetRealty: '#8B5CF6',
      }
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
      h1: {
        fontSize: '72px',
        fontWeight: 800,
        color: '#121826',
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#121826',
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#121826',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#121826',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 600,
        color: 'black',
      },
    },
    components: {
      MuiContainer: {
        defaultProps: {
          maxWidth: false,
        },
        styleOverrides: {
          root: {
            maxWidth: '100%',
            margin: '0 auto',
            padding: '16px',
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};

export default getTheme;

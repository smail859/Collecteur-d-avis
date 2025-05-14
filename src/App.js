import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "./dashboard/Dashboard";
import AvisRecents from "./avisRécents/pages/AvisRecents";
import Statistiques from './statistiques/page/Statistiques';
import CollecterAvis from "./collecterAvis/pages/CollecterAvis"
import AppNavbar from "./dashboard/components/NavBar/AppNavbar"; 
import CommerciauxManager from "./commerciaux/CommerciauxManager";
import Footer from './dashboard/components/Footer';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useEffect } from 'react';
import getTheme from './theme';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <ThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline /> {/* Applique automatiquement le bon background */}
      <BrowserRouter>
        {/* Barre de navigation avec le Dark Mode activable */}
        <AppNavbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

        {/* Gestion des différentes pages */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/avisRecents" element={<AvisRecents />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/collecterAvis" element={<CollecterAvis />} />
          <Route path="/commerciaux-manage" element={<CommerciauxManager />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "./dashboard/Dashboard";
import AvisRecents from "./avisRécents/pages/AvisRecents";
import Statistiques from "./statistiques/Statistiques";
import CollecterAvis from "./collecterAvis/pages/CollecterAvis"
import AppNavbar from "./dashboard/components/NavBar/AppNavbar"; 
import Footer from './dashboard/components/Footer';

function App() {
  return (
    <BrowserRouter>
      {/* Barre de navigation qui reste affichée */}
      <AppNavbar />

      {/* Gestion des différentes pages */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/avisRecents" element={<AvisRecents/>} />
        <Route path="/statistiques" element={<Statistiques />} />
        <Route path="/collecterAvis" element={<CollecterAvis />} />
      </Routes>

      <Footer />
    </BrowserRouter>


  );
}

export default App;

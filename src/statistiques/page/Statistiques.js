import ChartStatistiques from "../components/ChartStatistiques";
import ChartBarStatistiques from "../components/ChartBarStatistiques";
import { Typography, Button, Box } from "@mui/material";
import { useState } from "react";
import MONBIEN from "../../image/MONBIEN.png";
import STARTLOC from "../../image/STARTLOC.png";
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png";
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png";
import SINIMO from "../../image/SINIMO.png";
import PIGEONLINE from "../../image/PIGEONLINE.png";
import ListChip from "../../avisRécents/components/ListChip";
import useFetchReviews from "../../hooks/components/useFetchReviews";
import CommercialTable from "../components/CommercialTable";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Statistiques = () => {
  const { commercialCounts, commercialCountsYears } = useFetchReviews();
  
  // Fonction pour générer le PDF à partir de l'élément avec id "pdf-content"
  const generatePDF = () => {
    const input = document.getElementById("pdf-content");
    if (!input) {
      console.error("L'élément avec id 'pdf-content' n'a pas été trouvé.");
      return;
    }
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("avis.pdf");
    });
  };

  // Extraire les données annuelles (total des avis par commercial et par service)
  const { totalAvisParCommercialParService } = commercialCountsYears || {};

  // État : Commercial sélectionné
  const [selectedCommercial, setSelectedCommercial] = useState("Smaïl");

  // Fonction de changement de commercial
  const handleCommercialChange = (serviceLabel, commercial) => {
    setSelectedCommercial(commercial);
  };

  // Vérifier que commercialCounts contient des données
  const tableauCommerciaux = Array.isArray(commercialCounts) ? commercialCounts : [];

  // Construction des données mensuelles pour les cartes
  const data = tableauCommerciaux.map((commercial) => ({
    label: commercial.name || "Inconnu",
    count: commercial.count || 0,
  }));

  // Données des services et leurs commerciaux (pour le sélecteur)
  const servicesData = [
    { label: "Monbien", icon: MONBIEN, commerciaux: ["Joanna", "Théo"] },
    { label: "Startloc", icon: STARTLOC, commerciaux: ["Mélanie", "Smaïl", "Lucas", "Deborah", "Manon"] },
    { label: "Sinimo", icon: SINIMO, commerciaux: ["Anaïs"] },
    { label: "Marketing automobile", icon: MARKETINGAUTO, commerciaux: ["Elodie", "Oceane"] },
    { label: "Marketing immobilier", icon: MARKETINGIMMO, commerciaux: ["Johanna", "Jean-Simon"] },
    { label: "Pige Online", icon: PIGEONLINE, commerciaux: ["Angela"] },
  ];

  // Couleurs
  const colors = ["#7B61FF", "#E3E4FE"];

  return (
    <Box>
      <Typography variant="h2" textAlign="left" ml="180px" mt="50px" gutterBottom>
        <span style={{ fontWeight: "bold", color: "#121826" }}>Statistiques détaillées</span>
        <span style={{ color: "#8B61FF", fontWeight: "200" }}> par collaborateur</span>
      </Typography>

      {/* Sélection des commerciaux */}
      <ListChip
        servicesChip={servicesData}
        selectedCommercial={selectedCommercial}
        handleCommercialChange={handleCommercialChange}
        variant="select"
      />
      

      {selectedCommercial && (
        <>
          <Typography variant="h4" textAlign="start" mt={5} ml="180px">
            <span style={{ color: "#8B61FF", fontWeight: "500" }}>Bilan de {selectedCommercial}</span>
            <span style={{ fontWeight: "bold", color: "#121826" }}> pour le mois en cours</span>
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, alignItems: 'center' }}>
            <Button
              onClick={generatePDF}
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #7B61FF 0%, #8B61FF 100%)",
                color: "white",
                fontWeight: "bold",
                borderRadius: "30px",
                textTransform: "none",
                px: 4,
                py: 1.5,
                boxShadow: "0"
              }}
            >Exporter les données mensuelles en PDF</Button>
          </Box>
          <ChartStatistiques
            data={data}
            colors={colors}
            selectedCommercial={selectedCommercial}
            tableauCommerciaux={tableauCommerciaux}
            totalAvisParCommercialParService={totalAvisParCommercialParService}
          />

          <Typography variant="h4" textAlign="left" ml="180px" mt="50px" gutterBottom>
            <span style={{ fontWeight: "bold", color: "#121826" }}>Bilan annuel </span>
            <span style={{ color: "#8B61FF", fontWeight: "500" }}>de {selectedCommercial}</span>
          </Typography>

          <ChartBarStatistiques
            data={data}
            colors={colors}
            selectedCommercial={selectedCommercial}
            totalAvisParCommercialParService={totalAvisParCommercialParService}
            commercialCountsYears={commercialCountsYears}
          />

          {/* Conteneur PDF caché (positionné hors écran) */}
          <Box id="pdf-content" sx={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
            <CommercialTable commercialCounts={commercialCounts} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Statistiques;

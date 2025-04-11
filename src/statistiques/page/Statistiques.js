import ChartStatistiques from "../components/ChartStatistiques";
import ChartBarStatistiques from "../components/ChartBarStatistiques";
import { Typography, Button, Box } from "@mui/material";
import { useState } from "react";
import MonbienRadius from "../../image/MonbienRadius.png";
import MARadius from "../../image/MARadius.png";
import MIRadius from "../../image/MIRadius.png";
import PORadius from "../../image/PORadius.png";
import SinimoRadius from "../../image/SinimoRadius.png";
import StartlocRadius from "../../image/StartlocRadius.png";
import ListChip from "../../avisRécents/components/ListChip";
import useFetchReviews from "../../hooks/components/useFetchReviews";
import CommercialTable from "../components/CommercialTable";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Statistiques = () => {
  const { commercialCounts, commercialCountsYears, filteredReviews } = useFetchReviews();

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
  const [selectedCommercial, setSelectedCommercial] = useState("");



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
    { label: "Monbien", icon: MonbienRadius, commerciaux: ["Joanna", "Théo"] },
    { label: "Startloc", icon: StartlocRadius, commerciaux: ["Mélanie", "Smaïl", "Lucas", "Deborah", "Manon"] },
    { label: "Sinimo", icon: SinimoRadius, commerciaux: ["Anaïs"] },
    { label: "Marketing automobile", icon: MARadius, commerciaux: ["Elodie", "Arnaud"] },
    { label: "Marketing immobilier", icon: MIRadius, commerciaux: ["Johanna", "Jean-Simon","Oceane"] },
    { label: "Pige Online", icon: PORadius, commerciaux: ["Angela", "Esteban"] },
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

        {/* Bloc si aucun commercial sélectionné */}
        {!selectedCommercial && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: "415px",
              mx: "auto",
              mt: 6,
              maxWidth: "950px",
              px: 4,
              
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              fontWeight={600}
              color= "#8B61FF"

            >
              Veuillez sélectionner un commercial pour afficher les statistiques
            </Typography>
            <ArrowUpwardOutlinedIcon sx={{ fontSize: 40, color: "#8B61FF", mr: 2 }} />
          </Box>
        )}



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
            filteredReviews={filteredReviews}
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
import ChartStatistiques from "../components/ChartStatistiques";
import ChartBarStatistiques from "../components/ChartBarStatistiques";
import { Typography, Button, Box,useMediaQuery, useTheme } from "@mui/material";
import { useState, useMemo } from "react";
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
import useCommerciauxParService from "../../commerciaux/useCommerciauxParService";


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
  const { data: commerciauxParService, loading: loadingCommerciaux } = useCommerciauxParService();

  const servicesData = useMemo(() => {
    if (!commerciauxParService) return [];

    return Object.entries(commerciauxParService).map(([service, commerciaux]) => ({
      label: service,
      icon: {
        "Monbien": MonbienRadius,
        "Startloc": StartlocRadius,
        "Sinimo": SinimoRadius,
        "Marketing automobile": MARadius,
        "Marketing immobilier": MIRadius,
        "Pige Online": PORadius,
      }[service] || null,
      commerciaux: Object.keys(commerciaux),
    }));
  }, [commerciauxParService]);

  // Couleurs
  const colors = ["#7B61FF", "#E3E4FE"];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography
        variant="h2"
        sx={{
          textAlign: isMobile ? "center" : "left",
          mx: isMobile ? "auto" : "180px",
          mt: isMobile ? "30px" : "50px",
          fontSize: isMobile ? "26px" : "54px",
          fontWeight: 900,
        }}
        gutterBottom
      >
        <span style={{ color: "#121826" }}>Statistiques détaillées</span>{" "}
        <span style={{ color: "#8B61FF", fontWeight: 200 }}>par collaborateur</span>
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
          <Typography   
            textAlign={isMobile ? "center" : "left"}
            mt={isMobile ? 4 : 5}
            ml={isMobile ? 0 : "180px"}
            sx={{ fontSize: isMobile ? "20px" : "32px" }}
            >
            <span style={{ color: "#8B61FF", fontWeight: "500" }}>Bilan de {selectedCommercial}</span>
            <span style={{ fontWeight: "bold", color: "#121826" }}> pour le mois en cours</span>
          </Typography>
          <Box sx={{ display: isMobile ? "none" : "flex", justifyContent: "center", mt: 3, alignItems: 'center' }}>
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

          <Typography variant="h4"             
            textAlign={isMobile ? "center" : "left"}
            mt={isMobile ? 4 : 5}
            ml={isMobile ? 0 : "180px"}
            sx={{ fontSize: isMobile ? "20px" : "32px" }}gutterBottom>
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
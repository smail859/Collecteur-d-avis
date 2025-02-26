import { Typography, Box, Grid } from "@mui/material";

const StatistiquesGrid = ({ data = [], selectedCommercial }) => {
  console.log("📊 Data reçue dans StatistiquesGrid:", data);
  console.log("🔍 Commercial sélectionné:", selectedCommercial);

  // Vérifier si un commercial est sélectionné
  if (!selectedCommercial) {
    return <Typography color="error">❌ Aucun commercial sélectionné.</Typography>;
  }

  // Normalisation du texte pour éviter les erreurs de casse ou d'accents
  const normalizeText = (text) =>
    text ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  // Trouver les données du commercial sélectionné
  const selectedData = data.find(
    (item) => item.name && normalizeText(item.name) === normalizeText(selectedCommercial)
  );

  console.log("📊 Données trouvées pour le commercial:", selectedData);

  // Vérifier si le commercial a des données
  if (!selectedData) {
    return <Typography>Aucune donnée disponible pour ce commercial.</Typography>;
  }

  // Calcul des gains
  const nombreAvis = selectedData.count;
  const gainsBruts = nombreAvis * 10; // 10€ par avis
  const gainsNets = (gainsBruts * 7.96) / 10; // Calcul des gains nets

  return (
    <Grid container spacing={4}>
      {/* Nombre d'avis */}
      <Grid item xs={12} sm={6} md={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "150px",
            borderRadius: 2,
            bgcolor: "#F2F3FB",
            padding: "20px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Nombre d'avis
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#8B5CF6" }}>
            {nombreAvis}
          </Typography>
        </Box>
      </Grid>

      {/* Gains bruts */}
      <Grid item xs={12} sm={6} md={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "150px",
            borderRadius: 2,
            bgcolor: "#F2F3FB",
            padding: "20px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Gains bruts
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#27AE60" }}>
            {gainsBruts}€
          </Typography>
        </Box>
      </Grid>

      {/* Gains nets */}
      <Grid item xs={12} sm={6} md={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "150px",
            borderRadius: 2,
            bgcolor: "#F2F3FB",
            padding: "20px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Gains nets
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#E67E22" }}>
            {gainsNets.toFixed(2)}€
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StatistiquesGrid;

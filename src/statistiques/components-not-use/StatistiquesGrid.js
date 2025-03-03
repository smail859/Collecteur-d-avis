import { Typography, Box, Grid, LinearProgress, styled,Rating } from "@mui/material";

const StatistiquesGrid = ({ data = [], selectedCommercial }) => {

  const CustomLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    "& .MuiLinearProgress-bar": {
      borderRadius: 5,
      backgroundImage: "linear-gradient(to right, #1CB5E0, #e01cd5)",
    },
  }));

  // Vérifier si un commercial est sélectionné
  if (!selectedCommercial) {
    return <Typography color="error"> Aucun commercial sélectionné.</Typography>;
  }

  // Normalisation du texte pour éviter les erreurs de casse ou d'accents
  const normalizeText = (text) =>
    text ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  // Trouver les données du commercial sélectionné
  const selectedData = data.find((item) => {
    if (!item.label) {
      console.warn("Un élément de data n'a pas de label :", item);
      return false;
    }
  
    const normalizedItemLabel = normalizeText(item.label);
    const normalizedSelectedCommercial = normalizeText(selectedCommercial);
  
    console.log(`Comparaison : "${normalizedItemLabel}" vs "${normalizedSelectedCommercial}"`);
  
    return normalizedItemLabel === normalizedSelectedCommercial;
  });
  
  
  // Vérifier si le commercial a des données
  if (!selectedData) {
    return <Typography>Aucune donnée disponible pour ce commercial.</Typography>;
  }

  // Calcul des gains
  const nombreAvis = selectedData.count;
  const gainsBruts = nombreAvis * 10; // 10€ par avis
  const gainsNets = (gainsBruts * 7.96) / 10; // Calcul des gains nets

  return (
    <Grid container spacing={5}>
      {/* Nombre d'avis */}
      <Grid item xs={12} sm={1} md={3}>
        <Box
          sx={{
            width: "290px",
            height: "240px",
            borderRadius: 2,
            bgcolor: "#F2F3FB",
            padding: "34px",
          }}
        >
          <Rating value={5} precision={0.5} readOnly />
          <Typography variant="h6" sx={{ fontWeight: "400", color: "#8B5CF6"}}>
            <span style={{ fontWeight: 'bold', color: "#8B5CF6" }}>Total</span> d'avis collectés
          </Typography>
          <Typography variant="h1" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "120px"}}>
            {nombreAvis}
          </Typography>
        </Box>
      </Grid>
    
      {/* Gains bruts */}
      <Grid item xs={12} sm={6} md={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "start",
            width: "290px",
            height: "240px",
            borderRadius: 2,
            bgcolor: "#F2F3FB",
            padding: "34px",
          }}
        >
          <CustomLinearProgress variant="determinate" value={75} sx={{ width: "120px", height: "18px", marginBottom: "10px" }} />
          <Typography variant="h6" sx={{ fontWeight: "400" }}>
            <span style={{ fontWeight: 'bold', color: "black" }}>Gains</span>  bruts(€)
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "90px" }}>
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
            alignItems: "flex-start",
            justifyContent: "start",
            width: "290px",
            height: "240px",
            borderRadius: 2,
            bgcolor: "#F2F3FB",
            padding: "34px",
          }}
        >
          <CustomLinearProgress variant="determinate" value={75} sx={{ width: "120px", height: "18px", marginBottom: "10px" }} />
          <Typography variant="h6" sx={{ fontWeight: "400" }}>
            <span style={{ fontWeight: 'bold', color: "black" }}>Gains</span>  nets(€)
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#8B5CF6", fontSize: "70px" }}>
            {gainsNets.toFixed(2)}€
          </Typography>
        </Box>
      </Grid>
    </Grid>
  
  );
};

export default StatistiquesGrid;

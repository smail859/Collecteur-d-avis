import { useState } from "react";
import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button, Avatar, Alert, AlertTitle, useMediaQuery, useTheme,Stack,Divider} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

/**
 * Composant pour afficher des services avec des liens cachés.
 */
const CollecterAvis = ({ title, subtitle, services }) => {
  const [copied, setCopied] = useState(false); // État pour afficher l'alerte
  const [copiedPlatform, setCopiedPlatform] = useState(""); // Stocke la plateforme copiée
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));



  const handleCopy = (serviceName, link, platform) => {
    navigator.clipboard.writeText(link); // Copie l'URL dans le presse-papiers
    setCopied(true); // Active l'alerte
    setCopiedPlatform(platform); // Stocke la plateforme copiée

    // Masquer l’alerte après 3 secondes
    setTimeout(() => {
      setCopied(false);
      setCopiedPlatform("");
    }, 3000);
  };

  if (isMobile) {
    return (
      <Stack
        spacing={4}
        sx={{
          width: "100%",
          px: 2,
          py: 4, // espace haut + bas pour le titre
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* Titre principal */}
        <Typography
          gutterBottom
          sx={{
            fontSize: "28px",
            fontWeight: "900",
            textAlign: "center",
            mt: 2
          }}
        >
          {title}
        </Typography>
  
        {/* Sous-titre */}
        <Typography
          gutterBottom
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#8B5CF6"
          }}
        >
          {subtitle}
        </Typography>
        {copied && (
          <Alert severity="success" sx={{ marginBottom: "20px" }}>
            <AlertTitle>Succès</AlertTitle>
            Le lien **{copiedPlatform}** a été copié dans votre presse-papiers !
          </Alert>
        )}
  
        {/* Cartes services */}
        {services.map((service) => (
          <Paper
            key={service.name}
            sx={{
              p: 3, // padding augmenté
              borderRadius: 4,
              boxShadow: 3,
              width: "100%",
              maxWidth: 420 // limite la largeur max pour un rendu équilibré
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={service.icon} sx={{ width: 60, height: 60 }} />
              <Typography fontWeight="bold" fontSize="18px">
                {service.name}
              </Typography>
            </Box>
  
            <Divider sx={{ my: 2 }} />
  
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {service.links.map((linkObj, linkIndex) => (
                <Button
                  key={linkIndex}
                  variant="outlined"
                  sx={{
                    color: "#8B5CF6",
                    borderColor: "#8B5CF6",
                    fontWeight: "bold",
                    borderRadius: "14px",
                    textTransform: "none"
                  }}
                  endIcon={<ContentCopyIcon />}
                  onClick={() =>
                    handleCopy(service.name, linkObj.url, linkObj.platform)
                  }
                >
                  Copier le lien {linkObj.platform}
                </Button>
              ))}
            </Box>
          </Paper>
        ))}
      </Stack>
    );
  }
  

  return (
    <Box maxWidth="1400px" mx="auto" p={3}>
      {/* Titre principal */}
      <Typography gutterBottom sx={{fontSize: "54px", fontWeight:"900", textAlign: "start", ml:"20px"}} >
        {title}
      </Typography>

      {/* Sous-titre */}
      <Typography sx={{fontSize: "16px" ,fontWeight:"bold" ,textAlign:"start" ,ml:"20px" ,mb:"40px" ,color:"#8B5CF6" }} gutterBottom>
        {subtitle}
      </Typography>
      
      {copied && (
        <Alert severity="success" sx={{ marginBottom: "20px" }}>
          <AlertTitle>Succès</AlertTitle>
          Le lien **{copiedPlatform}** a été copié dans votre presse-papiers !
        </Alert>
      )}

      {/* Tableau des services */}
      <TableContainer component={Paper} sx={{ borderRadius: "10px", boxShadow: 3, padding: 3 }}>
        <Table sx={{ minWidth: 1000 }} aria-label="tableau des avis">
          {/* En-tête du tableau */}
          <TableHead sx={{ borderBottom: "1px solid #8B5CF6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "900", color: "#8B5CF6", fontSize: "18px", borderBottom: "none" }}>
                Services
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "900", color: "#8B5CF6", fontSize: "18px", borderBottom: "none" }}>
                Copier le lien
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service, index) => (
                <TableRow key={service.name} sx={{ backgroundColor: index % 2 === 0 ? "white" : "#F2F3FB", borderBottom: "1px solid #8B5CF6" }}>
                  {/* Logo + Nom du service */}
                  <TableCell component="th" scope="row" sx={{ display: "flex", alignItems: "center", gap: 2, borderBottom: "none", padding: "30px" }}>
                    <Avatar src={service.icon} sx={{ width: 60, height: 60 }} />
                    <Typography fontWeight="600">{service.name}</Typography>
                  </TableCell>

                  {/* Bouton Copier (affiche seulement "Google" ou "Trustpilot") */}
                  <TableCell align="right" sx={{ borderBottom: "1px solid #8B5CF6" }}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
                      {service.links.map((linkObj, linkIndex) => (
                        <Button
                          key={linkIndex}
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "#8B5CF6",
                            width:"190px",
                            height: "60px",
                            fontWeight: "bold",
                            boxShadow: 1,
                            borderRadius: "14px",
                            fontSize: "18px"
                          }}
                          endIcon={<ContentCopyIcon />}
                          onClick={() => handleCopy(service.name, linkObj.url, linkObj.platform)}
                        >
                          {linkObj.platform} {/* Affiche uniquement Google ou Trustpilot */}
                        </Button>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography variant="body1" color="text.secondary">
                    Aucun service disponible
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Définition des `propTypes`
CollecterAvis.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired, // Nom du service
      icon: PropTypes.string.isRequired, // Icône du service
      links: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired, // URL cachée
          platform: PropTypes.string.isRequired, // Plateforme (Google, Trustpilot)
        })
      ).isRequired,
    })
  ).isRequired,
};

export default CollecterAvis;
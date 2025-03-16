import { Card, CardContent, CardHeader, CardActions, Typography, Avatar, Stack, Link, Rating, Modal, Button, Box, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PropTypes from "prop-types";
import { useState } from "react";

const FullAvis = ({ avisData, defaultValueAvis }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const MAX_LENGTH = 150;
  const text = avisData.text || avisData.snippet || "";
  const isLongText = text.length > MAX_LENGTH;
  const truncatedText = isLongText ? text.slice(0, MAX_LENGTH) + "..." : text;

  return (
    <Card sx={{ 
      width: "350px", 
      minHeight: "200px",
      backgroundColor: '#F2F3FB', 
      borderRadius: '15px', 
      boxShadow: 2, 
      padding: 2,
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'space-between' 
    }}>
      {/* En-tête de l'avis */}
      <CardHeader
        avatar={
          <Avatar 
            src={avisData.user?.thumbnail} 
            alt={avisData.user?.name || "Utilisateur"} 
          />
        }
        title={
          <Link 
            href={avisData.user?.link || "#"} 
            target="_blank" 
            rel="noopener noreferrer" 
            underline="none"
          >
            {avisData.user?.name || "Utilisateur inconnu"}
          </Link>
        }
        subheader={avisData.date}
        sx={{ paddingBottom: 0 }}
      />

      {/* Contenu de l'avis */}
      <CardContent sx={{ paddingTop: 1, flexGrow: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Rating name="half-rating-read" value={defaultValueAvis} readOnly precision={0.5} />
        </Stack>

        <Typography variant="body2" color="text.secondary" mt={1}>
          {truncatedText}
        </Typography>

        {isLongText && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Button 
              startIcon={<ExpandMoreOutlinedIcon sx={{ fontSize: 30 }} />} 
              size="big" 
              onClick={handleOpen} 
              sx={{ textTransform: "none", color: "#8B5CF6" }}
            />
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <FolderOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />
            {avisData.link && (
              <Link 
                href={avisData.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                underline="none" 
                sx={{ color: '#8B5CF6', fontSize: '14px' }}
              >
                Voir l'avis sur Google
              </Link>
            )}
          </Stack>
        </Stack>
      </CardActions>

      {/* Modal pour afficher l'avis complet */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={styles.modal}>
          {/* Bouton de fermeture */}
          <IconButton onClick={handleClose} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>

          {/* Titre de la modal */}
          <Typography variant="h5" fontWeight="bold" sx={styles.title}>
            Détail de l'avis
          </Typography>

          {/* Informations sur l'utilisateur */}
          {avisData && avisData.user ? (
            <Box sx={styles.userSection}>
              <Avatar 
                src={avisData.user?.thumbnail} 
                alt={avisData.user?.name || "Utilisateur"} 
                sx={styles.avatar} 
              />
              <Box>
                <Typography fontWeight="bold">
                  {avisData.user?.name || "Utilisateur inconnu"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {avisData.date} • {avisData.reviewCount || 0} avis
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography color="error">Chargement des données...</Typography>
          )}

          {/* Contenu complet de l'avis */}
          <Typography sx={styles.commentText}>{avisData?.text || avisData?.snippet}</Typography>

          {/* Boutons secondaires */}
          <Box sx={styles.actions}>
            {avisData.link && (
              <Link 
                href={avisData.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                underline="none" 
                sx={{ color: '#8B5CF6', fontSize: '14px' }}
              >
                Voir l'avis sur Google
              </Link>
            )}
          </Box>

          {/* Bouton principal */}
          <Button variant="contained" sx={styles.sendButton}>
            Envoyer
          </Button>
        </Box>
      </Modal>
    </Card>
  );
};

/** 🎨 STYLES */
const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "auto",
    bgcolor: "white",
    borderRadius: "16px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "#8B5CF6",
  },
  title: {
    textAlign: "center",
    color: "#1E1E1E",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    bgcolor: "#F2F3FB",
    p: 2,
    borderRadius: "10px",
  },
  avatar: {
    width: 50,
    height: 50,
  },
  commentText: {
    mt: 2,
    bgcolor: "#F2F3FB",
    p: 2,
    borderRadius: "10px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    mt: 2,
  },
  sendButton: {
    mt: 2,
    bgcolor: "#8B5CF6",
    color: "white",
    fontWeight: "bold",
    "&:hover": { bgcolor: "#7B4CE3" },
  },
};

// Validation avec PropTypes
FullAvis.propTypes = {
  avisData: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string,
      link: PropTypes.string,
      thumbnail: PropTypes.string,
      reviews_count: PropTypes.number,
      photos_count: PropTypes.number,
    }),
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    text: PropTypes.string,
    snippet: PropTypes.string,
    link: PropTypes.string,
    reviewCount: PropTypes.number,
    likes: PropTypes.number,
  }).isRequired,
};

export default FullAvis;

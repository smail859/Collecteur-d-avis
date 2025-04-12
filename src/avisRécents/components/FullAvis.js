import {
  Card, CardContent, CardHeader, CardActions, Typography,
  Avatar, Stack, Link, Rating, Modal, Button, Box, IconButton,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';

import ChatGpt from './ChatGpt';
import PropTypes from "prop-types";
import { useState } from "react";

const FullAvis = ({ avisData, defaultValueAvis, detectCommercial }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const MAX_LENGTH = 150;
  const text = avisData.text || avisData.snippet || "";
  const isLongText = text.length > MAX_LENGTH;
  const truncatedText = isLongText ? text.slice(0, MAX_LENGTH) + "..." : text;


  return (
    <Card sx={styles.card}>
      <CardHeader
        avatar={<Avatar src={avisData.user?.thumbnail} alt={avisData.user?.name || "Utilisateur"} />}
        title={
          <Link
            href={avisData.user?.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{ color: "black" }}
          >
            {avisData.user?.name || "Utilisateur inconnu"}
          </Link>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {avisData.date}
            </Typography>
            <Rating
              name="half-rating-read"
              value={defaultValueAvis}
              readOnly
              precision={0.5}
              sx={{ fontSize: "20px" }}
            />
          </Stack>
        }
        sx={{ paddingBottom: 0 }}
      />

      <CardContent sx={{ paddingTop: 1, flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {detectCommercial(truncatedText)}
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

      <CardActions sx={styles.actionsRow}>
        <Stack direction="row" spacing={2} alignItems="center">
          <VisibilityOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />
          {avisData.link && (
            <Link
              href={avisData.link}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={styles.link}
            >
              {avisData.source === "Trustpilot" ? "Voir l'avis sur Trustpilot" : "Voir l'avis sur Google"}
            </Link>
          )}
        </Stack>
      </CardActions>

      <CardActions sx={styles.actionsRow}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ReplyOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />
          {avisData.source === "Google" && (
            <Link
              href="https://business.google.com/reviews"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={styles.link}
            >
              Répondre à l’avis de {avisData.user?.name || "cet utilisateur"} sur Google
            </Link>
          )}
          {avisData.source === "Trustpilot" && (
            <Link
              href="https://fr.trustpilot.com/evaluate/{YOUR_BUSINESS_DOMAIN}"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={styles.link}
            >
              Répondre à l’avis de {avisData.user?.name || "cet utilisateur"} sur Trustpilot
            </Link>
          )}
        </Stack>
      </CardActions>

      <CardActions sx={styles.actionsRow}>
        <Stack direction="row" spacing={2} alignItems="center">
          <AutoFixHighOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />
          {avisData.response?.snippet ? (
          <Typography variant="body2" color="text.secondary">
            Une réponse est déjà disponible.
          </Typography>
        ) : (
          <ChatGpt avisData={avisData} />
        )}
        </Stack>
      </CardActions>


      {/* Modal détaillée */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={styles.modal}>
          <IconButton onClick={handleClose} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold" sx={styles.title}>Détail de l'avis</Typography>
          <Box sx={styles.userSection}>
            <Avatar src={avisData.user?.thumbnail} alt={avisData.user?.name || "Utilisateur"} sx={styles.avatar} />
            <Box>
              <Typography fontWeight="bold">{avisData.user?.name || "Utilisateur inconnu"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {avisData.date} • {avisData.reviewCount || avisData.user?.reviews_count || 0} avis
              </Typography>
            </Box>
          </Box>
          <Typography sx={styles.commentText}>
            {detectCommercial(avisData?.text || avisData?.snippet)}
          </Typography>
          <Typography>{avisData.response?.snippet || "Aucune réponse disponible"}</Typography>
        </Box>
      </Modal>
    </Card>
  );
};

const styles = {
  card: {
    width: "494px",
    height: "auto",
    padding: "34px",
    backgroundColor: "#F2F3FB",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.05)",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    bgcolor: "white",
    borderRadius: "16px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    maxHeight: "80vh",
    overflowY: "auto",
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
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    mt: 1,
  },
  link: {
    color: '#8B5CF6',
    fontSize: '14px',
  },
  sendButton: {
    bgcolor: "#8B5CF6",
    color: "white",
    fontWeight: "bold",
    "&:hover": { bgcolor: "#7B4CE3" },
  },
};

FullAvis.propTypes = {
  avisData: PropTypes.object.isRequired,
  defaultValueAvis: PropTypes.number.isRequired,
  detectCommercial: PropTypes.func.isRequired,
};

export default FullAvis;

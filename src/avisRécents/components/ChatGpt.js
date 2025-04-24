import {
  Stack, Link, Snackbar, Alert,
  Tooltip, IconButton, Box, TextField,
  Modal, Typography
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import PropTypes from "prop-types";
import { useState } from "react";

const ChatGpt = ({ avisData }) => {
  const [loadingReply, setLoadingReply] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openTextarea, setOpenTextarea] = useState(false);
  const [contexte, setContexte] = useState("");

  const handleSuggestReply = async () => {
    setLoadingReply(true);
    setSuggestion(""); 
    setError("");
    const isProd = window.location.hostname !== "localhost";
    const baseUrl = isProd
      ? "https://collecteur-avis.onrender.com"
      : "http://localhost:5000";

    console.log(baseUrl)

    try {
      const response = await fetch(`${baseUrl}/api/suggest-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: avisData.text || avisData.snippet || "",
          source: avisData.source,
          site: avisData.site,
          name : avisData.user?.name,
          contexte: contexte
        }),
      });

      const data = await response.json();
      console.log("🔍 Reçu depuis l'API :", data);

      if (data.reply) {
        setSuggestion(data.reply);
        setOpenModal(true);
      } else {
        setError(data.error || "Erreur inconnue.");
      }
    } catch (err) {
      setError("Erreur lors de la génération de la réponse.");
    } finally {
      setLoadingReply(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Lien d’ouverture du champ contexte + bouton de génération */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Suggérer une réponse automatiquement">
          <Link
            component="button"
            underline="none"
            onClick={() => setOpenTextarea(true)}
            sx={{ color: '#8B5CF6', fontSize: '14px' }}
          >
            Suggérer une réponse
          </Link>
        </Tooltip>
      </Stack>

      {/* Modal de génération avec textarea + bouton */}
      <Modal open={openTextarea} onClose={() => setOpenTextarea(false)}>
        <Box sx={styles.modal}>
          <IconButton onClick={() => setOpenTextarea(false)} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ajouter un contexte (facultatif)
          </Typography>

          <TextField
            label="Souhaitez-vous ajouter un contexte pour affiner la réponse ?"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            value={contexte}
            onChange={(e) => setContexte(e.target.value)}
            sx={{ mb: 3 }}
          />

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <LoadingButton
            onClick={handleSuggestReply}
            loading={loadingReply}
            variant="contained"
            startIcon={<ChatBubbleOutlineIcon />}
            sx={{ backgroundColor: "#8B5CF6", '&:hover': { backgroundColor: "#7B4CE3" } }}
          >
            Générer une réponse
          </LoadingButton>
        </Box>
      </Modal>

      {/* Modal contenant la réponse générée */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={styles.modal}>
          <IconButton onClick={() => setOpenModal(false)} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Suggestion de réponse
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={8}
            value={suggestion}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Tooltip title="Copier la réponse dans le presse-papiers">
              <IconButton onClick={handleCopy} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContentCopyIcon />
                <Typography fontSize="14px" color="inherit">
                  Copier la réponse dans le presse-papiers
                </Typography>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Réponse copiée"
      />
    </>
  );
};

const styles = {
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
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    color: "#8B5CF6",
  },
};

ChatGpt.propTypes = {
  avisData: PropTypes.object.isRequired,
};

export default ChatGpt;

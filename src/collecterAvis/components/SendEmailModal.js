import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import AttachFileIcon from "@mui/icons-material/AttachFile";
  import { useState } from "react";
  
  const SendEmailModal = ({ open, onClose, onSend }) => {
    const [form, setForm] = useState({
      email: "",
      subject: "Demande d’avis",
      message: "Bonjour monsieur Dupont...",
      file: null,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleFileChange = (e) => {
      setForm((prev) => ({ ...prev, file: e.target.files[0] }));
    };
  
    const handleSubmit = () => {
      onSend(form);
      onClose();
    };
  
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: 500,
            maxWidth: "90%",
            bgcolor: "#F2F3FB",
            borderRadius: "14px",
            p: 4,
            mx: "auto",
            my: "10%",
            boxShadow: 24,
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "#8B5CF6",
              color: "#fff",
              "&:hover": { background: "#774DE0" },
            }}
          >
            <CloseIcon />
          </IconButton>
  
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={3}>
            Envoyer par email
          </Typography>
  
          <Box display="flex" gap={2} mb={2}>
            <TextField
              name="email"
              label="Email"
              variant="filled"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              name="subject"
              label="Objet"
              variant="filled"
              fullWidth
              value={form.subject}
              onChange={handleChange}
            />
          </Box>
  
          <TextField
            name="message"
            label="Message"
            variant="filled"
            fullWidth
            multiline
            minRows={4}
            value={form.message}
            onChange={handleChange}
          />
  
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <AttachFileIcon color="action" />
            <label htmlFor="upload-file" style={{ cursor: "pointer" }}>
              <Typography variant="body2" fontWeight="bold" color="#8B5CF6">
                Ajouter un document
              </Typography>
            </label>
            <input
              id="upload-file"
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Box>
  
          <Button
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: "20px",
              background: "linear-gradient(90deg, #2972FF 0%, #8B5CF6 100%)",
              color: "#fff",
              fontWeight: "bold",
            }}
            onClick={handleSubmit}
          >
            Envoyer
          </Button>
        </Box>
      </Modal>
    );
  };
  
  export default SendEmailModal;
  
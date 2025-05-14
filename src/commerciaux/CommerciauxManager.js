import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Paper,
} from "@mui/material";

const CommerciauxManager = () => {
  const [commerciaux, setCommerciaux] = useState([]);
  const [form, setForm] = useState({ service: "", label: "", variants: "" });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchCommerciaux();
  }, []);

  const fetchCommerciaux = async () => {
    const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    console.log("API_URL:", process.env.REACT_APP_API_URL);
    console.log("Base URL:", baseURL);
    console.log("Fetching commerciaux from:", `${baseURL}/api/commerciaux`);
    const { data } = await axios.get(`${baseURL}/api/commerciaux`);
    setCommerciaux(data);
  };

  const handleSubmit = async () => {
    const payload = {
      service: form.service.trim(),
      label: form.label.trim(),
      variants: form.variants.split(",").map(v => v.trim()).filter(Boolean),
    };

    const url = `${process.env.REACT_APP_API_URL}/api/commerciaux`;

    if (editId) {
      await axios.put(`${url}/${editId}`, payload);
    } else {
      await axios.post(url, payload);
    }

    setForm({ service: "", label: "", variants: "" });
    setEditId(null);
    fetchCommerciaux();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/commerciaux/${deleteId}`);
      setDeleteId(null);
      setConfirmOpen(false);
      fetchCommerciaux();
    }
  };


  const handleEdit = (com) => {
    setForm({
      service: com.service,
      label: com.label,
      variants: com.variants.join(", "),
    });
    setEditId(com._id);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const groupedByService = commerciaux.reduce((acc, commercial) => {
    acc[commercial.service] = acc[commercial.service] || [];
    acc[commercial.service].push(commercial);
    return acc;
  }, {});

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>Gestion des Commerciaux</Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Service"
                required
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Nom du commercial"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Variantes (séparées par des virgules)"
                value={form.variants}
                onChange={(e) => setForm({ ...form, variants: e.target.value })}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {Object.entries(groupedByService).map(([service, list]) => (
        <Box key={service} sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>{service}</Typography>
          <Grid container spacing={2}>
            {list.map((com) => (
              <Grid item xs={12} sm={6} md={4} key={com._id}>
                <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="subtitle1">{com.label}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Variantes: {com.variants.join(", ")}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(com)}>Modifier</Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteClick(com._id)}>Supprimer</Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Voulez-vous vraiment supprimer ce commercial ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Annuler</Button>
          <Button color="error" onClick={confirmDelete}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommerciauxManager;

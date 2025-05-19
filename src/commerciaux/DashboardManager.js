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
  Tabs,
  Tab,
  Pagination,
  Modal, 
  IconButton,
  CircularProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const sources = ["google", "trustpilot"];

const DashboardManager = () => {
  // Etats pour les avis
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState("google");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [avis, setAvis] = useState([]);
  const [form, setForm] = useState({
    site: "",
    rating: 5,
    text: "",
    user: "",
    source: "google",
    iso_date: "",
  });
  const [editForm, setEditForm] = useState({
    site: "",
    rating: 5,
    text: "",
    user: "",
    source: "google",
    review_id: ""
  });

  // Etats pour les commerciaux
  const [commerciaux, setCommerciaux] = useState([]);
  const [comForm, setComForm] = useState({ service: "", label: "", variants: "" });
  const [editComId, setEditComId] = useState(null);
  const [deleteComId, setDeleteComId] = useState(null);
  const [confirmComOpen, setConfirmComOpen] = useState(false);

  const MAX_TEXT_LENGTH = 120;
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (text) => {
    setModalContent(text);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingTrustpilot, setLoadingTrustpilot] = useState(false);

  const handleUpdateGoogle = async () => {
    setLoadingGoogle(true);
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/force-update`);
      alert("Mise à jour Google terminée !");
    } catch (err) {
      alert("Erreur lors de la mise à jour Google.");
    }
    setLoadingGoogle(false);
  };

  const handleUpdateTrustpilot = async () => {
    setLoadingTrustpilot(true);
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/update-latest`);
      alert("Mise à jour Trustpilot terminée !");
    } catch (err) {
      alert("Erreur lors de la mise à jour Trustpilot.");
    }
    setLoadingTrustpilot(false);
  };

  // Récupération des avis et commerciaux à chaque changement de source
  useEffect(() => {
    fetchAvis();
    fetchCommerciaux();
    resetForm();
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [selectedSource]);

  // Récupère les avis depuis l'API
  const fetchAvis = async () => {
    const baseURL = process.env.REACT_APP_API_URL;
    if (!baseURL) return;
    try {
      const { data } = await axios.get(`${baseURL}/api/reviews/${selectedSource}`);
      const regrouped = Object.values(data).flatMap(siteData => siteData.reviews || []);
      setAvis(regrouped);
    } catch {
      setAvis([]);
    }
  };

  // Récupère la liste des commerciaux
  const fetchCommerciaux = async () => {
    const baseURL = process.env.REACT_APP_API_URL;
    if (!baseURL) return;
    try {
      const { data } = await axios.get(`${baseURL}/api/commerciaux`);
      setCommerciaux(data);
    } catch {
      setCommerciaux([]);
    }
  };

  // Ajout ou édition d'un avis
  const handleSubmitAvis = async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/reviews`;
    try {
      let payload = { ...form };
      if (typeof payload.user === "string") {
        payload.user = { name: payload.user };
      }
      // Ajoute la date relative au format "fr-FR" (ex: "19/05/2025")
      if (payload.iso_date) {
        payload.date = new Date(payload.iso_date).toLocaleDateString("fr-FR");
      }
      if (!editId) {
        payload.review_id = "custom_" + Date.now();
        await axios.post(url, payload);
      } else {
        await axios.put(`${url}/${editId}`, payload);
      }
      resetForm();
      fetchAvis();
    } catch (err) {
      console.error(err);
    }
  };

  // Pré-remplit le formulaire pour édition
  const handleEdit = (avisItem) => {
    setEditForm({
      site: typeof avisItem.site === "object" ? avisItem.site.name || "" : avisItem.site || "",
      rating: avisItem.rating ?? 5,
      text: avisItem.text || avisItem.snippet || "",
      user: typeof avisItem.user === "object" ? avisItem.user.name || "" : avisItem.user || "",
      source: avisItem.source || selectedSource,
      ...(avisItem.review_id ? { review_id: avisItem.review_id } : {})
    });
    setEditId(avisItem._id || avisItem.review_id || avisItem.id);
    setConfirmEditOpen(true);
  };

  // Réinitialise le formulaire
  const resetForm = () => {
    setForm({ site: "", rating: 5, text: "", user: "", source: selectedSource, iso_date: "" });
    setEditId(null);
  };

  // Suppression d'un avis
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/reviews/${deleteId}`);
      setDeleteId(null);
      setConfirmOpen(false);
      fetchAvis();
    } catch (err) {
      console.error(err);
    }
  };

  // Ouvre la confirmation de suppression
  const handleDeleteClick = (id) => {
    if (!id) return;
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // Filtrage des avis selon la recherche
  const filteredAvis = avis.filter(item =>
    (item.text || item.snippet || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof item.site === "object" ? item.site.name : item.site || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof item.user === "object" ? item.user.name : item.user || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedAvis = filteredAvis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Changement de page
  const handlePageChange = (_, value) => setCurrentPage(value);

  // Ajout ou modification d'un commercial
  const handleSubmitCom = async () => {
    const payload = {
      service: comForm.service.trim(),
      label: comForm.label.trim(),
      variants: comForm.variants.split(",").map(v => v.trim()).filter(Boolean),
    };
    const url = `${process.env.REACT_APP_API_URL}/api/commerciaux`;
    try {
      if (editComId) await axios.put(`${url}/${editComId}`, payload);
      else await axios.post(url, payload);
      setComForm({ service: "", label: "", variants: "" });
      setEditComId(null);
      fetchCommerciaux();
    } catch (err) {
      console.error(err);
    }
  };

  // Suppression d'un commercial
  const confirmDeleteCom = async () => {
    if (deleteComId) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/commerciaux/${deleteComId}`);
        setDeleteComId(null);
        setConfirmComOpen(false);
        fetchCommerciaux();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Pré-remplit le formulaire pour modification d'un commercial
  const handleEditCom = (com) => {
    setComForm({ service: com.service, label: com.label, variants: com.variants.join(", ") });
    setEditComId(com._id);
  };

  // Ouvre la confirmation de suppression d'un commercial
  const handleDeleteComClick = (id) => {
    setDeleteComId(id);
    setConfirmComOpen(true);
  };

  // Regroupe les commerciaux par service
  const groupedByService = commerciaux.reduce((acc, commercial) => {
    acc[commercial.service] = acc[commercial.service] || [];
    acc[commercial.service].push(commercial);
    return acc;
  }, {});

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard – Commerciaux & Avis</Typography>

      {/* Formulaire d'avis */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Site concerné" value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Nom de l'utilisateur" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Note" inputProps={{ min: 1, max: 5 }} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 1 })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Date de l'avis"
                InputLabelProps={{ shrink: true }}
                value={form.iso_date}
                onChange={e => setForm({ ...form, iso_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Contenu de l'avis" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmitAvis}>
              {editId ? "Modifier l'avis" : "Ajouter l'avis"}
            </Button>
            {editId && <Button onClick={resetForm} sx={{ ml: 2 }}>Annuler</Button>}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateGoogle}
          disabled={loadingGoogle}
          startIcon={loadingGoogle && <CircularProgress size={18} color="inherit" />}
        >
          Mettre à jour les avis Google
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpdateTrustpilot}
          disabled={loadingTrustpilot}
          startIcon={loadingTrustpilot && <CircularProgress size={18} color="inherit" />}
        >
          Mettre à jour les avis Trustpilot
        </Button>
      </Box>

      {/* Onglets de sources */}
      <Tabs value={selectedSource} onChange={(e, val) => setSelectedSource(val)} sx={{ mb: 2 }}>
        {sources.map((s) => <Tab key={s} label={`Avis ${s.toUpperCase()}`} value={s} />)}
      </Tabs>

      {/* Recherche */}
      <TextField
        fullWidth
        sx={{ mb: 3 }}
        label="Rechercher un avis par mot-clé, site ou nom"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Liste des avis */}
      <Grid container spacing={2}>
        {paginatedAvis.map((item) => {
          const text = item.text || item.snippet || "Contenu non disponible";
          const isLong = text.length > MAX_TEXT_LENGTH;
          const displayText = isLong ? text.slice(0, MAX_TEXT_LENGTH) + "…" : text;

          return (
            <Grid item xs={12} sm={6} md={4} key={item._id || item.review_id || item.id}>
              <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                <Box mb={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {typeof item.user === 'object' ? item.user.name || 'Inconnu' : item.user || 'Inconnu'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Note : <b>{item.rating ?? "?"}/5</b> &nbsp;|&nbsp; 
                    Site : <b>{typeof item.site === 'object' ? item.site.name || 'Inconnu' : item.site || 'Inconnu'}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date : <b>{item.iso_date ? new Date(item.iso_date).toLocaleDateString("fr-FR") : "Non renseignée"}</b>
                  </Typography>
                </Box>
                <Box flexGrow={1} mb={1}>
                  <Typography variant="body2" sx={{ color: "black" }}>
                    {displayText}
                    {isLong && (
                      <IconButton
                        size="small"
                        aria-label="Voir plus"
                        onClick={() => handleOpenModal(text)}
                        sx={{ ml: 1, verticalAlign: "middle" }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button size="small" onClick={() => handleEdit(item)}>Modifier</Button>
                  <Button color="error" size="small" onClick={() => handleDeleteClick(item._id || item.review_id || item.id)}>Supprimer</Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Modale pour afficher l'avis complet */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 500,
            width: "90%",
          }}
        >
          <Typography variant="h6" gutterBottom>Contenu complet de l'avis</Typography>
          <Typography variant="body1">{modalContent}</Typography>
          <Box mt={2} textAlign="right">
            <Button onClick={handleCloseModal}>Fermer</Button>
          </Box>
        </Box>
      </Modal>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination count={Math.max(1, Math.ceil(filteredAvis.length / itemsPerPage))} page={currentPage} onChange={handlePageChange} color="primary" />
      </Box>

      {/* Gestion des commerciaux */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>Gestion des Commerciaux</Typography>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Service" required value={comForm.service} onChange={(e) => setComForm({ ...comForm, service: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth required label="Nom du commercial" value={comForm.label} onChange={(e) => setComForm({ ...comForm, label: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth required label="Variantes (séparées par des virgules)" value={comForm.variants} onChange={(e) => setComForm({ ...comForm, variants: e.target.value })} />
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleSubmitCom}>{editComId ? "Modifier" : "Ajouter"}</Button>
            </Box>
          </CardContent>
        </Card>

        {/* Liste des commerciaux par service */}
        {Object.entries(groupedByService).map(([service, list]) => (
          <Box key={service} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>{service}</Typography>
            <Grid container spacing={2}>
              {list.map((com) => (
                <Grid item xs={12} sm={6} md={4} key={com._id}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{com.label}</Typography>
                    <Typography variant="body2" color="textSecondary">Variantes: {Array.isArray(com.variants) ? com.variants.join(", ") : ""}</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button variant="outlined" size="small" onClick={() => handleEditCom(com)}>Modifier</Button>
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteComClick(com._id)}>Supprimer</Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Dialog de suppression de commercial */}
        <Dialog open={confirmComOpen} onClose={() => setConfirmComOpen(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography>Voulez-vous vraiment supprimer ce commercial ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmComOpen(false)}>Annuler</Button>
            <Button color="error" onClick={confirmDeleteCom}>Supprimer</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Dialog de confirmation suppression */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent><Typography>Voulez-vous vraiment supprimer cet avis ?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Annuler</Button>
          <Button color="error" onClick={confirmDelete}>Supprimer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation édition */}
      <Dialog open={confirmEditOpen} onClose={() => setConfirmEditOpen(false)}>
        <DialogTitle>Modifier l'avis</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Site concerné" value={editForm.site} onChange={(e) => setEditForm({ ...editForm, site: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Nom de l'utilisateur" value={editForm.user} onChange={(e) => setEditForm({ ...editForm, user: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Note" inputProps={{ min: 1, max: 5 }} value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) || 1 })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Contenu de l'avis" value={editForm.text} onChange={(e) => setEditForm({ ...editForm, text: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEditOpen(false)}>Annuler</Button>
          <Button
            color="primary"
            onClick={async () => {
              try {
                if (!editId) return;
                const url = `${process.env.REACT_APP_API_URL}/api/reviews/${editId}`;
                const payload = { ...editForm };
                if (typeof payload.user === "string") {
                  payload.user = { name: payload.user };
                }
                if (!payload.review_id) delete payload.review_id;
                await axios.put(url, payload);
                setConfirmEditOpen(false);
                setEditId(null);
                fetchAvis();
              } catch (err) {
                console.error("Erreur modification avis :", err);
              }
            }}
          >
            Valider la modification
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardManager;
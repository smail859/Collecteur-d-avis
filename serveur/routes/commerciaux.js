const express = require("express");
const router = express.Router();
const { Commercial } = require("../model/model");

// Liste tous
router.get("/", async (req, res) => {
  try {
    const commerciaux = await Commercial.find();
    res.json(commerciaux);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des commerciaux." });
  }
});

// Ajout
router.post("/", async (req, res) => {
  const { service, label, variants } = req.body;

  if (!service || !label || !Array.isArray(variants)) {
    return res.status(400).json({ error: "Champs 'service', 'label' et 'variants[]' requis." });
  }

  try {
    const commercial = new Commercial({ service, label, variants });
    await commercial.save();
    res.status(201).json(commercial);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création du commercial." });
  }
});

// Modification
router.put("/:id", async (req, res) => {
  const { service, label, variants } = req.body;
  if (!service || !label || !Array.isArray(variants)) {
    return res.status(400).json({ error: "Champs requis invalides." });
  }
  try {
    const updated = await Commercial.findByIdAndUpdate(
      req.params.id,
      { service, label, variants },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Non trouvé." });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// Suppression
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Commercial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Commercial non trouvé." });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

module.exports = router;
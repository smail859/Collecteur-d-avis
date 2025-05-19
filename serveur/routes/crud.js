const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Review } = require("../model/model.js");

// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { site, rating, user, review_id } = req.body;

    if (!site || !rating || !user) {
      return res.status(400).json({
        error: "Champs obligatoires manquants : 'site', 'rating' et 'user'.",
      });
    }

    if (!review_id) {
      return res.status(400).json({
        error: "L'identifiant 'review_id' est obligatoire (Google ou Trustpilot).",
      });
    }

    const newReview = new Review(req.body);
    const saved = await newReview.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Erreur création avis :", error.message);

    if (error.code === 11000 && error.keyPattern?.review_id) {
      return res.status(409).json({
        error: "Un avis avec cet identifiant 'review_id' existe déjà.",
      });
    }

    res.status(500).json({
      error: "Erreur interne : impossible d'ajouter l'avis. Veuillez réessayer.",
    });
  }
});

// PUT /api/reviews/:id// PUT /api/reviews/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID requis pour la mise à jour." });
    }

    const updated = await Review.findOneAndUpdate(
      {
        $or: [
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          { review_id: id }
        ]
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        error: `Aucun avis trouvé avec l'identifiant '${id}' (_id ou review_id).`,
      });
    }

    res.json(updated);
  } catch (error) {
    console.error("❌ Erreur modification avis :", error.message);
    res.status(500).json({
      error: "Erreur interne : impossible de modifier l'avis.",
    });
  }
});


// DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID requis pour la suppression." });
  }

  try {
    // Prépare les critères de suppression : review_id OU _id si ObjectId valide
    const criteria = [];

    if (mongoose.Types.ObjectId.isValid(id)) {
      criteria.push({ _id: id });
    }

    // Toujours chercher aussi par review_id (Google, Trustpilot)
    criteria.push({ review_id: id });

    const deleted = await Review.findOneAndDelete({ $or: criteria });

    if (!deleted) {
      return res.status(404).json({
        error: `Aucun avis trouvé avec l'_id ou le review_id : ${id}`,
      });
    }

    res.json({ message: "✅ Avis supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur suppression avis :", error.message);

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        error: "Format d'identifiant invalide : ni _id Mongo valide, ni review_id.",
      });
    }

    res.status(500).json({
      error: "Erreur serveur : suppression impossible.",
    });
  }
});

module.exports = router;

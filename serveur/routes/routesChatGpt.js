const express = require("express");
const router = express.Router();
// const { OpenAI } = require("openai");
require("dotenv").config();
const prompts = require("../prompt-file/prompt.js");
const { Groq } = require("groq-sdk");


// serveur/routes/routesGroq.js
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
  const { text, source, site, contexte, name } = req.body;
  if (!text || !site) return res.status(400).json({ error: "Texte ou site manquant" });

  const sitePrompt = prompts[site];
  if (!sitePrompt) return res.status(400).json({ error: "Aucun prompt défini pour ce site" });

  const prompt = `
    ${sitePrompt}
    
    Tu es responsable du service client de l’équipe ${site}.  
    Un client nommé **${name}** a laissé cet avis sur ${source} :  
    "${text}"
    
    **Objectif** : rédiger une réponse professionnelle, chaleureuse, humaine et reconnaissante.  
    Ta réponse doit être authentique, refléter l’écoute et montrer que chaque retour est précieux.
    
    Commence toujours par : "Bonjour ${name},"
    
    ${contexte ? `Contexte supplémentaire transmis par l'équipe : ${contexte}` : ""}
    
    Adapte ton ton en fonction de l’avis : 
    - S’il est positif : renforce la satisfaction, remercie avec le cœur ❤️ et termine sur une note enthousiaste.  
    - S’il est négatif : reste compréhensif, propose une solution, et montre notre engagement à s’améliorer 💪
    
    Ajoute des **émojis pertinents** pour donner du relief à ta réponse, **sans en abuser**.
    
    Ne copie pas le texte de l’avis, reformule toujours avec tes propres mots.
  `;
  
  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error("❌ Erreur GROQ:", error);
    res.status(500).json({ error: "Erreur lors de la génération de la réponse." });
  }
});

module.exports = router;


// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// router.post("/", async (req, res) => {
//   const { text, source } = req.body;
//   if (!text) return res.status(400).json({ error: "Texte manquant" });

//   try {
//     const prompt = `Tu es un professionnel de l'immobilier. Rédige une réponse professionnelle, humaine et sympathique à l'avis suivant (${source}) :\n\n"${text}"`;

//     const completion = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 150,
//     });

//     const reply = completion.choices[0].message.content.trim();
//     res.json({ reply });
//   } catch (error) {
//     console.error("❌ Erreur OpenAI:", error);
//     res.status(500).json({ error: "Erreur lors de la génération de la réponse." });
//   }
// });

// router.post("/", async (req, res) => {
//   const { text, source } = req.body;
//   if (!text) return res.status(400).json({ error: "Texte manquant" });

//   try {
//     // Simulation d'une réponse pour tester le fonctionnement
//     const fakeReply = `Merci beaucoup pour votre retour ${source === "Google" ? "sur Google" : "sur Trustpilot"} ! Nous sommes ravis que votre expérience ait été positive 😊`;

//     // Attente simulée pour l'effet de chargement
//     await new Promise(resolve => setTimeout(resolve, 800));

//     res.json({ reply: fakeReply });
//   } catch (error) {
//     console.error("❌ Erreur simulée :", error);
//     res.status(500).json({ error: "Erreur lors de la génération de la réponse." });
//   }
// });




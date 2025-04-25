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
    
    Tu es chargé du service client pour l’équipe ${site}.
    Un client nommé **${name}** a laissé cet avis sur ${source} :  
    "${text}"
    
    Ta mission : rédiger une réponse **brève**, **professionnelle** et **chaleureuse** (5 à 7 lignes maximum).
    
    Commence toujours par : "Bonjour ${name},"
    
    ${contexte ? `Voici un complément d'information fourni par l'équipe : ${contexte}` : ""}
    
    Consignes :
    - Si l’avis est **positif** : remercie chaleureusement, valorise son retour et termine par une touche positive.
    - Si l’avis est **négatif** : reste calme, montre de l’écoute, reformule brièvement le problème et propose une piste de solution.
    - Reformule avec **tes propres mots**, ne répète jamais mot pour mot le texte du client.
    - Tu peux insérer quelques **émojis utiles** mais sans excès.
    - Évite les phrases trop longues ou générales. Va à l’essentiel avec sincérité.
    
    Réponds maintenant.
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




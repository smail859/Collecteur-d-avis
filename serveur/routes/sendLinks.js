const express = require("express");
const router = express.Router();
const multer = require("multer");
const sgMail = require("@sendgrid/mail");
const upload = multer(); // pour gérer les fichiers en mémoire

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", upload.single("file"), async (req, res) => {
  const { email, subject, message, platform, service, link, from } = req.body;
  const attachment = req.file;

  const emailData = {
    to: email,
    from: from || "smail.elhajjar@groupe-realty.com", // fallback par défaut
    subject,
    text: `${message}\n\nVoici le lien vers ${platform} pour ${service} : ${link}`,
    html: `<p>${message}</p><p><strong>Lien ${platform} :</strong> <a href="${link}">${link}</a></p>`,
  };

  if (attachment) {
    emailData.attachments = [
      {
        content: attachment.buffer.toString("base64"),
        filename: attachment.originalname,
        type: attachment.mimetype,
        disposition: "attachment",
      },
    ];
  }

  try {
    await sgMail.send(emailData);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err.response?.body || err);
    res.status(500).json({ error: "Erreur lors de l'envoi" });
  }  
});


module.exports = router;

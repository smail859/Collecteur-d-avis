const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Chemin vers votre fichier de clé JSON
const SERVICE_ACCOUNT_FILE = "monbienfr-dfbe9d2d91c7.json";
const SCOPES = ["https://www.googleapis.com/auth/businessprofile"];

// L'ID de votre établissement
const LOCATION_ID = "5883753786407685028";

app.use(cors()); // Autoriser les requêtes cross-origin

// Route pour récupérer les avis
app.get("/get-reviews", async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: SCOPES,
    });

    const client = await auth.getClient();
    const myBusiness = google.mybusinessaccountmanagement({ version: "v1", auth: client });

    const response = await myBusiness.accounts.locations.reviews.list({
      parent: `accounts/{account_id}/locations/${LOCATION_ID}`,
    });

    console.log("API Response:", response.data); 
    const reviews = response.data.reviews || [];
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).send("Failed to fetch reviews");
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

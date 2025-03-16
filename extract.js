const fs = require("fs");

// Charger le fichier JSON (remplace "data.json" par ton fichier réel)
const rawData = fs.readFileSync("cache.json");
const jsonData = JSON.parse(rawData);

// Définir les limites de dates en ISO
const startDate = new Date("2025-02-01T00:00:00Z");
const endDate = new Date("2025-02-28T23:59:59Z");

// Créer un objet pour stocker les avis filtrés
let filteredReviews = {};

// Parcourir tous les services
Object.keys(jsonData.cachedReviews).forEach(service => {
    const reviews = jsonData.cachedReviews[service].reviews;

    // Filtrer les avis de ce service
    const filtered = reviews.filter(review => {
        const reviewDate = new Date(review.iso_date);
        return reviewDate >= startDate && reviewDate <= endDate;
    });

    // Ajouter au résultat seulement si des avis correspondent
    if (filtered.length > 0) {
        filteredReviews[service] = { 
            data_id: jsonData.cachedReviews[service].data_id, 
            reviews: filtered 
        };
    }
});

// Sauvegarder les avis filtrés dans un fichier
fs.writeFileSync("filtered_reviews.json", JSON.stringify(filteredReviews, null, 2));
console.log("✅ Avis filtrés enregistrés dans filtered_reviews.json");

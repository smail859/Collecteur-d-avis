require("dotenv").config();
const scrapeTrustpilot = require("./scrapeTrustpilot");

const urls = [
  { name: "Pige Online", url: "https://fr.trustpilot.com/review/pigeonline.fr" },
  { name: "Startloc", url: "https://fr.trustpilot.com/review/startloc.fr" },
  { name: "Marketing immobilier", url: "https://fr.trustpilot.com/review/marketing-immo.fr" },
  { name: "Monbien", url: "https://fr.trustpilot.com/review/monbien.fr" },
  { name: "Sinimo", url: "https://fr.trustpilot.com/review/sinimo.fr" },
];

(async () => {
  console.log("🚀 Démarrage du scraping Trustpilot...");
  const results = [];

  for (const { name, url } of urls) {
    try {
      const res = await scrapeTrustpilot(url, name);
      results.push({ name, success: true, ...res });
    } catch (err) {
      results.push({ name, success: false, error: err.message });
    }
  }

  console.log("✅ Résultats du scraping :");
  console.table(results);

  process.exit(0);
})();

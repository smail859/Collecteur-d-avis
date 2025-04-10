// -------------------------
// Liste des sites Google Maps (via SERPAPI)
// -------------------------
const googleSites = [
  { name: "Startloc", id: "0x479184d4eff4c4d7:0x7899f13a20c78918" },
  { name: "Monbien", id: "0x479184d502446031:0x3dc3354f518ad246" },
  { name: "Marketing automobile", id: "0x479185440a06d1e1:0x2391239b2b5d84b1" },
  { name: "Marketing immobilier", id: "0x47919b8544571e67:0x621ea08da3594e1e" },
  { name: "Pige Online", id: "0x47919b8544571e67:0x52e0eab98e405b90" },
];

// -------------------------
// Liste des sites Trustpilot (scraping)
// -------------------------
const trustpilotSites = [
  { name: "Pige Online", url: "https://fr.trustpilot.com/review/pige-online.fr" },
  { name: "Startloc", url: "https://fr.trustpilot.com/review/www.startloc.fr" },
  { name: "Marketing immobilier", url: "https://fr.trustpilot.com/review/www.marketing-immo.fr" },
  { name: "Monbien", url: "https://fr.trustpilot.com/review/monbien.fr" },
  { name: "Sinimo", url: "https://fr.trustpilot.com/review/sinimo.fr" },
];

module.exports = { googleSites, trustpilotSites};

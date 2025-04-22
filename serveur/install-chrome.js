const { exec } = require("child_process");

exec("npx puppeteer browsers install chrome", (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Erreur lors de l’installation de Chromium :", stderr);
    process.exit(1);
  }
  console.log("✅ Chromium installé avec succès !");
  console.log(stdout);
});

const { exec } = require("child_process");

exec("npx puppeteer browsers install chrome", (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Erreur install Chromium :", stderr);
    process.exit(1);
  }
  console.log("✅ Chromium installé !");
  console.log(stdout);

  const puppeteer = require("puppeteer");
  console.log("✅ Path détecté :", puppeteer.executablePath());
});

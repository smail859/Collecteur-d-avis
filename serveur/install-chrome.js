const puppeteer = require('puppeteer');

(async () => {
  console.log('🔧 Téléchargement de Chromium pour Puppeteer...');
  try {
    await puppeteer.install({
      browser: 'chrome',
    });
    console.log('✅ Chrome installé avec succès !');
  } catch (err) {
    console.error('❌ Erreur pendant l’installation de Chrome :', err.message);
    process.exit(1);
  }
})();

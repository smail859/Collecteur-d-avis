#!/bin/bash
echo "📦 Installation des dépendances"
npm install

echo "⏬ Installation automatique de Chromium"
npx puppeteer browsers install chrome

echo "✅ Build terminé"

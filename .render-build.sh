#!/usr/bin/env bash

echo "📦 Installation des dépendances..."
npm install

echo "🌐 Installation de Chrome via Puppeteer..."
npx puppeteer browsers install chrome

echo "🚀 Lancement du serveur Node..."
npm run server

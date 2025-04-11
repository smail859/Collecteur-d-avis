#!/usr/bin/env bash

# 📦 Installe les dépendances
npm install

# 🧰 Télécharge Chromium pour Puppeteer
npx puppeteer browsers install chrome

# 🚀 Lance le serveur comme prévu
npm run start

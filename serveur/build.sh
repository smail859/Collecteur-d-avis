#!/bin/bash

echo "📦 Installation des dépendances"
npm install

echo "⏬ Installation de Chromium dans un chemin persistant"

# Crée un dossier persistant
mkdir -p ./chromium
# Installe Chrome dans ce dossier
PUPPETEER_CACHE_DIR=./chromium npx puppeteer browsers install chrome

echo "✅ Build terminé"

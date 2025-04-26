
# Collecteur d'Avis

**Collecteur d'Avis** est une application complète en React + Node.js permettant de collecter, centraliser, filtrer et analyser automatiquement des avis clients provenant de **Google Maps** et **Trustpilot** pour différents services :  
Monbien, Startloc, Sinimo, Marketing Automobile, Marketing Immobilier, Pige Online.

---

## Sommaire
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Lancer le projet en local](#lancer-le-projet-en-local)
- [Déploiement](#déploiement)
- [Sécurité](#sécurité)
- [Scripts disponibles](#scripts-disponibles)
- [Bonus : Idées d’améliorations](#bonus--idées-daméliorations)
- [Auteur](#auteur)
- [Licence](#licence)

## Fonctionnalités principales

- Récupération automatique des avis Google & Trustpilot via SerpAPI
- Statistiques dynamiques par période (aujourd’hui, 7 jours, 30 jours)
- Analyse des notes moyennes, avis par étoiles
- Détection intelligente des commerciaux mentionnés dans les avis
- Suivi de l’évolution mensuelle des notes par service
- Filtres avancés : période, note, service, plateforme, commercial
- Affichage progressif des avis + système de pagination
- Visualisation des données via MUI, Charts, Recharts

---

## Technologies utilisées

### Frontend
- React 18 (CRA)
- Material UI (MUI)
- Recharts
- Ant Design
- Date-fns, Day.js

### Backend
- Express
- MongoDB + Mongoose
- SerpAPI
- Axios
- Node-cron (prévu pour automatisation)
- Docker / Docker Compose

---

## Structure du projet

```
/src
├── avisRécents
├── collecterAvis
├── dashboard
├── hooks
│   └── useFetchReviews.js   ← Hook principal ultra-complet de gestion des avis
├── login / statistiques / date / utils
├── components-not-use       ← (à nettoyer si obsolète)
public/
server.js                    ← Serveur Express + routes API
Dockerfile / docker-compose.yml
```

---

## Lancer le projet en local

### 1. Clone le repo
```bash
git clone https://github.com/ton-utilisateur/collecteur-avis.git
cd collecteur-avis
```

### 2. Crée un fichier `.env` (non versionné)
```env
MONGO_URI=ta_bdd
SERPAPI_KEY=ta_clé
PORT=3000
```

### 3. Démarre avec Docker
```bash
docker compose up --build
```

---

## Déploiement

Tu peux déployer sur **Render** (backend) et **Vercel** (frontend) :

- **Ne push jamais ton `.env`** → `.gitignore` doit le contenir.
- Déclare les variables d’environnement directement dans l’interface de Render / Vercel.
- Utilise en production une URI Mongo Atlas du type :
```env
MONGO_URI=mongodb+srv://utilisateur:motdepasse@cluster.mongodb.net/dbname
```

---

## Sécurité

- `.env` est ignoré (`.gitignore`)
- Les clés sensibles ne sont pas versionnées
- Privilégie toujours un backend sécurisé via HTTPS en production
- Révoque les clés exposées si jamais tu les avais déjà poussées

---

## Scripts disponibles

```bash
npm start       # Lance React en dev
npm run build   # Build de l'app React
npm test        # Lance les tests
npm run eject   # Déstructure le CRA
```

---

## Bonus : Idées d’améliorations

- Authentification + dashboard privé
- Ajout de graphiques évolutifs (comparaison mois / année)
- Export CSV / PDF des statistiques

---

## Auteur

Ce projet est développé par El Hajjar Smaïl.  
Contact : elhajjarsmail70000@gmail.com

---

## Licence
Ce projet est sous licence ISC.



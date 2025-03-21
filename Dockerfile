# Utilisation de Node.js LTS
FROM node:18

# Définition du répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port
EXPOSE 5000

# Lancer le serveur
CMD ["node", "server.js"]

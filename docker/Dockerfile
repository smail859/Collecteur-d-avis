FROM node:18

WORKDIR /app

# Installer netcat
RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

EXPOSE 5000

CMD ["node", "server.js"]

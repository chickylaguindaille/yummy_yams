# Utiliser une image Node.js comme base
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de configuration du projet
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port sur lequel le serveur va écouter
EXPOSE 3000

# Commande pour démarrer le serveur
CMD ["npm", "start"]

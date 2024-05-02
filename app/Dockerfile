# Utiliser une image Node.js comme base
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers du projet dans le conteneur
COPY package*.json ./

# Supprimer les fichiers de verrouillage des dépendances et le répertoire node_modules
RUN rm -rf package-lock.json node_modules

# Installer les dépendances
RUN npm i
RUN npm install

# Installer Vite
RUN npm install vite@4.4.0

# Copier le reste des fichiers du projet
COPY . .

# Compiler le code TypeScript (si nécessaire)
RUN npm run build

# Exposer le port sur lequel l'application va tourner
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]

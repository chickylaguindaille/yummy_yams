// Import des modules
const express = require('express');
// const mongoose = require('mongoose');
require('dotenv').config(); // Pour charger les variables d'environnement

// Initialisation de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Définition de la route principale
app.get('/', (req, res) => {
    res.send('Bienvenue sur votre backend !');
});

// Port d'écoute du serveur
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});

// Connexion à MongoDB avec Mongoose
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connexion à MongoDB réussie'))
// .catch(err => console.error('Erreur de connexion à MongoDB :', err));

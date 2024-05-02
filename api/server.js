// Import des modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Pour charger les variables d'environnement

// Initialisation de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Définition de la route principale
app.get('/', (req, res) => {
    res.send('Bienvenue sur votre backend !');
});

// Définition du modèle de données MongoDB
// const DataModel = mongoose.model('yummy', new mongoose.Schema({
//     name: String
// }));

const yummySchema = new mongoose.Schema({
    name: String,
    image: String,
    stock: Number,
    quantityWon: Number
});

const DataModel = mongoose.model('yummy', yummySchema);


// Route pour récupérer les données de la base de données
app.get('/data', async (req, res) => {
    try {
        // Récupérer les données depuis la base de données
        const data = await DataModel.find();
        // const count = await DataModel.countDocuments();
        // Renvoyer les données comme réponse
        res.json(data);
    } catch (error) {
        // En cas d'erreur, renvoyer un message d'erreur
        res.status(500).json({ message: error.message });
    }
});

// Port d'écoute du serveur
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});

// Connexion à MongoDB avec Mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB :', err));

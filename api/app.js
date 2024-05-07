const express = require('express');
const cors = require('cors');
const yummyRoutes = require('./routes/route');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/yummy', yummyRoutes);
app.use('/api/auth', userRoutes);

//Mongoose

// Import des modules
const mongoose = require('mongoose');
require('dotenv').config(); // Pour charger les variables d'environnement

// Connexion à MongoDB avec Mongoose
mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB :', err));


module.exports = app;
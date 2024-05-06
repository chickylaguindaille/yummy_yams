const express = require('express');
const yummyRoutes = require('./routes/route');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

app.use('/api/yummy', yummyRoutes);
app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Définition de la route principale
// app.get('/', (req, res) => {
//     res.send('Bienvenue sur votre backend !');
// });

// app.use('/api', (req, res, next) => {
//     const stuff = [
//         {
//           "_id": 1,
//           "name": "Fondant suprême",
//           "image": "fondant.jpeg",
//           "stock": 4,
//           "quantityWon": 0
//         },
//         {
//           "_id": 2,
//           "name": "Cake tout Chocolat",
//           "image": "cake-choco.jpeg",
//           "stock": 3,
//           "quantityWon": 0
//         },
//       ];
//     res.status(200).json(stuff);
//   });


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
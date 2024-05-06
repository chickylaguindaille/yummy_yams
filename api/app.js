const express = require('express');
const yummyRoutes = require('./routes/route');

const app = express();

app.use(express.json());

app.use('/api', yummyRoutes);

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

app.use('/api', (req, res, next) => {
    const stuff = [
        {
          "_id": 1,
          "name": "Fondant suprême",
          "image": "fondant.jpeg",
          "stock": 4,
          "quantityWon": 0
        },
        {
          "_id": 2,
          "name": "Cake tout Chocolat",
          "image": "cake-choco.jpeg",
          "stock": 3,
          "quantityWon": 0
        },
      ];
    res.status(200).json(stuff);
  });


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




// Routes

const Yummy = require('./models/yummy');

//     app.post('/add', (req, res, next) => {
//         delete req.body._id;
//         const yummy = new Yummy({
//             ...req.body
//         });
//         yummy.save()
//             .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
//             .catch(error => res.status(400).json({ error }));
//     });

//     app.use('/get', (req, res, next) => {
//         Yummy.find()
//           .then(things => res.status(200).json(things))
//           .catch(error => res.status(400).json({ error }));
//       });

//     app.get('/getid/:id', (req, res, next) => {
//         Yummy.findOne({ _id: req.params.id })
//           .then(thing => res.status(200).json(thing))
//           .catch(error => res.status(404).json({ error }));
//       });

//     app.put('/put/:id', (req, res, next) => {
//         Yummy.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//           .then(() => res.status(200).json({ message: 'Objet modifié !'}))
//           .catch(error => res.status(400).json({ error }));
//       });

//     app.delete('/delete/:id', (req, res, next) => {
//         Yummy.deleteOne({ _id: req.params.id })
//           .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
//           .catch(error => res.status(400).json({ error }));
//       });




module.exports = app;
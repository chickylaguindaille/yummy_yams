const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Patisserie = require('../models/yummy');
const middleware = require('../middleware/auth');

// Route pour le tirage des dés
router.get('/roll/:id', middleware.auth, async (req, res) => {
  // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL
  const userId = req.params.id;
  
  try {
    // Requête à la base de données pour récupérer les données de l'utilisateur en fonction de l'ID
    let userData = await User.findById(userId);

    if (userData) {
      // Récupérer la valeur de "try" à partir des données de l'utilisateur
      let tryValue = userData.try;

      // Vérifier si "try" est supérieur à 0 pour autoriser le tirage des dés
      if (tryValue > 0) {
        // Réduire de 1 la valeur de "try"
        tryValue--;

        // Mettre à jour la valeur de "try" dans la base de données
        await User.findByIdAndUpdate(userId, { try: tryValue });

        // Utiliser les données de l'utilisateur pour conditionner le tirage des dés
        const diceValues = conditionRollDice(userData);

        // Logique pour déterminer les réussites
        let successMessage = '';
        if (isYams(diceValues)) {
          successMessage = 'YAM\'S (5/5 dés identiques 🎲🎲🎲🎲🎲) : Félicitations ! Vous avez gagné 3 pâtisseries.';
          getRandomPatisseries(userId, 3);
        } else if (isCarre(diceValues)) {
          getRandomPatisseries(userId, 2);
          successMessage = 'CARRÉ (4/5 dés identiques 🎲🎲🎲🎲) : Félicitations ! Vous avez gagné 2 pâtisseries.';
        } else if (isDouble(diceValues)) {
          getRandomPatisseries(userId, 1);
          successMessage = 'DOUBLE (2 paires de dés identiques 🎲🎲 + 🎲🎲) : Félicitations ! Vous avez gagné 1 pâtisserie.';
        }

        // Afficher la réussite dans la console
        if (successMessage !== '') {
          console.log(successMessage);
        }

        res.json({ diceValues });
      } else {
        res.status(403).json({ error: 'Nombre de tentatives épuisé' });
      }
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Fonction pour conditionner le tirage des dés en fonction des données de l'utilisateur
function conditionRollDice(userData) {
  // const diceValues = Array.from({ length: 5 }, () => getRandomInt(1, 6));
  const diceValues = [
    4,
    4,
    4,
    4,
    4
];
  return diceValues;
}

// Fonction pour vérifier si les dés forment un YAM'S
function isYams(diceValues) {
  return new Set(diceValues).size === 1;
}

// Fonction pour vérifier si les dés forment un CARRÉ
function isCarre(diceValues) {
  const countMap = new Map();
  diceValues.forEach(value => {
    countMap.set(value, (countMap.get(value) || 0) + 1);
  });
  return Array.from(countMap.values()).includes(4);
}

// Fonction pour vérifier si les dés forment un DOUBLE
function isDouble(diceValues) {
  const countMap = new Map();
  diceValues.forEach(value => {
    countMap.set(value, (countMap.get(value) || 0) + 1);
  });
  return Array.from(countMap.values()).filter(count => count === 2).length === 2;
}

// Fonction pour générer un nombre entier aléatoire entre min et max inclus
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomPatisseries(userId, numPatisseries) {
  try {
    let stockEmpty = false; // Variable pour suivre l'état du stock

    for (let i = 0; i < numPatisseries; i++) {
      // Utiliser l'agrégation MongoDB pour sélectionner une pâtisserie en stock au hasard
      const patisserieEnStock = await Patisserie.aggregate([
        { $match: { stock: { $gt: 0 } } }, // Filtrer les pâtisseries avec un stock supérieur à zéro
        { $sample: { size: 1 } } // Sélectionner un échantillon aléatoire d'une pâtisserie
      ]);

      // Si aucune pâtisserie n'est disponible, arrêtez la boucle
      if (patisserieEnStock.length === 0) {
        console.log("Plus de pâtisseries en stock.");
        stockEmpty = true;
        break;
      }

      const patisserie = patisserieEnStock[0];
      // Enlever un du stock
      const updatedStock = patisserie.stock - 1;
      // Augmenter de 1 la quantité gagnée
      const updatedQuantityWon = patisserie.quantityWon + 1;

      try {

        const yummyApiUrl = process.env.YUMMY_API_URL;

        // Mettre à jour la pâtisserie dans la base de données en utilisant votre route PUT
        const response = await fetch(`${yummyApiUrl}/${patisserie._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': ''
          },
          body: JSON.stringify({ stock: updatedStock, quantityWon: updatedQuantityWon })
        });

        // Vérifiez le statut de la réponse HTTP
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }

        const data = await response.json();
        console.log('Pâtisserie sélectionnée :', patisserie);

        // console.log(patisseries);
        await addPatisseriesToUser(userId, patisserie);
        
      } catch (error) {
        console.error(`Erreur lors de la mise à jour de la pâtisserie avec ID ${patisserie._id} :`, error.message);
      }
    }

    if (stockEmpty) {
      // const diceValues = conditionRollDice(userData);
      return "Plus de pâtisseries en stock.";
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des pâtisseries en stock :', error.message);
  }
}


async function addPatisseriesToUser(userId, patisserie) {
  try {
    const currentDate = new Date();

    // Formater la date en format européen avec le fuseau horaire de Paris
    const options = { 
      timeZone: 'Europe/Paris', 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const formattedDate = currentDate.toLocaleDateString('fr-FR', options);

    patisserie.date = formattedDate;

    const userData = await User.findByIdAndUpdate(userId, { $push: { pastriesWon: patisserie } }, { new: true });

    console.log('Utilisateur mis à jour avec les pâtisseries gagnées :', userData);
  
  } catch (error) {
    console.error('Erreur lors de l\'ajout des pâtisseries à l\'utilisateur :', error.message);
    throw error;
  }
}




module.exports = router;

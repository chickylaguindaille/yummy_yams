const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Patisserie = require('../models/yummy');

// Route pour le tirage des dés
router.get('/roll/:id', async (req, res) => {
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
          getRandomPatisseries(3);
        } else if (isCarre(diceValues)) {
          getRandomPatisseries(2);
          successMessage = 'CARRÉ (4/5 dés identiques 🎲🎲🎲🎲) : Félicitations ! Vous avez gagné 2 pâtisseries.';
        } else if (isDouble(diceValues)) {
          getRandomPatisseries(1);
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

async function getRandomPatisseries(numPatisseries) {
  try {
    // Utiliser l'agrégation MongoDB pour sélectionner les pâtisseries en stock
    const patisseriesEnStock = await Patisserie.aggregate([
      { $match: { stock: { $gt: 0 } } }, // Filtrer les pâtisseries avec un stock supérieur à zéro
      { $sample: { size: numPatisseries } } // Sélectionner un échantillon aléatoire du nombre spécifié de pâtisseries
    ]);

    // Mettre à jour le stock et la quantité gagnée pour chaque pâtisserie sélectionnée
    await Promise.all(patisseriesEnStock.map(async (patisserie) => {
      // Enlever un du stock
      const updatedStock = patisserie.stock - 1;
      // Augmenter de 1 la quantité gagnée
      const updatedQuantityWon = patisserie.quantityWon + 1;
      // Mettre à jour la pâtisserie dans la base de données en utilisant votre route PUT
      const response = await fetch(`http://localhost:3001/api/yummy/${patisserie._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: updatedStock, quantityWon: updatedQuantityWon })
      });
      const data = await response.json();
      console.log('Pâtisserie mise à jour :', data);
    }));

    // Afficher les pâtisseries sélectionnées
    console.log('Pâtisseries sélectionnées :', patisseriesEnStock);
  } catch (error) {
    console.error('Erreur lors de la récupération des pâtisseries en stock :', error);
  }
}


module.exports = router;

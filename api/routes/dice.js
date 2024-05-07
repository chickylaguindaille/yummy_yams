const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Importez votre modèle d'utilisateur

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
  // Ici, vous pouvez mettre en place la logique pour conditionner le tirage des dés en fonction des données de l'utilisateur
  // Par exemple, vous pouvez utiliser le nombre de gâteaux gagnés par l'utilisateur pour influencer les résultats des dés
  // Pour l'exemple, nous générons simplement des valeurs de dés aléatoires
  const diceValues = Array.from({ length: 5 }, () => getRandomInt(1, 6));
  return diceValues;
}

// Fonction pour générer un nombre entier aléatoire entre min et max inclus
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;

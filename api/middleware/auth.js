// Middleware pour vérifier l'origine de la requête
const checkRequestOrigin = (req, res, next) => {
  // Vérifie si la requête provient de l'API elle-même
  if (req.headers['x-api-request'] === 'true') {
    next(); // Passe à la prochaine étape du middleware
  } else {
    // Si la requête ne provient pas de l'API, renvoie une erreur 403 (Accès refusé)
    res.status(403).json({ error: 'Accès refusé' });
  }
};

// Middleware d'authentification
const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId
    };
    next();
  } catch(error) {
    res.status(401).json({ error });
  }
};

module.exports = {
  checkRequestOrigin,
  auth
};

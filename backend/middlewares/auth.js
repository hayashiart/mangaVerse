const jwt = require("jsonwebtoken"); // Importe la bibliothèque JWT pour vérifier et décoder les tokens

// Fonction middleware pour authentifier les requêtes avec JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrait le token de l'en-tête Authorization (format "Bearer <token>")
  if (!token) { // Si pas de token, renvoie une erreur 401 (non autorisé)
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // Vérifie la validité du token avec la clé secrète de .env
    if (err) { // Si token invalide ou expiré, renvoie une erreur 403 (interdit)
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user; // Si valide, stocke les infos de l'utilisateur (ex. id_user) dans req.user pour les routes suivantes
    next(); // Passe à la route ou au middleware suivant
  });
};

module.exports = authenticateJWT; // Exporte la fonction pour l'utiliser dans d'autres fichiers (ex. routes/manga.js)
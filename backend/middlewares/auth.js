const jwt = require("jsonwebtoken"); // Importe la bibliothèque JWT pour vérifier et décoder les tokens
const db = require("../db");

// Fonction middleware pour authentifier les requêtes avec JWT
const authenticateJWT = async (req, res, next) => {
  console.log("Authenticating request for path:", req.path, "Token:", req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db.query("SELECT id_user, role FROM Users WHERE id_user = ?", [decoded.id_user]);
    if (!user[0]) return res.status(401).json({ error: "Invalid token" });
    req.user = user[0];
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
module.exports = authenticateJWT; // Exporte la fonction pour l'utiliser dans d'autres fichiers (ex. routes/manga.js)
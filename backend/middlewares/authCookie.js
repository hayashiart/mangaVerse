// backend/middlewares/authCookie.js – VERSION FINALE
const jwt = require("jsonwebtoken");
const db = require("../db");

module.exports = async (req, res, next) => {
  const token = req.cookies?.session_token;

  if (!token) {
    return res.status(401).json({ error: "Accès refusé : aucun token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      "SELECT id_user, pseudo, role FROM Users WHERE id_user = ?",
      [decoded.id_user]
    );

    if (!rows[0]) {
      return res.status(401).json({ error: "Utilisateur introuvable" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.error("Token invalide :", err.message);
    return res.status(401).json({ error: "Session expirée" });
  }
};
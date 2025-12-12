// middlewares/auth.js
const jwt = require("jsonwebtoken");
const db = require("../db");

const authenticateJWT = async (req, res, next) => {
  console.log("Authenticating request for path:", req.path);

  // 1. Essaie d'abord dans les headers (standard)
  let token = req.headers.authorization?.split(" ")[1];

  // 2. Si pas dans headers, essaie dans les cookies
  if (!token && req.cookies && req.cookies.session_token) {
    token = req.cookies.session_token;
  }

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

module.exports = authenticateJWT;
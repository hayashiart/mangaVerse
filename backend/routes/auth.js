const express = require("express"); // Importe Express
const router = express.Router(); // Crée un router pour les routes
const bcrypt = require("bcrypt"); // Importe bcrypt pour hasher les mots de passe
const jwt = require("jsonwebtoken"); // Importe jwt pour générer des tokens

const db = require("../db"); // Importe la connexion DB (chemin relatif depuis routes)

router.post("/register", async (req, res) => {
  const { pseudo, email, password } = req.body;
  try {
    // Vérifier si l'email ou le pseudo existe
    const [existingUsers] = await db.query(
      "SELECT * FROM Users WHERE email = ? OR pseudo = ?",
      [email, pseudo]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email or pseudo already exists" });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur
    await db.query(
      "INSERT INTO Users (pseudo, email, password) VALUES (?, ?, ?)",
      [pseudo, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Vérifier si l'utilisateur existe
    console.log("Checking user with email:", email);
    const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    console.log("Users found:", users);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Vérifier le mot de passe
    console.log("Comparing password for user:", user.pseudo);
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isValid);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Vérifier JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Générer un JWT
    const token = jwt.sign(
      { id_user: user.id_user, pseudo: user.pseudo, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, pseudo: user.pseudo });
  } catch (error) {
    console.error("Error logging in:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; // Exporte le router pour import dans app.js
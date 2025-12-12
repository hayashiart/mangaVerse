// routes/categories.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT id_category AS id, name FROM Categories ORDER BY name");
    res.json(categories);
  } catch (err) {
    console.error("Erreur catégories:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
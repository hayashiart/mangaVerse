// Remplace tout le contenu de favorites.js
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/auth.js");
const db = require("../db");

// Remplace router.post("/add")
router.post("/add", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  const { book_id } = req.body;
  console.log("Adding favorite for user_id:", user_id, "book_id:", book_id);
  try {
    await db.query("INSERT INTO Favorites (user_id, book_id) VALUES (?, ?)", [user_id, book_id]);
    res.json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Remplace router.delete("/remove/:book_id")
router.delete("/remove/:book_id", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  const { book_id } = req.params;
  console.log("Removing favorite for user_id:", user_id, "book_id:", book_id);
  try {
    await db.query("DELETE FROM Favorites WHERE user_id = ? AND book_id = ?", [user_id, book_id]);
    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Remplace router.get("/:book_id")
router.get("/:book_id", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  const { book_id } = req.params;
  console.log("Checking favorite for user_id:", user_id, "book_id:", book_id);
  try {
    const [rows] = await db.query("SELECT * FROM Favorites WHERE user_id = ? AND book_id = ?", [user_id, book_id]);
    res.json({ isFavorite: rows.length > 0 });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Remplace router.get("/")
router.get("/", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  console.log("Fetching favorites for user_id:", user_id);
  try {
    const [rows] = await db.query(
      "SELECT b.id_book, b.title FROM Favorites f JOIN Books b ON f.book_id = b.id_book WHERE f.user_id = ?",
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
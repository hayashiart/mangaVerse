const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/auth.js");
const db = require("../db");

router.post("/add", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  const { book_id } = req.body;
  console.log("Adding bookmark for user_id:", user_id, "book_id:", book_id);
  try {
    await db.query("INSERT INTO Bookmarks (user_id, book_id) VALUES (?, ?)", [user_id, book_id]);
    res.json({ message: "Added to bookmarks" });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/remove/:book_id", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  const { book_id } = req.params;
  console.log("Removing bookmark for user_id:", user_id, "book_id:", book_id);
  try {
    await db.query("DELETE FROM Bookmarks WHERE user_id = ? AND book_id = ?", [user_id, book_id]);
    res.json({ message: "Removed from bookmarks" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:book_id", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  const { book_id } = req.params;
  console.log("Checking bookmark for user_id:", user_id, "book_id:", book_id);
  try {
    const [rows] = await db.query("SELECT * FROM Bookmarks WHERE user_id = ? AND book_id = ?", [user_id, book_id]);
    res.json({ isBookmarked: rows.length > 0 });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  console.log("Fetching bookmarks for user_id:", user_id);
  try {
    const [rows] = await db.query(
      "SELECT b.id_book, b.title FROM Bookmarks bm JOIN Books b ON bm.book_id = b.id_book WHERE bm.user_id = ?",
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
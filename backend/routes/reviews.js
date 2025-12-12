const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateJWT = require("../middlewares/auth.js");

// Ajouter un commentaire (principal ou réponse)
router.post("/reviews", authenticateJWT, async (req, res) => {
  const { book_id, comment, parent_id } = req.body;
  const user_id = req.user.id_user;
  if (!comment || !book_id) {
    return res.status(400).json({ error: "Comment and book_id required" });
  }
  try {
    await db.query(
      "INSERT INTO Reviews (id_user, book_id, comment, parent_id, submission_date) VALUES (?, ?, ?, ?, NOW())",
      [user_id, book_id, comment, parent_id || null]
    );
    res.json({ message: "Comment added" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Lister les commentaires d’un manga
router.get("/reviews/:book_id", async (req, res) => {
  const { book_id } = req.params;
  try {
    const [reviews] = await db.query(
      "SELECT r.id_review, r.id_user, r.comment, r.parent_id, r.submission_date, u.pseudo " +
      "FROM Reviews r JOIN Users u ON r.id_user = u.id_user WHERE r.book_id = ? ORDER BY r.submission_date DESC",
      [book_id]
    );
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
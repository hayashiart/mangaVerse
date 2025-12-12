const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateJWT = require("../middlewares/auth.js");

router.post("/reviews/add", authenticateJWT, async (req, res) => {
    const { book_id, rating } = req.body;
    const user_id = req.user.id_user;
    if (!rating || rating < 0 || rating > 10 || !Number.isInteger(rating)) {
      return res.status(400).json({ error: "Rating must be an integer between 0 and 10" });
    }
    try {
      const [existing] = await db.query("SELECT avg_rating, review_count, user_ids, user_ratings FROM MangaRatings WHERE book_id = ?", [book_id]);
      let userIds = existing.length && existing[0].user_ids ? existing[0].user_ids.split(",") : [];
      let userRatings = existing.length && existing[0].user_ratings ? existing[0].user_ratings.split(",") : [];
      let newCount = existing.length ? existing[0].review_count : 0;
      let newAvg = existing.length ? existing[0].avg_rating : 0;
      if (userIds.includes(user_id.toString())) {
        // Mise à jour de la note
        const oldRating = userRatings.find(r => r.startsWith(`${user_id}:`))?.split(":")[1] || 0;
        const oldAvg = existing[0].avg_rating * existing[0].review_count;
        newAvg = ((oldAvg - parseFloat(oldRating) + rating) / newCount).toFixed(1);
        userRatings = userRatings.filter(r => !r.startsWith(`${user_id}:`));
        userRatings.push(`${user_id}:${rating}`);
        const newUserRatings = userRatings.join(",");
        await db.query(
          "UPDATE MangaRatings SET avg_rating = ?, user_ratings = ? WHERE book_id = ?",
          [newAvg, newUserRatings, book_id]
        );
      } else {
        // Nouvelle note
        newCount = existing.length ? existing[0].review_count + 1 : 1;
        newAvg = existing.length ? ((existing[0].avg_rating * existing[0].review_count + rating) / newCount).toFixed(1) : rating.toFixed(1);
        userIds.push(user_id);
        userRatings.push(`${user_id}:${rating}`);
        const newUserIds = userIds.join(",");
        const newUserRatings = userRatings.join(",");
        await db.query(
          "INSERT INTO MangaRatings (book_id, avg_rating, review_count, user_ids, user_ratings) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE avg_rating = ?, review_count = ?, user_ids = ?, user_ratings = ?",
          [book_id, newAvg, newCount, newUserIds, newUserRatings, newAvg, newCount, newUserIds, newUserRatings]
        );
      }
      res.json({ message: "Rating added or updated" });
    } catch (error) {
      console.error("Error adding rating:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/auth.js");
const db = require("../db");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/books", authenticateJWT, async (req, res) => {
    console.log("GET /books route hit, user role:", req.user.role); // Ajoute ce log
    if (req.user.role !== "admin" && req.user.role !== "librarian") {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      const [books] = await db.query("SELECT id_book AS id, title, description, cover_image AS coverImage, views, category_id FROM Books");
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.post("/books", authenticateJWT, upload.single("coverImage"), async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "librarian") {
    return res.status(403).json({ error: "Access denied" });
  }
  const { title, description, views, category_id } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    if (!title || !description || !coverImage) {
      return res.status(400).json({ error: "Title, description, and cover image are required" });
    }
    const [result] = await db.query(
      "INSERT INTO Books (title, description, cover_image, views, category_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, coverImage, views || 0, category_id || null]
    );
    const [newBook] = await db.query("SELECT id_book AS id, title, description, cover_image AS coverImage, views, category_id FROM Books WHERE id_book = ?", [result.insertId]);
    res.status(201).json(newBook[0]);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/books/:id", authenticateJWT, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "librarian") {
    return res.status(403).json({ error: "Access denied" });
  }
  const { id } = req.params;
  const { title, description, views, category_id } = req.body;
  try {
    await db.query("UPDATE Books SET title = ?, description = ?, views = ?, category_id = ? WHERE id_book = ?", [title, description, views, category_id, id]);
    res.json({ message: "Book updated" });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
// backend/routes/books.js – VERSION FINALE QUI MARCHE À 100% (2025)

const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/auth");
const db = require("../db");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// GET tous les mangas (admin + librarian)
router.get("/", authenticateJWT, async (req, res) => {
  if (!["admin", "librarian"].includes(req.user.role)) {
    return res.status(403).json({ error: "Accès refusé" });
  }

  try {
    const [books] = await db.query(`
      SELECT 
        b.id_book AS id,
        b.title,
        b.description,
        b.cover_image AS coverImage,
        b.views,
        b.category_id,
        c.name AS category_name,
        GROUP_CONCAT(t.name SEPARATOR ', ') AS tags
      FROM Books b
      LEFT JOIN Categories c ON b.category_id = c.id_category
      LEFT JOIN Book_Tags bt ON b.id_book = bt.book_id
      LEFT JOIN Tags t ON bt.tag_id = t.id_tag
      GROUP BY b.id_book
      ORDER BY b.title
    `);

    const formatted = books.map(book => ({
      ...book,
      tags: book.tags || ""
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erreur GET /api/books :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST - Créer un manga
router.post("/", authenticateJWT, upload.single("coverImage"), async (req, res) => {
  if (!["admin", "librarian"].includes(req.user.role)) return res.status(403).json({ error: "Accès refusé" });

  const { title, description, category_id, tags } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title?.trim()) return res.status(400).json({ error: "Titre obligatoire" });

  try {
    const [result] = await db.query(
      "INSERT INTO Books (title, description, cover_image, category_id, views) VALUES (?, ?, ?, ?, 0)",
      [title.trim(), description || null, coverImage, category_id || null]
    );
    const bookId = result.insertId;

    if (tags) {
      const tagArray = JSON.parse(tags);
      for (const tagName of tagArray) {
        if (!tagName.trim()) continue;
        let [tag] = await db.query("SELECT id_tag FROM Tags WHERE name = ?", [tagName.trim()]);
        if (tag.length === 0) {
          const [newTag] = await db.query("INSERT INTO Tags (name) VALUES (?)", [tagName.trim()]);
          tag = [{ id_tag: newTag.insertId }];
        }
        await db.query("INSERT INTO Book_Tags (book_id, tag_id) VALUES (?, ?)", [bookId, tag[0].id_tag]);
      }
    }

    res.status(201).json({ id: bookId, message: "Manga créé" });
  } catch (err) {
    console.error("Erreur POST /api/books :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT - Modifier un manga + synchroniser le titre dans Chapters
router.put("/:id", authenticateJWT, upload.single("coverImage"), async (req, res) => {
  if (!["admin", "librarian"].includes(req.user.role))
    return res.status(403).json({ error: "Accès refusé" });

  const { id } = req.params;
  const { title, description, category_id, tags } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title?.trim()) return res.status(400).json({ error: "Titre obligatoire" });

  try {
    // 1. Récupère l’ancien titre
    const [oldBook] = await db.query("SELECT title FROM Books WHERE id_book = ?", [id]);
    if (oldBook.length === 0) return res.status(404).json({ error: "Manga introuvable" });
    const oldTitle = oldBook[0].title;

    // 2. Met à jour Books
    if (coverImage) {
      await db.query(
        "UPDATE Books SET title = ?, description = ?, cover_image = ?, category_id = ? WHERE id_book = ?",
        [title.trim(), description || null, coverImage, category_id || null, id]
      );
    } else {
      await db.query(
        "UPDATE Books SET title = ?, description = ?, category_id = ? WHERE id_book = ?",
        [title.trim(), description || null, category_id || null, id]
      );
    }

    // 3. Met à jour le book_title dans Chapters (SYNCHRONISATION)
    if (oldTitle !== title.trim()) {
      await db.query(
        "UPDATE Chapters SET book_title = ? WHERE book_title = ?",
        [title.trim(), oldTitle]
      );
    }

    // 4. Tags
    await db.query("DELETE FROM Book_Tags WHERE book_id = ?", [id]);
    if (tags) {
      const tagArray = JSON.parse(tags);
      for (const tagName of tagArray) {
        if (!tagName.trim()) continue;
        let [tag] = await db.query("SELECT id_tag FROM Tags WHERE name = ?", [tagName.trim()]);
        if (tag.length === 0) {
          const [newTag] = await db.query("INSERT INTO Tags (name) VALUES (?)", [tagName.trim()]);
          tag = [{ id_tag: newTag.insertId }];
        }
        await db.query("INSERT INTO Book_Tags (book_id, tag_id) VALUES (?, ?)", [id, tag[0].id_tag]);
      }
    }

    res.json({ message: "Manga mis à jour" });
  } catch (err) {
    console.error("Erreur PUT /api/books :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE
router.delete("/:id", authenticateJWT, async (req, res) => {
  if (!["admin", "librarian"].includes(req.user.role)) return res.status(403).json({ error: "Accès refusé" });
  try {
    await db.query("DELETE FROM Books WHERE id_book = ?", [req.params.id]);
    res.json({ message: "Supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur" });
  }
});

module.exports = router;
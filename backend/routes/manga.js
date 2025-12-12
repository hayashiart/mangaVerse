const path = require('path');
const fs = require('fs');

console.log("Current directory in manga.js: ", __dirname);
const authPath = path.join(__dirname, '../middlewares/auth.js');
console.log("Full path to auth.js: ", authPath);
console.log("Does auth.js exist: ", fs.existsSync(authPath));

const express = require("express");
const router = express.Router();

const db = require("../db");

const authenticateJWT = require(path.join(__dirname, '../middlewares/auth.js'));

// Récupère les détails d'un manga et ses chapitres
// Récupère les détails d'un manga et ses chapitres
router.get("/manga/:title", async (req, res) => {
  const { title } = req.params;
  try {
    const [books] = await db.query(
      "SELECT b.id_book, b.title, b.description, b.cover_image, b.views, c.name as category_name " +
      "FROM Books b LEFT JOIN Categories c ON b.category_id = c.id_category " +
      "WHERE b.title = ?",
      [title]
    );
    if (books.length === 0) return res.status(404).json({ error: "Manga not found" });

    // === DÉTECTION DES CHAPITRES PHYSIQUES ===
    const mangaDir = path.join(__dirname, "..", "mangas", title);
    let chapters = [];

    if (fs.existsSync(mangaDir)) {
      const chapterFolders = fs.readdirSync(mangaDir)
        .filter(f => f.startsWith("chapter") && fs.statSync(path.join(mangaDir, f)).isDirectory())
        .map(f => {
          const num = parseInt(f.replace("chapter", ""), 10);
          return { chapter_number: num, id_chapter: num };
        })
        .sort((a, b) => a.chapter_number - b.chapter_number);

      chapters = chapterFolders;
    } else {
      // Fallback BDD si dossier n'existe pas
      const [dbChapters] = await db.query(
        "SELECT id_chapter, chapter_number FROM Chapters WHERE book_id = ? ORDER BY chapter_number DESC",
        [books[0].id_book]
      );
      chapters = dbChapters.length ? dbChapters : [{ id_chapter: 1, chapter_number: 1 }];
    }

    const [authors] = await db.query(
      "SELECT a.name, a.biography FROM Authors a JOIN Book_Authors ba ON a.id_author = ba.author_id WHERE ba.book_id = ?",
      [books[0].id_book]
    );

    const [rating] = await db.query(
      "SELECT avg_rating, review_count FROM MangaRatings WHERE book_id = ?",
      [books[0].id_book]
    );

    res.json({
      manga: {
        ...books[0],
        authors: authors.map(author => ({ name: author.name, biography: author.biography })),
        avg_rating: rating.length ? rating[0].avg_rating.toFixed(1) : "0.0",
        review_count: rating.length ? rating[0].review_count : 0
      },
      chapters: chapters
    });
  } catch (error) {
    console.error("Error fetching manga:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Remplace toute la route /mangas
router.get("/mangas", (req, res) => {
  const mangasDir = path.join(
    __dirname,
    "..",
    "..",
    "frontend-vite",
    "src",
    "assets",
    "images",
    "mangas"
  );
  console.log("mangasDir path: ", mangasDir);
  fs.readdir(mangasDir, (err, folders) => {
    if (err) {
      console.log("Error reading mangasDir: ", err);
      return res.status(500).json({ error: "Erreur lecture dossiers mangas" });
    }
    const mangas = folders
      .filter((folder) => !folder.startsWith("."))
      .map((folder) => {
        const coverPath = path.join(mangasDir, folder, `cover${folder}.jpg`);
        console.log("Checking coverPath: ", coverPath);
        if (fs.existsSync(coverPath)) {
          return {
            name: folder,
            cover: `/mangas/${folder}/cover${folder}.jpg`,
          };
        }
        return null;
      })
      .filter(Boolean);
    console.log("Mangas found: ", mangas);
    res.json(mangas);
  });
});

// Remplace toute la route /manga/:title/:chapter/images
router.get("/manga/:title/:chapter/images", (req, res) => {
  const { title, chapter } = req.params;
  const chapterDir = path.join(
    __dirname,
    "..",
    "..",
    "frontend-vite",
    "src",
    "assets",
    "images",
    "mangas",
    title,
    `chapter${chapter}`
  );
  console.log("Checking chapterDir: ", chapterDir);
  fs.readdir(chapterDir, (err, files) => {
    if (err) {
      console.error("Error fetching chapter images:", err);
      return res.status(404).json({ error: "Chapter images not found" });
    }
    console.log("Files found:", files);
    const imageUrls = files
      .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(file => `/mangas/${title}/chapter${chapter}/${file}`);
    res.json({ images: imageUrls });
  });
});

module.exports = router;
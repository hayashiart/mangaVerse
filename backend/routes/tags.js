// backend/routes/tags.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET tous les tags
router.get("/", async (req, res) => {
  try {
    const [tags] = await db.query("SELECT id_tag AS id, name FROM Tags ORDER BY name");
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
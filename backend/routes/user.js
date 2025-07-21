const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/auth.js");
const db = require("../db");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path"); // Ajoute pour path.join
const bcrypt = require("bcrypt");

router.get("/user", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  console.log("Endpoint /user appelé pour user_id:", user_id);
  try {
    const [user] = await db.query("SELECT pseudo, email, profile_photo, role FROM Users WHERE id_user = ?", [user_id]);
    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/user/update", authenticateJWT, async (req, res) => {
  const user_id = req.user.id_user;
  const { pseudo, email, password } = req.body;
  try {
    let query = "UPDATE Users SET pseudo = ?, email = ? WHERE id_user = ?";
    let params = [pseudo, email, user_id];
    if (password) {
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE Users SET pseudo = ?, email = ?, password = ? WHERE id_user = ?";
      params = [pseudo, email, hashedPassword, user_id];
    }
    await db.query(query, params);
    res.json({ message: "Profile updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/user/upload-photo", authenticateJWT, upload.single("photo"), async (req, res) => {
  const user_id = req.user.id_user;
  console.log("Upload endpoint reached for user_id:", user_id);
  const file = req.file;
  if (!file) {
    console.log("No file uploaded for user_id:", user_id);
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    console.log("Upload started for user_id:", user_id, "file:", file.filename);
    const newPath = path.join(__dirname, "..", "uploads", "profiles", `${user_id}.jpg`);
    fs.renameSync(file.path, newPath); // Déplace fichier vers uploads/profiles
    const url = `/profiles/${user_id}.jpg`; // URL relative
    console.log("Upload finished, url:", url);
    await db.query("UPDATE Users SET profile_photo = ? WHERE id_user = ?", [url, user_id]);
    res.json({ message: "Photo updated", url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error" });
    fs.unlink(file.path, (err) => { if (err) console.error("Unlink error:", err); });
  }
});

router.get("/users", authenticateJWT, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "librarian") {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const [users] = await db.query("SELECT id_user, pseudo, email, role FROM Users");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/users", authenticateJWT, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "librarian") {
    return res.status(403).json({ error: "Access denied" });
  }
  const { pseudo, email, password, role } = req.body;
  console.log("Received data:", { pseudo, email, password, role });
  try {
    if (!pseudo || !email || !password || !role) {
      return res.status(400).json({ error: "All fields (pseudo, email, password, role) are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO Users (pseudo, email, password, role) VALUES (?, ?, ?, ?)",
      [pseudo, email, hashedPassword, role]
    );
    const newUserId = result.insertId; // Récupère l'ID généré
    const [newUser] = await db.query("SELECT id_user, pseudo, email, role FROM Users WHERE id_user = ?", [newUserId]);
    res.status(201).json(newUser[0]); // Renvoie le nouvel utilisateur
  } catch (error) {
    console.error("Error adding user:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/users/:id", authenticateJWT, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "librarian") {
    return res.status(403).json({ error: "Access denied" });
  }
  const { id } = req.params;
  const { role } = req.body;
  try {
    await db.query("UPDATE Users SET role = ? WHERE id_user = ?", [role, id]);
    res.json({ message: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/users/:id", authenticateJWT, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "librarian") {
    return res.status(403).json({ error: "Access denied" });
  }
  const { id } = req.params;
  try {
    await db.query("DELETE FROM Users WHERE id_user = ?", [id]);
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
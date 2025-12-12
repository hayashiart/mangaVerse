// backend/routes/contact.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Vérifie que admin est bien initialisé dans app.js (c'est déjà le cas chez toi)

router.post("/", async (req, res) => {
  const { first_name, last_name, email, subject, message } = req.body;

  // Validation des champs
  if (!first_name || !last_name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Enregistrement dans Firestore
    await admin.firestore().collection("contacts").add({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Réponse succès
    res.status(200).json({ success: "Message sent successfully!" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

module.exports = router;
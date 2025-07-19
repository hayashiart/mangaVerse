const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");


const db = admin.firestore();

router.post("/contact", async (req, res) => {
  const { first_name, last_name, email, subject, message } = req.body;
  if (!first_name || !last_name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields required" });
  }
  try {
    await db.collection("contacts").add({
      first_name,
      last_name,
      email,
      subject,
      message,
      submission_date: admin.firestore.Timestamp.now()
    });
    res.json({ message: "Message sent" });
  } catch (error) {
    console.error("Error sending contact:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
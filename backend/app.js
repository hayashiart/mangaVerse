const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const https = require('https');
const cookieParser = require("cookie-parser");

const admin = require("firebase-admin");
const serviceAccount = require("./mangaverse-e07e3-firebase-adminsdk-fbsvc-c807ab9231.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "mangaverse-e07e3.appspot.com"
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://localhost:1234', // Ajuste selon le port de ton frontend (ex. 1234 si Vite)
  credentials: true // Permet l'envoi de cookies
}));

// Importe toutes les routes
const favoriteRoutes = require("./routes/favorites");
const bookmarkRoutes = require("./routes/bookmarks");
const ratingRoutes = require("./routes/ratings");
const reviewRoutes = require("./routes/reviews");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const mangaRoutes = require("./routes/manga");
const booksRoutes = require("./routes/books"); // Vérifie que cette ligne est là
const categoriesRoutes = require("./routes/categories");
//const chaptersRoutes = require("./routes/chapters");
const tagsRouter = require("./routes/tags");

// Remplace les app.use
app.use("/api/favorites", favoriteRoutes); // Spécifique pour éviter conflits
app.use("/api/bookmarks", bookmarkRoutes); // Spécifique pour éviter conflits
app.use("/api/books", booksRoutes); // Vérifie que cette ligne est correcte
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", mangaRoutes);
app.use("/api", ratingRoutes);
app.use("/api", reviewRoutes);
app.use("/api", contactRoutes);
app.use("/api/categories", categoriesRoutes); // ← GET /api/categories marche
//app.use("/api/chapters", chaptersRoutes);
app.use("/api/tags", tagsRouter);

// Sert les dossiers statiques
app.use("/mangas", express.static(path.join(__dirname, "mangas")));
app.use("/profiles", express.static(path.join(__dirname, "uploads", "profiles")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/chapters", express.static(path.join(__dirname, "uploads", "chapters")));

const PORT = process.env.PORT || 5000;

// EN DOCKER → ON FORCE HTTP (Nginx gère HTTPS si besoin)
if (process.env.NODE_ENV === "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HTTP server running on port ${PORT} (Docker mode)`);
  });
} else {
  // En local → HTTPS
  const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem')
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
  });
}
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const admin = require("firebase-admin");
const serviceAccount = require("./mangaverse-e07e3-firebase-adminsdk-fbsvc-c807ab9231.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "mangaverse-e07e3.appspot.com"
});

app.use(express.json());
app.use(cors());

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
console.log("Books routes loaded:", booksRoutes); // Ajoute ce log

// Sert les dossiers statiques
app.use(
  "/mangas",
  express.static(
    path.join(__dirname, "..", "frontend-vite", "src", "assets", "images", "mangas")
  )
);
app.use(
  "/profiles",
  express.static(path.join(__dirname, "uploads", "profiles"))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
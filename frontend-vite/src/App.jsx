import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MangaPage from "./pages/Manga/MangaPage.jsx";
import Profile from "./pages/Profile/Profile.jsx"; // Importe la page Profil
import Favorites from "./pages/Favorites/Favorites";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import Reader from "./pages/Reader/Reader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-mangas" element={<div>All Mangas Page</div>} />
        <Route path="/manga/:title" element={<MangaPage />} /> {/* Route dynamique */}
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/manga/:title/:chapter" element={<Reader />} />
      </Routes>
    </Router>
  );
}

export default App;
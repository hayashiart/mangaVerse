// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MangaPage from "./pages/Manga/MangaPage.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Favorites from "./pages/Favorites/Favorites";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import Reader from "./pages/Reader/Reader";
import Admin from "./pages/Admin/Admin";
// import MangaChapters from "./pages/Admin/MangaChapters";
import ChapterImages from "./pages/Admin/ChapterImages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manga/:title" element={<MangaPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/manga/:title/:chapter" element={<Reader />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/admin/manga/:bookId/chapters" element={<MangaChapters />} /> */}
        <Route path="/admin/manga/:bookId/chapter/:chapterNumber/images" element={<ChapterImages />} />
      </Routes>
    </Router>
  );
}

export default App;
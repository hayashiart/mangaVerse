import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const BookmarksPage = styled.div`
  background-color: #182032;
  min-height: 100vh;
  padding: 20px;
`;

const BookmarksContainer = styled.div`
  max-width: 1240px;
  margin: 80px auto 40px;
`;

const SectionTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
`;

const MangaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const MangaCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MangaCover = styled.img`
  width: 100%;
  height: 250px;
  border-radius: 10px;
  object-fit: cover;
`;

const MangaTitle = styled.h3`
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background-color: #424c61;
  border-radius: 10px;
  border: none;
  padding: 8px 12px;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    opacity: 0.8;
  }
`;

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view bookmarks");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/bookmarks", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarks(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Server error");
      }
    }
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (book_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/bookmarks/remove/${book_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarks.filter((bm) => bm.id_book !== book_id));
      alert("Removed from bookmarks");
    } catch (err) {
      alert(err.response?.data?.error || "Error removing bookmark");
    }
  };

  if (error) {
    return (
      <BookmarksPage>
        <Header />
        <BookmarksContainer>
          <SectionTitle>Error</SectionTitle>
          <p>{error}</p>
        </BookmarksContainer>
        <Footer />
      </BookmarksPage>
    );
  }

  return (
    <BookmarksPage>
      <Header />
      <BookmarksContainer>
        <SectionTitle>Bookmarks</SectionTitle>
        {bookmarks.length ? (
          <MangaGrid>
            {bookmarks.map((manga) => (
              <MangaCard key={manga.id_book}>
                <Link to={`/manga/${manga.title}`}>
                  <MangaCover
                    src={`http://localhost:5000/mangas/${manga.title}/cover${manga.title}.jpg`}
                    alt={manga.title}
                  />
                </Link>
                <MangaTitle>{manga.title}</MangaTitle>
                <RemoveButton onClick={() => handleRemoveBookmark(manga.id_book)}>
                  Remove
                </RemoveButton>
              </MangaCard>
            ))}
          </MangaGrid>
        ) : (
          <p>No bookmarks yet</p>
        )}
      </BookmarksContainer>
      <Footer />
    </BookmarksPage>
  );
}

export default Bookmarks;
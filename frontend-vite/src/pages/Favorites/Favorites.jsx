import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Cookies from "js-cookie";

const FavoritesPage = styled.main`
  background-color: #182032;
  min-height: 100vh;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const FavoritesContainer = styled.section`
  max-width: 1240px;
  margin: 80px auto 40px;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 60px 10px 20px;
  }
`;

const SectionTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const MangaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const MangaCard = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MangaCover = styled.img`
  width: 100%;
  height: 250px;
  border-radius: 10px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 180px;
  }
`;

const MangaTitle = styled.h3`
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 14px;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    padding: 6px 10px;
    font-size: 12px;
  }
`;

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const token = Cookies.get("session_token");
        if (!token) {
          setError("Please login to view favorites");
          return;
        }
        const response = await axios.get("https://localhost:5000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Server error");
      }
    }
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (book_id) => {
    try {
      const token = Cookies.get("session_token");
      await axios.delete(`https://localhost:5000/api/favorites/remove/${book_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(favorites.filter((fav) => fav.id_book !== book_id));
      alert("Removed from favorites");
    } catch (err) {
      alert(err.response?.data?.error || "Error removing favorite");
    }
  };

  if (error) {
    return (
      <FavoritesPage>
        <Header />
        <FavoritesContainer>
          <SectionTitle>Error</SectionTitle>
          <p role="alert">{error}</p> {/* WCAG: Ajouté role="alert" pour accessibilité */}
        </FavoritesContainer>
        <Footer />
      </FavoritesPage>
    );
  }

  return (
    <FavoritesPage aria-label="Favorites page"> {/* WCAG: Ajouté aria-label pour accessibilité */}
      {/* Ajouter meta tags ici avec react-helmet si utilisé :
      <Helmet>
        <title>Favorites - MangaVerse</title>
        <meta name="description" content="View and manage your favorite mangas on MangaVerse." />
        <meta name="keywords" content="favorites, manga, collection" />
        <meta name="robots" content="index, follow" />
      </Helmet> */}
      <Header />
      <FavoritesContainer>
        <SectionTitle>Favorites</SectionTitle>
        {favorites.length ? (
          <MangaGrid>
            {favorites.map((manga) => (
              <MangaCard key={manga.id_book}>
                <Link to={`/manga/${manga.title}`} aria-label={`View ${manga.title}`}> {/* WCAG: Ajouté aria-label pour accessibilité */}
                  <MangaCover
                    src={`https://localhost:5000/mangas/${manga.title}/cover${manga.title}.jpg`}
                    alt={`${manga.title} cover`} // WCAG: Ajouté alt pour accessibilité
                  />
                </Link>
                <MangaTitle>{manga.title}</MangaTitle>
                <RemoveButton
                  onClick={() => handleRemoveFavorite(manga.id_book)}
                  aria-label={`Remove ${manga.title} from favorites`} // WCAG: Ajouté aria-label pour accessibilité
                >
                  Remove
                </RemoveButton>
              </MangaCard>
            ))}
          </MangaGrid>
        ) : (
          <p>No favorites yet</p>
        )}
      </FavoritesContainer>
      <Footer />
    </FavoritesPage>
  );
}

export default Favorites;
import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom"; // Pour les liens vers les pages manga
import axios from "axios";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #182032;
    margin: 0;
    padding: 0;
  }
`;

const MostViewedSection = styled.section`
  padding: 20px;
  text-align: center;
  margin-top: 80px; /* Ajouté pour descendre la section */
`;

const MostViewedTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-align: left;
  padding-left: 100px;
`;

const MangaContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
`;

const MangaCover = styled.img`
  width: auto;
  height: 220px;
  display: block;
  border-radius: 10px 10px 0 0;
  margin-bottom: 0;
`;

const Notch = styled.div`
  background-color: #2f3b55;
  border-radius: 0 0 20px 20px;
  padding: 5px 10px;
  margin-top: 0;
`;

const MangaName = styled.p`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin: 0;
`;

const RecentlyUpdatedContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Permet de passer à la ligne si besoin */
  justify-content: center; /* Centre les boxes */
  gap: 20px; /* Espace entre les boxes */
  margin-top: 50px;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
`;

const RecentlyUpdatedSection = styled.section`
  padding: 20px;
  text-align: center;
  margin-top: 40px; /* Espace entre Most Viewed et Recently Updated */
`;

const RecentlyUpdatedTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-align: left;
  padding-left: 40px; /* Aligné comme Most Viewed */
`;

const MangaBox = styled.div`
  background-color: #2f3b55;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: flex-start;
  max-width: 500px;
  width: calc(50% - 20px);
`;

const MangaBoxCover = styled.img`
  width: auto;
  height: 150px;
  border-radius: 10px;
  margin-right: 15px;
`;

const MangaBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const MangaBoxTitle = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin: 0 0 10px 0;
`;

const ChapterBar = styled.div`
  background-color: #1b2335;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 5px;
  width: 100%; /* Prend toute la largeur disponible */
`;

const ChapterText = styled.p`
  font-family: "Lora", serif;
  color: white;
  margin: 0;
  font-size: 14px;
`;

const NextButton = styled.button`
  background-color: #518cc7;
  border-radius: 10px;
  border: none;
  padding: 10px 30px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 50px; /* Espace au-dessus du bouton */
  margin-bottom: 100px;
  display: block; /* Centré avec margin auto */
  margin-left: auto;
  margin-right: auto;

  &:hover {
    opacity: 0.8; /* Effet hover comme dans Header */
  }
`;

function getRandomItems(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function Home() {
  const [mostViewed, setMostViewed] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMangas() {
      try {
        const response = await axios.get("http://localhost:5000/api/mangas");

setMostViewed(getRandomItems(response.data, 4));
console.log("Most viewed set:", getRandomItems(response.data, 4));
setMangas(response.data);
setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching mangas");
      }
    }
    fetchMangas();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Header />
      <MostViewedSection>
        <MostViewedTitle>Most Viewed</MostViewedTitle>
        <MangaContainer>
          {mostViewed.map((manga, idx) => (
            <Link key={idx} to={`/manga/${manga.name}`}>
            <div key={idx}>
            <MangaCover src={`http://localhost:5000${manga.cover}`} alt={manga.name} />
              <Notch>
                <MangaName>{manga.name}</MangaName>
              </Notch>
            </div>
            </Link>
          ))}
        </MangaContainer>
      </MostViewedSection>
      <RecentlyUpdatedSection>
  <RecentlyUpdatedTitle>Recently Updated</RecentlyUpdatedTitle>
  <RecentlyUpdatedContainer>
    <MangaBox>
      <Link to="/manga/Naruto">
        <MangaBoxCover
          src="/mangas/Naruto/coverNaruto.jpg"
          alt="Naruto"
        />
      </Link>
      <MangaBoxContent>
        <MangaBoxTitle>Naruto</MangaBoxTitle>
        <ChapterBar>
          <ChapterText>Chapter 700 - 2025-07-01</ChapterText>
        </ChapterBar>
        <ChapterBar>
          <ChapterText>Chapter 699 - 2025-06-25</ChapterText>
        </ChapterBar>
      </MangaBoxContent>
    </MangaBox>
    <MangaBox>
      <Link to="/manga/SailorMoon">
        <MangaBoxCover
          src="/mangas/SailorMoon/coverSailorMoon.jpg"
          alt="Sailor Moon"
        />
      </Link>
      <MangaBoxContent>
        <MangaBoxTitle>Sailor Moon</MangaBoxTitle>
        <ChapterBar>
          <ChapterText>Chapter 60 - 2025-07-02</ChapterText>
        </ChapterBar>
        <ChapterBar>
          <ChapterText>Chapter 59 - 2025-06-20</ChapterText>
        </ChapterBar>
      </MangaBoxContent>
    </MangaBox>
    <MangaBox>
      <Link to="/manga/Berserk">
        <MangaBoxCover
          src="/mangas/Berserk/coverBerserk.jpg"
          alt="Berserk"
        />
      </Link>
      <MangaBoxContent>
        <MangaBoxTitle>Berserk</MangaBoxTitle>
        <ChapterBar>
          <ChapterText>Chapter 364 - 2025-07-03</ChapterText>
        </ChapterBar>
        <ChapterBar>
          <ChapterText>Chapter 363 - 2025-06-15</ChapterText>
        </ChapterBar>
      </MangaBoxContent>
    </MangaBox>
    <MangaBox>
      <Link to="/manga/OnePiece">
        <MangaBoxCover
          src="/mangas/OnePiece/coverOnePiece.jpg"
          alt="One Piece"
        />
      </Link>
      <MangaBoxContent>
        <MangaBoxTitle>One Piece</MangaBoxTitle>
        <ChapterBar>
          <ChapterText>Chapter 1088 - 2025-07-04</ChapterText>
        </ChapterBar>
        <ChapterBar>
          <ChapterText>Chapter 1087 - 2025-06-30</ChapterText>
        </ChapterBar>
      </MangaBoxContent>
    </MangaBox>
  </RecentlyUpdatedContainer>
  <NextButton>Next</NextButton>
</RecentlyUpdatedSection>
<Footer />
    </>
  );
}

export default Home;
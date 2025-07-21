import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #182032;
    margin: 0;
    padding: 0;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const MostViewedSection = styled.section`
  padding: 20px;
  text-align: center;
  margin-top: 80px;

  @media (max-width: 768px) {
    margin-top: 60px;
    padding: 10px;
  }
`;

const MostViewedTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-align: left;
  padding-left: 100px;

  @media (max-width: 768px) {
    font-size: 20px;
    padding-left: 20px;
    margin-bottom: 15px;
  }
`;

const MangaContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;

const MangaCover = styled.img`
  width: auto;
  height: 220px;
  display: block;
  border-radius: 10px 10px 0 0;
  margin-bottom: 0;

  @media (max-width: 768px) {
    height: 150px;
    width: 100%;
  }
`;

const Notch = styled.div`
  background-color: #2f3b55;
  border-radius: 0 0 20px 20px;
  padding: 5px 10px;
  margin-top: 0;

  @media (max-width: 768px) {
    padding: 3px 8px;
  }
`;

const MangaName = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const RecentlyUpdatedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 15px;
  }
`;

const RecentlyUpdatedSection = styled.section`
  padding: 20px;
  text-align: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    margin-top: 20px;
    padding: 10px;
  }
`;

const RecentlyUpdatedTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-align: left;
  padding-left: 40px;

  @media (max-width: 768px) {
    font-size: 20px;
    padding-left: 20px;
    margin-bottom: 15px;
  }
`;

const MangaBox = styled.article`
  background-color: #2f3b55;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: flex-start;
  max-width: 500px;
  width: calc(50% - 20px);

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
`;

const MangaBoxCover = styled.img`
  width: auto;
  height: 150px;
  border-radius: 10px;
  margin-right: 15px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
    height: 120px;
  }
`;

const MangaBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const MangaBoxTitle = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  margin: 0 0 10px 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ChapterBar = styled.div`
  background-color: #1b2335;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 5px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 3px 8px;
  }
`;

const ChapterText = styled.p`
  font-family: "Lora", serif;
  color: white;
  margin: 0;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
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
  margin-top: 50px;
  margin-bottom: 100px;
  display: block;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 200px;
    margin: 20px auto;
    font-size: 14px;
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
        setMangas(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching mangas");
      }
    }
    fetchMangas();
  }, []);

  return (
    <main aria-label="Home page"> {/* WCAG: Ajouté aria-label pour accessibilité */}
      {/* Ajouter meta tags ici avec react-helmet si utilisé :
      <Helmet>
        <title>Home - MangaVerse</title>
        <meta name="description" content="Discover the latest mangas and updates on MangaVerse." />
        <meta name="keywords" content="manga, home, updates" />
        <meta name="robots" content="index, follow" />
      </Helmet> */}
      <GlobalStyle />
      <Header />
      <MostViewedSection>
        <MostViewedTitle>Most Viewed</MostViewedTitle>
        <MangaContainer>
          {mostViewed.map((manga, idx) => (
            <Link key={idx} to={`/manga/${manga.name}`} aria-label={`View ${manga.name}`}> {/* WCAG: Ajouté aria-label pour accessibilité */}
              <div key={idx}>
                <MangaCover src={`http://localhost:5000${manga.cover}`} alt={`${manga.name} cover`} /> {/* WCAG: Ajouté alt pour accessibilité */}
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
            <Link to="/manga/Naruto" aria-label="View Naruto manga"> {/* WCAG: Ajouté aria-label pour accessibilité */}
              <MangaBoxCover src="/mangas/Naruto/coverNaruto.jpg" alt="Naruto cover" /> {/* WCAG: Ajouté alt pour accessibilité */}
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
            <Link to="/manga/SailorMoon" aria-label="View Sailor Moon manga"> {/* WCAG: Ajouté aria-label pour accessibilité */}
              <MangaBoxCover src="/mangas/SailorMoon/coverSailorMoon.jpg" alt="Sailor Moon cover" /> {/* WCAG: Ajouté alt pour accessibilité */}
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
            <Link to="/manga/Berserk" aria-label="View Berserk manga"> {/* WCAG: Ajouté aria-label pour accessibilité */}
              <MangaBoxCover src="/mangas/Berserk/coverBerserk.jpg" alt="Berserk cover" /> {/* WCAG: Ajouté alt pour accessibilité */}
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
            <Link to="/manga/OnePiece" aria-label="View One Piece manga"> {/* WCAG: Ajouté aria-label pour accessibilité */}
              <MangaBoxCover src="/mangas/OnePiece/coverOnePiece.jpg" alt="One Piece cover" /> {/* WCAG: Ajouté alt pour accessibilité */}
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
        <NextButton aria-label="View next recently updated mangas"> {/* WCAG: Ajouté aria-label pour accessibilité */}
          Next
        </NextButton>
      </RecentlyUpdatedSection>
      <Footer />
    </main>
  );
}

export default Home;
import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #182032;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 0 20px 100px; /* espace propre avant le footer */
`;

const Container = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 34px;
  font-weight: 700;
  text-align: center;
  margin: 80px 0 50px 0;
  font-family: "Montserrat", sans-serif;
`;

/* ==================== MOST VIEWED ==================== */
const MostViewedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 35px;
  margin-bottom: 90px;
`;

const MangaCard = styled(Link)`
  text-decoration: none;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  transition: all 0.4s ease;
  background: #2f3b55;

  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 30px 70px rgba(0,0,0,0.8);
  }
`;

const Cover = styled.img`
  width: 100%;
  height: 360px;
  object-fit: cover;
  display: block;
`;

const CardFooter = styled.div`
  padding: 22px;
  text-align: center;
`;

const MangaTitle = styled.h3`
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  font-family: "Montserrat", sans-serif;
`;

/* ==================== RECENTLY UPDATED ==================== */
const RecentlyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 35px;
  margin-bottom: 80px;
`;

const RecentCard = styled.div`
  background: linear-gradient(135deg, #2f3b55, #1e2740);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.6);
  transition: all 0.3s ease;
  display: flex;
  align-items: stretch;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 60px rgba(0,0,0,0.8);
  }
`;

const RecentCover = styled.img`
  width: 160px;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
`;

const RecentInfo = styled.div`
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RecentTitle = styled.h3`
  color: white;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 15px 0;
  font-family: "Montserrat", sans-serif;
`;

const ChapterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChapterItem = styled.div`
  background: #1e2740;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  color: #a0d8ff;
  transition: all 0.2s;

  &:hover {
    background: #2a3550;
    transform: translateX(5px);
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 80px auto 0;
  background: linear-gradient(135deg, #518cc7, #3a6a9e);
  color: white;
  border: none;
  padding: 18px 50px;
  border-radius: 16px;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(81,140,199,0.6);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(81,140,199,0.8);
  }
`;

function getRandomItems(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default function Home() {
  const navigate = useNavigate();
  const [mostViewed, setMostViewed] = useState([]);

  useEffect(() => {
    async function fetchMangas() {
      try {
        const response = await axios.get("https://localhost:5000/api/manga/mangas");
        setMostViewed(getRandomItems(response.data, 4));
      } catch (err) {
        console.error("Erreur chargement mangas", err);
      }
    }
    fetchMangas();
  }, []);

  const recentMangas = [
    { name: "Naruto", cover: "/mangas/Naruto/coverNaruto.jpg", chapters: ["Chapter 700 - 2025-07-01", "Chapter 699 - 2025-06-25"] },
    { name: "Sailor Moon", cover: "/mangas/SailorMoon/coverSailorMoon.jpg", chapters: ["Chapter 60 - 2025-07-02", "Chapter 59 - 2025-06-20"] },
    { name: "Berserk", cover: "/mangas/Berserk/coverBerserk.jpg", chapters: ["Chapter 364 - 2025-07-03", "Chapter 363 - 2025-06-15"] },
    { name: "One Piece", cover: "/mangas/OnePiece/coverOnePiece.jpg", chapters: ["Chapter 1088 - 2025-07-04", "Chapter 1087 - 2025-06-30"] },
  ];

  return (
    <PageWrapper>
      <Header />

      <MainContent>
        <Container>
          <SectionTitle>Most Viewed</SectionTitle>
          <MostViewedGrid>
            {mostViewed.map((manga) => (
              <MangaCard key={manga.name} to={`/manga/${encodeURIComponent(manga.name)}`}>
                <Cover src={`https://localhost:5000${manga.cover}`} alt={manga.name} />
                <CardFooter>
                  <MangaTitle>{manga.name}</MangaTitle>
                </CardFooter>
              </MangaCard>
            ))}
          </MostViewedGrid>

          <SectionTitle>Recently Updated</SectionTitle>
          <RecentlyGrid>
            {recentMangas.map((manga) => (
              <RecentCard key={manga.name}>
                <Link to={`/manga/${encodeURIComponent(manga.name)}`} style={{textDecoration: "none"}}>
                  <RecentCover src={`https://localhost:5000${manga.cover}`} alt={manga.name} />
                </Link>
                <RecentInfo>
                  <RecentTitle>{manga.name}</RecentTitle>
                  <ChapterList>
                    {manga.chapters.map((ch, i) => (
                      <ChapterItem key={i}>{ch}</ChapterItem>
                    ))}
                  </ChapterList>
                </RecentInfo>
              </RecentCard>
            ))}
          </RecentlyGrid>

          <LoadMoreButton onClick={() => navigate("/all-mangas")}>
  See more mangas
</LoadMoreButton>
        </Container>
      </MainContent>

      <Footer />
    </PageWrapper>
  );
}
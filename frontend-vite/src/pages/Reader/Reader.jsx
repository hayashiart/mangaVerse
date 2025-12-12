import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const ReaderPage = styled.main`
  background-color: #182032;
  min-height: 100vh;
  padding: 0;
  position: relative;
`;

const ReaderContainer = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 340px 100px 40px;

  @media (max-width: 1300px) {
    padding-right: 300px;
  }
  @media (max-width: 1100px) {
    padding-right: 40px;
    padding-bottom: 400px;
  }
`;

const ChapterTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 34px;
  text-align: center;
  margin: 0 0 60px 0;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 40px;
  }
`;

const ChapterImage = styled.img`
  width: 100%;
  display: block;
  margin-bottom: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
`;

// === SIDEBAR — TOUTE LA HAUTEUR, ÉLÉMENTS CENTRÉS ET DESCENDUS ===
const SidebarNav = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: linear-gradient(to left, #2f3b55 0%, #1e2740 100%);
  padding: 180px 40px 100px; /* descendu un peu plus */
  box-shadow: -15px 0 40px rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 35px;
  z-index: 900;
  box-sizing: border-box;

  @media (max-width: 1300px) {
    width: 270px;
    padding: 160px 30px 100px;
    gap: 30px;
  }
  @media (max-width: 1100px) {
    position: static;
    height: auto;
    width: 100%;
    max-width: 600px;
    margin: 60px auto 0;
    padding: 40px 30px;
    background: #2f3b55;
    justify-content: flex-start;
    gap: 30px;
  }
`;

const CurrentChapter = styled.div`
  color: white;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
`;

const CurrentPage = styled.div`
  color: #a0d8ff;
  font-size: 19px;
  font-weight: 600;
`;

const ChapterSelect = styled.select`
  width: 100%;
  padding: 16px 20px;
  background: #1b2335;
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: #222a40;
  }

  option {
    background: #1b2335;
    color: white;
  }
`;

const PageInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const PageInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  background: #1b2335;
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  text-align: center;

  &::placeholder {
    color: rgba(255,255,255,0.6);
  }

  &:focus {
    outline: none;
    background: #222a40;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
`;

const NavButton = styled.button`
  flex: 1;
  background: #518cc7;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #3a6a9e;
  }

  &:disabled {
    background: #334066;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

function Reader() {
  const { title, chapter: currentChapterStr } = useParams
();
  const navigate = useNavigate();
  const currentChapter = parseInt(currentChapterStr) || 1;
  const [pageInput, setPageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [images, setImages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const imageRefs = useRef([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const mangaRes = await axios.get(`https://localhost:5000/api/manga/manga/${encodeURIComponent(title)}`);
        const chapterList = mangaRes.data.chapters || [];
        setChapters(chapterList.map(ch => ch.chapter_number));

        const imagesRes = await axios.get(`https://localhost:5000/api/manga/manga/${encodeURIComponent(title)}/${currentChapter}/images`);
        const urls = imagesRes.data.images.map(url => `https://localhost:5000${url}`);
        setImages(urls);
        setTotalPages(urls.length);
        setCurrentPage(1);
        setPageInput("1");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [title, currentChapter]);

  // Détection de la page actuelle au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.dataset.page);
            setCurrentPage(pageNum);
            setPageInput(pageNum.toString());
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    imageRefs.current.forEach(img => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect();
  }, [images]);

  const goToChapter = (num) => {
    if (num >= 1 && num <= chapters.length) {
      navigate(`/manga/${encodeURIComponent(title)}/${num}`);
    }
  };

  const goToPage = () => {
    const num = parseInt(pageInput);
    if (num >= 1 && num <= totalPages) {
      imageRefs.current[num - 1]?.scrollIntoView({ behavior: "smooth" });
      setCurrentPage(num);
    }
  };

  if (loading) {
    return (
      <ReaderPage>
        <Header />
        <ReaderContainer>
          <ChapterTitle>Loading chapter...</ChapterTitle>
        </ReaderContainer>
        <Footer />
      </ReaderPage>
    );
  }

  return (
    <ReaderPage>
      <Header />
      <ReaderContainer>
        <ChapterTitle>{title} - Chapter {currentChapter}</ChapterTitle>

        {images.length > 0 ? (
          images.map((src, index) => (
            <ChapterImage
              key={index}
              ref={el => imageRefs.current[index] = el}
              data-page={index + 1}
              src={src}
              alt={`Page ${index + 1}`}
              loading="lazy"
            />
          ))
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>No images available for this chapter.</p>
        )}
      </ReaderContainer>

      {/* BARRE LATÉRALE — CENTRÉE ET DESCENDUE */}
      <SidebarNav>
        <CurrentChapter>Chapter {currentChapter}</CurrentChapter>
        <CurrentPage>Page: {currentPage} / {totalPages}</CurrentPage>

        <ChapterSelect value={currentChapter} onChange={(e) => goToChapter(parseInt(e.target.value))}>
          {chapters.map(num => (
            <option key={num} value={num}>Chapter {num}</option>
          ))}
        </ChapterSelect>

        <PageInputWrapper>
          <PageInput
            type="number"
            min="1"
            max={totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToPage()}
            placeholder={`1 - ${totalPages}`}
          />
        </PageInputWrapper>

        <NavButtons>
          <NavButton onClick={() => goToChapter(currentChapter - 1)} disabled={currentChapter <= 1}>
            ← Prev
          </NavButton>
          <NavButton onClick={() => goToChapter(currentChapter + 1)} disabled={currentChapter >= chapters.length}>
            Next →
          </NavButton>
        </NavButtons>
      </SidebarNav>

      <Footer />
    </ReaderPage>
  );
}

export default Reader;
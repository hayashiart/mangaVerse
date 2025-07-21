import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import axios from "axios";

const ReaderPage = styled.main`
  background-color: #182032;
  min-height: 100vh;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ReaderContainer = styled.section`
  max-width: 800px;
  margin: 80px auto 40px;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 60px 10px 20px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    max-width: 600px;
  }
`;

const ChapterTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const ChapterImage = styled.img`
  width: 100%;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    height: auto;
    max-width: 100%;
  }
`;

function Reader() {
  const { title, chapter } = useParams();
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChapterImages() {
      try {
        const response = await axios.get(`http://localhost:5000/api/manga/${title}/${chapter}/images`);
        setImages(response.data.images.map(url => `http://localhost:5000${url}`));
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error loading chapter images");
      }
    }
    fetchChapterImages();
  }, [title, chapter]);

  if (error) {
    return (
      <ReaderPage>
        <Header />
        <ReaderContainer>
          <ChapterTitle>Error</ChapterTitle>
          <p role="alert">{error}</p> {/* WCAG: Ajouté role="alert" pour accessibilité */}
        </ReaderContainer>
        <Footer />
      </ReaderPage>
    );
  }

  return (
    <ReaderPage aria-label={`Reader page for ${title} chapter ${chapter}`}> {/* WCAG: Ajouté aria-label pour accessibilité */}
      {/* Ajouter meta tags ici avec react-helmet si utilisé :
      <Helmet>
        <title>{title} Chapter {chapter} - MangaVerse</title>
        <meta name="description" content={`Read chapter ${chapter} of ${title} manga on MangaVerse.`} />
        <meta name="keywords" content={`${title}, chapter ${chapter}, manga, read`} />
        <meta name="robots" content="index, follow" />
      </Helmet> */}
      <Header />
      <ReaderContainer>
        <ChapterTitle>{title} - Chapter {chapter}</ChapterTitle>
        {images.map((src, index) => (
          <ChapterImage
            key={index}
            src={src}
            alt={`Page ${index + 1} of ${title} chapter ${chapter}`} // WCAG: Ajouté alt pour accessibilité
          />
        ))}
      </ReaderContainer>
      <Footer />
    </ReaderPage>
  );
}

export default Reader;
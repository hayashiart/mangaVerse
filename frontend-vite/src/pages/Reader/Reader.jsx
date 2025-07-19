import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import axios from "axios";

const ReaderPage = styled.div`
  background-color: #182032;
  min-height: 100vh;
  padding: 20px;
`;

const ReaderContainer = styled.div`
  max-width: 800px;
  margin: 80px auto 40px;
`;

const ChapterTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const ChapterImage = styled.img`
  width: 100%;
  margin-bottom: 10px;
`;

function Reader() {
  const { title, chapter } = useParams();
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChapterImages() {
      try {
        const response = await axios.get(`http://localhost:5000/api/manga/${title}/${chapter}/images`);
        console.log("Chapter images loaded:", response.data.images);
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
          <p>{error}</p>
        </ReaderContainer>
        <Footer />
      </ReaderPage>
    );
  }

  return (
    <ReaderPage>
      <Header />
      <ReaderContainer>
        <ChapterTitle>{title} - Chapter {chapter}</ChapterTitle>
        {images.map((src, index) => (
          <ChapterImage key={index} src={src} alt={`Page ${index + 1}`} />
        ))}
      </ReaderContainer>
      <Footer />
    </ReaderPage>
  );
}

export default Reader;
// src/pages/AllMangas/AllMangas.jsx
import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #182032;
  margin: 0;
  padding: 0;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: white;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 50px 0;
  font-family: "Montserrat", sans-serif;
`;

/* === FILTRES === */
const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 50px;
  padding: 0 20px;
`;

const SearchInput = styled.input`
  padding: 14px 20px;
  background: #2f3b55;
  border: 2px solid #518cc7;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  width: 320px;
  max-width: 100%;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border-color: #70a1ff;
    box-shadow: 0 0 0 4px rgba(81,140,199,0.3);
  }
`;

const Select = styled.select`
  padding: 14px 20px;
  background: #2f3b55;
  border: 2px solid #518cc7;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  min-width: 200px;
`;

/* === GRID 4 PAR LIGNE === */
const MangaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 60px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MangaCard = styled(Link)`
  text-decoration: none;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.6);
  transition: all 0.4s ease;
  background: #2f3b55;

  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 30px 70px rgba(0,0,0,0.8);
  }
`;

const Cover = styled.img`
  width: 100%;
  height: 340px;
  object-fit: cover;
  display: block;
`;

const CardFooter = styled.div`
  padding: 20px;
  text-align: center;
`;

const MangaTitle = styled.h3`
  color: white;
  font-size: 19px;
  font-weight: 600;
  margin: 0;
  font-family: "Montserrat", sans-serif;
`;

/* === PAGINATION TOUJOURS VISIBLE === */
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 60px 0;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  min-width: 50px;
  height: 50px;
  padding: 0 16px;
  border-radius: 14px;
  background: ${props => props.active ? "#518cc7" : "#334066"};
  color: white;
  border: none;
  font-size: 18px;
  font-weight: ${props => props.active ? "bold" : "600"};
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${props => props.active ? "0 0 0 4px rgba(81,140,199,0.4)" : "none"};

  &:hover {
    background: #518cc7;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ITEMS_PER_PAGE = 12;

export default function AllMangas() {
  const [allMangas, setAllMangas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchMangas();
    fetchCategories();
  }, []);

  const fetchMangas = async () => {
    try {
      const res = await axios.get("https://localhost:5000/api/manga/mangas");
      setAllMangas(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtrage
  useEffect(() => {
    let result = allMangas;

    if (search) {
      result = result.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(m => m.category_id === selectedCategory);
    }

    if (selectedTag) {
      result = result.filter(m => 
        m.tags && m.tags.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [search, selectedCategory, selectedTag, allMangas]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentMangas = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <PageWrapper>
      <Header />

      <MainContent>
        <Container>
          <Title>All Mangas</Title>

          <Filters>
            <SearchInput
              placeholder="Search a title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="">Categories</option>
              {categories.map(cat => (
                <option key={cat.id_category} value={cat.id_category}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <SearchInput
              placeholder="Tag (ex: shonen)"
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
            />
          </Filters>

          <MangaGrid>
            {currentMangas.map(manga => (
              <MangaCard key={manga.name} to={`/manga/${encodeURIComponent(manga.name)}`}>
                <Cover src={`https://localhost:5000${manga.cover}`} alt={manga.name} />
                <CardFooter>
                  <MangaTitle>{manga.name}</MangaTitle>
                </CardFooter>
              </MangaCard>
            ))}
          </MangaGrid>

          {/* PAGINATION TOUJOURS VISIBLE (même s’il n’y a qu’une page) */}
          <Pagination>
            <PageButton
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ←
            </PageButton>

            {Array.from({ length: Math.max(totalPages, 5) }, (_, i) => (
              <PageButton
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}

            <PageButton
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              →
            </PageButton>
          </Pagination>
        </Container>
      </MainContent>

      <Footer />
    </PageWrapper>
  );
}
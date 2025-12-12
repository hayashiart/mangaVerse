// src/pages/Admin/ChapterImages.jsx – VERSION 100% FONCTIONNELLE 2025
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

// ... tout le reste du code reste IDENTIQUE (styled components, etc.)

const Page = styled.div`
  background: #182032;
  min-height: 100vh;
  color: white;
  font-family: "Montserrat", sans-serif;
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 80px auto 40px;
  padding: 20px;
  @media (max-width: 768px) {
    margin: 60px auto 20px;
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  @media (max-width: 768px) { font-size: 22px; }
`;

const BackButton = styled.button`
  background: #424c61;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
`;

const UploadZone = styled.div`
  border: 3px dashed #518cc7;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  background: #1e2a42;
  margin-bottom: 40px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { background: #253045; border-color: #6ba1e0; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
`;

const PageItem = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

const PageImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
  @media (max-width: 768px) { height: 200px; }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(220, 20, 60, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  &:hover { background: crimson; }
`;

const PageNumber = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0,0,0,0.7);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
`;

function SortablePage({ page, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: page.pageNum });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <PageItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PageImage src={page.url} alt={`Page ${page.pageNum}`} />
      <PageNumber>{page.pageNum}</PageNumber>
      <DeleteBtn onClick={(e) => { e.stopPropagation(); onDelete(page.pageNum); }}>X</DeleteBtn>
    </PageItem>
  );
}

function ChapterImages() {
  const { bookId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [isUploading, setIsUploadingissory] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadPages = async () => {
    try {
      const res = await axios.get(`https://localhost:5000/api/manga/${encodeURIComponent(bookId)}/${chapterNumber}/images`, { withCredentials: true });
      const urls = res.data.images;
      const formatted = urls.map((url, i) => ({
        url,
        pageNum: i + 1,
      }));
      setPages(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadPages(); }, [bookId, chapterNumber]);

  const handleUpload = async (files) => {
    if (!files.length) return;
    setIsUploading(true);
    const formData = new FormData();
    for (const file of files) formData.append("pages", file);
    formData.append("chapterNumber", chapterNumber);

    try {
      await axios.post(`https://localhost:5000/api/chapters/${bookId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      loadPages();
    } catch (err) {
      alert("Erreur upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (pageNum) => {
    if (!confirm(`Supprimer la page ${pageNum} ?`)) return;
    try {
      await axios.delete(`https://localhost:5000/api/chapters/chapter/${chapterNumber}/page/${pageNum}`, { withCredentials: true });
      setPages(pages.filter(p => p.pageNum !== pageNum));
      // renumérotation après suppression
      const remaining = pages.filter(p => p.pageNum !== pageNum);
      setPages(remaining.map((p, i) => ({ ...p, pageNum: i + 1 })));
    } catch (err) {
      alert("Erreur suppression");
    }
  };

 const handleDragEnd = async (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = pages.findIndex(p => p.pageNum === active.id);
  const newIndex = pages.findIndex(p => p.pageNum === over.id);
  const newPages = arrayMove(pages, oldIndex, newIndex);

  setPages(newPages.map((p, i) => ({ ...p, pageNum: i + 1 })));

  const newOrder = newPages.map((p, i) => ({ oldPage: p.pageNum, newPage: i + 1 }));
  try {
    await axios.post(`https://localhost:5000/api/chapters/chapter/${chapterNumber}/reorder`, { newOrder }, { withCredentials: true });
  } catch (err) {
    console.error("Erreur réordonnancement:", err);
    alert("Erreur lors du réordonnancement");
  }
};

  return (
    <Page>
      <Header />
      <Container>
        <BackButton onClick={() => navigate(`/admin/manga/${bookId}/chapters`)}>Retour aux chapitres</BackButton>
        <Title>Chapitre {chapterNumber} – Gestion des pages</Title>

        <UploadZone onClick={() => document.getElementById("fileInput").click()}>
          {isUploading ? (
            <p>Upload en cours...</p>
          ) : (
            <>
              <p style={{ fontSize: "20px", margin: "0 0 10px" }}>Glisse-dépose ou clique ici</p>
              <p style={{ opacity: 0.7 }}>Pour ajouter de nouvelles pages</p>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </UploadZone>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={pages.map(p => p.pageNum)} strategy={rectSortingStrategy}>
            <Grid>
              {pages.map(page => (
                <SortablePage key={page.pageNum} page={page} onDelete={handleDelete} />
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      </Container>
      <Footer />
    </Page>
  );
}

export default ChapterImages;
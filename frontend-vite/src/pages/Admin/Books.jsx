// src/pages/Admin/Books.jsx → VERSION FINALE 100% (titre bloqué si chapitres existants)
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Cookies from "js-cookie";

const Container = styled.div`
  padding: 30px;
  color: white;
  min-height: 100vh;
  background: #182032;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-size: 28px;
  margin: 0;
  font-weight: bold;
`;

const AddButton = styled.button`
  background: #518cc7;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  min-height: 400px;
`;

const Card = styled.div`
  background: #2f3b55;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  }
`;

const CoverLink = styled.div`
  cursor: pointer;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const Cover = styled.img`
  width: 100%;
  height: 360px;
  object-fit: cover;
  background: #182032;
  display: block;
`;

const Info = styled.div`
  padding: 20px;
`;

const MangaTitle = styled.h3`
  margin: 0 0 10px 0;
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Category = styled.p`
  margin: 8px 0;
  opacity: 0.9;
  font-size: 14px;
`;

const Tags = styled.p`
  margin: 10px 0;
  font-size: 13px;
  color: #a0d8ff;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 15px;
`;

const Btn = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
`;

const EditBtn = styled(Btn)`
  background: #518cc7;
  color: white;
`;

const DeleteBtn = styled(Btn)`
  background: #c75151;
  color: white;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 60px;
  flex-wrap: wrap;
`;

const PageBtn = styled.button`
  background: ${(props) => (props.active ? "#518cc7" : "#2f3b55")};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  min-width: 44px;
  font-weight: bold;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const Modal = styled.div`
  background: #2f394f;
  padding: 40px;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  background: #182032;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 14px;
  margin: 12px 0;
  background: #182032;
  border: none;
  border-radius: 10px;
  color: white;
  resize: vertical;
`;

const Select = styled.select`
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  background: #182032;
  border: none;
  border-radius: 10px;
  color: white;
`;

 const TagInput = styled.input`
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  background: #182032;
  border: none;
  border-radius: 10px;
  color: white;
`;

const ITEMS_PER_PAGE = 12;

export default function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [canEditTitle, setCanEditTitle] = useState(true); // ← NOUVEAU
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    tags: "",
    coverImage: null,
  });

  const token = Cookies.get("session_token");

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("https://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Erreur chargement mangas:", err);
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

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return books.slice(start, start + ITEMS_PER_PAGE);
  }, [books, currentPage]);

  const handleEdit = async (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      description: book.description || "",
      category_id: book.category_id || "",
      tags: book.tags || "",
      coverImage: null,
    });

    // Vérifie s’il y a déjà des chapitres → si oui, on bloque le titre
    try {
      const res = await axios.get(
        `https://localhost:5000/api/chapters/list/${book.id_book}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCanEditTitle(res.data.length === 0);
    } catch (err) {
      setCanEditTitle(true); // En cas d'erreur, on autorise
    }

    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description);
    formData.append("category_id", form.category_id || "");
    formData.append("tags", JSON.stringify(form.tags.split(",").map(t => t.trim()).filter(Boolean)));
    if (form.coverImage) formData.append("coverImage", form.coverImage);

    try {
      if (editingBook) {
        await axios.put(`https://localhost:5000/api/books/${editingBook.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("https://localhost:5000/api/books", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }
      setIsOpen(false);
      setEditingBook(null);
      setForm({ title: "", description: "", category_id: "", tags: "", coverImage: null });
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer définitivement ce manga ?")) return;
    try {
      await axios.delete(`https://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      alert("Erreur suppression");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Gestion des Mangas ({books.length})</Title>
        <AddButton
          onClick={() => {
            setEditingBook(null);
            setCanEditTitle(true);
            setForm({ title: "", description: "", category_id: "", tags: "", coverImage: null });
            setIsOpen(true);
          }}
        >
          + Ajouter un Manga
        </AddButton>
      </Header>

      <Grid>
        {paginatedBooks.map((book) => (
          <Card key={book.id}>
            <CoverLink onClick={() => navigate(`/admin/manga/${book.id_book}/chapters`)}>
              <Cover
                src={`${book.coverImage?.startsWith("http") ? book.coverImage : `https://localhost:5000${book.coverImage || `/mangas/${book.title}/cover${book.title}.jpg`}`}?$t=${Date.now()}`}
                alt={book.title}
                loading="lazy"
              />
            </CoverLink>

            <Info>
              <MangaTitle title={book.title}>{book.title}</MangaTitle>
              <Category>{book.category_name || "Aucune catégorie"}</Category>
              {book.tags && <Tags>#{book.tags.replace(/,/g, " #")}</Tags>}

              <Actions>
                <EditBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(book);
                  }}
                >
                  Modifier infos
                </EditBtn>
                <DeleteBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(book.id);
                  }}
                >
                  Supprimer
                </DeleteBtn>
              </Actions>
            </Info>
          </Card>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Pagination>
          <PageBtn onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Précédent
          </PageBtn>
          {[...Array(totalPages)].map((_, i) => (
            <PageBtn
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageBtn>
          ))}
          <PageBtn onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Suivant
          </PageBtn>
        </Pagination>
      )}

      {/* MODAL D'AJOUT/ÉDITION */}
      {isOpen && (
        <ModalOverlay onClick={() => setIsOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, fontFamily: "Montserrat" }}>
              {editingBook ? "Modifier" : "Ajouter"} un Manga
            </h2>
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={canEditTitle ? "Titre du manga" : "Impossible de modifier (chapitres existants)"}
                disabled={!canEditTitle}
                required
              />
              <TextArea
                placeholder="Description (facultatif)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
              <TagInput
                type="text"
                placeholder="Tags (ex: action, romance, shonen)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, coverImage: e.target.files?.[0] || null })}
              />
              <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#518cc7",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {editingBook ? "Sauvegarder" : "Créer"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#666",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}
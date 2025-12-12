import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Cookies from "js-cookie";

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #182032;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
`;

const Title = styled.h1`
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #518cc7, #3a6a9e);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 25px rgba(81,140,199,0.5);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(81,140,199,0.7);
  }
`;

const MangaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 40px;
  height: calc(100vh - 280px);
  max-height: 900px;
`;

const MangaCard = styled.div`
  background: #2f3b55;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.6);
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #3a4a6e;

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 25px 60px rgba(0,0,0,0.8);
  }
`;

const CoverWrapper = styled.div`
  position: relative;
  height: 340px;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  cursor: pointer;
`;

const Cover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${MangaCard}:hover & {
    transform: scale(1.12);
  }
`;

const CardFooter = styled.div`
  padding: 22px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MangaTitle = styled.h3`
  margin: 0 0 10px 0;
  color: white;
  font-size: 19px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Category = styled.p`
  margin: 8px 0;
  color: #a0d8ff;
  font-size: 15px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
`;

const EditButton = styled(ActionButton)`
  background: #518cc7;
  color: white;

  &:hover { background: #3a6a9e; }
`;

const DeleteButton = styled(ActionButton)`
  background: #c75151;
  color: white;

  &:hover { background: #a13e3e; }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 50px 0;

  button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #334066;
    color: white;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #518cc7;
      transform: scale(1.1);
    }

    &.active {
      background: #518cc7;
      box-shadow: 0 0 0 5px rgba(81,140,199,0.4);
    }
  }
`;

// MODAL
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #2f3b55;
  padding: 40px;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0,0,0,0.8);
  border: 1px solid #518cc7;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 26px;
  margin: 0 0 30px 0;
  text-align: center;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 16px;
  margin: 12px 0;
  background: #1e2740;
  border: 2px solid #518cc7;
  border-radius: 12px;
  color: white;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #70a1ff;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  height: 130px;
  padding: 16px;
  margin: 12px 0;
  background: #1e2740;
  border: 2px solid #518cc7;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  resize: vertical;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 16px;
  margin: 12px 0;
  background: #1e2740;
  border: 2px solid #518cc7;
  border-radius: 12px;
  color: white;
  font-size: 16px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 35px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
`;

const SaveModalButton = styled(ModalButton)`
  background: #518cc7;
  color: white;
`;

const CancelModalButton = styled(ModalButton)`
  background: #666;
  color: white;
`;

const ITEMS_PER_PAGE = 4;

export default function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [canEditTitle, setCanEditTitle] = useState(true);
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
  const currentBooks = books.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = async (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      description: book.description || "",
      category_id: book.category_id || "",
      tags: book.tags || "",
      coverImage: null,
    });

    try {
      const res = await axios.get(
        `https://localhost:5000/api/chapters/list/${book.id_book}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCanEditTitle(res.data.length === 0);
    } catch (err) {
      setCanEditTitle(true);
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
        await axios.put(`https://localhost:5000/api/books/${editingBook.id_book}`, formData, {
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
    <PageWrapper>
      <Container>
        <Header>
          <Title>Gestion des Mangas ({books.length})</Title>
          <AddButton onClick={() => {
            setEditingBook(null);
            setCanEditTitle(true);
            setForm({ title: "", description: "", category_id: "", tags: "", coverImage: null });
            setIsOpen(true);
          }}>
            + Ajouter un Manga
          </AddButton>
        </Header>

        <MangaGrid>
          {currentBooks.map(book => (
            <MangaCard key={book.id_book}>
              <CoverWrapper onClick={() => navigate(`/admin/manga/${book.id_book}/chapters`)}>
                <Cover
                  src={`https://localhost:5000${book.cover_image || `/mangas/${book.title}/cover${book.title}.jpg`}`}
                  alt={book.title}
                />
              </CoverWrapper>
              <CardFooter>
                <MangaTitle title={book.title}>{book.title}</MangaTitle>
                <Category>{book.category_name || "Sans catégorie"}</Category>
                <Actions>
                  <EditButton onClick={(e) => { e.stopPropagation(); handleEdit(book); }}>
                    Modifier
                  </EditButton>
                  <DeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(book.id_book); }}>
                    Supprimer
                  </DeleteButton>
                </Actions>
              </CardFooter>
            </MangaCard>
          ))}
        </MangaGrid>

        {totalPages > 1 && (
          <Pagination>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              →
            </button>
          </Pagination>
        )}

        {/* MODAL */}
        {isOpen && (
          <ModalOverlay onClick={() => setIsOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalTitle>{editingBook ? "Modifier" : "Ajouter"} un Manga</ModalTitle>
              <form onSubmit={handleSubmit}>
                <FormInput
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Titre"
                  required
                  disabled={!canEditTitle}
                />
                <FormTextarea
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
                <FormSelect
                  value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Catégorie</option>
                  {categories.map(c => (
                    <option key={c.id_category} value={c.id_category}>
                      {c.name}
                    </option>
                  ))}
                </FormSelect>
                <FormInput
                  placeholder="Tags (ex: action, romance)"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                />
                <FormInput
                  type="file"
                  accept="image/*"
                  onChange={e => setForm({ ...form, coverImage: e.target.files?.[0] || null })}
                />
                <ModalButtons>
                  <SaveModalButton type="submit">{editingBook ? "Sauvegarder" : "Créer"}</SaveModalButton>
                  <CancelModalButton type="button" onClick={() => setIsOpen(false)}>Annuler</CancelModalButton>
                </ModalButtons>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </PageWrapper>
  );
}
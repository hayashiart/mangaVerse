import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const AddBookForm = styled.form`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const BooksTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  max-height: 400px;
  overflow-y: auto;
  display: block;

  @media (max-width: 768px) {
    overflow-x: auto;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    font-size: 14px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    max-height: 300px;
  }
`;

const AddButton = styled.button`
  background-color: #518CC7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 15px;
    font-size: 14px;
  }
`;

const SaveButton = styled.button`
  background-color: #518CC7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 15px;
    font-size: 14px;
  }
`;

const Input = styled.input`
  padding: 5px;
  border: 1px solid #518cc7;
  border-radius: 5px;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ffffff33;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #1b2335;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ffffff33;
`;

const Select = styled.select`
  padding: 5px;
  border: 1px solid #518cc7;
  border-radius: 5px;
`;

function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [newBook, setNewBook] = useState({ title: "", description: "", views: 0 });
  const [coverImage, setCoverImage] = useState(null);

  const fetchBooks = async () => {
    try {
        const token = Cookies.get("session_token");
      const response = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.description || !coverImage) {
      console.error("Title, description, and cover image are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("description", newBook.description);
    formData.append("views", newBook.views);
    formData.append("coverImage", coverImage);

    try {
        const token = Cookies.get("session_token");
      console.log("Data sent to API:", { title: newBook.title, description: newBook.description, views: newBook.views });
      const response = await axios.post("http://localhost:5000/api/books", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      console.log("Book added:", response.data);
      await fetchBooks();
      setNewBook({ title: "", description: "", views: 0 });
      setCoverImage(null);
    } catch (err) {
      console.error("Error adding book:", err.response?.data || err.message);
    }
  };

  return (
    <section aria-label="Books management section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
      {/* Ajouter meta tags ici avec react-helmet si utilisé :
      <Helmet>
        <title>Books Management - MangaVerse</title>
        <meta name="description" content="Manage manga books on the MangaVerse admin panel." />
        <meta name="keywords" content="books, manga, management" />
        <meta name="robots" content="index, follow" />
      </Helmet> */}
      <h1>Manage Books</h1>
      <AddBookForm onSubmit={handleAddBook} aria-label="Add new book form"> {/* WCAG: Ajouté aria-label pour accessibilité */}
        <Input
          type="text"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          placeholder="Enter book title"
          aria-label="Book title input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="text"
          value={newBook.description}
          onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          placeholder="Enter book description"
          aria-label="Book description input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files[0])}
          aria-label="Book cover image upload" // WCAG: Ajouté aria-label pour accessibilité
        />
        <AddButton type="submit" aria-label="Add book button"> {/* WCAG: Ajouté aria-label pour accessibilité */}
          <FaPlus /> Add Book
        </AddButton>
      </AddBookForm>
      {error && <div style={{ color: "red" }} role="alert">{error}</div>} {/* WCAG: Ajouté role="alert" pour accessibilité */}
      <BooksTable aria-label="Books table"> {/* WCAG: Ajouté aria-label pour accessibilité */}
        <thead>
          <tr>
            <TableHeader>Title</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Cover Image</TableHeader>
            <TableHeader>Views</TableHeader>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.description}</TableCell>
              <TableCell>
                {book.coverImage && <img src={book.coverImage} alt={`Cover of ${book.title}`} style={{ maxWidth: "100px" }} // WCAG: Ajouté alt descriptif
                />}
              </TableCell>
              <TableCell>{book.views}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </BooksTable>
      <SaveButton
        onClick={async () => {
          try {
            const token = Cookies.get("session_token");
            const originalBooks = await axios.get("http://localhost:5000/api/books", {
              headers: { Authorization: `Bearer ${token}` },
            }).then(res => res.data);
            const updatedBooks = books.filter(book => {
              const original = originalBooks.find(b => b.id === book.id);
              return original && (book.title !== original.title || book.description !== original.description || book.views !== original.views);
            });
            for (const book of updatedBooks) {
              await axios.put(`http://localhost:5000/api/books/${book.id}`, book, {
                headers: { Authorization: `Bearer ${token}` },
              });
            }
            if (updatedBooks.length > 0) {
              console.log("Changes saved to database:", updatedBooks);
            } else {
              console.log("No changes to save");
            }
          } catch (err) {
            console.error("Error saving changes:", err);
          }
        }}
        aria-label="Save changes button" // WCAG: Ajouté aria-label pour accessibilité
      >
        Save Changes
      </SaveButton>
    </section>
  );
}

export default Books;
import React, { useState, useEffect } from "react"; // Importe React et ses hooks : useState pour gérer les états locaux, useEffect pour les effets de côté comme les appels API
import { useParams } from "react-router-dom"; // Importe useParams pour récupérer les paramètres de l'URL, comme :title dans /manga/:title
import styled from "styled-components"; // Importe styled-components pour créer des composants stylés avec CSS-in-JS
import axios from "axios"; // Importe axios pour faire des requêtes HTTP au backend (ex. /api/manga/:title)
import Header from "../../components/common/Header"; // Importe le composant Header pour l'afficher en haut de la page
import Footer from "../../components/common/Footer"; // Importe le composant Footer pour l'afficher en bas de la page
import { Link } from "react-router-dom"

// Style global pour le fond de la page, appliqué à un div enveloppant tout le contenu
const GlobalStyle = styled.div`
  background-color: #182032; /* Même fond que Home.jsx pour cohérence visuelle */
  min-height: 100vh; /* Assure que le fond couvre toute la hauteur de la vue, même si le contenu est court */
`;

// Conteneur principal centré avec marges, pour le contenu de la page manga
const MangaPageContainer = styled.div`
  padding: 20px; /* Espace interne autour du contenu */
  max-width: 1240px; /* Largeur maximale alignée avec les sections de Home.jsx */
  margin: 80px auto 40px; /* Marge en haut pour éviter le chevauchement avec Header, centré horizontalement, marge en bas pour Footer */
`;

// Conteneur pour la section couverture + titre, utilisant flexbox pour alignement horizontal
const MangaHeader = styled.div`
  display: flex; /* Active flexbox pour aligner les enfants côte à côte */
  align-items: flex-start; /* Aligne les éléments en haut (couverture et infos) */
  gap: 20px; /* Espace entre la couverture et les infos (titre, etc.) */
  margin-bottom: 40px; /* Marge sous la section pour séparer du reste de la page */
`;

// Couverture du manga, stylée comme une image
const MangaCover = styled.img`
  width: auto; /* Largeur automatique pour conserver les proportions */
  height: 300px; /* Hauteur fixe pour rendre l'image plus grande que dans Home.jsx */
  border-radius: 10px; /* Coins arrondis pour un look moderne */
`;

// Conteneur pour couverture et note
const CoverContainer = styled.div`
  display: flex;
  flex-direction: column; // Alignement vertical
  align-items: flex-start;
`;

// Conteneur pour les infos (titre, auteur, etc.), utilisant flexbox en colonne
const MangaInfo = styled.div`
  display: flex; /* Active flexbox */
  flex-direction: column; /* Aligne les enfants verticalement (titre au-dessus de l'auteur) */
`;

// Titre du manga
const MangaTitle = styled.h2`
  font-family: "Montserrat", sans-serif; /* Police Montserrat pour cohérence avec les titres dans Home.jsx */
  font-weight: bold; /* Gras pour le titre */
  color: white; /* Couleur blanche sur fond sombre */
  font-size: 24px; /* Taille pour prominence, plus grand que les textes normaux */
  margin: 0; /* Pas de marge par défaut */
`;

// Auteur du manga
const MangaAuthor = styled.p`
  font-family: "Montserrat", sans-serif; // Police Montserrat pour cohérence
  font-weight: normal; // Regular pour le texte normal
  color: white; // Blanc sur fond sombre
  opacity: 0.6; // Opacité 60% comme demandé
  font-size: 16px; // Plus petit que le titre pour hiérarchie visuelle
  margin: 5px 0 0; // Petit espace au-dessus pour séparation du titre
`;

// Résumé du manga
const MangaDescription = styled.p`
  font-family: "Lora", serif; // Police Lora pour le texte descriptif
  color: white; // Blanc sur fond sombre
  font-size: 14px; // Taille standard pour le texte
  margin: 10px 0 0; // Espace au-dessus pour séparation de l'auteur
`;

// Biographie de l'auteur
const MangaBiography = styled.p`
  font-family: "Lora", serif; // Police Lora pour le texte descriptif
  color: white; // Blanc sur fond sombre
  opacity: 0.8; // Opacité 80% pour lisibilité sans être trop fade
  font-size: 14px; // Taille standard pour le texte
  margin: 10px 0 0; // Espace au-dessus pour séparation du résumé
`;

// Conteneur pour les boutons (sur la même ligne)
const ButtonsContainer = styled.div`
  display: flex; // Flexbox pour aligner les boutons horizontalement
  gap: 10px; // Espace entre les boutons
  margin: 10px 0 20px; // Marge au-dessus de l'auteur et en bas avant le résumé
`;

// Bouton base réutilisable
const Button = styled.button`
  border-radius: 10px; // Radius comme demandé
  border: none; // Pas de bordure
  padding: 10px 15px; // Espace interne
  font-family: "Lora", serif; // Police Lora pour cohérence
  color: white; // Texte blanc
  font-size: 14px; // Taille standard
  cursor: pointer; // Curseur main au survol
  &:hover {
    opacity: 0.8; // Effet hover comme dans Header
  }
`;

// Bouton Start Reading (couleur spécifique)
const StartButton = styled(Button)`
  background-color: #518cc7; // Bleu comme demandé
`;

// Boutons secondaires (Favourites, Bookmarks)
const SecondaryButton = styled(Button)`
  background-color: #424c61; // Gris comme demandé
`;

// Box pour la note moyenne
const RatingBox = styled.div`
  background-color: #424c61;
  border-radius: 10px;
  padding: 15px; // Plus grand pour inclure étoiles
  margin-top: 10px;
  text-align: center;
  font-family: "Lora", serif;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px; // Espace entre note et reviews
`;

const RatingValue = styled.div`
  font-size: 24px; // Note en gros
  font-weight: bold;
`;

const ReviewCount = styled.div`
  font-size: 12px; // Reviews en petit
  opacity: 0.8;
`;

const StarRating = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 10px;
`;

const Star = styled.span`
  font-size: 20px;
  color: ${(props) => (props.$filled ? "#FFD700" : "#424C61")}; // Or pour étoile remplie, gris sinon
  cursor: pointer;
`;

const ChaptersBox = styled.div`
  background-color: #101726;
  border-radius: 10px;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

const ChaptersHeader = styled.div`
  background-color: #1B2335;
  padding: 10px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const ChapterItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  border-bottom: 1px solid #424c61;
`;

const CommentsBox = styled.div`
  background-color: #101726;
  border-radius: 10px;
  margin-top: 20px;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden; // Ajoute ça pour supprimer le scrolling horizontal (empêche le débordement latéral)
  &::-webkit-scrollbar { // Ajoute ça pour styliser la barre verticale (pour Chrome, Firefox, etc.)
    width: 8px; // Largeur de la barre, plus fine et jolie
  }
  &::-webkit-scrollbar-track { // Fond de la barre
    background: #1B2335; // Couleur foncée pour matcher l'en-tête
  }
  &::-webkit-scrollbar-thumb { // La partie glissante de la barre
    background: #424C61; // Gris pour matcher les boutons
    border-radius: 4px; // Arrondi pour un look moderne
  }
`;

const CommentsHeader = styled.div`
  background-color: #1B2335;
  padding: 10px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const CommentItem = styled.div`
  padding: 10px;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  border-bottom: 1px solid #424c61;
  margin-left: ${props => props.$level * 20}px;
  display: flex;
  flex-direction: column;
`;

const CommentPseudo = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const CommentDate = styled.div`
  font-size: 10px;
  opacity: 0.6;
  margin-top: 5px;
`;

const ReplyText = styled.span`
  font-family: "Lora", serif;
  color: #424C61;
  font-size: 12px;
  cursor: pointer;
  margin-top: 5px;
  &:hover {
    text-decoration: underline;
  }
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
  font-family: "Lora", serif;
  background-color: #101726;
  color: white;
`;

const CommentForm = styled.div`
  position: sticky; // Fixe l'input et bouton en bas de la box
  bottom: 0; // Au bas de CommentsBox
  background-color: #101726; // Fond pour matcher la box
  padding: 10px; // Espace interne
  border-top: 1px solid #424c61; // Barre grise au-dessus pour séparation
`;

function MangaPage() {
  const { title } = useParams(); // Récupère le paramètre :title de l'URL (ex. "Naruto" pour /manga/Naruto)
  const [manga, setManga] = useState(null); // État pour stocker les détails du manga (title, description, etc.) récupérés du backend
  const [error, setError] = useState(""); // État pour stocker les messages d'erreur (ex. "Manga not found")

  const [userRating, setUserRating] = useState(0); // État pour la note utilisateur
  const [chapters, setChapters] = useState([]);

  const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");
const [replyTo, setReplyTo] = useState(null);
const [replyInputs, setReplyInputs] = useState({}); // État pour montrer/cacher inputs de reply par id_review (ex. {1: true} pour montrer sous comment 1)

const [isFavorite, setIsFavorite] = useState(false); // État pour vérifier si manga est favori
const [isBookmarked, setIsBookmarked] = useState(false); // État pour vérifier si manga est bookmarked

  const handleStarClick = async (rating) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token for review:", token); // Ajouté pour déboguer
      if (!token) return alert("Please login first");
      await axios.post(
        "http://localhost:5000/api/reviews/add",
        { book_id: manga.id_book, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserRating(rating);
      const response = await axios.get(`http://localhost:5000/api/manga/${title}`);
      setManga(response.data.manga);
    } catch (err) {
      alert(err.response?.data?.error || "Error adding rating");
    }
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first");
      await axios.post(
        "http://localhost:5000/api/reviews",
        { book_id: manga.id_book, comment: newComment, parent_id: replyTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      setReplyTo(null);
      setReplyInputs(prev => ({ ...prev, [replyTo]: false })); // Cache l'input après envoi de la réponse
      const response = await axios.get(`http://localhost:5000/api/reviews/${manga.id_book}`);
setComments(buildCommentTree(response.data)); // Ajout de buildCommentTree pour organiser en arbre après l'ajout

    } catch (err) {
      alert(err.response?.data?.error || "Error adding comment");
    }
  };

  const buildCommentTree = (comments) => {
    const map = {};
    const tree = [];
    comments.forEach(comment => {
      map[comment.id_review] = { ...comment, replies: [] };
    });
    comments.forEach(comment => {
      if (comment.parent_id) {
        map[comment.parent_id]?.replies.push(map[comment.id_review]);
      } else {
        tree.push(map[comment.id_review]);
      }
    });
    return tree;
  };

  
// Remplace useEffect
useEffect(() => {
  async function fetchManga() {
    try {
      const response = await axios.get(`http://localhost:5000/api/manga/${title}`);
      setManga(response.data.manga);
      console.log("Chapters from API:", response.data.chapters);
      setChapters(response.data.chapters || [{ id_chapter: 1, chapter_number: 1 }]);
      setError("");
      if (response.data.manga.id_book) {
        const fetchComments = async () => {
          try {
            const commentResponse = await axios.get(`http://localhost:5000/api/reviews/${response.data.manga.id_book}`);
            setComments(buildCommentTree(commentResponse.data));
          } catch (err) {
            console.error("Error fetching comments:", err);
          }
        };
        const fetchFavoritesAndBookmarks = async () => {
          try {
            const token = localStorage.getItem("token");
            if (token) {
              const [favResponse, bookmarkResponse] = await Promise.all([
                axios.get(`http://localhost:5000/api/favorites/${response.data.manga.id_book}`, {
                  headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:5000/api/bookmarks/${response.data.manga.id_book}`, {
                  headers: { Authorization: `Bearer ${token}` }
                })
              ]);
              setIsFavorite(favResponse.data.isFavorite); // true si dans favoris
              setIsBookmarked(bookmarkResponse.data.isBookmarked); // true si dans bookmarks
            }
          } catch (err) {
            console.error("Error fetching favorites/bookmarks:", err);
          }
        };
        fetchComments();
        fetchFavoritesAndBookmarks();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  }
  fetchManga();
}, [title]);

    // Fonction pour ajouter aux favoris
const handleAddFavorite = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token used:", token);
    if (!token) return alert("Please login first");
    if (isFavorite) {
      await axios.delete(`http://localhost:5000/api/favorites/remove/${manga.id_book}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(false);
      alert("Removed from favorites");
    } else {
      await axios.post(
        "http://localhost:5000/api/favorites/add",
        { book_id: manga.id_book },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavorite(true);
      alert("Added to favorites");
    }
  } catch (err) {
    alert(err.response?.data?.error || "Error updating favorites");
  }
};

// Remplace handleAddBookmark
const handleAddBookmark = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token used:", token);
    if (!token) return alert("Please login first");
    if (isBookmarked) {
      await axios.delete(`http://localhost:5000/api/bookmarks/remove/${manga.id_book}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsBookmarked(false);
      alert("Removed from bookmarks");
    } else {
      await axios.post(
        "http://localhost:5000/api/bookmarks/add",
        { book_id: manga.id_book },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsBookmarked(true);
      alert("Added to bookmarks");
    }
  } catch (err) {
    alert(err.response?.data?.error || "Error updating bookmarks");
  }
};

  // Si erreur (ex. manga non trouvé), affiche un message d'erreur
  if (error) {
    return (
      <GlobalStyle>
        <Header />
        <MangaPageContainer>
          <MangaTitle>Error</MangaTitle>
          <p>{error}</p> /* Affiche le message d'erreur */
        </MangaPageContainer>
        <Footer />
      </GlobalStyle>
    );
  }

  // Si manga pas encore chargé, affiche un message de chargement
  if (!manga) {
    return (
      <GlobalStyle>
        <Header />
        <MangaPageContainer>
          <MangaTitle>Loading...</MangaTitle>
        </MangaPageContainer>
        <Footer />
      </GlobalStyle>
    );
  }

  // Affichage normal quand les données sont prêtes
  return (
    <GlobalStyle>
      <Header />
      <MangaPageContainer>
      <MangaHeader>
      <CoverContainer>
  <MangaCover
    src={`http://localhost:5000/mangas/${manga.title}/cover${manga.title}.jpg`}
    alt={manga.title}
  />
  <RatingBox>
    <RatingValue>{manga.avg_rating}/10</RatingValue>
    <ReviewCount>by {manga.review_count} reviews</ReviewCount>
    <StarRating>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          $filled={userRating >= star * 2}
          onClick={() => handleStarClick(star * 2)}
        >
          ★
        </Star>
      ))}
    </StarRating>
  </RatingBox>
</CoverContainer>
  <MangaInfo>
  <MangaTitle>{manga.title}</MangaTitle>
  <MangaAuthor>
  {manga.authors && manga.authors.length > 0
    ? manga.authors.map(author => author.name).join(", ") 
    : "Unknown Author"}
</MangaAuthor>
<ButtonsContainer>
  <StartButton onClick={() => alert("Start Reading - Placeholder")}>START READING</StartButton>
  <SecondaryButton onClick={handleAddFavorite}>
    {isFavorite ? "REMOVE FAVOURITES" : "SET FAVOURITES"}
  </SecondaryButton>
  <SecondaryButton onClick={handleAddBookmark}>
    {isBookmarked ? "REMOVE BOOKMARK" : "BOOKMARKS"}
  </SecondaryButton>
</ButtonsContainer>
  <MangaDescription>{manga.description}</MangaDescription>
  <MangaBiography>
    {manga.authors && manga.authors.length > 0
      ? manga.authors[0].biography
      : "No biography available"}
  </MangaBiography>
</MangaInfo>
        </MangaHeader>
        <ChaptersBox>
  <ChaptersHeader>Chapters</ChaptersHeader>
  {chapters.length ? (
    chapters.map((chapter) => (
      <ChapterItem key={chapter.id_chapter}>
        <Link to={`/manga/${manga.title}/${chapter.chapter_number}`}>
          <span>Chapter {chapter.chapter_number}</span>
        </Link>
        <span>No date available</span>
      </ChapterItem>
    ))
  ) : (
    <ChapterItem>No chapters available</ChapterItem>
  )}
</ChaptersBox>
<CommentsBox>
  <CommentsHeader>Comments</CommentsHeader>
  {comments.length ? (
    comments.map((comment) => (
      <div key={comment.id_review}>
        <CommentItem $level={0}>
          <CommentPseudo>{comment.pseudo}</CommentPseudo>
          <span>{comment.comment}</span>
          <CommentDate>{new Date(comment.submission_date).toLocaleDateString()}</CommentDate>
          <ReplyText onClick={() => { setReplyTo(comment.id_review); setReplyInputs(prev => ({ ...prev, [comment.id_review]: true })); }}>Reply</ReplyText>
          {replyInputs[comment.id_review] && ( 
            <CommentForm>
              <CommentInput
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
              />
              <Button style={{ backgroundColor: "#424C61" }} onClick={handleAddComment}>Post Reply</Button>
            </CommentForm>
          )}
        </CommentItem>
        {comment.replies.map((reply) => (
          <CommentItem key={reply.id_review} $level={1}>
            <CommentPseudo>{reply.pseudo}</CommentPseudo>
            <span>{reply.comment}</span>
            <CommentDate>{new Date(reply.submission_date).toLocaleDateString()}</CommentDate>
            <ReplyText onClick={() => { setReplyTo(reply.id_review); setReplyInputs(prev => ({ ...prev, [reply.id_review]: true })); }}>Reply</ReplyText>
            {replyInputs[reply.id_review] && (
              <CommentForm>
                <CommentInput
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                />
                <Button style={{ backgroundColor: "#424C61" }} onClick={handleAddComment}>Post Reply</Button>
              </CommentForm>
            )}
          </CommentItem>
        ))}
      </div>
    ))
  ) : (
    <CommentItem $level={0}>No comments available</CommentItem>
  )}
  <CommentForm> 
    <CommentInput
      type="text"
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
    />
    <Button style={{ backgroundColor: "#424C61" }} onClick={handleAddComment}>Post Comment</Button>
  </CommentForm> 
</CommentsBox>
      </MangaPageContainer>
      <Footer />
    </GlobalStyle>
  );
}

export default MangaPage;
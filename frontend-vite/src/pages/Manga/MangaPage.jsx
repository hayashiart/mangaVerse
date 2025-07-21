import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const GlobalStyle = styled.div`
  background-color: #182032;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const MangaPageContainer = styled.main`
  padding: 20px;
  max-width: 1240px;
  margin: 80px auto 40px;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 60px 10px 20px;
    padding: 10px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    max-width: 800px;
  }
`;

const MangaHeader = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;

const MangaCover = styled.img`
  width: auto;
  height: 300px;
  border-radius: 10px;

  @media (max-width: 768px) {
    height: 200px;
    width: 100%;
  }
`;

const CoverContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
  }
`;

const MangaInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MangaTitle = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 24px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const MangaAuthor = styled.p`
  font-family: "Montserrat", sans-serif;
  font-weight: normal;
  color: white;
  opacity: 0.87;
  font-size: 16px;
  margin: 5px 0 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  & button {
    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

const Button = styled.button`
  border-radius: 10px;
  border: none;
  padding: 10px 15px;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  cursor: pointer;
  outline: 2px solid transparent;
  outline-offset: 2px;

  &:hover,
  &:focus {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 10px;
    font-size: 12px;
  }
`;

const StartButton = styled(Button)`
  background-color: #518cc7;
`;

const SecondaryButton = styled(Button)`
  background-color: #424c61;
`;

const RatingBox = styled.div`
  background-color: #424c61;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  text-align: center;
  font-family: "Lora", serif;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  @media (max-width: 768px) {
    padding: 10px;
    width: 100%;
  }
`;

const RatingValue = styled.div`
  font-size: 24px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ReviewCount = styled.div`
  font-size: 12px;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 10px;

  @media (max-width: 768px) {
    gap: 3px;
  }
`;

const Star = styled.span`
  font-size: 20px;
  color: ${(props) => (props.$filled ? "#FFD700" : "#424C61")};
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ChaptersBox = styled.section`
  background-color: #101726;
  border-radius: 10px;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;

  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

const ChaptersHeader = styled.h2`
  background-color: #1B2335;
  padding: 10px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const ChapterItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  border-bottom: 1px solid #424c61;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px;
    flex-direction: column;
    gap: 5px;
  }
`;

const CommentsBox = styled.section`
  background-color: #101726;
  border-radius: 10px;
  margin-top: 20px;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    max-height: 400px;
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #1B2335;
  }
  &::-webkit-scrollbar-thumb {
    background: #424C61;
    border-radius: 4px;
  }
`;

const CommentsHeader = styled.h2`
  background-color: #1B2335;
  padding: 10px;
  font-family: "Lora", serif;
  color: white;
  font-size: 16px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const CommentItem = styled.article`
  padding: 10px;
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  border-bottom: 1px solid #424c61;
  margin-left: ${props => props.$level * 20}px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px;
    margin-left: ${props => props.$level * 10}px;
  }
`;

const CommentPseudo = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const CommentDate = styled.div`
  font-size: 10px;
  opacity: 0.6;
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 8px;
  }
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

  @media (max-width: 768px) {
    font-size: 10px;
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

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 12px;
  }
`;

const CommentForm = styled.form`
  position: sticky;
  bottom: 0;
  background-color: #101726;
  padding: 10px;
  border-top: 1px solid #424c61;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const MangaDescription = styled.p`
  font-family: "Lora", serif;
  color: white;
  font-size: 14px;
  margin: 10px 0 0;
`;

const MangaBiography = styled.p`
  font-family: "Lora", serif;
  color: white;
  opacity: 0.8;
  font-size: 14px;
  margin: 10px 0 0;
`;

function MangaPage() {
  const { title } = useParams();
  const [manga, setManga] = useState(null);
  const [error, setError] = useState("");

  const [userRating, setUserRating] = useState(0);
  const [chapters, setChapters] = useState([]);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});

  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleStarClick = async (rating) => {
    try {
      const token = Cookies.get("session_token");
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("session_token");
      if (!token) return alert("Please login first");
      await axios.post(
        "http://localhost:5000/api/reviews",
        { book_id: manga.id_book, comment: newComment, parent_id: replyTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      setReplyTo(null);
      setReplyInputs(prev => ({ ...prev, [replyTo]: false }));
      const response = await axios.get(`http://localhost:5000/api/reviews/${manga.id_book}`);
      setComments(buildCommentTree(response.data));
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

  useEffect(() => {
    async function fetchManga() {
      try {
        const response = await axios.get(`http://localhost:5000/api/manga/${title}`);
        setManga(response.data.manga);
        setChapters(response.data.chapters || [{ id_chapter: 1, chapter_number: 1 }]);
        setError("");
        if (response.data.manga?.id_book) {
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
              const token = Cookies.get("session_token");
              if (token) {
                const [favResponse, bookmarkResponse] = await Promise.all([
                  axios.get(`http://localhost:5000/api/favorites/${response.data.manga.id_book}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  }),
                  axios.get(`http://localhost:5000/api/bookmarks/${response.data.manga.id_book}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                ]);
                setIsFavorite(favResponse.data.isFavorite);
                setIsBookmarked(bookmarkResponse.data.isBookmarked);
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

  const handleAddFavorite = async () => {
    try {
      const token = Cookies.get("session_token");
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

  const handleAddBookmark = async () => {
    try {
      const token = Cookies.get("session_token");
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

  return (
    <GlobalStyle>
      <Header />
      <MangaPageContainer>
        {/* WCAG: Ajouté aria-label pour accessibilité */}
        {manga ? (
          <MangaHeader aria-label={`Manga page for ${manga.title}`}>
            <CoverContainer>
              <MangaCover
                src={`http://localhost:5000/mangas/${manga.title}/cover${manga.title}.jpg`}
                alt={`${manga.title} cover image`} // WCAG: Ajouté alt descriptif
              />
              <RatingBox>
                <RatingValue>{manga.avg_rating}/10</RatingValue>
                <ReviewCount>by {manga.review_count} reviews</ReviewCount>
                <StarRating>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      $filled={userRating >= star * 2} // WCAG: Propriété pour l'état visuel
                      onClick={() => handleStarClick(star * 2)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStarClick(star * 2); }} // WCAG: Ajouté navigation au clavier
                      tabIndex={0} // WCAG: Ajouté focus clavier
                      aria-label={`Rate ${star * 2} stars for ${manga.title}`} // WCAG: Ajouté description pour accessibilité
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
                <StartButton
                  onClick={() => alert("Start Reading - Placeholder")}
                  onKeyDown={(e) => { if (e.key === 'Enter') alert("Start Reading - Placeholder"); }} // WCAG: Ajouté navigation au clavier
                  tabIndex={0} // WCAG: Ajouté focus clavier
                  aria-label={`Start reading ${manga.title}`} // WCAG: Ajouté description pour accessibilité
                >
                  START READING
                </StartButton>
                <SecondaryButton
                  onClick={handleAddFavorite}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddFavorite(); }} // WCAG: Ajouté navigation au clavier
                  tabIndex={0} // WCAG: Ajouté focus clavier
                  aria-label={`Toggle ${manga.title} as favorite`} // WCAG: Ajouté description pour accessibilité
                >
                  {isFavorite ? "REMOVE FAVOURITES" : "SET FAVOURITES"}
                </SecondaryButton>
                <SecondaryButton
                  onClick={handleAddBookmark}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddBookmark(); }} // WCAG: Ajouté navigation au clavier
                  tabIndex={0} // WCAG: Ajouté focus clavier
                  aria-label={`Toggle ${manga.title} as bookmark`} // WCAG: Ajouté description pour accessibilité
                >
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
        ) : error ? (
          <div role="alert">{error}</div> // WCAG: Ajouté role="alert" pour indiquer une erreur
        ) : (
          <div>Loading...</div> // Indicateur de chargement pendant le fetch
        )}
        <ChaptersBox>
          <ChaptersHeader>Chapters</ChaptersHeader>
          {chapters.length && manga ? (
            chapters.map((chapter) => (
              <ChapterItem key={chapter.id_chapter}>
                <Link
                  to={`/manga/${manga.title}/${chapter.chapter_number}`}
                  aria-label={`Chapter ${chapter.chapter_number} of ${manga.title}`} // WCAG: Ajouté aria-label pour lien
                >
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
          {comments.length && manga ? (
            comments.map((comment) => (
              <div key={comment.id_review}>
                <CommentItem $level={0}>
                  <CommentPseudo>{comment.pseudo}</CommentPseudo>
                  <span>{comment.comment}</span>
                  <CommentDate>{new Date(comment.submission_date).toLocaleDateString()}</CommentDate>
                  <ReplyText
                    onClick={() => { setReplyTo(comment.id_review); setReplyInputs(prev => ({ ...prev, [comment.id_review]: true })); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { setReplyTo(comment.id_review); setReplyInputs(prev => ({ ...prev, [comment.id_review]: true })); } }} // WCAG: Ajouté navigation au clavier
                    tabIndex={0} // WCAG: Ajouté focus clavier
                    aria-label="Reply to comment" // WCAG: Ajouté description pour accessibilité
                  >
                    Reply
                  </ReplyText>
                  {replyInputs[comment.id_review] && (
                    <CommentForm onSubmit={handleAddComment}> {/* WCAG: Ajouté form pour soumission accessible */}
                      <CommentInput
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a reply..."
                        aria-label="Reply input" // WCAG: Ajouté aria-label pour accessibilité
                      />
                      <Button
                        style={{ backgroundColor: "#424C61" }}
                        type="submit"
                        aria-label="Post reply button" // WCAG: Ajouté aria-label pour accessibilité
                      >
                        Post Reply
                      </Button>
                    </CommentForm>
                  )}
                </CommentItem>
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id_review} $level={1}>
                    <CommentPseudo>{reply.pseudo}</CommentPseudo>
                    <span>{reply.comment}</span>
                    <CommentDate>{new Date(reply.submission_date).toLocaleDateString()}</CommentDate>
                    <ReplyText
                      onClick={() => { setReplyTo(reply.id_review); setReplyInputs(prev => ({ ...prev, [reply.id_review]: true })); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { setReplyTo(reply.id_review); setReplyInputs(prev => ({ ...prev, [reply.id_review]: true })); } }} // WCAG: Ajouté navigation au clavier
                      tabIndex={0} // WCAG: Ajouté focus clavier
                      aria-label="Reply to reply" // WCAG: Ajouté description pour accessibilité
                    >
                      Reply
                    </ReplyText>
                    {replyInputs[reply.id_review] && (
                      <CommentForm onSubmit={handleAddComment}> {/* WCAG: Ajouté form pour soumission accessible */}
                        <CommentInput
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a reply..."
                          aria-label="Reply input" // WCAG: Ajouté aria-label pour accessibilité
                        />
                        <Button
                          style={{ backgroundColor: "#424C61" }}
                          type="submit"
                          aria-label="Post reply button" // WCAG: Ajouté aria-label pour accessibilité
                        >
                          Post Reply
                        </Button>
                      </CommentForm>
                    )}
                  </CommentItem>
                ))}
              </div>
            ))
          ) : (
            <CommentItem $level={0}>No comments available</CommentItem>
          )}
          <CommentForm onSubmit={handleAddComment}> {/* WCAG: Ajouté form pour soumission accessible */}
            <CommentInput
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
              aria-label={replyTo ? "Reply input" : "Comment input"} // WCAG: Ajouté aria-label dynamique pour accessibilité
            />
            <Button
              style={{ backgroundColor: "#424C61" }}
              type="submit"
              aria-label="Post comment button" // WCAG: Ajouté aria-label pour accessibilité
            >
              Post Comment
            </Button>
          </CommentForm>
        </CommentsBox>
      </MangaPageContainer>
      <Footer />
    </GlobalStyle>
  );
}

export default MangaPage;
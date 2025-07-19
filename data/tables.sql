CREATE TABLE Categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Administrators (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Librarians (
    id_librarian INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Tags (
    id_tag INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Authors (
    id_author INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    biography TEXT
);

CREATE TABLE Books (
    id_book INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255) NOT NULL,
    views INT DEFAULT 0,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Categories(id_category)
);

CREATE TABLE Chapters (
    id_chapter INT AUTO_INCREMENT PRIMARY KEY,
    chapter_number INT NOT NULL,
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(id_book)
);

CREATE TABLE Chapter_Images (
    id_image INT AUTO_INCREMENT PRIMARY KEY,
    page_number INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    chapter_id INT,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(id_chapter)
);

CREATE TABLE Reviews (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    comment TEXT,
    book_id INT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    submission_date TIMESTAMP NOT NULL,
    librarian_id INT,
    FOREIGN KEY (id_user) REFERENCES Users(id_user),
    FOREIGN KEY (book_id) REFERENCES Books(id_book),
    FOREIGN KEY (librarian_id) REFERENCES Librarians(id_librarian)
);

CREATE TABLE Book_Tags (
    id_book_tag INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    tag_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(id_book),
    FOREIGN KEY (tag_id) REFERENCES Tags(id_tag)
);

CREATE TABLE Book_Authors (
    id_book_author INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    author_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(id_book),
    FOREIGN KEY (author_id) REFERENCES Authors(id_author)
);

-- Table pour les favoris
CREATE TABLE Favorites (
  id_favorite INT AUTO_INCREMENT PRIMARY KEY, /* ID unique auto-incrémenté */
  user_id INT NOT NULL, /* ID de l'utilisateur */
  book_id INT NOT NULL, /* ID du manga */
  FOREIGN KEY (user_id) REFERENCES Users(id_user) ON DELETE CASCADE, /* Supprime les favoris si l'utilisateur est supprimé */
  FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE, /* Supprime les favoris si le manga est supprimé */
  UNIQUE KEY unique_favorite (user_id, book_id) /* Évite les doublons pour un utilisateur/manga */
);

-- Table pour les bookmarks (même structure)
CREATE TABLE Bookmarks (
  id_bookmark INT AUTO_INCREMENT PRIMARY KEY, /* ID unique auto-incrémenté */
  user_id INT NOT NULL, /* ID de l'utilisateur */
  book_id INT NOT NULL, /* ID du manga */
  FOREIGN KEY (user_id) REFERENCES Users(id_user) ON DELETE CASCADE, /* Supprime les bookmarks si l'utilisateur est supprimé */
  FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE, /* Supprime les bookmarks si le manga est supprimé */
  UNIQUE KEY unique_bookmark (user_id, book_id) /* Évite les doublons pour un utilisateur/manga */
);

CREATE TABLE MangaRatings (
  book_id INT PRIMARY KEY,
  avg_rating FLOAT DEFAULT 0.0,
  review_count INT DEFAULT 0,
  user_ids TEXT, -- Pas de DEFAULT pour TEXT
  FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE
);
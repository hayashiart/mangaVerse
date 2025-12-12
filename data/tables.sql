
DROP DATABASE IF EXISTS mangaverse_db;
CREATE DATABASE mangaverse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mangaverse_db;
CREATE TABLE Categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'librarian') DEFAULT 'user' NOT NULL,
    profile_photo VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    cover_image VARCHAR(255) NOT NULL,
    views INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id_category) ON DELETE SET NULL,
    INDEX idx_title (title)
);

-- CHAPITRES : LA BONNE VERSION (book_id au lieu de book_title)
CREATE TABLE Chapters (
    id_chapter INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,                    -- ← LA BONNE CLÉ
    chapter_number INT NOT NULL,
    chapter_title VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Un manga ne peut pas avoir 2 fois le même numéro de chapitre
    UNIQUE KEY unique_chapter_per_book (book_id, chapter_number),
    
    -- Index pour les requêtes rapides
    INDEX idx_book_id (book_id),
    INDEX idx_chapter_number (chapter_number),
    
    -- Si on supprime un manga → tous ses chapitres sont supprimés
    FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Reviews (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    comment TEXT NOT NULL,
    parent_id INT NULL DEFAULT NULL,
    book_id INT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    librarian_id INT NULL,
    FOREIGN KEY (id_user) REFERENCES Users(id_user) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES Reviews(id_review) ON DELETE SET NULL,
    FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE,
    FOREIGN KEY (librarian_id) REFERENCES Users(id_user) ON DELETE SET NULL
);

CREATE TABLE Book_Tags (
    book_id INT,
    tag_id INT,
    PRIMARY KEY (book_id, tag_id),
    FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(id_tag) ON DELETE CASCADE
);

CREATE TABLE Book_Authors (
    book_id INT,
    author_id INT,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES Authors(id_author) ON DELETE CASCADE
);

CREATE TABLE Favorites (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES Users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE
);

CREATE TABLE Bookmarks (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES Users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE
);

CREATE TABLE MangaRatings (
    book_id INT PRIMARY KEY,
    avg_rating FLOAT DEFAULT 0.0,
    review_count INT DEFAULT 0,
    user_ids TEXT,
    user_ratings TEXT,
    FOREIGN KEY (book_id) REFERENCES Books(id_book) ON DELETE CASCADE
);
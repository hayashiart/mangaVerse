-- Catégories
INSERT INTO Categories (name) VALUES
('Shonen'), ('Shojo'), ('Seinen'), ('Comics'), ('European Comics');

-- Utilisateurs
INSERT INTO Users (pseudo, email, password) VALUES
('narutoFan', 'user1@gmail.com', 'password123!'),
('sailorMoonLover', 'user2@gmail.com', 'password123!'),
('berserkKing', 'user3@gmail.com', 'password123!');

-- Administrateurs
INSERT INTO Administrators (email, password) VALUES
('admin1@gmail.com', 'password123!'), ('admin2@gmail.com', 'password123!');

-- Bibliothécaires
INSERT INTO Librarians (email, password) VALUES
('librarian1@gmail.com', 'password123!'), ('librarian2@gmail.com', 'password123!');

-- Tags
INSERT INTO Tags (name) VALUES
('Action'), ('Romance'), ('Fantasy'), ('Horror'), ('Adventure');

-- Auteurs
INSERT INTO Authors (name, biography) VALUES
('Masashi Kishimoto', 'Creator of Naruto, known for epic ninja tales.'),
('Naoko Takeuchi', 'Creator of Sailor Moon, a legend of Shojo.'),
('Kentaro Miura', 'Author of Berserk, master of dark fantasy.'),
('Stan Lee', 'Legend of comics, co-creator of Spider-Man.'),
('Hergé', 'Creator of Tintin, icon of European comics.');

-- Livres
INSERT INTO Books (title, description, cover_image, views, category_id) VALUES
('Naruto', 'The story of a determined ninja aiming to become Hokage.', 'default_cover.jpg', 1000, 1),
('Sailor Moon', 'A magical girl saga.', 'sailor_moon_cover.jpg', 800, 2),
('Berserk', 'A dark fantasy epic.', 'berserk_cover.jpg', 1200, 3);

-- Relations
INSERT INTO Book_Tags (book_id, tag_id) VALUES
(1, 1), (1, 3), (2, 2), (3, 3);
INSERT INTO Book_Authors (book_id, author_id) VALUES
(1, 1), (2, 2), (3, 3);
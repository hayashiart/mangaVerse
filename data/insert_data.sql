USE mangaverse_db;

-- Catégories
INSERT INTO Categories (name) VALUES ('Shonen'), ('Shojo'), ('Seinen'), ('Comics'), ('European Comics');

-- LES 3 COMPTES – MOT DE PASSE Seb12345! (hash généré sur TA machine)
INSERT INTO Users (pseudo, email, password, role) VALUES
('Sebastien',  'user@gmail.com',        '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'user'),
('Admin',      'admin@gmail.com',       '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'admin'),
('Librarian',  'librarian@gmail.com',   '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'librarian');

-- Quelques mangas
INSERT INTO Authors (name) VALUES ('Masashi Kishimoto'), ('Naoko Takeuchi'), ('Kentaro Miura');

INSERT INTO Books (title, description, cover_image, views, category_id) VALUES
('Naruto',      'Un jeune ninja qui rêve de devenir Hokage',         'naruto.jpg',     1500, 1),
('Sailor Moon', 'Des lycéennes qui se transforment en guerrières',   'sailormoon.jpg', 1200, 2),
('Berserk',     'L’épopée sombre de Guts et Griffith',               'berserk.jpg',    2000, 3);

INSERT INTO Book_Authors (book_id, author_id) VALUES (1,1),(2,2),(3,3);
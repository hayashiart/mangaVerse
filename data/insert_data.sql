USE mangaverse_db;

-- Catégories
INSERT INTO Categories (name) VALUES ('Shonen'), ('Shojo'), ('Seinen'), ('Comics'), ('European Comics');

-- LES 3 COMPTES – MOT DE PASSE Seb12345! (hash généré sur TA machine)
INSERT INTO Users (pseudo, email, password, role) VALUES
('Sebastien',  'user@gmail.com',        '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'user'),
('Admin',      'admin@gmail.com',       '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'admin'),
('Librarian',  'librarian@gmail.com',   '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'librarian');

USE mangaverse_db;

-- Catégories
INSERT INTO Categories (name) VALUES 
('Shonen'), ('Shojo'), ('Seinen');

-- Utilisateurs
INSERT INTO Users (pseudo, email, password, role) VALUES
('Sebastien', 'user@gmail.com',      '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'user'),
('Admin',     'admin@gmail.com',     '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'admin'),
('Librarian', 'librarian@gmail.com', '$2b$10$qllJ7NzbLDMW/Ad/DhEPMuYGMs9/K1808Dxejht6cX0XlFara4FqW', 'librarian');

-- Auteurs avec biographies
INSERT INTO Authors (name, biography) VALUES
('Masashi Kishimoto', 
 'Masashi Kishimoto is a Japanese manga artist best known for creating the Naruto series, which has become one of the best-selling manga of all time. Born in 1974 in Okayama, Japan, he began drawing from a young age and debuted with the one-shot "Karakuri" in 1995. Naruto ran from 1999 to 2014 and spawned a massive franchise including anime, movies, and games. He is also the creator of Samurai 8: The Tale of Hachimaru.'),

('Naoko Takeuchi', 
 'Naoko Takeuchi is a renowned Japanese manga artist famous for creating Sailor Moon, one of the most influential magical girl series in history. Born in 1967 in Kofu, Japan, she studied chemistry before pursuing manga. Sailor Moon, serialized from 1991 to 1997, revolutionized the genre by combining action, romance, and female empowerment. The series has sold over 35 million copies worldwide and inspired a global phenomenon.'),

('Kentaro Miura', 
 'Kentaro Miura (1966–2021) was a legendary Japanese manga artist known for Berserk, widely regarded as one of the greatest dark fantasy manga ever created. His intricate artwork and deep storytelling set new standards in the seinen genre. Berserk began serialization in 1989 and continued until his passing in 2021. Miura''s attention to detail and philosophical themes made him a master of the medium.'),

('Eiichiro Oda', 
 'Eiichiro Oda is the creator of One Piece, the best-selling manga series in history with over 500 million copies in circulation. Born in 1975 in Kumamoto, Japan, he started drawing manga at age 4 and debuted professionally at 17. One Piece began in 1997 and is still ongoing, known for its epic world-building, memorable characters, and themes of friendship and adventure.');

-- Mangas avec descriptions détaillées
INSERT INTO Books (title, description, cover_image, views, category_id) VALUES
('Naruto', 
 'Naruto Uzumaki is a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village. The story follows his growth as he faces powerful enemies, discovers his past, and protects his friends. A tale of perseverance, friendship, and redemption.',
 'naruto.jpg', 3500, 1),

('Sailor Moon', 
 'Usagi Tsukino is an ordinary schoolgirl who discovers she is Sailor Moon, a legendary warrior destined to protect Earth from evil. Along with her fellow Sailor Guardians, she battles dark forces while balancing teenage life, love, and friendship.',
 'sailormoon.jpg', 2200, 2),

('Berserk', 
 'In a dark medieval world, Guts, a lone mercenary wielding a massive sword, fights for survival against demonic forces. Betrayed by his closest friend, he embarks on a brutal journey of revenge and self-discovery in a merciless universe.',
 'berserk.jpg', 2800, 3),

('One Piece', 
 'Monkey D. Luffy, a young pirate with a rubber body, sets out to find the legendary treasure known as "One Piece" to become the Pirate King. With his diverse crew, the Straw Hat Pirates, he adventures across the seas facing powerful enemies and uncovering ancient mysteries.',
 'onepiece.jpg', 4500, 1);

-- Liaison auteurs / mangas
INSERT INTO Book_Authors (book_id, author_id) VALUES
(1, 1), -- Naruto → Masashi Kishimoto
(2, 2), -- Sailor Moon → Naoko Takeuchi
(3, 3), -- Berserk → Kentaro Miura
(4, 4); -- One Piece → Eiichiro Oda
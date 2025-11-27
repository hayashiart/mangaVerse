

# MangaVerse – Full-Stack Manga Reader
**Your complete, beautiful and professional manga reading platform**


## Project Description
MangaVerse is a modern, full-featured manga (scanlation) platform with everything you need:

- Smooth reading experience (long-strip + pagination)
- Favorites & bookmarks system
- User profile with avatar
- Complete admin + librarian panel (manage manga, chapters, users, tags, categories)
- Secure registration / login (JWT + bcrypt)
- Nested comments with replies and moderation
- Dark theme, fully responsive & accessible
- Simple & reliable local file storage

Ready to run in 2 minutes and deploy for free!

## Features
- Home page with trending & latest chapters
- Manga search
- Full-screen reader (zoom, scroll, keyboard navigation)
- Favorites & bookmarks
- Nested comments + replies
- Admin panel (add/edit/delete manga, chapters, users)
- Cover & chapter page upload (drag & drop ready)
- Role system (user / librarian / admin)
- Simple captcha on registration
- Perfect mobile experience (burger menu)

## Demo Content Already Included

The `backend/mangas/` folder already contains 4 complete manga ready to read:

```
backend/mangas/
├── Berserk/      → cover + chapter1/chapter2/chapter3 (80+ pages)
├── Naruto/       → cover + chapters 1 to 7
├── OnePiece/     → cover + multiple chapters
└── SailorMoon/   → cover + chapters
```

You can start reading immediately after launch – just log in with one of the test accounts below.

## Project Structure
```
mangaVerse/
├── backend/
│   ├── mangas/           (4 demo manga included)
│   ├── uploads/          (profile avatars)
│   ├── routes/, middlewares/, utils/
│   ├── app.js, db.js
│   └── Dockerfile
│
├── frontend-vite/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── assets/
│   ├── public/
│   ├── Dockerfile
│   └── nginx.conf
│
├── data/
│   ├── tables.sql
│   └── insert_data.sql
│
├── docker-compose.yml
└── README.md
```

## Prerequisites
- Git
- Docker + Docker Compose (strongly recommended)
- Node.js 18+ (only if running without Docker)

## Quick Start – Docker (Recommended)
```bash
git clone https://github.com/hayashiart/mangaVerse.git
cd mangaVerse
docker-compose up --build
```

Then open:
- http://localhost
- https://localhost (accept the self-signed certificate once)

The 4 demo manga are instantly available!

### Test Accounts (pre-created)
| Role         | Email                  | Password   |
|--------------|------------------------|------------|
| Admin        | admin@gmail.com        | Seb12345!  |
| Librarian    | librarian@gmail.com    | Seb12345!  |
| Regular User | user@gmail.com         | Seb12345!  |

Log in with the admin account to access the full admin panel.

## Development Without Docker
```bash
# Terminal 1 – MySQL
docker run --name mysql-mangaverse -e MYSQL_ROOT_PASSWORD=Seb12345! \
  -e MYSQL_DATABASE=mangaverse_db -p 3306:3306 -d mysql:8.0

# Terminal 2 – Backend
cd backend
cp .env.example .env
npm install
npm start                 # HTTPS on port 5000

# Terminal 3 – Frontend
cd ../frontend-vite
cp .env.example .env
npm install
npm run dev               # https://localhost:1234
```

### Environment Files

**backend/.env**
```env
DB_HOST=db                  # "db" with Docker, "localhost" without
DB_USER=root
DB_PASSWORD=Seb12345!
DB_NAME=mangaverse_db
JWT_SECRET=super_long_random_secret_change_in_production_123456789
NODE_ENV=production
PORT=5000
```

**frontend-vite/.env** (local dev)
```env
VITE_API_URL=http://localhost:5000/api
```

In production / Docker:
```env
VITE_API_URL=/api
```

## Production Deployment – Free & Easy
1. Push to GitHub
2. Go to Railway.app (or Render / Fly.io)
3. New Project → Deploy from GitHub → select your repo
4. Railway auto-detects docker-compose.yml
5. Add the same variables as backend/.env

→ Live HTTPS URL in under 5 minutes!

## Upcoming Features (already prepared)
- Drag & drop chapter upload
- Page reordering with drag & drop
- Cloudflare R2 integration (unlimited free storage)
- Light/Dark mode toggle
- Push notifications (Firebase)
- Full-text search

## License
MIT License – see the LICENSE file for details.

---
**MangaVerse** 
```markdown
# MangaVerse – Full-Stack Manga Reader
**Your complete, beautiful and professional manga reading platform**

Final version – November 2025  
Built by you (with a little help from Grok)

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

## Demo Content Already Included!

The `backend/mangas/` folder already contains 4 complete manga ready to read:

```
backend/mangas/
├── Berserk/      → cover + chapter1/chapter2/chapter3 (80+ pages)
├── Naruto/       → cover + chapters 1 to 7
├── OnePiece/     → cover + multiple chapters
└── SailorMoon/   → cover + chapters
```

You can read them immediately after launch.  
Of course, you (or the admin) can add as many manga as you want later.

## Project Structure

```
mangaVerse/
├── backend/
│   ├── mangas/           ← 4 demo manga already included
│   │   ├── Berserk/
│   │   ├── Naruto/
│   │   ├── OnePiece/
│   │   └── SailorMoon/
│   ├── uploads/          ← Profile pictures
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

## Quick Start – Docker (Recommended – One Command)

```bash
git clone https://github.com/your-username/mangaVerse.git
cd mangaVerse
docker-compose up --build
```

Then open your browser:

- http://localhost → works instantly
- https://localhost → works (accept the self-signed certificate once)

The 4 demo manga are available immediately!

### Test Accounts (Already Created)

| Role         | Email                  | Password     |
|--------------|------------------------|--------------|
| Admin        | admin@gmail.com        | Seb12345!    |
| Librarian    | librarian@gmail.com    | Seb12345!    |
| Regular User | user@gmail.com         | Seb12345!    |

Log in with the admin account to access the full admin panel.

## Development Without Docker (Alternative)

```bash
# Terminal 1 – MySQL
docker run --name mysql-mangaverse -e MYSQL_ROOT_PASSWORD=Seb12345! \
  -e MYSQL_DATABASE=mangaverse_db -p 3306:3306 -d mysql:8.0

# Terminal 2 – Backend
cd backend
cp .env.example .env
npm install
npm start                    # HTTPS on port 5000

# Terminal 3 – Frontend
cd ../frontend-vite
cp .env.example .env
npm install
npm run dev                  # https://localhost:1234
```

### Environment Files

**backend/.env**

```
DB_HOST=db                  # "db" with Docker, "localhost" without
DB_USER=root
DB_PASSWORD=Seb12345!
DB_NAME=mangaverse_db
JWT_SECRET=super_long_random_secret_change_in_production_123456789
NODE_ENV=production
PORT=5000
```

**frontend-vite/.env** (local development)

```
VITE_API_URL=http://localhost:5000/api
```

In production (Docker or real domain):

```
VITE_API_URL=/api
# or
VITE_API_URL=https://your-domain.com/api
```

## Production Deployment – FREE & Super Easy

1. Push your code to GitHub
2. Go to https://railway.app (or Render / Fly.io)
3. New Project → Deploy from GitHub → select your repo
4. Railway automatically detects the docker-compose.yml
5. Add the same environment variables as `backend/.env`

→ In less than 5 minutes you have a live HTTPS URL!

Optional: buy a domain (≈ €1/year) and point it to your Railway URL.

## Upcoming Features (Already Prepared)

- Drag & drop chapter upload (local storage)
- Page reordering with drag & drop
- Cloudflare R2 integration (unlimited free storage)
- Light/Dark mode toggle
- Push notifications (Firebase)
- Full-text search

## License

MIT License – see the LICENSE file for details.

---

**MangaVerse**   
November 2025
```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FoodRec AI** — a full-stack food recommendation web app built for a Data Mining course. Uses a Hybrid Recommendation System (Collaborative Filtering + Content-Based Filtering) with MySQL, Express, React, and Socket.io.

## Dev Commands

### Backend (`/backend`)
```bash
cd backend
npm install        # first time only
npm run dev        # start with nodemon (hot reload) on port 5000
npm start          # production start
```

### Frontend (`/frontend`)
```bash
cd frontend
npm install        # first time only
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # production build
npm run lint       # ESLint
```

### Database
```bash
# Import schema (run once)
mysql -u root -p foodrec_ai < database/schema.sql

# Seed test data
node database/seeder.js
```

## Architecture

### Backend (`/backend`)
- **`index.js`** — Express + Socket.io entry point. Mounts all routes under `/api`. Passes `io` instance to controllers via `req.app.get('io')`.
- **`config/db.js`** — MySQL connection pool (mysql2/promise).
- **`routes/api.routes.js`** — Single route file for all endpoints.
- **`controllers/`** — `auth.controller.js` (register/login with JWT), `posts.controller.js` (posts CRUD, interactions, recommendations), `admin.controller.js` (create/delete posts, broadcast notifications).
- **`middleware/auth.middleware.js`** — JWT auth (`authMiddleware`) and role check (`adminOnly`). Token is read from `Authorization: Bearer <token>` header.
- **`services/recommendation.service.js`** — Core AI logic: `getCollaborativeRecommendations(userId)` builds a user-post interaction matrix and computes Cosine Similarity; `getContentBasedRecommendations(postId)` finds similar posts by shared tags + category.
- **`services/notification.service.js`** — `notifyUser(io, userId, ...)` saves to DB and emits to `user_${userId}` Socket.io room; `notifyAll(io, ...)` broadcasts to all users.

### Frontend (`/frontend/src`)
- **`store/useStore.js`** — Zustand store. Holds `user`, `token` (persisted in `localStorage`), and `notifications`. All auth state flows through here.
- **`App.jsx`** — Router + Socket.io listener. Connects socket and joins `user_${id}` room when user is logged in.
- **`pages/`** — `Home`, `PostDetail`, `Login`, `Register`, `Profile`, `Admin`.
- **`components/`** — Reusable UI components including `Navbar`.
- **`api/`** — Axios API call helpers. Base URL from `VITE_API_URL` env var.

### Database
13 core tables: `users`, `categories`, `posts`, `media`, `comments`, `likes`, `tags`, `post_tags`, `favorites`, `views`, `ratings`, `notifications`, `recommendations_cache`, `follows`.

Interaction scoring weights used by the recommendation engine:
- `ratings.score` (1–5) — direct value
- `favorites` — 3 points
- `likes` — 2 points
- `views` — 1 point

## Key API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/posts` | — | List posts (query: `categoryId`, `minPrice`, `maxPrice`, `q`) |
| GET | `/api/posts/:id` | JWT | Post detail + records view + similar posts |
| POST | `/api/interact` | JWT | `action`: `like`, `favorite`, `rate` (with `score`, `comment`) |
| GET | `/api/recommendations` | JWT | Collaborative-filtering "For You" feed |
| GET | `/api/history` | JWT | Last 20 viewed posts |
| POST | `/api/admin/posts` | JWT + admin | Create post |
| DELETE | `/api/admin/posts/:id` | JWT + admin | Delete post |

## Environment Variables

**`backend/.env`:**
```
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=...
DB_NAME=foodrec_ai
JWT_SECRET=...
NODE_ENV=development
```

**`frontend/.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

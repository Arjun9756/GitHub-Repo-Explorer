# GitHub Repo Explorer

A full-stack web application that lets you search any GitHub username and explore their public profile and repositories. Built as part of the Studio Graphene Associate Software Engineer assessment.

The frontend never calls the GitHub API directly — all requests are proxied through the Node.js backend, which also handles in-memory caching to avoid hitting GitHub's rate limit.

## Live Demo

- **Frontend (Netlify):** https://studio-graphene-assign.netlify.app
- **Backend (Vercel):** https://git-hub-repo-explorer-o9pwdvk4g-arjun9756s-projects.vercel.app

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Vite | Fast dev server, modern tooling |
| Styling | Tailwind CSS | Utility-first, rapid UI development |
| HTTP Client | Axios | Clean API, good error handling |
| Chart | Recharts | Simple, composable React charts |
| Backend | Node.js + Express | Lightweight, fits the proxy pattern well |
| Caching | In-memory Map | Sufficient for single-instance, no infra needed |
| GitHub API | REST v3 | Public endpoints, no GraphQL complexity needed |

## Features

### Must Have
- Search GitHub username and view public profile
- Display avatar, name, bio, location, followers, following, public repo count
- Display repos with name, description, language, stars, forks, last updated
- Sort repos by Stars / Name / Last Updated (client-side)
- Handle username not found (404) and network errors gracefully

### Should Have
- Server-side in-memory cache with 60s TTL — same username within 60s returns cached response
- Loading skeleton while request is in flight
- Pagination via "Load More" button (GitHub returns 30 repos per page)
- Click repo to expand and see open issues count and default branch

### Bonus
- Recently searched usernames persisted in localStorage (max 5, clickable chips)
- Language distribution pie chart using Recharts
- Debounced search-as-you-type (300ms)

## How to Run Locally

### Prerequisites
- Node.js installed (v18+ recommended)
- A GitHub Personal Access Token (optional but recommended — increases rate limit from 60 to 5000 req/hour)

### 1. Clone the repo

```bash
git clone https://github.com/Arjun9756/GitHub-Repo-Explorer.git
cd GitHub-Repo-Explorer
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```
PORT=5000
GITHUB_TOKEN=your_github_token_here
```

Start the backend:

```bash
npm run dev
```

Backend will run at `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`

### 4. Run Tests

```bash
cd Backend
npm test
```

## API Documentation

### GET /health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

### GET /api/github/user/:username
Returns the GitHub user profile.

**Params:**
- `username` — GitHub username (string, required)

**Response (200):**
```json
{
  "status": true,
  "data": {
    "login": "torvalds",
    "name": "Linus Torvalds",
    "bio": "Just a simple coder...",
    "avatar_url": "https://avatars.githubusercontent.com/u/1024025",
    "followers": 241000,
    "following": 0,
    "public_repos": 8,
    "html_url": "https://github.com/torvalds",
    "location": "Portland, OR"
  }
}
```

**Response (404):**
```json
{
  "status": false,
  "message": "Github user not found"
}
```

---

### GET /api/github/user/:username/repos?page=1
Returns paginated public repositories for a user.

**Params:**
- `username` — GitHub username (string, required)

**Query:**
- `page` — Page number (default: 1)

**Response (200):**
```json
{
  "status": true,
  "data": {
    "repos": [
      {
        "id": 123456,
        "name": "linux",
        "description": "Linux kernel source tree",
        "language": "C",
        "stargazers_count": 180000,
        "updated_at": "2025-01-01T00:00:00Z",
        "html_url": "https://github.com/torvalds/linux",
        "open_issues_count": 0,
        "default_branch": "master",
        "forks_count": 52000
      }
    ],
    "hasNextPage": false,
    "currentPage": 1
  }
}
```

## Project Structure

```
GitHub-Repo-Explorer/
├── Backend/                  # Node.js + Express server
│   ├── src/
│   │   ├── routes/
│   │   │   └── github.routes.js      # API route handlers
│   │   ├── services/
│   │   │   ├── cache.service.js      # In-memory cache with TTL
│   │   │   └── github.service.js     # GitHub API proxy logic
│   │   ├── middleware/
│   │   │   └── errorHandler.js       # Global error handler
│   │   ├── app.js                    # Express app setup
│   │   └── index.js                  # Server entry point
│   ├── tests/
│   │   └── test.js                   # Manual test suite
│   ├── .env                          # Environment variables (not committed)
│   └── package.json
│
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js                # Axios API calls to backend
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   └── package.json
│
└── README.md
```

## Caching Design

The backend uses a `Map`-based in-memory cache with a 60-second TTL. Cache keys follow the pattern:

- `user:{username}` — profile data
- `repos:{username}:{page}` — paginated repo data

If the same username is requested within 60 seconds, GitHub is not called again. The cache service also exposes `clear()` and `remove()` methods for future use (e.g. cache invalidation endpoints).

In production, this would be replaced with Redis for persistence across restarts and multi-instance support.

## Next Steps

Given more time, I would:

- **Replace in-memory cache with Redis** — persistence across server restarts, works across multiple instances
- **Add rate limit headers to API responses** — so the frontend can show "X requests remaining"
- **Authentication** — GitHub OAuth so users can see private repos
- **Persistent recently searched** — move from localStorage to a backend store so it syncs across devices
- **Better error messages** — distinguish between rate limit errors and genuine 404s more clearly in the UI
- **End-to-end tests** — using Playwright or Cypress for full user flow testing
- **Two-profile-comparison** - using the meta data of github profile and respository

## Honest Notes

- Frontend was built with AI assistance (as permitted). I understand every component and can walk through the code.
- Backend was written by hand — cache service, GitHub proxy, route handlers, error middleware and deployment.
- The in-memory cache resets on every server restart — acceptable for this scope, Redis would fix this in production.
